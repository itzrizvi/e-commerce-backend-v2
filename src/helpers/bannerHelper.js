// BRAND HELPER REQUIRES
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");

// Banner HELPER
module.exports = {
  // Create Banner HELPER
  createBanner: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // Data From Req
      const { banner_name, banner_status, content, layout_type } = req;

      // Slugify  with Banner name
      const banner_slug = slugify(banner_name, {
        replacement: "-",
        remove: /[*+~.()'"!:@]/g,
        lower: true,
        strict: true,
        trim: true,
      });

      // Check If Already Exist the Banner
      const checkExistence = await db.banner.findOne({
        where: {
          [Op.and]: [
            {
              name: banner_name,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      // If Found Banner
      if (checkExistence)
        return { message: "Already Have This Banner!!!", status: false };

      // Create Banner
      const createBanner = await db.banner.create({
        name: banner_name,
        slug: banner_slug,
        status: banner_status,
        content,
        layout_type,
        tenant_id: TENANTID,
      });

      if (createBanner) {
        // Return Formation
        return {
          message: "Successfully Created Banner!",
          id: createBanner.id,
          status: true,
        };
      } else {
        // Return Formation
        return {
          message: "Banner Update Failed!!",
          status: false,
        };
      }
    } catch (error) {
      if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };
    }
  },
<<<<<<< HEAD
=======
  // Create Banner Item Helper
  createBannerItem: async (req, db, user, isAuth, TENANTID) => {
    try {
      const {
        banner_id,
        title,
        sub_title,
        price,
        sale_price,
        button_text,
        option_1,
        option_2,
        link,
        sort_order,
        image,
      } = req;
      // If Image is Available
      let imageName;
      if (image) {
        // Upload Image to AWS S3
        const banner_image_src = config.get("AWS.BANNER_IMG_SRC").split("/");
        const banner_image_bucketName = banner_image_src[0];
        const banner_image_folder = banner_image_src.slice(1);
        const imageUrl = await singleFileUpload({
          file: image,
          idf: banner_id,
          folder: banner_image_folder,
          bucketName: banner_image_bucketName,
        });
        if (!imageUrl)
          return {
            message: "Image Couldn't Uploaded Properly!!!",
            status: false,
          };
        // Update Brand with Image Name
        imageName = imageUrl.Key.split("/").slice(-1)[0];
      }

      // Create Banner Item
      const createBannerItem = await db.banner_item.create({
        banner_id,
        title,
        link,
        sub_title,
        price,
        sale_price,
        button_text,
        option_1,
        option_2,
        image: imageName,
        sort_order,
        tenant_id: TENANTID,
      });

      if (createBannerItem) {
        // Return Formation
        // console.log([...createBannerItem]);
        return {
          message: "Successfully Created Banner Item!",
          data: createBannerItem,
          status: true,
        };
      } else {
        // Return Formation
        return {
          message: "Banner Item Failed!!",
          status: false,
        };
      }
    } catch (error) {
      if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };
    }
  },
>>>>>>> a98f41c006af6248e3cfcf7d7691af54d49de115
  // Update Banner Helper
  updateBanner: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // Data From Request
      const { banner_id, name, status, content, layout_type } = req;

      if (name) {
        // Check If Already Exist the Banner
        const checkExistence = await db.banner.findOne({
          where: {
            [Op.and]: [
              {
                name,
                tenant_id: TENANTID,
              },
            ],
            [Op.not]: [
              {
                id: banner_id,
              },
            ],
          },
        });

        // If Found Banner
        if (checkExistence)
          return { message: "This Banner is Already Exists!!!", status: false };
      }

      // Update Doc for Banner
      const updateDoc = {
        name,
        content,
        status,
        layout_type
      };

      // Update Banner
      const updateBnr = await db.banner.update(updateDoc, {
        where: {
          [Op.and]: [
            {
              id: banner_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      if (!updateBnr)
        return { message: "Couldn't Update the Banner!!!", status: false };

      // Return Formation
      return {
        message: "Banner Update Success!!!",
        status: true,
        tenant_id: TENANTID,
      };
    } catch (error) {
      if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };
    }
  },
  // GET SINGLE BANNER
  getSingleBanner: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // Data From Request
      const { banner_id } = req;

      // GET Single Banner
      const getBanner = await db.banner.findOne({
        where: {
          id: banner_id,
          tenant_id: TENANTID,
        }
      });

      // Return
      return {
        message: "Get Single Banner Success!!!",
        status: true,
        tenant_id: TENANTID,
        data: getBanner,
      };
    } catch (error) {
      if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };
    }
  },
  // GET ALL BANNERS HELPER
  getAllBanners: async (db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // GET All Banners
      const getallbanner = await db.banner.findAll({
        where: {
          tenant_id: TENANTID,
        }
      });

      // Return
      return {
        message: "Get All Banners Success!!!",
        status: true,
        tenant_id: TENANTID,
        data: getallbanner,
      };
    } catch (error) {
      if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };
    }
  },
  // GET BANNER BY SLUG HELPER
  getBannerBySlug: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // Data From Request
      const { banner_slug } = req;

      // GET Banner By SLUG
      const getBanner = await db.banner.findOne({
        where: {
          slug: banner_slug,
          tenant_id: TENANTID,
        }
      });

      // Return
      return {
        message: "Get Banner By Slug Success!!!",
        status: true,
        tenant_id: TENANTID,
        data: getBanner,
      };
    } catch (error) {
      if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };
    }
  },
};
