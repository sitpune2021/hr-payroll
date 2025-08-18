import { where } from "sequelize";
import models, { sequelize } from "../models/index.js";
import { saveImageFile } from "../utils/imageUtils.js";
import logger from '../config/logger.js';

const { Branch, Company } = models;



const addNewBranch = async (req, res) => {
  logger.info(`${req.user.id}-- adding new branch`);
  const { name, address, phone, companyId, email, nameOfSalarySlip } = req.body;

  try {
    const branchLogoFile = req.files['branchLogo']?.[0];
    const bankDetailsFile = req.files['bankDetails']?.[0];

    if (!branchLogoFile) {
      return res.status(400).json({ message: 'Branch logo is required' });
    }

    // 🔍 Check by name
    const nameExists = await Branch.findOne({ where: { name } });
    if (nameExists) {
      return res.status(409).json({ message: 'A branch with this name already exists' });
    }

    // 🔍 Check by phone
    const phoneExists = await Branch.findOne({ where: { phone } });
    if (phoneExists) {
      return res.status(409).json({ message: 'A branch with this phone number already exists' });
    }

    // 🔍 Check by email
    const emailExists = await Branch.findOne({ where: { email } });
    if (emailExists) {
      return res.status(409).json({ message: 'A branch with this email already exists' });
    }

    let branchLogoFileName = await saveImageFile(branchLogoFile);
    let bankDetailsFileName = null;

    if (bankDetailsFile) {
      bankDetailsFileName = await saveImageFile(bankDetailsFile);
    }

    const newBranch = await Branch.create({
      name,
      address,
      phone,
      email,
      companyId,
      nameOfSalarySlip,
      bankDetailsFileName,
      branchLogoFileName
    });
    logger.info(`${req.user.id}-- added new branch`);
    res.status(201).json({
      message: 'Branch created successfully',
      branch: newBranch
    });

  } catch (error) {
    logger.error(`${`${req.user.id}--${error}`}`);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};


const fetchListBranches = async (req, res) => {
  try {
    const user = req.user;
    logger.info(`${req.user.id}-- fetching branch list controller entry`);
    if (user.companyId) {
      const branches = await Branch.findAll({
        where: {
          companyId: user.companyId
        }
      }
      );
      logger.info(`${req.user.id}-- branch list fetched successfully for company user`);
      return res.status(200).json(branches)
    }else{
      const branches = await Branch.findAll();
      logger.info(`${req.user.id}-- getched branch list for super admin`);
      return res.status(200).json(branches)
    }

  } catch (error) {
    logger.erro(`${req.user.id}--${error}--error while fetching list of branches`);
    return res.status(500).json({ message: "Error" })
  }
}

const updateBranch = async (req, res) => {
  try {
    logger.info(`${req.user.id}-- updating existing branch`);
    const id = req.params.branchId;
    const { name, address, phone, email,status } = req.body;
    const branch = await Branch.update({ name, address, phone, email,status }, { where: { id } });
    logger.info(`${req.user.id}-- branch updated successfully`);
    return res.status(200).json({ message: "Branch updated successfully", branch: branch })
  } catch (error) {
    logger.error(`${req.user.id}-- ${error}--error while updating branch`);
    return res.status(500).json({ message: "Error" })
  }
}

export { addNewBranch, updateBranch, fetchListBranches };