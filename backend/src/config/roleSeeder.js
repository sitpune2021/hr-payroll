
const seedRoles = async (Role) => {
  const roles = ['SUPER_ADMIN', 'COMPANY_ADMIN', 'BRANCH_MANAGER', 'EMPLOYEE'];
  for (const roleName of roles) {
    await Role.findOrCreate({ where: { name: roleName } });
  }
};

export default seedRoles