import models from "../models/index.js";
import logger from '../config/logger.js';

const { Department } = models;

const AddNewDepartments = async (req, res) => {

    try {
        logger.info(`${req.user.id}-- add new department controller entry`)
        const { name, description, companyId } = req.body;
        const companyID = Number(companyId)

        const existing = await Department.findOne({ where: { name, companyId: companyID } });
        if (existing) {
            return res.status(400).json({ message: "Department already exist" });
        }

        const createdDept = await Department.create({
            name,
            description,
            companyId: companyID
        });

        logger.info(`${req.user.id}-- add new department controller added dept successfully`)
        return res.status(201).json({ message: "Departemnt created Successfully", createdDept })
    } catch (error) {
        logger.error(`${req.user.id}--${error}--error while adding new department`)
        return res.status(500).json({ message: error.message })
    }

}

const FetchDepartmentList = async (req, res) => {

    try {
        logger.info(`${req.user.id}-- fetch department list controller entry`)
        const deparments = await Department.findAll({
            attributes: ["id", "name", "description", "companyId", "isActive"],
        });
        logger.info(`${req.user.id}-- fetch department list successfully`)
        return res.status(200).json(deparments)
    } catch (error) {
        logger.error(`${req.user.id}--${error}--error while fetching department list`)
        return res.status(500).json({ message: error.message });
    }

}

export { AddNewDepartments, FetchDepartmentList }