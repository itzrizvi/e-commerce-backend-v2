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
