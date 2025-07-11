import models, { sequelize } from "../models/index.js";
import { saveImageFile } from "../utils/imageUtils.js";

const { Branch, Company } = models;


const addNewBranch = async (req, res) => {
  const { name, address, phone, companyId, email, nameOfSalarySlip } = req.body;

  try {

    const branchLogoFile = req.files['branchLogo']?.[0];
    const bankDetailsFile = req.files['bankDetails']?.[0];

     let branchLogoFileName = null;
     let bankDetailsFileName = null;

    
        if (branchLogoFile) {
          branchLogoFileName = await saveImageFile(branchLogoFile);
        }

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
}

const fetchListBranches = async (req, res) => {
  try {
    const branches = await Branch.findAll();
    return res.status(200).json(branches)
  } catch (error) {
    console.error('Error fetching branches:', error);
    return res.status(500).json({ message: "Error" })
  }
}

const updateBranch = async (req, res) => {
  try {
    const id = req.params.branchId;
    const { name, address, phone, email } = req.body;
    const branch = await Branch.update({ name, address, phone, email }, { where: { id } });
    return res.status(200).json({ message: "Branch updated successfully", branch: branch })
  } catch (error) {
    console.error('Error updating branch:', error);
    return res.status(500).json({ message: "Error" })
  }
}

export { addNewBranch, updateBranch, fetchListBranches };