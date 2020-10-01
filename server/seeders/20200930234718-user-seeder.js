'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.bulkInsert('Users', [
      {
        "fullName":"Admin",
        "username": "admin",
        "role":"admin",
        "email":"admin@gmail.com",
        "password":"password",
        "createdAt": new Date(),
        "updatedAt": new Date()
      }
    ]),

  down: queryInterface => queryInterface.dropTable('Users'),
};