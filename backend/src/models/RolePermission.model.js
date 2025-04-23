import { DataTypes } from "sequelize";

export default (sequelize) => {
    const RolePermission = sequelize.define('RolePermission', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        permissionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },{
        tableName: 'RolePermission',
        timestamps: true
    });

    RolePermission.associate = (models) => {
        RolePermission.belongsTo(models.Role, {
            foreignKey: 'roleId',
            as: 'role'
        });

        RolePermission.belongsTo(models.Permission, {
            foreignKey: 'permissionId',
            as: 'permission'
        });
    };

    return RolePermission;
};
