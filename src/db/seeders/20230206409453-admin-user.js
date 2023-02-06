"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: 1000000001,
          first_name: "Admin",
          last_name: "Demo",
          email: "admin@primeserverparts.com",
          password: "$2b$10$QH.ktS3Emi7J.F99naLxOOet4SpHzi6Ffu6WPAdpBo1IbVl56/Ymq", // A12345678
          email_verified: true,
          user_status: true,
          has_role: 1,
          tenant_id: 100001,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1000000002,
          first_name: "Shahriar",
          last_name: "Rizvi",
          email: "rizvis@primeserverparts.com",
          password: "$2b$10$QH.ktS3Emi7J.F99naLxOOet4SpHzi6Ffu6WPAdpBo1IbVl56/Ymq", // A12345678
          email_verified: true,
          user_status: true,
          has_role: 1,
          tenant_id: 100001,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
