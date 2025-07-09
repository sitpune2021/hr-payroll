// models/LeaveRecord.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const LeaveRecord = sequelize.define('LeaveRecord', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    leaveType: {
      type: DataTypes.ENUM('Paid', 'Sick', 'Casual','Unpaid'),
      allowNull: false,
    },
    fromDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    toDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    totalDays: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Applied', 'Approved', 'Rejected'),
      allowNull: false,
      defaultValue: 'Applied',
    },
    approverId: {
      type: DataTypes.INTEGER,
      allowNull: true, // in case no one has acted yet
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'LeaveRecord',
    timestamps: true,
  });

  LeaveRecord.associate = (models) => {
    LeaveRecord.belongsTo(models.User, { foreignKey: 'userId', as: 'employee' });
    LeaveRecord.belongsTo(models.User, { foreignKey: 'approverId', as: 'approver' });
  };

  return LeaveRecord;
};
