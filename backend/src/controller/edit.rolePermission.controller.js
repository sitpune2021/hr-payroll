import models from '../models/index.js';

const { Role, Permission, RolePermission } = models

const updatePermissionsForRole = async (req, res) => {

  const { roleId, permissionId } = req.params;

  console.log(roleId,permissionId);
  


  try {

    // Validate Role
    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({ message: 'Role not found.' });
    }

    // Validate Permission
    const permission = await Permission.findByPk(permissionId);
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found.' });
    }


    const existing = await RolePermission.findOne({
      where: { roleId, permissionId }
    });

    if (existing) {
      // Permission already assigned, remove it (toggle OFF)
      await existing.destroy();
      return res.status(200).json({ message: 'Permission disabled for role.' });
    } else {
      // Permission not assigned, add it (toggle ON)
      await RolePermission.create({ roleId, permissionId });
      return res.status(200).json({ message: 'Permission enabled for role.' });
    }
  } catch (error) {
    console.error("Toggle permission error:", error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const fetchRolesPermissionsLinking = async (req, res) => {
  try {
    const rolesPermissions = await RolePermission.findAll({
      attributes: ['roleId', 'permissionId'], 
      raw: true 
    });

      return res.status(200).json(rolesPermissions);
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
};





export { updatePermissionsForRole,fetchRolesPermissionsLinking }