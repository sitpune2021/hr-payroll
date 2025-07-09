// models/WeeklyOffPattern.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const WeeklyOffPattern = sequelize.define('WeeklyOffPattern', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    leaveTemplateId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dayOfWeek: {
      type: DataTypes.INTEGER, // 0 = Sunday, 6 = Saturday
      allowNull: false,
    },
    isFixed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isAlternate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    weekNumbers: {
      type: DataTypes.STRING, // e.g., "1,3" for 1st and 3rd
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'WeeklyOffPatterns',
    timestamps: true,
  });

  WeeklyOffPattern.associate = (models) => {
    WeeklyOffPattern.belongsTo(models.LeaveTemplate, { foreignKey: 'leaveTemplateId' });
  };

  return WeeklyOffPattern;
};
