import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const EmployeeShiftSchedule = sequelize.define('EmployeeShiftSchedule', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY, // Only the date (YYYY-MM-DD)
      allowNull: false,
    },
    attendanceSettingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'EmployeeShiftSchedule',
    timestamps: true,
    uniqueKeys: {
      unique_schedule: {
        fields: ['userId', 'date'],
      },
    },
  });

  EmployeeShiftSchedule.associate = (models) => {
    EmployeeShiftSchedule.belongsTo(models.User, { foreignKey: 'userId' });
    EmployeeShiftSchedule.belongsTo(models.AttendanceSetting, { foreignKey: 'attendanceSettingId' });
  };

  return EmployeeShiftSchedule;
};
