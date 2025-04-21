const seedRolePermissions = async (models) => {
    const { Role, Permission, RolePermission } = models;
  
    // Define the mapping of roles to permissions
    const rolePermissionsMapping = {
      SUPER_ADMIN: ['ADD_COMPANY_ADMIN', 'ADD_BRANCH', 'UPDATE_BRANCH', 'DELETE_BRANCH', 'VIEW_REPORTS'],
      COMPANY_ADMIN: ['ADD_BRANCH', 'UPDATE_BRANCH', 'VIEW_REPORTS'],
      BRANCH_MANAGER: ['UPDATE_BRANCH', 'VIEW_REPORTS'],
      EMPLOYEE: ['VIEW_REPORTS'],
    };
  
    try {
      // Iterate through the role-permission mapping
      for (const [roleName, permissions] of Object.entries(rolePermissionsMapping)) {
        // Find the role by its name
        const role = await Role.findOne({ where: { name: roleName } });
  
        if (!role) {
          console.warn(`Role "${roleName}" not found.`);
          continue;
        }
  
        // Find permissions and map them to the role
        for (const permissionName of permissions) {
          const permission = await Permission.findOne({ where: { name: permissionName } });
  
          if (!permission) {
            console.warn(`Permission "${permissionName}" not found.`);
            continue;
          }
  
          // Create the mapping in the RolePermission table
          await RolePermission.findOrCreate({
            where: { roleId: role.id, permissionId: permission.id },
          });
  
          console.log(`Mapped permission "${permission.name}" to role "${role.name}".`);
        }
      }
  
      console.log('Role-permission mapping completed!');
    } catch (error) {
      console.error('Error mapping roles with permissions:', error);
    }
  };
  
  export default seedRolePermissions;
  