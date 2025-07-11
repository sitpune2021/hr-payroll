import models, { sequelize } from "../models/index.js";
import bcrypt from 'bcryptjs';
import { deleteImageFile, saveImageFile } from "../utils/imageUtils.js";

const { Company, User, Role, Department } = models;


const addnewcompany = async (req, res) => {
  const {
    companyName,
    companyAddress,
    companyPhone,
    companyEmail,
    companyWebsite,
    subscriptionStartDate,
    subscriptionEndDate,
    allowedNoOfUsers,
    firstName,
    lastName,
    password,
  } = req.body;
  const transaction = await sequelize.transaction();

  const nameExists = await Company.findOne({ where: { name: companyName } });
  if (nameExists) {
    await transaction.rollback();
    return res.status(400).json({ message: "Company with this name already exists." });
  }

  const emailExists = await Company.findOne({ where: { email: companyEmail } });
  if (emailExists) {
    await transaction.rollback();
    return res.status(400).json({ message: "Company with this email already exists." });
  }

  const phoneExists = await Company.findOne({ where: { phone: companyPhone } });
  if (phoneExists) {
    await transaction.rollback();
    return res.status(400).json({ message: "Company with this phone number already exists." });
  }

  if (companyWebsite) {
    const websiteExists = await Company.findOne({ where: { website: companyWebsite } });
    if (websiteExists) {
      await transaction.rollback();
      return res.status(400).json({ message: "Company with this website already exists." });
    }
  }


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
        subscriptionStartDate,
        subscriptionEndDate,
        allowedNoOfUsers
      },
      { transaction }
    );

    const rolesToCreate = ["COMPANY_ADMIN", "BRANCH_MANAGER", "EMPLOYEE"];
    const createdRoles = {};

    for (const roleName of rolesToCreate) {
      const role = await Role.create({ name: roleName, companyId: company.id }, { transaction });
      createdRoles[roleName] = role;
    }

    const companyAdminRole = createdRoles["COMPANY_ADMIN"];
    if (!companyAdminRole) throw new Error("Failed to create COMPANY_ADMIN role");
    if (!companyAdminRole) throw new Error("Role 'COMPANY_ADMIN' not found");

    const hashedPassword = await bcrypt.hash(password, 10);

    let department2 = await Department.findOne({ where: { name: "Admins" } });

    const newUser = await User.create({
      email: companyEmail,
      contact: companyPhone,
      password: hashedPassword,
      firstName: firstName || "Admin",
      lastName: lastName || "User",
      roleId: companyAdminRole.id,
      designation:"company admin",
      companyId: company.id,
      departmentId: department2.id,
      joiningDate: new Date()
    }, { transaction });



    await transaction.commit();

    res.status(201).json({
      message: "Company and Company Admin User created successfully",
      company,
      newUser
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Company creation failed:", error);
    res.status(500).json({ message: error.message });
  }
};

const fetchListOfCompanies = async (req, res) => {
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
      address,
      subscriptionStartDate,
      subscriptionEndDate,
      allowedNoOfUsers
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
    company.subscriptionStartDate = subscriptionStartDate;
    company.subscriptionEndDate = subscriptionEndDate;
    company.allowedNoOfUsers = allowedNoOfUsers;

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


export { addnewcompany, updatecompany, fetchListOfCompanies }