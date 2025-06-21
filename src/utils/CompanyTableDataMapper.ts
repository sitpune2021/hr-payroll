

import { Company } from "../core/data/redux/companySlice";

export interface CompanyTableItem {
  key: string;
  CompanyName: string;
  Email: string;
  AccountURL: string;
  Plan: string;
  CreatedDate: string;
  Image: string;
  Status: string;
  Address: string;
  Phone: string;
  subscriptionStartDate: string;
  subscriptionEndDate:string;
  allowedNoOfUsers:number;
}

export const mapCompanyDataToTable = (apiData: Company[]): CompanyTableItem[] => {
  return apiData.map((company) => ({
    key: String(company.id),
    CompanyName: company.name,
    Email: company.email,
    AccountURL: company.website,
    Plan: "Advanced (Monthly)", // default/fixed or you can modify logic if plan is available in your API
    CreatedDate: new Date(company.createdAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    Image: company.companyImage || "company-01.svg", // fallback to default if needed
    Status: company.isActive ? "Active" : "Inactive",
    Address: company.address,
    Phone: company.phone,
    subscriptionStartDate: new Date(company.subscriptionStartDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    subscriptionEndDate:new Date(company.subscriptionEndDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    allowedNoOfUsers:company.allowedNoOfUsers
  }));
};
