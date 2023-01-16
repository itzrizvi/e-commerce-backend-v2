// BRAND HELPER REQUIRES
const { default: slugify } = require("slugify");
const { Op } = require("sequelize");
const config = require("config");
const { singleFileUpload, deleteFile } = require("../utils/fileUpload");

// Banner HELPER
module.exports = {
  // Create Banner HELPER
  createBanner: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // Data From Req
      const { banner_name, banner_status } = req;
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
              slug: banner_slug,
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
        tenant_id: TENANTID,
      });

      if (createBanner) {
        // Return Formation
        return {
          message: "Successfully Created Banner!",
          data: {
            id: createBanner.id,
            status: createBanner.status,
          },
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
  // Update Banner Helper
  updateBanner: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // Data From Request
      const { banner_id, name, status } = req;

      // Create New Slug If Banner name is also Updating
      let slug;
      if (name) {
        // Slugify Banner Name
        slug = slugify(`${name}`, {
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
                slug,
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
        slug,
        status,
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
  // Update Banner Item HELPER
  updateBannerItem: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // Data From Request
      const {
        id,
        title,
        link,
        sub_title,
        price,
        sale_price,
        button_text,
        option_1,
        option_2,
        sort_order,
        banner_id,
        image,
      } = req;

      // Update Doc
      const updateDoc = {
        title,
        link,
        sub_title,
        price,
        sale_price,
        button_text,
        option_1,
        option_2,
        sort_order,
      };

      // Update Banner Item Details
      const updateBannerItem = await db.banner_item.update(updateDoc, {
        where: {
          [Op.and]: [
            {
              id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      // IF NOT UPDATED THEN RETURN
      if (!updateBannerItem)
        return { message: "Update Gone Wrong!!!", status: false };

      // Find Banner Item to Get Item Name
      const findBannerItem = await db.banner_item.findOne({
        where: {
          [Op.and]: [
            {
              id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      // IF Image Also Updated
      if (image && findBannerItem.image) {
        // Delete Previous S3 Image For this Banner Slide
        const banner_image_src = config.get("AWS.BANNER_IMG_DEST").split("/");
        const banner_image_bucketName = banner_image_src[0];
        const banner_image_folder = banner_image_src.slice(1);
        await deleteFile({
          idf: banner_id,
          folder: banner_image_folder,
          fileName: findBannerItem.image,
          bucketName: banner_image_bucketName,
        });
      }

      // Upload New Image to S3
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
            message: "New Image Couldn't Uploaded Properly!!!",
            status: false,
          };

        // Update Banner Slide with New Image Name
        const imageName = imageUrl.Key.split("/").slice(-1)[0];

        // Find and Update Banner Item Name By UUID
        const bannerImageUpdate = {
          image: imageName,
        };
        // Update Banner Image
        const updateBannerImg = await db.banner_item.update(bannerImageUpdate, {
          where: {
            [Op.and]: [
              {
                id,
                tenant_id: TENANTID,
              },
            ],
          },
        });
        // If not updated
        if (!updateBannerImg)
          return {
            message: "New Image Name Couldn't Be Updated Properly!!!",
            status: false,
          };

        // Return
        return {
          message: "Banner Slide Updated With New Image!!!",
          status: true,
          tenant_id: TENANTID,
        };
      } else {
        // Return
        return {
          message: "Banner Slide Updated With New Details!!!",
          status: true,
          tenant_id: TENANTID,
        };
      }
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

      // Association with Banner and Banner Images
      if (!db.banner.hasAlias("banner_items")) {
        await db.banner.hasMany(db.banner_item, { foreignKey: "banner_id" });
      }

      // GET Single Banner
      const getBanner = await db.banner.findOne({
        where: {
          id: banner_id,
          tenant_id: TENANTID,
        },
        include: [
          {
            model: db.banner_item,
            as: "banner_items",
          },
        ],
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
      // Association with Banner and Banner Images
      if (!db.banner.hasAlias("banner_items")) {
        await db.banner.hasMany(db.banner_item, { foreignKey: "banner_id" });
      }

      // GET All Banners
      const getallbanner = await db.banner.findAll({
        where: {
          tenant_id: TENANTID,
        },
        include: [
          {
            model: db.banner_item,
            as: "banner_items",
          },
        ],
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

      // Association with Banner and Banner Images
      if (!db.banner.hasAlias("banner_items")) {
        await db.banner.hasMany(db.banner_item, { foreignKey: "banner_id" });
      }

      // GET Banner By SLUG
      const getBanner = await db.banner.findOne({
        where: {
          slug: banner_slug,
          tenant_id: TENANTID,
        },
        include: [
          {
            model: db.banner_item,
            as: "banner_items",
          },
        ],
        order: [
          [{ model: db.banner_item, as: 'banner_items' }, 'sort_order', 'ASC']
        ]
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
  // DELETE Banner Item HELPER
  deleteBannerItem: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // Data From Request
      const { banner_id } = req;

      // Find Banner Item to Get Item Name
      const findBannerItem = await db.banner_item.findOne({
        where: {
          [Op.and]: [
            {
              id: banner_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      if (!findBannerItem)
        return { message: "Couldnt Found Banner Item!!!", status: false };

      // IF Item Found
      if (findBannerItem.image) {
        // Delete Previous S3 Image For this Banner Slide
        const banner_image_src = config.get("AWS.BANNER_IMG_DEST").split("/");
        const banner_image_bucketName = banner_image_src[0];
        const banner_image_folder = banner_image_src.slice(1);
        await deleteFile({
          idf: findBannerItem.banner_id,
          folder: banner_image_folder,
          fileName: findBannerItem.image,
          bucketName: banner_image_bucketName,
        });
      }

      // Delete Banner Item
      const deleteBannerItem = await db.banner_item.destroy({
        where: {
          [Op.and]: [
            {
              id: banner_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });
      if (!deleteBannerItem)
        return { message: "Couldnt Delete Banner Item!!!", status: false };

      // Return
      return {
        message: "Banner Item Delete Success!!!",
        status: true,
        tenant_id: TENANTID,
      };
    } catch (error) {
      if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };
    }
  },
};
