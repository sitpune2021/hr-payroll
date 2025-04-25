import jwt from 'jsonwebtoken';
import models from '../models/index.js';
import { JWT_SECRET } from '../envvariablesdata.js';

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token; 

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    
    const user = await models.User.findByPk(decoded.id, {
      include: {
        model: models.Role,
        include: {
          model: models.Permission,
          through: { attributes: [] },
        },
      },
    });

    if (!user) {
      return res.status(403).json({ message: 'User not found or unauthorized' });
    }

    req.user = {
      id: user.id,
      role: user.Role.name,
      roleId: user.roleId,
      companyId: user.companyId,
      branchId: user.branchId,
      permissions: user.Role.Permissions.map((perm) => perm.name),
    };

    next();
  } catch (error) {
    console.error('Invalid token:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};
export const checkRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};


export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }
    const userPermissions = req.user.permissions || []; // Assume permissions are attached to `req.user`
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

