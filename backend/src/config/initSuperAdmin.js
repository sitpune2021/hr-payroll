import bcrypt from 'bcryptjs';


const initSuperAdmin = async (models) => {
    const { User, Role, Department } = models;
  
    const userCount = await User.count();
    if (userCount === 0) {
      const superAdminRole = await Role.findOne({ where: { name: "SUPER_ADMIN" } });
      if (!superAdminRole) {
        console.error("Role SUPER_ADMIN not found in the Role table.");
        return;
      }
  
      // Create or fetch a default department
      let department = await Department.findOne({ where: { name: "Delta" } });
      if (!department) {
        department = await Department.create({ name: "Delta", description: "Default department for superadmin" });
      }
  
      const hashedPassword = await bcrypt.hash("Sadmin@123", 10);
  
      await User.create({
        email: "superadmin@mail.com",
        contact: "1234567890",
        password: hashedPassword,
        firstName: "Super",
        lastName: "Admin",
        roleId: superAdminRole.id,
        departmentId: department.id, 
      });
  
      console.log("SUPER_ADMIN user created successfully.");
    }
  };
  
  export default initSuperAdmin;