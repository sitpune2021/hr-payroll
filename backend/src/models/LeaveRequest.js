import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const LeaveRequest = sequelize.define('LeaveRequest', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
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
    reason: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
      defaultValue: 'Pending',
    },
  }, {
    tableName: 'LeaveRequests',
    timestamps: true,
  });

  LeaveRequest.associate = (models) => {
    LeaveRequest.belongsTo(models.User, { foreignKey: 'employeeId' });
  };

  return LeaveRequest;
};
