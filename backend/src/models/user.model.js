import { nanoid } from "nanoid";
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define('User', {


    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
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
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      }, 
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reportingPerson: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    joiningDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    attendanceMode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shiftRotationalFixed: {
      type: DataTypes.ENUM('Rotational', 'Fixed'),
      allowNull: false,
      defaultValue: 'Fixed'
    },
    workingShift: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sendAttTOWhatsapp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    geofencepoint: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    leaveTemplateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    paymentMode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    basicSalary: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    payrollTemplate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    temporaryAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    PermenantAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    BloodGroup: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alternatePhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    PFAccountDetails: {
      type: DataTypes.STRING,
      allowNull: true,
    },
     profilePhoto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bankDetails: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    adhaarCard: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    panCard: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    educationalQualification: {
      type: DataTypes.STRING,
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
    User.belongsTo(models.PayrollTemplate, { foreignKey: 'payrollTemplate' });
    User.belongsTo(models.LeaveTemplate, { foreignKey: 'leaveTemplateId' });

  };



  return User;
};
