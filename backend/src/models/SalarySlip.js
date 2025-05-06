import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const SalarySlip = sequelize.define('SalarySlip', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalEarnings: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalDeductions: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    netPay: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    tableName: 'SalarySlips',
    timestamps: true,
  });

  SalarySlip.associate = (models) => {
    SalarySlip.belongsTo(models.User, { foreignKey: 'employeeId' });
  };

  return SalarySlip;
};
