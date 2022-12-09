const db = require("../../src/db");
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const { default: slugify } = require("slugify");
const productData = [];
fs.createReadStream(path.join(__dirname, "SERVERSUPPLY_HARD_DRIVES.csv"))
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", async function (row) {
    const prod_slug = slugify(`${row[2]}`, {
      replacement: "-",
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: true,
      trim: true,
    });
    const data = {
      prod_name: row[2],
      prod_slug,
      prod_long_desc: row[12],
      prod_short_desc: row[4],
      prod_meta_title: row[2],
      prod_meta_desc: row[4],
      prod_regular_price: row[9],
      prod_partnum: row[6],
      prod_sku: row[7],
      prod_outofstock_status: row[5],
      prod_status: false,
      prod_condition: row[10],
      tenant_id: 100001,
      added_by: 10002,
    };

    productData.push(data);
  })
  .on("end", function () {
    console.log("finished");
    productData.forEach((item, i) => {
      setTimeout(async () => {
        if (i >= 0 && i <= 200) {
          const res = await db.product.create(item);
          if (res) {
            console.log(`Data inserted no : ${i}`);
          }
        }
      }, 50);
    });
  })
  .on("error", function (error) {
    console.log(error.message);
  });
