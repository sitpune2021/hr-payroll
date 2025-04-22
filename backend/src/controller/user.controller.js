import bcrypt from 'bcryptjs';
import models from '../models/index.js';
import { where,Op } from 'sequelize';
import * as XLSX from 'xlsx'
import { validateUsersFromExcel } from '../utils/validateUsersFromExcelUpload.js';

const { Permission, Role, User, Company,Department } = models;

const addNewUser = async (req, res) => {

  try {
    const {
      firstName,
      lastName,
      email,
      password,
      contact,
      birthDate,
      roleId,
      maritalStatus,
      companyId,
      branchId,
      departmentId
    } = req.body;
    console.log(departmentId,"!!!!!!!!!!!!!!!!!!!!!!!");
    


    const userExists = await User.findOne({
      where:
        { email: email }
    });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    const deptExist = await Department.findOne({
      where:
        { id:departmentId}
    });
    if (!deptExist) {
      return res.status(400).json({ message: "Department not found." });
    }

    const userExists2 = await User.findOne({
      where: {
        contact
      }
    });
    if (userExists2) {
      return res.status(400).json({ message: "User already exists with this contact." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const cleanBranchId = branchId === '' ? null : branchId;
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      contact,
      birthDate,
      roleId,
      maritalStatus,
      companyId,
      branchId: cleanBranchId,
      departmentId
    });
    const savedUser = await newUser.save();


    return res.status(200).json({ message: "User added successfully", savedUser });

  } catch (error) {
    return res.status(500).json({ message: "Error adding new user", error: error.message });
  }
}

const getUsersList = async (req, res) => {
  try {
    const { companyId, branchId, roleId, page = 1, limit = 10, sortField = 'id', sortOrder = 'asc' } = req.query;

    const whereClause = {};
    
    // Apply dynamic filters
    if (companyId) whereClause.companyId = companyId;
    if (branchId) whereClause.branchId = branchId;
    if (roleId) whereClause.roleId = { [Op.gt]: roleId };

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Ensure valid sortField and sortOrder
    const validSortFields = ['id', 'firstName', 'lastName', 'email', 'createdAt'];
    if (!validSortFields.includes(sortField)) sortField = 'id';
    
    const validSortOrders = ['asc', 'desc'];
    if (!validSortOrders.includes(sortOrder)) sortOrder = 'asc';

    // Fetch and sort users from the database
    const { rows: users, count: total } = await User.findAndCountAll({
      where: whereClause,
      offset,
      limit: parseInt(limit),
      order: [[sortField, sortOrder]],
      attributes: ['id','contact', 'companyId','firstName', 'branchId', 'roleId', 'birthDate', 'maritalStatus','departmentId', 'lastName', 'email', 'createdAt'],
    });

    return res.status(200).json({
      users,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    return res.status(500).json({ message: "Error getting users list", error: error.message });
  }
};


const updateUserCOntrller = async (req, res) => {
  try {
    const id = req.params.userId;
    const { firstName, lastName, email, contact, birthDate, maritalStatus, companyId, branchId, roleId,departmentId } = req.body;
    console.log(departmentId,"AAAAAAAAAAAAAAAAAAAAA");
    
    const user = await User.findOne({
      where: {
        id
      }
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const cleanBranchId = branchId === '' ? null : branchId;
    const cleanCompanyId = companyId === '' ? null : companyId;
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.contact = contact;
    user.birthDate = birthDate;
    user.maritalStatus = maritalStatus;
    user.companyId = cleanCompanyId;
    user.branchId = cleanBranchId;
    user.roleId = roleId;
    user.departmentId = departmentId;
    await user.save();
    return res.status(200).json({ message: "User updated successfully" });


  } catch (error) {
    return res.status(500).json({ message: "Error updating user", error: error.message });
  }
}

const uploadUsersExcel = async (req, res) => {
  try {
    const file = req.file;
    const loggedInUser = req.user;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { validUsers, errors } = await validateUsersFromExcel(file.buffer, loggedInUser);

    if (errors.length > 0) {
      const errorSheet = XLSX.utils.json_to_sheet(errors);
      const errorBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(errorBook, errorSheet, 'Errors');

      const buffer = XLSX.write(errorBook, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader('Content-Disposition', 'attachment; filename=errors.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return res.status(400).send(buffer);
    }

    await User.bulkCreate(validUsers);
    return res.status(200).json({ message: 'All users uploaded successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export { addNewUser, getUsersList, updateUserCOntrller, uploadUsersExcel }
