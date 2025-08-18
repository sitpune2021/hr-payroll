import models from '../models/index.js';
import logger from '../config/logger.js';

const { Role, Permission, RolePermission } = models

const updatePermissionsForRole = async (req, res) => {
  const { roleId, permissionId } = req.params;
  logger.info(`${req.user.id}-- update permission for role--roleId:${roleId}--permissionId:${permissionId}`)
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
      logger.info(`${req.user.id}-- update permission for role--roleId:${roleId}--permissionId:${permissionId}--success`)
      return res.status(200).json({ message: 'Permission enabled for role.' });
    }
  } catch (error) {
    logger.error(`${req.user.id}-- update permission for role--roleId:${roleId}--permissionId:${permissionId}--error:${error.message}`)
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const fetchRolesPermissionsLinking = async (req, res) => {
  try {
    logger.info(`${req.user.id}-- fetch roles permissions linking controller called`)
    const rolesPermissions = await RolePermission.findAll({
      attributes: ['roleId', 'permissionId'],
      raw: true
    });

    logger.info(`${req.user.id}-- fetch roles permissions linking controller responded--successfully`)
    return res.status(200).json(rolesPermissions);
  } catch (error) {
    logger.error(`${req.user.id}-- fetch roles permissions linking controller responded--error:${error.message}`)
    return res.status(500).json({ message: error.message });
  }
};





export { updatePermissionsForRole, fetchRolesPermissionsLinking }