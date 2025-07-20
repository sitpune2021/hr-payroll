import * as XLSX from 'xlsx';
import bcrypt from 'bcryptjs';
import models from '../models/index.js';
const { Company, User, Role, Branch } = models;

const validateUsersFromExcel = async (buffer, loggedInUser, metadata) => {
  const { companyId, branchId, departmentId, roleId } = metadata;

  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  const errors = [];
  const validUsers = [];

  // Optional: preload companies, branches, roles if needed
  const allowedCompany = await Company.findByPk(companyId);
  const allowedBranch = branchId ? await Branch.findByPk(branchId) : null;
  const allowedRole = await Role.findByPk(roleId);

  if (!allowedCompany) {
    throw new Error('Invalid companyId from metadata');
  }
  if (branchId && !allowedBranch) {
    throw new Error('Invalid branchId from metadata');
  }
  if (!allowedRole) {
    throw new Error('Invalid roleId from metadata');
  }

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowErrors = [];

    // ✅ Required fields from Excel
    const requiredFields = ['firstName', 'lastName', 'email', 'contact'];
    requiredFields.forEach(field => {
      if (!row[field]) rowErrors.push(`${field} is required`);
    });

    // ✅ Email uniqueness
    const emailExists = await User.findOne({ where: { email: row.email } });
    if (emailExists) rowErrors.push('Email already exists');

    // ✅ Contact uniqueness
    const contactExists = await User.findOne({ where: { contact: row.contact } });
    if (contactExists) rowErrors.push('Contact already exists');

    // ✅ Role hierarchy check
    const userRoleId = loggedInUser.roleId;
    if (parseInt(roleId) <= userRoleId) {
      rowErrors.push('Cannot assign higher or equal role');
    }

    // ✅ No need to check row.companyId or row.branchId — they're coming from metadata

    if (rowErrors.length > 0) {
      errors.push({ ...row, errors: rowErrors.join(', ') });
    } else {
      const defaultPassword = row.contact?.toString(); // fallback handled
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      validUsers.push({
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        contact: row.contact,
        password: hashedPassword,
        birthDate: null,
        maritalStatus: null,
        companyId,
        branchId: branchId || null,
        departmentId,
        roleId
      });
    }
  }

  return { validUsers, errors };
};

export { validateUsersFromExcel };
