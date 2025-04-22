const seedPermissions = async (models) => {
    const { Permission, Role } = models;
    const permissions = [
      { name: 'Dashboard', description: 'Permission to access dashboard' },
      { name: 'Companies', description: 'Permission to access companies' },
      { name: 'FetchCompany', description: 'Permission to fetch company details' },
      { name: 'AddCompany', description: 'Permission to add a new company' },
      { name: 'EditCompany', description: 'Permission to edit company details' },
      { name: 'User Management', description: 'Permission to manage users' },
      { name: 'Users', description: 'Permission to access user details' },
      { name: 'EditUser', description: 'Permission to edit user details' },
      { name: 'AddUser', description: 'Permission to add new users' },
      { name: 'Branches', description: 'Permission to manage branches' },
      { name: 'AddBranch', description: 'Permission to add a new branch' },
      { name: 'EditBranch', description: 'Permission to edit branch details' },
      { name: 'Features', description: 'Permission to access features details' },
      { name: 'AddFeature', description: 'Permission to add new Feature' },
    ];
  
    try {
      for (const permission of permissions) {
        const [result, created] = await Permission.findOrCreate({
          where: { name: permission.name },
          defaults: { description: permission.description },
        });
  
        if (created) {
          console.log(`Permission "${result.name}" created.`);
        } else {
          console.log(`Permission "${result.name}" already exists.`);
        }
      }
      console.log('Permissions seeding completed!');
    } catch (error) {
      console.error('Error seeding permissions:', error);
    }
  };
  
  export default seedPermissions;
  