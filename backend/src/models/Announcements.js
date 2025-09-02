// models/Announcement.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Announcement = sequelize.define('Announcement', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageFileName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    announcementDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER, // reference to admin/user who created
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  }, {
    tableName: 'Announcements',
    timestamps: true,
  });

  Announcement.associate = (models) => {
    Announcement.belongsTo(models.Company, { foreignKey: 'companyId' });
    Announcement.belongsTo(models.User, { foreignKey: 'createdBy' });
  };

  return Announcement;
};
