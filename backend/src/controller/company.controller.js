import models, { sequelize } from "../models/index.js";
import bcrypt from 'bcryptjs';
import { deleteImageFile, saveImageFile } from "../utils/imageUtils.js";

const { Company, User, Role } = models;


const addnewcompany = async (req, res) => {
  const {
    companyName,
    companyAddress,
    companyPhone,
    companyEmail,
    companyWebsite
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    // Upload and save company image if provided
    let imageFileName = null;
    
    if (req.file) {
      
      imageFileName = await saveImageFile(req.file);
    }

    // Create the company
    const company = await Company.create(
      {
        name: companyName,
        address: companyAddress,
        phone: companyPhone,
        email: companyEmail,
        website: companyWebsite || null,
        companyImage: imageFileName,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Company creation failed:", error);
    res.status(500).json({ message: error.message });
  }
};

const fetchListOfCompanies =async(req,res)=>{
  try {
    const companies = await Company.findAll();
    res.status(200).json(companies);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}



 const updatecompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const {
      name,
      isActive,
      email,
      phone,
      website,
      address
    } = req.body;

    const company = await Company.findByPk(companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    // Update basic fields
    company.name = name;
    company.isActive = isActive === 'true'; // convert to boolean
    company.email = email;
    company.phone = phone;
    company.website = website;
    company.address = address;

    // If new image uploaded
    if (req.file) {
      // Delete old image if exists
      if (company.companyImage) {
        await deleteImageFile(company.companyImage);
      }

      // Save new image and update name
      const savedFileName = await saveImageFile(req.file);
      company.companyImage = savedFileName;
    }

    await company.save();

    return res.status(200).json({ message: 'Company updated successfully', company });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};


export { addnewcompany, updatecompany,fetchListOfCompanies }