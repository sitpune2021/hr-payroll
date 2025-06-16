import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PayrollTemplate = sequelize.define('PayrollTemplate', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    templateName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'PayrollTemplates',
    timestamps: true,
  });

  PayrollTemplate.associate = (models) => {
    PayrollTemplate.hasMany(models.PayrollComponent, { foreignKey: 'templateId' });
    PayrollTemplate.hasMany(models.User, { foreignKey: 'payrollTemplate' });
  };

  return PayrollTemplate;
};
