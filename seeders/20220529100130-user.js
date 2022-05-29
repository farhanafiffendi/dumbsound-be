'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert(
      'users',
      [
        {
          fullname: 'admin',
          email: 'admin@gmail.com',
          password:
            '$2b$10$tU3tl4wkIZxYdXCPmvhP2uKAUXfa8gutnfIDHwYrSLNjNwwePAfvS', //123456
          gender: 'Male',
          status: 'admin',
          phone: '0822725243277',
          address: 'Medan Sumut',
          createdAt: '2022-05-25 17:13:03',
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
