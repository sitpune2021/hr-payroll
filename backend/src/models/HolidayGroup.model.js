// models/HolidayGroup.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const HolidayGroup = sequelize.define('HolidayGroup', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    groupName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'HolidayGroups',
    timestamps: true,
  });

  HolidayGroup.associate = (models) => {
    HolidayGroup.belongsTo(models.Company, { foreignKey: 'companyId' });
    HolidayGroup.hasMany(models.Holiday, { foreignKey: 'holidayGroupId' });
  };

  return HolidayGroup;
};
