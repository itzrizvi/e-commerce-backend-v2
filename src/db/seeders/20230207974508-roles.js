"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          id: 1000000001,
          role: "System Admin",
          role_slug: "system-admin",
          role_description: "This is the System Admin or Super Admin Role",
          role_status: true,
          tenant_id: 100001,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 1000000002,
          role: "IT Admin",
          role_slug: "it-admin",
          role_description: "This is the IT Admin Role",
          role_status: true,
          tenant_id: 100001,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 1000000003,
          role: "Purchase Admin",
          role_slug: "purchase-admin",
          role_description: "This is the Purchase Admin Role",
          role_status: true,
          tenant_id: 100001,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
