// models/UserLeaveQuota.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const UserLeaveQuota = sequelize.define('UserLeaveQuota', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paidLeavesTaken: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sickLeavesTaken: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    casualLeavesTaken: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // Optionally track year/month-wise leaves
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: true, // optional if tracking yearly only
    },
  }, {
    tableName: 'UserLeaveQuota',
    timestamps: true,
  });

  UserLeaveQuota.associate = (models) => {
    UserLeaveQuota.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return UserLeaveQuota;
};
