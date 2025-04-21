import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Permission = sequelize.define('Permission', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, 
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },{
        tableName: 'Permission',
        timestamps: true
    });

    Permission.associate = (models) => {
        // Many-to-Many with Role
        Permission.belongsToMany(models.Role, {
            through: models.RolePermission,
            foreignKey: 'permissionId',
            otherKey: 'roleId',
        });
    };

    return Permission;
};
