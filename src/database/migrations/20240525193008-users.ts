'use strict';
import { QueryInterface, DataTypes } from "sequelize";


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize:typeof DataTypes) => {
    await queryInterface.createTable('users',{
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      name:{
        type: Sequelize.STRING(50),
        allowNull: false
      },
      email:{
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      password:{
        type: Sequelize.STRING(20),
        allowNull: false
      },
      createdAt:{
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt:{
        type: Sequelize.DATE,
        allowNull: false,
      }
    })
  },

  down: async(queryInterface: QueryInterface, Sequelize:any) => {
    await queryInterface.dropTable('users');
  }
};
