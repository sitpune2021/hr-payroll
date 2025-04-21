import { nanoid } from "nanoid";
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey: true,
    }, 
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    companyImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10, 10],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
  },{
    tableName: 'Company',
    timestamps: true,
  });

  Company.associate = (models) => {
    Company.hasMany(models.Branch, { foreignKey: 'companyId' });
    Company.hasMany(models.User, { foreignKey: 'companyId' });
    Company.belongsTo(models.User, { foreignKey: 'userId', as: 'adminUser' }); // Linking admin user
  };

  return Company;
};
