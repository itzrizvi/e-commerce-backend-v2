// All requires
const { Op } = require("sequelize");
const config = require("config");
const { deleteFile, singleFileUpload } = require("../utils/fileUpload");

module.exports = {
  companyInfo: async (req, db, user, isAuth, TENANTID) => {
    try {
      // Data From Request
      const { name, logo, contact_address, fax, email = [], phone = [] } = req;
      const checkExistence = await db.company_info.findOne({
        where: {
          [Op.and]: [
            {
              tenant_id: TENANTID,
            },
          ],
        },
      });

      let updated_data = {
        name,
        contact_address,
        fax,
      };

      if (checkExistence && checkExistence.logo) {
        // Delete Previous S3 Image For this Banner Slide
        const logo_src = config.get("AWS.COMPANY_LOGO_IMG_DEST").split("/");
        const logo_bucketName = logo_src[0];
        const logo_folder = logo_src.slice(1);
        await deleteFile({
          idf: TENANTID,
          folder: logo_folder,
          fileName: "logo",
          bucketName: logo_bucketName,
        });
      }

      if (logo) {
        // Upload Image to AWS S3
        const logo_src = config.get("AWS.COMPANY_LOGO_IMG_SRC").split("/");
        const logo_bucketName = logo_src[0];
        const logo_folder = logo_src.slice(1);
        const imageUrl = await singleFileUpload({
          file: logo,
          idf: TENANTID,
          fileName: "logo",
          folder: logo_folder,
          bucketName: logo_bucketName,
        });
        if (!imageUrl)
          return {
            message: "Logo Couldn't Uploaded Properly!!!",
            status: false,
          };
        // Update Brand with Image Name
        imageName = imageUrl.Key.split("/").slice(-1)[0];

        updated_data = { ...updated_data, ...{ logo: imageName } };
      }

      let company_info;

      if (checkExistence) {
        company_info = await db.company_info.update(updated_data, {
          where: {
            [Op.and]: [
              {
                tenant_id: TENANTID,
              },
            ],
          },
        });

        email.forEach(async (ele) => {
          if (ele.id) {
            await db.company_email.update(
              {
                email: ele.email,
                type: ele.type,
              },
              {
                where: {
                  [Op.and]: [
                    {
                      id: ele.id,
                      tenant_id: TENANTID,
                    },
                  ],
                },
              }
            );
          } else {
            await db.company_email.create({
              company_info_id: checkExistence.id,
              email: ele.email,
              type: ele.type,
              tenant_id: TENANTID,
            });
          }
        });

        phone.forEach(async (ele) => {
          if (ele.id) {
            await db.company_phone.update(
              {
                email: ele.phone,
                type: ele.type,
              },
              {
                where: {
                  [Op.and]: [
                    {
                      id: ele.id,
                      tenant_id: TENANTID,
                    },
                  ],
                },
              }
            );
          } else {
            await db.company_phone.create({
              company_info_id: checkExistence.id,
              phone: ele.phone,
              type: ele.type,
              tenant_id: TENANTID,
            });
          }
        });
      } else {
        company_info = await db.company_info.create({
          name,
          contact_address,
          fax,
          tenant_id: TENANTID,
        });

        email.forEach(async (ele) => {
          if (ele.id) {
            await db.company_email.update(
              {
                email: ele.email,
                type: ele.type,
              },
              {
                where: {
                  [Op.and]: [
                    {
                      id: ele.id,
                      tenant_id: TENANTID,
                    },
                  ],
                },
              }
            );
          } else {
            await db.company_email.create({
              company_info_id: company_info.id,
              email: ele.email,
              type: ele.type,
              tenant_id: TENANTID,
            });
          }
        });

        phone.forEach(async (ele) => {
          if (ele.id) {
            await db.company_phone.update(
              {
                email: ele.phone,
                type: ele.type,
              },
              {
                where: {
                  [Op.and]: [
                    {
                      id: ele.id,
                      tenant_id: TENANTID,
                    },
                  ],
                },
              }
            );
          } else {
            await db.company_phone.create({
              company_info_id: company_info.id,
              phone: ele.phone,
              type: ele.type,
              tenant_id: TENANTID,
            });
          }
        });
      }

      // Return Formation
      return {
        message: "Company Info Updated Successfully!!!",
        status: true,
        tenant_id: TENANTID,
      };
    } catch (error) {
      if (error) {
        return {
          message: "Something Went Wrong!!!",
          isAuth: false,
          data: [],
          status: false,
        };
      }
    }
  },
  getCompanyInfo: async (req, db, user, isAuth, TENANTID) => {
    // try {
      if (!db.company_info.hasAlias("company_emails")) {
        await db.company_info.hasMany(db.company_email, {
          foreignKey: "company_info_id",
        });
      }

      if (!db.company_info.hasAlias("company_phones")) {
        await db.company_info.hasMany(db.company_phone, {
          foreignKey: "company_info_id",
        });
      }

      const getCompanyInfo = await db.company_info.findOne({
        where: {
          [Op.and]: [
            {
              tenant_id: TENANTID,
            },
          ],
        },
        include: [
          { model: db.company_email, as: 'company_emails' },
          { model: db.company_phone, as: 'company_phones' },
        ]
      });

      // Return
      return {
        message: "Get Company Info Success!!!",
        status: true,
        tenant_id: TENANTID,
        data: getCompanyInfo,
      };
    // } catch (error) {
    //   if (error) return { message: "Something Went Wrong!!!", status: false };
    // }
  },
};