// models/LeaveTemplate.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const LeaveTemplate = sequelize.define('LeaveTemplate', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paidLeaveQuota: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sickLeaveQuota: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    casualLeaveQuota: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    allowedLateEntries: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    holidayGroupId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'LeaveTemplates',
    timestamps: true,
  });

  LeaveTemplate.associate = (models) => {
    LeaveTemplate.belongsTo(models.Company, { foreignKey: 'companyId' });
    LeaveTemplate.belongsTo(models.HolidayGroup, { foreignKey: 'holidayGroupId' });
    LeaveTemplate.hasMany(models.WeeklyOffPattern, { foreignKey: 'leaveTemplateId' });
    LeaveTemplate.hasMany(models.User, { foreignKey: 'leaveTemplateId' });
  };

  return LeaveTemplate;
};
