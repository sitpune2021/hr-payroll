import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import UserModel from './user.model.js';
import CompanyModel from './company.model.js';
import BranchModel from './branch.model.js';
import RoleModel from './Role.model.js';
import initSuperAdmin from '../config/initSuperAdmin.js';
import PermissionModel from './Permission.model.js';
import RolePermissionModel from './RolePermission.model.js';
import PayrollTemplateModel from './PayrollTemplate.js';
import PayrollComponentModel from './PayrollComponent.js';
import AttendanceModel from './Attendance.js';
import SalarySlipModel from './SalarySlip.js';
import AttendanceSettingModel from './AttendanceSetting.js';
import EmployeeShiftScheduleModel from './EmployeeShiftSchedule.js';
import LeaveTemplateModel from './LeaveTemplate.template.js';







// import seedPermissions from '../config/permissionSeeder.js';
import seedRoles from '../config/roleSeeder.js';
import seedRolePermissions from '../config/rolePermissionSeeder.js';
import departmentModel from './department.model.js';
import seedPermissions from '../config/permissionSeeder.js';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from '../envvariablesdata.js';
import WeeklyOffPatternModel from './WeeklyOffPattern.model.js';
import HolidayModel from './Holiday.model.js';
import HolidayGroupModel from './HolidayGroup.model.js';
import UserLeaveQuotaModel from './UserLeaveQuota.model.js';
import LeaveRecordModel from './LeaveRecord.model.js';

// dotenv.config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT || 5432,
//     dialect: 'postgres',
//     logging: false,
//   }
// );


const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  {
    host: DB_HOST,
    port: 5432,
    dialect: 'postgres',
    logging: false,
  }
);

const models = {
  User: UserModel(sequelize),
  Company: CompanyModel(sequelize),
  Branch: BranchModel(sequelize),
  Role: RoleModel(sequelize),
  Permission: PermissionModel(sequelize),
  RolePermission: RolePermissionModel(sequelize),
  Department: departmentModel(sequelize),
  PayrollTemplate: PayrollTemplateModel(sequelize),
  PayrollComponent: PayrollComponentModel(sequelize),
  Attendance: AttendanceModel(sequelize),
  SalarySlip: SalarySlipModel(sequelize),
  AttendanceSetting: AttendanceSettingModel(sequelize),
  EmployeeShiftSchedule: EmployeeShiftScheduleModel(sequelize),
  LeaveTemplate: LeaveTemplateModel(sequelize),
  WeeklyOffPattern: WeeklyOffPatternModel(sequelize),
  HolidayGroup: HolidayGroupModel(sequelize),
  Holiday: HolidayModel(sequelize),
  UserLeaveQuota: UserLeaveQuotaModel(sequelize),
  LeaveRecord: LeaveRecordModel(sequelize),
};

// Function to seed roles


// Authenticate and seed roles
await sequelize.authenticate();
console.log('Database connected successfully.');

await sequelize.sync({alter:true});
// console.log('Database synchronized successfully.');

await seedRoles(models.Role);
await initSuperAdmin(models);
await seedPermissions(models)
// await seedRolePermissions(models);

// Define relationships
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { sequelize, models };
export default {
  sequelize,
  ...models,
};
