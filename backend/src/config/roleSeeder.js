
const seedRoles = async (Role) => {
  const roles = ['SUPER_ADMIN'];
  for (const roleName of roles) {
    await Role.findOrCreate({ where: { name: roleName } });
  }
};

export default seedRoles