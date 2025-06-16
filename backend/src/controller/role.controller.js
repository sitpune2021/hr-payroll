import { Op } from "sequelize";
import models from "../models/index.js";

const { Role } = models;

const addNewRole = async (req, res) => {
  try {
    const { name, companyId } = req.body;

    // Basic validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: "Role name is required and must be a non-empty string" });
    }

    if (companyId === undefined || companyId === null) {
      return res.status(400).json({ message: "companyId is required" });
    }

    // Normalize name to avoid case sensitivity issues
    const normalizedName = name.trim().toUpperCase();

    // Optional: Prevent creation of SUPER_ADMIN role
    if (normalizedName === 'SUPER_ADMIN') {
      return res.status(403).json({ message: "Cannot create SUPER_ADMIN role via API" });
    }

    const existingRole = await Role.findOne({
      where: {
        name: normalizedName,
        companyId
      }
    });

    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const createdRole = await Role.create({ name: normalizedName, companyId });

    return res.status(201).json({
      message: "Role created successfully",
      createdRole
    });

  } catch (error) {
    console.error("Error creating role:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};



const getRolesList = async (req, res) => {
  try {
    const rolesList = await Role.findAll({
      attributes: ['id', 'name', 'companyId'],
      where: {
        companyId: {
          [Op.ne]: null 
        }
      }
    });

    res.status(200).json(rolesList);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export { addNewRole, getRolesList }