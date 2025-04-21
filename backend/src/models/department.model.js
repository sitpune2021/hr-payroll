// models/department.js

import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Department = sequelize.define('Department', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },{
    tableName: 'Department',
    timestamps: true
  });

  Department.associate = (models) => {
    Department.hasMany(models.User, {
      foreignKey: 'departmentId',
      onDelete: 'RESTRICT', // prevent deleting department if users exist
    });
  };

  return Department;
};
