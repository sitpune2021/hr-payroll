import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const AttendanceSetting = sequelize.define('AttendanceSetting', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    shiftName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    checkInTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    checkOutTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    gracePeriodMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },

    earlyLeaveAllowanceMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },

    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }

  }, {
    tableName: 'AttendanceSetting',
    timestamps: true,
  });

  AttendanceSetting.associate = (models) => {
  AttendanceSetting.belongsTo(models.Company, { foreignKey: 'companyId' });
  };

  return AttendanceSetting;
};
