"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "tax_classes",
      [
        {
          id: 10000001,
          zip_code: "1200",
          tax_amount: 5, 
          created_by: 10000001,
          tenant_id: 100001,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tax_classes", null, {});
  },
};
