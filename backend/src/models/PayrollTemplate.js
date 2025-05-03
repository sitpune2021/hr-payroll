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
    assignTo: {
      type: DataTypes.ENUM('branch', 'employee'),
      allowNull: false,
    },
    assignId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    effectiveFrom: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'PayrollTemplates',
    timestamps: true,
  });

  PayrollTemplate.associate = (models) => {
    PayrollTemplate.hasMany(models.PayrollComponent, { foreignKey: 'templateId' });
  };

  return PayrollTemplate;
};
