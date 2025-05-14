import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { sequelize } from './models/index.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import companyRoutes from './routes/company.routes.js';
import branchRoutes from './routes/branch.route.js';
import roleRouter from './routes/role.route.js';
import featureRouter from './routes/feature.route.js';
import settingRoutes from './routes/settings.router.js';
import userRouter from './routes/user.routes.js';
import imageRouter from './routes/images.routes.js';
import attendanceRouter from './routes/attendance.router.js';
import employeeShiftRoutes from './routes/employeeShift.router.js';
import attendanceSettingRoutes from './routes/AttendanceSetting.router.js';
import payrollTemplateRoute from './routes/payroll.templete.router.js';

import depaermentRouter from './routes/department.routes.js' 
import { PORT } from './envvariablesdata.js';


dotenv.config();

const app = express();

app.use(cors({
  // origin: "http://localhost:3000",
  origin: "http://103.165.118.71:3020",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/branch', branchRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/role', roleRouter);
app.use('/api/feature',featureRouter)
app.use('/api/user',userRouter)
app.use('/api/image',imageRouter)
app.use('/api/department',depaermentRouter)
app.use('/api/attendance',attendanceRouter)
app.use('/api/shifts', attendanceSettingRoutes);
app.use('/api/employee-shift', employeeShiftRoutes);

app.use('/api/payrollTemplate', payrollTemplateRoute);








async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    await sequelize.sync();
    console.log('Database synchronized.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

start();
