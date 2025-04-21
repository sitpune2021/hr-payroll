import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const generateErrorExcelUserUpload = (errorRows: any[]) => {
    const ws = XLSX.utils.json_to_sheet(errorRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Error Rows');
    
    // Generate an Excel file and save it
    const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }); // Use 'array' instead of 'blob'
    saveAs(new Blob([excelFile]), 'error_file.xlsx');
};
