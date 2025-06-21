// models/Holiday.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Holiday = sequelize.define('Holiday', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    holidayGroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    holidayDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'Holidays',
    timestamps: true,
  });

  Holiday.associate = (models) => {
    Holiday.belongsTo(models.HolidayGroup, { foreignKey: 'holidayGroupId' });
  };

  return Holiday;
};
