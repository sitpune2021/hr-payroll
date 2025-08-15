import bcrypt from 'bcryptjs';
import models, { sequelize } from '../models/index.js';
import { where, Op, Sequelize } from 'sequelize';
import * as XLSX from 'xlsx'
import { validateUsersFromExcel } from '../utils/validateUsersFromExcelUpload.js';
import { log } from 'console';
import { deleteImageFile, saveImageFile } from '../utils/imageUtils.js';

const { Permission, Role, User, Branch, Company, Department, UserLeaveQuota } = models;

const addNewUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    let {
      firstName, lastName, contact, email, gender, Designation, roleId,
      companyId, branchId, departmentId, reportingManagerId, joiningDate,
      birthDate, attendanceMode, shiftRotationalFixed, workingShift,
      sendWhatsapp, geofencepoint, leaveTemplate, paymentMode, paymentDate,
      basicSalary, payrollTemplate, tempAddress, permenentAddress, bloodGroup,
      alternateMobileNO, pfNumber
    } = req.body;

    const parseOrNull = (val) => {
      if (val === undefined || val === null || val === '') return null;
      const parsed = parseInt(val);
      return isNaN(parsed) ? null : parsed;
    };

    // Parse integers safely
    reportingManagerId = parseOrNull(reportingManagerId);
    roleId = parseOrNull(roleId);
    branchId = parseOrNull(branchId);
    departmentId = parseOrNull(departmentId);
    workingShift = parseOrNull(workingShift);
    leaveTemplate = parseOrNull(leaveTemplate);
    payrollTemplate = parseOrNull(payrollTemplate);

    // Parse floats safely
    basicSalary = (basicSalary === '' || isNaN(parseFloat(basicSalary))) ? null : parseFloat(basicSalary);

    // Parse dates safely
    joiningDate = joiningDate ? new Date(joiningDate) : null;
    birthDate = birthDate ? new Date(birthDate) : null;
    paymentDate = paymentDate ? new Date(paymentDate) : null;

    if (!firstName || !firstName.trim()) {
      return res.status(400).json({ message: "First name is required" });
    }
    if (!lastName || !lastName.trim()) {
      return res.status(400).json({ message: "Last name is required" });
    }
    if (!contact || !/^\d{10}$/.test(contact)) {
      return res.status(400).json({ message: "Valid 10-digit contact number is required" });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Valid email is required" });
    }
    if (!roleId) {
      return res.status(400).json({ message: "Role is required" });
    }
    if (!companyId) {
      return res.status(400).json({ message: "Company is required" });
    }

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
      reportingManagerId
    }, { transaction });

    await UserLeaveQuota.create({
      userId: newUser.id,
      paidLeavesTaken: 0,
      sickLeavesTaken: 0,
      casualLeavesTaken: 0,
      year: new Date().getFullYear(),
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

    const loggedInUser = req.user; // assume this comes from JWT middleware
    const isAdmin = loggedInUser?.role === 'SUPER_ADMIN'; // OR roleId === 1 etc.

    const whereClause = {};

    // Only admin can see all
    if (!isAdmin) {
      if (loggedInUser.companyId) {
        whereClause.companyId = loggedInUser.companyId;
      }
      if (loggedInUser.branchId) {
        whereClause.branchId = loggedInUser.branchId;
      }
    }


    // Pagination and sorting logic
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const validSortFields = ['id', 'firstName', 'lastName', 'email', 'createdAt'];
    if (!validSortFields.includes(sortField)) sortField = 'id';

    const validSortOrders = ['asc', 'desc'];
    if (!validSortOrders.includes(sortOrder)) sortOrder = 'asc';

    // Fetch data
    const { rows: users, count: total } = await User.findAndCountAll({
      where: whereClause,
      offset,
      limit: parseInt(limit),
      order: [[sortField, sortOrder]],
      attributes: [
        'id', 'firstName', 'lastName', 'contact', 'email',
        'gender', 'designation', 'roleId', 'companyId',
        'branchId', 'departmentId',
        'joiningDate', 'birthDate', 'attendanceMode',
        'shiftRotationalFixed', 'workingShift', 'sendAttTOWhatsapp',
        'geofencepoint', 'leaveTemplateId', 'paymentMode',
        'paymentDate', 'basicSalary', 'profilePhoto',
        'payrollTemplate', 'temporaryAddress', 'PermenantAddress',
        'BloodGroup', 'alternatePhone', 'PFAccountDetails',
        'bankDetails', 'adhaarCard', 'panCard', "reportingManagerId",
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
  const transaction = await sequelize.transaction();

  try {
    const id = req.params.userId;
    const updatedFields = req.body;

    const files = req.files || {};
    console.log('--- FILES RECEIVED ---');
    console.log(req.files); // Log all files
    console.log('--- BODY RECEIVED ---');
    console.log(req.body);  // Log form fields


    // Parse fields safely
    const parseOrNull = (val) => {
      if (val === undefined || val === null || val === '') return null;
      const parsed = parseInt(val);
      return isNaN(parsed) ? null : parsed;
    };

    const parseFloatOrNull = (val) =>
      val === '' || isNaN(parseFloat(val)) ? null : parseFloat(val);

    // Fix field types
    updatedFields.reportingManagerId = parseOrNull(updatedFields.reportingManagerId);
    updatedFields.roleId = parseOrNull(updatedFields.roleId);
    updatedFields.branchId = parseOrNull(updatedFields.branchId);
    updatedFields.departmentId = parseOrNull(updatedFields.departmentId);
    updatedFields.workingShift = parseOrNull(updatedFields.workingShift);
    updatedFields.leaveTemplateId = parseOrNull(updatedFields.leaveTemplate);
    updatedFields.payrollTemplate = parseOrNull(updatedFields.payrollTemplate);
    updatedFields.basicSalary = parseFloatOrNull(updatedFields.basicSalary);
    updatedFields.joiningDate = updatedFields.joiningDate ? new Date(updatedFields.joiningDate) : null;
    updatedFields.birthDate = updatedFields.birthDate ? new Date(updatedFields.birthDate) : null;
    updatedFields.paymentDate = updatedFields.paymentDate ? new Date(updatedFields.paymentDate) : null;
    updatedFields.sendAttTOWhatsapp = updatedFields.sendWhatsapp === 'yes' || updatedFields.sendWhatsapp === true;

    // Fetch existing user
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Handle file uploads and delete old files if replaced

    if (files.profilePhotoEdit?.[0]) {
      deleteImageFile(user.profilePhoto);
      const name = await saveImageFile(files.profilePhotoEdit[0]);
      updatedFields.profilePhoto = name;
    }
    if (files.adhaarCardEdit?.[0]) {
      deleteImageFile(user.adhaarCard);
      updatedFields.adhaarCard = await saveImageFile(files.adhaarCardEdit[0]);
    }
    if (files.panCardEdit?.[0]) {
      deleteImageFile(user.panCard);
      updatedFields.panCard = await saveImageFile(files.panCardEdit[0]);
    }
    if (files.bankDetailsEdit?.[0]) {
      deleteImageFile(user.bankDetails);
      updatedFields.bankDetails = await saveImageFile(files.bankDetailsEdit[0]);
    }
    if (files.educationalQulifEdit?.[0]) {
      deleteImageFile(user.educationalQualification);
      updatedFields.educationalQualification = await saveImageFile(files.educationalQulifEdit[0]);
    }

    // Remove frontend-only fields
    delete updatedFields.sendWhatsapp;
    delete updatedFields.leaveTemplate;

    // Update user
    await user.update(updatedFields, { transaction });

    await transaction.commit();
    return res.status(200).json({ message: "User updated successfully", user });

  } catch (error) {
    await transaction.rollback();
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Error updating user", error: error.message });
  }
};
const uploadUsersExcel = async (req, res) => {
  try {
    const file = req.file;
    const loggedInUser = req.user;

    // ✅ Extract form fields from FormData (text fields come in req.body)
    const { companyId, branchId, departmentId, roleId } = req.body;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // ✅ Optional: Validate that all fields are present
    if (!companyId || !branchId || !departmentId || !roleId) {
      return res.status(400).json({ message: 'All form fields (companyId, branchId, departmentId, roleId) are required.' });
    }

    // ✅ Pass additional metadata to validator (if needed)
    const { validUsers, errors } = await validateUsersFromExcel(
      file.buffer,
      loggedInUser,
      {
        companyId: parseInt(companyId),
        branchId: branchId ? parseInt(branchId) : null,
        departmentId: parseInt(departmentId),
        roleId: parseInt(roleId),
      }
    );

    // ✅ If validation errors exist, send Excel back
    if (errors.length > 0) {

      const errorSheet = XLSX.utils.json_to_sheet(errors);
      const errorBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(errorBook, errorSheet, 'Errors');

      const buffer = XLSX.write(errorBook, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader('Content-Disposition', 'attachment; filename=errors.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return res.status(400).send(buffer);
    }

    // ✅ Save users (assumes validUsers already have necessary info)
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

const getTeamByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Fetch the user with reporting manager
    const user = await User.findByPk(userId, {
      attributes: ['id', 'firstName', 'lastName', 'profilePhoto', 'designation', 'email', 'contact', 'reportingManagerId']
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const team = [];

    // 2. Include manager (if exists)
    if (user.reportingManagerId) {
      const manager = await User.findByPk(user.reportingManagerId, {
        attributes: ['id', 'firstName', 'lastName', 'profilePhoto', 'designation', 'email', 'contact']
      });

      if (manager) {
        team.push({
          id: manager.id,
          name: `${manager.firstName} ${manager.lastName}`,
          email: manager.email,
          contact: manager.contact,
          designation: manager.designation,
          profilePhoto: manager.profilePhoto,
          type: 'manager'
        });
      }

      // 3. Fetch all colleagues who report to the same manager
      const peers = await User.findAll({
        where: {
          reportingManagerId: user.reportingManagerId
        },
        attributes: ['id', 'firstName', 'lastName', 'profilePhoto', 'designation', 'email', 'contact']
      });

      for (const peer of peers) {
        team.push({
          id: peer.id,
          name: `${peer.firstName} ${peer.lastName}`,
          email: peer.email,
          contact: peer.contact,
          designation: peer.designation,
          profilePhoto: peer.profilePhoto,
          type: 'teamMember'
        });
      }

    } else {
      // No manager: only include self
      team.push({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        designation: user.designation,
        type: 'teamMember'
      });
    }

    return res.json({ team });

  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOrganizationTree = async (req, res) => {
  try {
    const { userId } = req.params;

    // Step 1: Get current user to extract companyId and branchId
    const currentUser = await User.findByPk(userId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { companyId, branchId } = currentUser;

    if (!companyId || !branchId) {
      return res.status(400).json({ message: "Company ID or Branch ID missing for user" });
    }

    // Step 2: Fetch all users in the same company
    const usersInCompany = await User.findAll({
      where: { companyId },
      attributes: ['id', 'firstName', 'lastName', 'designation', 'reportingManagerId', 'companyId', 'branchId'],
      include: [
        { model: Company, attributes: ['id', 'name'] },
        { model: Branch, attributes: ['id', 'name'], required: false }
      ]
    });

    // Step 3: Filter users in branch from company list
    const usersInBranch = usersInCompany.filter(u => u.branchId === branchId);

    // Step 4: Build maps for company and branch trees
    const buildUserMap = (users) => {
      const userMap = {};
      users.forEach(user => {
        userMap[user.id] = {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          designation: user.designation,
          company: user.Company ? { id: user.Company.id, name: user.Company.name } : null,
          branch: user.Branch ? { id: user.Branch.id, name: user.Branch.name } : null,
          team: []
        };
      });
      return userMap;
    };

    const buildManagerMap = (users) => {
      const managerMap = {};
      users.forEach(user => {
        const mgrId = user.reportingManagerId;
        if (!managerMap[mgrId]) managerMap[mgrId] = [];
        managerMap[mgrId].push(user.id);
      });
      return managerMap;
    };

    const buildTree = (managerMap, userMap, rootManagerId = null) => {
      const children = managerMap[rootManagerId] || [];
      return children.map(id => {
        const userNode = userMap[id];
        userNode.team = buildTree(managerMap, userMap, id);
        return userNode;
      });
    };

    // Company Tree
    const companyUserMap = buildUserMap(usersInCompany);
    const companyManagerMap = buildManagerMap(usersInCompany);
    const companyTree = buildTree(companyManagerMap, companyUserMap);

    // Branch Tree
    const branchUserMap = buildUserMap(usersInBranch);
    const branchManagerMap = buildManagerMap(usersInBranch);
    const branchTree = buildTree(branchManagerMap, branchUserMap);

    return res.json({
      companyTree,
      branchTree
    });

  } catch (error) {
    console.error("Error building organization tree:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({
      where: { id: userId },
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'contact',
        'designation',
        'birthDate',
        'BloodGroup',
        'profilePhoto',
        'companyId'
      ],
      include: [
        {
          model: Company,
          attributes: ['name'],
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Format response
    const fullName = `${user.firstName} ${user.lastName}`;
    const formattedDOB = user.birthDate
      ? new Date(user.birthDate).toISOString().split('T')[0].split('-').reverse().join(' : ')
      : null;

    res.json({
      id: user.id,
      fullName,
      designation: user.designation,
      companyName: user.Company?.name || 'N/A',
      empCode: `Emp Code${user.id}`,
      dob: formattedDOB,
      bloodGroup: user.BloodGroup || 'N/A',
      contact: user.contact,
      email: user.email,
      profilePhoto: user.profilePhoto || null
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



const getBirthdaysAndAnniversaries = async (req, res) => {
  try {
    const { companyId, branchId, startDate, endDate } = req.query;

    if (!companyId) {
      return res.status(400).json({ error: "companyId is required" });
    }
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }

    // Local timezone safe parsing (yyyy-mm-dd → Date)
    const [sy, sm, sd] = startDate.split("-").map(Number);
    const [ey, em, ed] = endDate.split("-").map(Number);
    const start = new Date(sy, sm - 1, sd);
    const end = new Date(ey, em - 1, ed);

    const whereClause = { companyId };
    if (branchId) whereClause.branchId = branchId;

    const employees = await User.findAll({
      where: whereClause,
      attributes: [
        "id", "firstName", "lastName",
        "birthDate", "joiningDate",
        "designation", "companyId", "branchId",
      ],
    });

    const birthdays = [];
    const anniversaries = [];

    employees.forEach((emp) => {
      // --- Birthday ---
      if (emp.birthDate) {
        const [_, birthMonth, birthDay] = emp.birthDate
          .toISOString()
          .split("T")[0]
          .split("-")
          .map(Number);

        const currentYearBirthday = new Date(start.getFullYear(), birthMonth - 1, birthDay);
        if (currentYearBirthday >= start && currentYearBirthday <= end) {
          birthdays.push(emp);
        }
      }

      // --- Anniversary ---
      if (emp.joiningDate) {
        const [_, joinMonth, joinDay] = emp.joiningDate
          .toISOString()
          .split("T")[0]
          .split("-")
          .map(Number);

        const currentYearAnniversary = new Date(start.getFullYear(), joinMonth - 1, joinDay);
        if (currentYearAnniversary >= start && currentYearAnniversary <= end) {
          anniversaries.push(emp);
        }
      }
    });

    return res.json({ birthdays, anniversaries });

  } catch (error) {
    console.error("Error fetching birthdays/anniversaries:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export default getBirthdaysAndAnniversaries;



export { getBirthdaysAndAnniversaries, getUserProfile, getOrganizationTree, getTeamByUserId, addNewUser, getUsersList, updateUserCOntrller, uploadUsersExcel, fetchCompanysUsers }
