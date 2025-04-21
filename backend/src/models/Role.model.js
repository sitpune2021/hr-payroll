import { nanoid } from "nanoid";
import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Role = sequelize.define('Role', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },{
        tableName: 'Role',
        timestamps: true
    });

    Role.associate = (models) => {

        Role.belongsToMany(models.Permission, {
            through: models.RolePermission,
            foreignKey: 'roleId',
            otherKey: 'permissionId',
        });

        Role.hasMany(models.User, { foreignKey: 'roleId' });
    };

    return Role;
};
