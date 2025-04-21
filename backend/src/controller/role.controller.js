import models from "../models/index.js";

const { Role } = models;

const addNewRole = async (req, res) => {
    try {

        const { name } = req.body;

        const existingRole = await Role.findOne({
            where: {
                name
            }
        });

        if (existingRole) {
            return res.status(400).json({ message: "Role already exists" });
        }

        const createdRole = await Role.create({ name });
        return res.status(201).json({ message: "Role created successfully", createdRole });



    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });

    }





}


const getRolesList = async (req, res) => {
    try {
        const rolesList = await Role.findAll({
            attributes: ['id', 'name'],
        });
        res.status(200).json(rolesList);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });

    }
}

export { addNewRole, getRolesList }