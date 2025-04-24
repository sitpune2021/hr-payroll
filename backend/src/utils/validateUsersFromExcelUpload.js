// utils/validateUsersFromExcel.ts
import * as XLSX from 'xlsx';
import bcrypt from 'bcryptjs';
import models from '../models/index.js';
const { Company, User, Role,Branch } = models;


const validateUsersFromExcel = async (buffer, loggedInUser) => {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);
  
    const errors = [];
    const validUsers = [];
  
    const allCompanies = await Company.findAll();
    const allBranches = await Branch.findAll();
    const allRoles = await Role.findAll();
  
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowErrors = [];
  
      const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'roleId', 'companyId','departmentId'];
      requiredFields.forEach(field => {
        if (!row[field]) rowErrors.push(`${field} is required`);
      });
  
      if (row.password !== row.confirmPassword) {
        rowErrors.push('Password and confirmPassword do not match');
      }
  
      const emailExists = await User.findOne({ where: { email: row.email } });
      if (emailExists) rowErrors.push('Email already exists');
  
      const contactExists = await User.findOne({ where: { contact: row.contact } });
      if (contactExists) rowErrors.push('Contact already exists');
  
      const userRoleId = loggedInUser.roleId;
      if (parseInt(row.roleId) <= userRoleId) {
        rowErrors.push('Cannot assign higher or equal role');
      }
  
      const allowedCompany = allCompanies.find(c => c.id == row.companyId);
      if (!allowedCompany || (loggedInUser.companyId && loggedInUser.companyId !== allowedCompany.id)) {
        rowErrors.push('Invalid companyId');
      }
  
      if (parseInt(row.roleId) >= 3 && !row.branchId) {
        rowErrors.push('Branch required for role');
      } else if (row.branchId) {
        const validBranch = allBranches.find(b => b.id == row.branchId && b.companyId == row.companyId);
        if (!validBranch) {
          rowErrors.push('Invalid branchId');
        }
      }
  
      if (rowErrors.length > 0) {
        errors.push({ ...row, errors: rowErrors.join(', ') });
      } else {
        const hashedPassword = await bcrypt.hash(row.password, 10);
        validUsers.push({
          firstName: row.firstName,
          lastName: row.lastName,
          email: row.email,
          password: hashedPassword,
          contact: row.contact,
          birthDate: row.birthDate || null,
          roleId: row.roleId,
          maritalStatus: row.maritalStatus,
          companyId: row.companyId,
          branchId: row.branchId || null,
          departmentId:row.departmentId
        });
      }
    }
  
    return { validUsers, errors };
  };


  export {validateUsersFromExcel}