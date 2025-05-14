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
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    templateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },{
    tableName: 'Branch',
    timestamps: true
  });

  Branch.associate = (models) => {
    Branch.belongsTo(models.Company, { foreignKey: 'companyId' });
    Branch.belongsTo(models.PayrollTemplate, { foreignKey: 'templateId' });
    Branch.hasMany(models.User, { foreignKey: 'branchId' });
    Branch.hasMany(models.AttendanceSetting, { foreignKey: 'branchId' });
  };

  return Branch;
};
