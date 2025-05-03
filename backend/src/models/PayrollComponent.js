import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PayrollComponent = sequelize.define('PayrollComponent', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('Allowance', 'Deduction', 'Bonus'),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amountType: {
      type: DataTypes.ENUM('Fixed', 'Percentage'),
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    templateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'PayrollComponents',
    timestamps: true,
  });

  PayrollComponent.associate = (models) => {
    PayrollComponent.belongsTo(models.PayrollTemplate, { foreignKey: 'templateId' });
  };

  return PayrollComponent;
};
