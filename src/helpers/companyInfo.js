// All requires
const { Op } = require("sequelize");
const config = require("config");
const { deleteFile, singleFileUpload } = require("../utils/fileUpload");

module.exports = {
  companyInfo: async (req, db, user, isAuth, TENANTID) => {
    try {
      // Data From Request
      const { name, logo, dark_logo, fav_icon, contact_address, fax, email = [], phone = [], social = [] } = req;
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
      if (checkExistence && checkExistence.dark_logo) {
        // Delete Previous S3 Image For this Banner Slide
        const dark_logo_src = config.get("AWS.COMPANY_DARK_LOGO_IMG_DEST").split("/");
        const dark_logo_bucketName = dark_logo_src[0];
        const dark_logo_folder = dark_logo_src.slice(1);
        await deleteFile({
          idf: TENANTID,
          folder: dark_logo_folder,
          fileName: "dark-logo",
          bucketName: dark_logo_bucketName,
        });
      }

      if (checkExistence && checkExistence.fav_icon) {
        // Delete Previous S3 Image For this Banner Slide
        const fav_icon_src = config.get("AWS.COMPANY_FAV_ICON_DEST").split("/");
        const fav_icon_bucketName = fav_icon_src[0];
        const fav_icon_folder = fav_icon_src.slice(1);
        await deleteFile({
          idf: TENANTID,
          folder: fav_icon_folder,
          fileName: "fav",
          bucketName: fav_icon_bucketName,
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

      if (dark_logo) {
        // Upload Image to AWS S3
        const dark_logo_src = config.get("AWS.COMPANY_DARK_LOGO_IMG_SRC").split("/");
        const dark_logo_bucketName = dark_logo_src[0];
        const dark_logo_folder = dark_logo_src.slice(1);
        const imageUrl = await singleFileUpload({
          file: dark_logo,
          idf: TENANTID,
          fileName: "dark-logo",
          folder: dark_logo_folder,
          bucketName: dark_logo_bucketName,
        });
        if (!imageUrl)
          return {
            message: "Dark Logo Couldn't Uploaded Properly!!!",
            status: false,
          };
        // Update Brand with Image Name
        imageName = imageUrl.Key.split("/").slice(-1)[0];

        updated_data = { ...updated_data, ...{ dark_logo: imageName } };
      }

      if (fav_icon) {
        // Upload Image to AWS S3
        const fav_icon_src = config.get("AWS.COMPANY_FAV_ICON_SRC").split("/");
        const fav_icon_bucketName = fav_icon_src[0];
        const fav_icon_folder = fav_icon_src.slice(1);
        const imageUrl = await singleFileUpload({
          file: fav_icon,
          idf: TENANTID,
          fileName: "fav",
          folder: fav_icon_folder,
          bucketName: fav_icon_bucketName,
        });
        if (!imageUrl)
          return {
            message: "Fav Icon Couldn't Uploaded Properly!!!",
            status: false,
          };
        // Update Brand with Image Name
        imageName = imageUrl.Key.split("/").slice(-1)[0];

        updated_data = { ...updated_data, ...{ fav_icon: imageName } };
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

        social.forEach(async (ele) => {
          if (ele.id) {
            await db.company_social.update(
              {
                social: ele.social,
                type: ele.type,
                updated_by: user.id
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
            await db.company_social.create({
              company_info_id: checkExistence.id,
              social: ele.social,
              type: ele.type,
              tenant_id: TENANTID,
              created_by: user.id
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


        social.forEach(async (ele) => {
          if (ele.id) {
            await db.company_social.update(
              {
                social: ele.social,
                type: ele.type,
                updated_by: user.id
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
            await db.company_social.create({
              company_info_id: checkExistence.id,
              social: ele.social,
              type: ele.type,
              tenant_id: TENANTID,
              created_by: user.id
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
  getCompanyInfo: async (db, TENANTID) => {
    try {
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

      if (!db.company_info.hasAlias("company_social")) {
        await db.company_info.hasMany(db.company_social, {
          foreignKey: "company_info_id",
        });
      }

      if (!db.company_info.hasAlias("address") && !db.company_info.hasAlias("shippingAddresses")) {
        await db.company_info.hasMany(db.address, {
          foreignKey: "ref_id",
          as: 'shippingAddresses'
        });
      }

      if (!db.company_info.hasAlias("address") && !db.company_info.hasAlias("billingAddresses")) {
        await db.company_info.hasMany(db.address, {
          foreignKey: "ref_id",
          as: 'billingAddresses'
        });
      }

      const getCompanyInfo = await db.company_info.findOne({
        where: {
          tenant_id: TENANTID,
        },
        include: [
          { model: db.company_email, as: 'company_emails' },
          { model: db.company_phone, as: 'company_phones' },
          { model: db.company_social, as: 'company_socials' },
          {
            model: db.address, as: 'shippingAddresses',
            required: false,
            where: {
              type: "shipping",
            }
          },
          {
            model: db.address, as: 'billingAddresses',
            required: false,
            where: {
              type: "billing",
            }
          },
        ]
      });

      // Return
      return {
        message: "Get Company Info Success!!!",
        status: true,
        tenant_id: TENANTID,
        data: getCompanyInfo,
      };
    } catch (error) {
      if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };
    }
  },
  // Add Company Billing Addresses
  addCompanyBillingAddress: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {

      // Data From Request
      const { addresses } = req;

      // Array Formation For Bulk Create
      let companyBillingAddress = [];
      // Default check
      let defaultBilling = [];
      // GET Ref ID
      let ref_id;

      addresses.forEach(async (address) => {
        ref_id = address.parent_id
        if (address.isDefault) {
          defaultBilling.push(true);
        }
        if (defaultBilling.length === 1) {

          await companyBillingAddress.push({
            ref_id: address.parent_id,
            ref_model: "company_info",
            phone: address.phone,
            fax: address.fax,
            email: address.email,
            address1: address.address1,
            address2: address.address2,
            city: address.city,
            state: address.state,
            zip_code: address.zip_code,
            country: address.country,
            type: "billing",
            status: address.status,
            tenant_id: TENANTID,
            created_by: user.id,
            isDefault: address.isDefault
          });

        }

      });

      if (defaultBilling && defaultBilling.length > 1) {
        return {
          message: "You Can Only Select Maximum One Default Billing Address!!!",
          status: false,
          tenant_id: TENANTID
        }
      }

      if (defaultBilling && defaultBilling.length > 0) {

        const makesDefaultFalse = {
          isDefault: false,
          updated_by: user.id
        }

        await db.address.update(makesDefaultFalse, {
          where: {
            [Op.and]: [{
              ref_id,
              ref_model: "company_info",
              type: "billing",
              tenant_id: TENANTID
            }]
          }
        });
      }

      if (companyBillingAddress && companyBillingAddress.length > 0) {
        const createCompanyBilling = await db.address.bulkCreate(companyBillingAddress);

        if (createCompanyBilling) {
          return {
            tenant_id: TENANTID,
            message: "Successfully Created Company Billing Address.",
            status: true,
          }
        }
      }

    } catch (error) {
      if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
    }
  },
  // Add Company Shipping Addresses
  addCompanyShippingAddress: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {

      // Data From Request
      const { addresses } = req;

      // Array Formation For Bulk Create
      let companyShippingAddress = [];
      // Default check
      let defaultShipping = [];
      // GET Ref ID
      let ref_id;

      addresses.forEach(async (address) => {

        ref_id = address.parent_id
        if (address.isDefault) {
          defaultShipping.push(true);
        }

        if (defaultShipping.length === 1) {
          await companyShippingAddress.push({
            ref_id: address.parent_id,
            ref_model: "company_info",
            phone: address.phone,
            fax: address.fax,
            email: address.email,
            address1: address.address1,
            address2: address.address2,
            city: address.city,
            state: address.state,
            zip_code: address.zip_code,
            country: address.country,
            type: "shipping",
            status: address.status,
            tenant_id: TENANTID,
            created_by: user.id,
            isDefault: address.isDefault
          });
        }

      });

      if (defaultShipping && defaultShipping.length > 1) {
        return {
          message: "You Can Only Select Maximum One Default Shipping Address!!!",
          status: false,
          tenant_id: TENANTID
        }
      }

      if (defaultShipping && defaultShipping.length > 0) {

        const makesDefaultFalse = {
          isDefault: false,
          updated_by: user.id
        }

        await db.address.update(makesDefaultFalse, {
          where: {
            [Op.and]: [{
              ref_id,
              ref_model: "company_info",
              type: "shipping",
              tenant_id: TENANTID
            }]
          }
        });
      }

      if (companyShippingAddress && companyShippingAddress.length > 0) {
        const createCompanyShipping = await db.address.bulkCreate(companyShippingAddress);

        if (createCompanyShipping) {
          return {
            tenant_id: TENANTID,
            message: "Successfully Created Company Shipping Address.",
            status: true,
          }
        }
      }

    } catch (error) {
      if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
    }
  },
  // Update Company Addresses
  updateCompanyAddress: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {

      // Data From Request
      const { ref_id, type, addresses } = req;

      // Extract New Addresses
      let newAddresses = [];
      // Check Multiple Defaults in New Addresses
      let multipleDefaults = [];
      //
      addresses.forEach(async (addrss) => {
        if (addrss.isNew) {
          //
          if (addrss.isDefault) {
            multipleDefaults.push(true);
          }
          //
          newAddresses.push({
            ref_id: addrss.parent_id,
            ref_model: "company_info",
            phone: addrss.phone,
            fax: addrss.fax,
            email: addrss.email,
            address1: addrss.address1,
            address2: addrss.address2,
            city: addrss.city,
            state: addrss.state,
            zip_code: addrss.zip_code,
            country: addrss.country,
            type: type,
            status: addrss.status,
            tenant_id: TENANTID,
            created_by: user.id,
            isDefault: addrss.isDefault
          });
        }
      });

      //
      let oldAddresses = addresses.filter((address) => !address.isNew);

      // Differentiate By Type
      if (type === "billing") {
        //
        companyUpdatedBillingAddress = [];
        // Old Address IDS
        let oldAddressIDs = [];

        oldAddresses.forEach(async (address) => {
          oldAddressIDs.push(address.id);
          //
          if (address.isDefault) {
            multipleDefaults.push(true);
          }
          //
          if (multipleDefaults.length === 1) {
            await companyUpdatedBillingAddress.push({
              id: address.id,
              ref_id: address.parent_id,
              ref_model: "company_info",
              phone: address.phone,
              fax: address.fax,
              email: address.email,
              address1: address.address1,
              address2: address.address2,
              city: address.city,
              state: address.state,
              zip_code: address.zip_code,
              country: address.country,
              type: "billing",
              status: address.status,
              tenant_id: TENANTID,
              created_by: user.id,
              isDefault: address.isDefault
            });
          }

        });

        //
        if (multipleDefaults && multipleDefaults.length > 1) {
          return {
            message: "You Can Only Select Maximum One Default Billing Address!!!",
            status: false,
            tenant_id: TENANTID
          }
        }

        // Delete Billing Addresses Which Were Removed
        if (oldAddressIDs && oldAddressIDs.length > 0) {
          await db.address.destroy({
            where: {
              [Op.and]: [{
                id: {
                  [Op.notIn]: oldAddressIDs
                },
                ref_id,
                ref_model: "company_info",
                type: type,
                tenant_id: TENANTID
              }]
            }
          });
        }

        //
        if (multipleDefaults && multipleDefaults.length > 0) {
          const makesDefaultFalse = {
            isDefault: false,
            updated_by: user.id
          }
          await db.address.update(makesDefaultFalse, {
            where: {
              [Op.and]: [{
                ref_id,
                ref_model: "company_info",
                type: type,
                tenant_id: TENANTID
              }]
            }
          });
        }

        //
        if (companyUpdatedBillingAddress && companyUpdatedBillingAddress.length > 0) {
          //
          companyUpdatedBillingAddress.forEach(async (element) => {
            await db.address.update({
              ref_id: element.parent_id,
              ref_model: "company_info",
              phone: element.phone,
              fax: element.fax,
              email: element.email,
              address1: element.address1,
              address2: element.address2,
              city: element.city,
              state: element.state,
              zip_code: element.zip_code,
              country: element.country,
              type: type,
              status: element.status,
              tenant_id: TENANTID,
              updated_by: user.id,
              isDefault: element.isDefault
            }, {
              where: {
                [Op.and]: [{
                  id: element.id,
                  ref_id,
                  ref_model: "company_info",
                  type: type,
                  tenant_id: TENANTID
                }]
              }
            });

          });
        }

        if (newAddresses && newAddresses.length > 0) {
          const createNewCompanyBilling = await db.address.bulkCreate(newAddresses);
          if (!createNewCompanyBilling) return { message: "New Billing Address Couldn't Inserted!!!", status: false, tenant_id: TENANTID }
        }

        // Return Formation
        return {
          message: "Company Billing Address Updated Successfully!!!",
          tenant_id: TENANTID,
          status: true
        }


      } else if (type === "shipping") {

        //
        companyUpdatedShippingAddress = [];
        // Old Address IDS
        let oldAddressIDs = [];

        oldAddresses.forEach(async (address) => {
          oldAddressIDs.push(address.id);
          //
          if (address.isDefault) {
            multipleDefaults.push(true);
          }
          //
          if (multipleDefaults.length === 1) {
            await companyUpdatedShippingAddress.push({
              id: address.id,
              ref_id: address.parent_id,
              ref_model: "company_info",
              phone: address.phone,
              fax: address.fax,
              email: address.email,
              address1: address.address1,
              address2: address.address2,
              city: address.city,
              state: address.state,
              zip_code: address.zip_code,
              country: address.country,
              type: "shipping",
              status: address.status,
              tenant_id: TENANTID,
              created_by: user.id,
              isDefault: address.isDefault
            });
          }

        });

        //
        if (multipleDefaults && multipleDefaults.length > 1) {
          return {
            message: "You Can Only Select Maximum One Default Shipping Address!!!",
            status: false,
            tenant_id: TENANTID
          }
        }

        // Delete Shipping Addresses Which Were Removed
        if (oldAddressIDs && oldAddressIDs.length > 0) {
          await db.address.destroy({
            where: {
              [Op.and]: [{
                id: {
                  [Op.notIn]: oldAddressIDs
                },
                ref_id,
                ref_model: "company_info",
                type: type,
                tenant_id: TENANTID
              }]
            }
          });
        }

        //
        if (multipleDefaults && multipleDefaults.length > 0) {
          const makesDefaultFalse = {
            isDefault: false,
            updated_by: user.id
          }
          await db.address.update(makesDefaultFalse, {
            where: {
              [Op.and]: [{
                ref_id,
                ref_model: "company_info",
                type: type,
                tenant_id: TENANTID
              }]
            }
          });
        }

        //
        if (companyUpdatedShippingAddress && companyUpdatedShippingAddress.length > 0) {
          //
          companyUpdatedShippingAddress.forEach(async (element) => {
            await db.address.update({
              ref_id: element.parent_id,
              ref_model: "company_info",
              phone: element.phone,
              fax: element.fax,
              email: element.email,
              address1: element.address1,
              address2: element.address2,
              city: element.city,
              state: element.state,
              zip_code: element.zip_code,
              country: element.country,
              type: type,
              status: element.status,
              tenant_id: TENANTID,
              updated_by: user.id,
              isDefault: element.isDefault
            }, {
              where: {
                [Op.and]: [{
                  id: element.id,
                  ref_id,
                  ref_model: "company_info",
                  type: type,
                  tenant_id: TENANTID
                }]
              }
            });

          });
        }

        if (newAddresses && newAddresses.length > 0) {
          const createNewCompanyShipping = await db.address.bulkCreate(newAddresses);
          if (!createNewCompanyShipping) return { message: "New Shipping Address Couldn't Inserted!!!", status: false, tenant_id: TENANTID }
        }

        // Return Formation
        return {
          message: "Company Shipping Address Updated Successfully!!!",
          tenant_id: TENANTID,
          status: true
        }

      }

    } catch (error) {
      if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
    }
  },
};
