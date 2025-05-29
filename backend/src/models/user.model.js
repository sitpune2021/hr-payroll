import { nanoid } from "nanoid";
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define('User', {


    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    contact: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isNumeric: true,
        len: [10, 10],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maritalStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
     joiningDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    templateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ruleTemplateId: { //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    workingShift: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    biometricDevice: {
      type: DataTypes.STRING,
      allowNull: true,
    },
     geofencepoint: {
      type: DataTypes.STRING,
      allowNull: true,
    },
     paymentMode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    basicSalary: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  }, {
    tableName: 'User',
    timestamps: true
  });

  User.associate = (models) => {
    User.belongsTo(models.Company, { foreignKey: 'companyId' });
    User.belongsTo(models.Branch, { foreignKey: 'branchId' });
    User.belongsTo(models.Role, { foreignKey: 'roleId' });
    User.belongsTo(models.Department, { foreignKey: 'departmentId' });
    User.belongsTo(models.PayrollTemplate, { foreignKey: 'templateId' });

  };



  return User;
};
 