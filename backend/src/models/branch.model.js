import { nanoid } from 'nanoid';
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Branch = sequelize.define('Branch', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    branchLogoFileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bankDetailsFileName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nameOfSalarySlip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },{
    tableName: 'Branch',
    timestamps: true
  });

  Branch.associate = (models) => {
    Branch.belongsTo(models.Company, { foreignKey: 'companyId' });
    // Branch.belongsTo(models.PayrollTemplate, { foreignKey: 'templateId' });
    Branch.hasMany(models.User, { foreignKey: 'branchId' });
  };

  return Branch;
};
