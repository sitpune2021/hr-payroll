import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Attendance = sequelize.define('Attendance', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    checkIn: {
      type: DataTypes.TIME,
    },
    checkOut: {
      type: DataTypes.TIME,
    },
    status: {
      type: DataTypes.ENUM('Present','Unscheduled', 'Absent', 'Half-Day', 'Leave'),
      defaultValue: 'Present',
    },
    isLate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isEarlyLeave: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, 
    },
    workingHours: {
      type: DataTypes.FLOAT, // in hours
    },
    overtimeHours: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    remarks: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'Attendances',
    timestamps: true,
  });

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.User, { foreignKey: 'employeeId' });
  };

  return Attendance;
};
