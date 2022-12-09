const db = require("../../src/db");
const { Op } = require("sequelize");
var fs = require("fs"),
  JSONStream = require("JSONStream"),
  es = require("event-stream");
const path = require("path");
const { default: slugify } = require("slugify");
const config = require("config");
const { S3 } = require("aws-sdk");
const { sleep } = require("../../src/utils/time");
/* ---------------------------- Modifiable Start ---------------------------- */
const category_name = "SSD";
const file_name = "SERVERSUPPLY_SSD.json";
const aws_folder = "final-data";

/* ---------------------------- AWS Config Start ---------------------------- */
const region = config.get("AWS.BUCKET_REGION");
const accessKeyId = "AKIATEJBKMJF43ZVBZFO";
const secretAccessKey = "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";

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

/* ----------------------------- Aws Config End ----------------------------- */
const TENANTID = "100001";
/* ---------------------------- Modifiable End ---------------------------- */

var getStream = function () {
  var stream = fs.createReadStream(
      path.join(__dirname, category_name, file_name),
      { encoding: "utf8" }
    ),
    parser = JSONStream.parse("*");
  return stream.pipe(parser);
};

const cat_slug = slugify(category_name, {
  replacement: "-",
  remove: /[*+~.()'"!:@]/g,
  lower: true,
  strict: true,
  trim: true,
});

var i = 0;
const start = 0;
const end = 200;
const sleep_time = 3000;

async function _run() {
  if (i >= start && i < end) {
    getStream().pipe(
      es.mapSync(async function (item) {
        await sleep(sleep_time);
        const prod_slug = slugify(`${item[i]?.name}`, {
          replacement: "-",
          remove: /[*+~.()'"!:@]/g,
          lower: true,
          strict: true,
          trim: true,
        });

        const category_id = await db.category.findOne({
          where: {
            [Op.and]: [
              {
                cat_slug,
                tenant_id: TENANTID,
              },
            ],
          },
        });

        const brand_slug = slugify(`${item[i]?.brand}`, {
          replacement: "-",
          remove: /[*+~.()'"!:@]/g,
          lower: true,
          strict: true,
          trim: true,
        });

        let brand_id = null;

        const brand = await db.brand.findOne({
          where: {
            [Op.and]: [
              {
                brand_slug,
                tenant_id: TENANTID,
              },
            ],
          },
        });

        if (brand) {
          brand_id = brand.id;
        } else {
          if (item[i]?.brand) {
            const create_brand = await db.brand.create({
              brand_name: item[i]?.brand,
              brand_slug,
              brand_description: item[i]?.brand,
              brand_status: true,
              image: null,
              brand_sort_order: 0,
              tenant_id: TENANTID,
            });
            brand_id = create_brand.id;
          }
        }

        const data = {
          prod_name: item[i]?.name,
          prod_slug,
          prod_category: category_id.id ?? null,
          prod_long_desc: item[i]["full description"],
          prod_short_desc: item[i]?.description ?? "No Description",
          prod_meta_title: item[i]?.name,
          prod_meta_desc: item[i]?.description,
          prod_regular_price: item[i]?.price,
          prod_partnum: item[i]?.mpn,
          prod_sku: item[i]?.sku,
          prod_outofstock_status: item[i]?.availability,
          prod_status: true,
          prod_condition: item[i]?.condition,
          tenant_id: TENANTID,
          added_by: 10002,
          brand_id,
        };

        const res = await db.product.create(data);
        if (res) {
          await db.product.update(
            {
              prod_thumbnail: res.id + ".jpg",
            },
            {
              where: {
                [Op.and]: [
                  {
                    id: res.id,
                    tenant_id: TENANTID,
                  },
                ],
              },
            }
          );

          // Upload Image to AWS S3
          const product_image_src = config
            .get("AWS.PRODUCT_IMG_THUMB_SRC")
            .split("/");
          const product_image_bucketName = product_image_src[0];
          const product_image_folder = product_image_src.slice(1).join("/");

          var params = {
            Bucket: product_image_bucketName,
            CopySource: `psp-product-sample/${aws_folder}/${category_name.toUpperCase()}/images/${
              item[i].sku
            }.jpg`,
            Key: `${product_image_folder}/${res.id}/${res.id}.jpg`,
          };

          s3.copyObject(params, function (err) {
            if (err) console.log(err, err.stack); // an error occurred
            else console.log("image inserted"); // successful response
          });
          console.log(`Data inserted no : ${i}`);
          i++;
          _run();
        }
      })
    );
  } else {
    i++;
    console.log("counting " + i);
    await sleep(5000);
    _run();
  }
}

_run();
