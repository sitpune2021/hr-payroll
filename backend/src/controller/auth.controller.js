import { models } from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { JWT_SECRET, NODE_ENV } from '../envvariablesdata.js';
import logger from '../config/logger.js';

const { User, Role } = models;


const loginController = async (req, res) => {
  const { emailOrContact, password } = req.body;
  logger.info(`login request--${emailOrContact,password}`)

  console.log(emailOrContact, password, "@@@@@@@@@@@@");


  try {
    console.log("1111111111111");
    
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: emailOrContact },
          { contact: emailOrContact },
        ],
      },
    });
    if (!user) {
      console.log("222222222222");
      
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userRole = await Role.findOne(
      {
        where: {
          id: user.roleId
        }
      }
    )

    const token = jwt.sign(
      { id: user.id, email: user.email, role: userRole.name },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // secure: NODE_ENV === 'production',

    res.cookie('token', token, {
      httpOnly: true,
      secure:false,
      sameSite: 'Lax',
      maxAge: 8 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        contact: user.contact,
        role: userRole.name,
        roleId: userRole.id,
        companyId: user.companyId,
        branchId:user.branchId,
        departmentId:user.departmentId
      },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const registerController = async (req, res) => {

  const { email, password, firstName, lastName, roleId, companyId, branchId,contact } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      contact,
      roleId,
      companyId,
      branchId,
    });

    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}

const getUserDataController = async (req, res) => {

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); 
    }

    return res.status(200).json(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contact: user.contact,
        role: req.user.role,
        roleId:req.user.roleId,
        companyId: user.companyId,
        roleId:user.roleId,
        departmentId:user.departmentId,
        branchId:user.branchId
      }
    );


  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }

}
const logoutController = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,     // same as in your login
    sameSite: 'Lax',
  });

  res.status(200).json({ message: 'Logout successful' });
};


export { logoutController,loginController, registerController, getUserDataController };
