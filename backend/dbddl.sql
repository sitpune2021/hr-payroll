
-- Drop tables if they already exist (in reverse dependency order)
DROP TABLE IF EXISTS "RolePermissions" CASCADE;
DROP TABLE IF EXISTS "Permissions" CASCADE;
DROP TABLE IF EXISTS "Users" CASCADE;
DROP TABLE IF EXISTS "Roles" CASCADE;
DROP TABLE IF EXISTS "Departments" CASCADE;
DROP TABLE IF EXISTS "Branches" CASCADE;
DROP TABLE IF EXISTS "Companies" CASCADE;

-- Table: Companies
CREATE TABLE "Companies" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    companyImage VARCHAR(255),
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    address TEXT NOT NULL,
    phone VARCHAR(10) NOT NULL,
    email VARCHAR(255) NOT NULL,
    userId INTEGER,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: Departments
CREATE TABLE "Departments" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    isActive BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: Roles
CREATE TABLE "Roles" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: Branches
CREATE TABLE "Branches" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    companyId INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_branch_company FOREIGN KEY (companyId) REFERENCES "Companies"(id)
);

-- Table: Users
CREATE TABLE "Users" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    contact VARCHAR(10) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    maritalStatus VARCHAR(50),
    birthDate DATE,
    companyId INTEGER,
    branchId INTEGER,
    roleId INTEGER NOT NULL,
    departmentId INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_company FOREIGN KEY (companyId) REFERENCES "Companies"(id),
    CONSTRAINT fk_user_branch FOREIGN KEY (branchId) REFERENCES "Branches"(id),
    CONSTRAINT fk_user_role FOREIGN KEY (roleId) REFERENCES "Roles"(id),
    CONSTRAINT fk_user_department FOREIGN KEY (departmentId) REFERENCES "Departments"(id)
);

-- Update Companies.userId FK after Users table exists
ALTER TABLE "Companies"
ADD CONSTRAINT fk_company_user FOREIGN KEY ("userId") REFERENCES "Users"(id);

-- Table: Permissions
CREATE TABLE "Permissions" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(255),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: RolePermissions (Join Table for Roles & Permissions)
CREATE TABLE "RolePermissions" (
    id SERIAL PRIMARY KEY,
    roleId INTEGER NOT NULL,
    permissionId INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rolepermission_role FOREIGN KEY (roleId) REFERENCES "Roles"(id),
    CONSTRAINT fk_rolepermission_permission FOREIGN KEY (permissionId) REFERENCES "Permissions"(id)
);
