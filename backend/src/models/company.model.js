import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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
    subscriptionStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    subscriptionEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    allowedNoOfUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
  }, {
    tableName: 'Company',
    timestamps: true,
  });

  Company.associate = (models) => {
    Company.hasMany(models.Branch, { foreignKey: 'companyId' });
    Company.hasMany(models.User, { foreignKey: 'companyId' });
    Company.belongsTo(models.User, { foreignKey: 'userId', as: 'adminUser' });
  };

  return Company;
};
