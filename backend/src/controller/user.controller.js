import bcrypt from 'bcryptjs';
import models from '../models/index.js';
import { where, Op, Sequelize } from 'sequelize';
import * as XLSX from 'xlsx'
import { validateUsersFromExcel } from '../utils/validateUsersFromExcelUpload.js';
import { log } from 'console';
import { saveImageFile } from '../utils/imageUtils.js';

const { Permission, Role, User, Company, Department , UserLeaveQuota } = models;

const addNewUser = async (req, res) => {
  const transaction = await Sequelize.transaction();
  try {
    let {
      firstName, lastName, contact, email, gender, Designation, roleId,
      companyId, branchId, departmentId, reportingPerson, joiningDate,
      birthDate, attendanceMode, shiftRotationalFixed, workingShift,
      sendWhatsapp, geofencepoint, leaveTemplate, paymentMode, paymentDate,
      basicSalary, payrollTemplate, tempAddress, permenentAddress, bloodGroup,
      alternateMobileNO, pfNumber
    } = req.body;

    const clean = (val) => val === '' || val === undefined ? null : val;
    [
      birthDate, joiningDate, roleId, branchId, departmentId, gender,
      basicSalary, geofencepoint, paymentMode, workingShift
    ] = [
      clean(birthDate), clean(joiningDate), clean(roleId), clean(branchId),
      clean(departmentId), clean(gender), clean(basicSalary),
      clean(geofencepoint), clean(paymentMode), clean(workingShift)
    ];

    const company = await Company.findByPk(companyId);
    if (!company) return res.status(400).json({ message: "Company not found" });

    const existingUserCount = await User.count({ where: { companyId } });
    if (existingUserCount >= company.allowedNoOfUsers) {
      return res.status(400).json({ message: "User limit exceeded, please contact Provider." });
    }

    const [userExists, userExists2] = await Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { contact } })
    ]);
    if (userExists) return res.status(400).json({ message: "Email already exists" });
    if (userExists2) return res.status(400).json({ message: "Contact already exists" });

    const deptExist = await Department.findByPk(departmentId);
    if (!deptExist) return res.status(400).json({ message: "Department not found" });

    const files = req.files || {};
    const profilePhoto = files.profilePhoto?.[0] ? await saveImageFile(files.profilePhoto[0]) : null;
    const adhaarCard = files.adhaarCard?.[0] ? await saveImageFile(files.adhaarCard[0]) : null;
    const panCard = files.panCard?.[0] ? await saveImageFile(files.panCard[0]) : null;
    const bankDetails = files.bankDetails?.[0] ? await saveImageFile(files.bankDetails[0]) : null;
    const educationalQualification = files.educationalQualification?.[0] ? await saveImageFile(files.educationalQualification[0]) : null;

    const hashedPassword = await bcrypt.hash(contact, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      contact,
      email,
      gender,
      designation: Designation,
      roleId,
      companyId,
      branchId,
      departmentId,
      reportingPerson,
      joiningDate,
      birthDate,
      attendanceMode,
      shiftRotationalFixed,
      workingShift,
      sendAttTOWhatsapp: sendWhatsapp === 'yes' || sendWhatsapp === true,
      geofencepoint,
      leaveTemplateId: leaveTemplate,
      paymentMode,
      paymentDate,
      basicSalary,
      payrollTemplate,
      temporaryAddress: tempAddress,
      PermenantAddress: permenentAddress,
      BloodGroup: bloodGroup,
      alternatePhone: alternateMobileNO,
      PFAccountDetails: pfNumber,
      password: hashedPassword,
      profilePhoto,
      adhaarCard,
      panCard,
      bankDetails,
      educationalQualification,
    }, { transaction });

    const currentYear = new Date().getFullYear();


    // await addEmployee(newUser.id, newUser.firstName + " " + newUser.lastName, newUser.gender, newUser.designation)

    await UserLeaveQuota.create({
      userId: newUser.id,
      paidLeavesTaken: 0,
      sickLeavesTaken: 0,
      casualLeavesTaken: 0,
      year: currentYear,
      month: null
    }, { transaction });

    await transaction.commit();

    return res.status(201).json({ message: "User added successfully", user: newUser });

  } catch (error) {
    await transaction.rollback();
    console.error("Error adding user:", error);
    return res.status(500).json({ message: "Error adding new user", error: error.message });
  }
};



const getUsersList = async (req, res) => {
  try {
    let {
      companyId,
      branchId,
      roleId,
      page = 1,
      limit = 10,
      sortField = 'id',
      sortOrder = 'asc',
    } = req.query;

    const whereClause = {};

    // Apply filters
    if (companyId) whereClause.companyId = companyId;
    if (branchId) whereClause.branchId = branchId;
    if (roleId) whereClause.roleId = roleId; // use Op.gt only if intentional

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Validate sort field
    const validSortFields = [
      'id', 'firstName', 'lastName', 'email', 'createdAt'
    ];
    if (!validSortFields.includes(sortField)) sortField = 'id';

    // Validate sort order
    const validSortOrders = ['asc', 'desc'];
    if (!validSortOrders.includes(sortOrder)) sortOrder = 'asc';

    // Query the users
    const { rows: users, count: total } = await User.findAndCountAll({
      where: whereClause,
      offset,
      limit: parseInt(limit),
      order: [[sortField, sortOrder]],
      attributes: [
        'id', 'firstName', 'lastName', 'contact', 'email',
        'gender', 'designation', 'roleId', 'companyId',
        'branchId', 'departmentId', 'reportingPerson',
        'joiningDate', 'birthDate', 'attendanceMode',
        'shiftRotationalFixed', 'workingShift', 'sendAttTOWhatsapp',
        'geofencepoint', 'leaveTemplateId', 'paymentMode',
        'paymentDate', 'basicSalary',
        'payrollTemplate', 'temporaryAddress', 'PermenantAddress',
        'BloodGroup', 'alternatePhone', 'PFAccountDetails',
        'bankDetails', 'adhaarCard', 'panCard',
        'educationalQualification', 'createdAt', 'updatedAt'
      ],
    });

    return res.status(200).json({
      users,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });

  } catch (error) {
    console.error('getUsersList error:', error);
    return res.status(500).json({
      message: 'Error getting users list',
      error: error.message,
    });
  }
};

const updateUserCOntrller = async (req, res) => {
  try {
    const id = req.params.userId;
    const { firstName, lastName, email, contact, birthDate, maritalStatus, companyId, branchId, roleId, departmentId } = req.body;
    console.log(departmentId, "AAAAAAAAAAAAAAAAAAAAA");

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


const fetchCompanysUsers = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    console.log('[Fetch Company Users] companyId:', companyId);

    const compUserList = await User.findAll({
      where: {
        companyId: companyId,
      },
      attributes: [
        'id',
        'firstName',
        'lastName',
        'contact',
        'email',
        'designation',
        'roleId',
        'companyId',
        'branchId',
        'departmentId',
        'workingShift',
        'profilePhoto',
      ],
    });

    console.log(`[Users Fetched] Count: ${compUserList.length}`);

    return res.status(200).json(compUserList);

  } catch (error) {
    console.error('[Error in fetchCompanysUsers]', error);
    return res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};


export { addNewUser, getUsersList, updateUserCOntrller, uploadUsersExcel, fetchCompanysUsers }
