import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      // remove global uniqueness constraint if roles are company-scoped
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'Role',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['name', 'companyId'] // unique per company
      }
    ]
  });

  Role.associate = (models) => {
    Role.belongsTo(models.Company, { foreignKey: 'companyId' });

    Role.belongsToMany(models.Permission, {
      through: models.RolePermission,
      foreignKey: 'roleId',
      otherKey: 'permissionId',
    });

    Role.hasMany(models.User, { foreignKey: 'roleId' });
  };

  return Role;
};
