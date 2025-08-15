import { where } from "sequelize";
import models, { sequelize } from "../models/index.js";
import { saveImageFile } from "../utils/imageUtils.js";

const { Branch, Company } = models;



const addNewBranch = async (req, res) => {
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

    res.status(201).json({
      message: 'Branch created successfully',
      branch: newBranch
    });

  } catch (error) {
    console.error('Error creating branch:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};


const fetchListBranches = async (req, res) => {
  try {
    const user = req.user;
    if (user.companyId) {
      const branches = await Branch.findAll({
        where: {
          companyId: user.companyId
        }
      }
      );
      return res.status(200).json(branches)
    }else{
      const branches = await Branch.findAll();
      return res.status(200).json(branches)
    }

  } catch (error) {
    console.error('Error fetching branches:', error);
    return res.status(500).json({ message: "Error" })
  }
}

const updateBranch = async (req, res) => {
  try {
    const id = req.params.branchId;
    const { name, address, phone, email,status } = req.body;
    const branch = await Branch.update({ name, address, phone, email,status }, { where: { id } });
    return res.status(200).json({ message: "Branch updated successfully", branch: branch })
  } catch (error) {
    console.error('Error updating branch:', error);
    return res.status(500).json({ message: "Error" })
  }
}

export { addNewBranch, updateBranch, fetchListBranches };