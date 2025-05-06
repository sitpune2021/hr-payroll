import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const EmployeePayroll = sequelize.define('EmployeePayroll', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payrollTemplateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    effectiveFrom: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'EmployeePayrolls',
    timestamps: true,
  });

  EmployeePayroll.associate = (models) => {
    EmployeePayroll.belongsTo(models.User, { foreignKey: 'employeeId' });
    EmployeePayroll.belongsTo(models.PayrollTemplate, { foreignKey: 'payrollTemplateId' });
  };

  return EmployeePayroll;
};
