import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  designation: string;
  workingShift: number | null;
};

type Shift = {
  id: number;
  shiftName: string;
  checkInTime: string;
  checkOutTime: string;
};

type AssignedShifts = {
  [employeeId: number]: number | '';
};

const ShiftAssignment: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [assignedShifts, setAssignedShifts] = useState<AssignedShifts>({});

  useEffect(() => {
    // Replace with API calls if needed
    const employeeData: Employee[] = [
      { id: 2, firstName: "Sushant", lastName: "Gore", email: "sit@comp.com", designation: "company admin", workingShift: null },
      { id: 3, firstName: "Omkar", lastName: "Pagade", email: "omiii@mail.com", designation: "Web Devloper", workingShift: 1 },
      { id: 4, firstName: "asdf", lastName: "xcvb", email: "sdvb@sdv.cm", designation: "zdv", workingShift: 1 },
      { id: 5, firstName: "wfcsd", lastName: "aw", email: "sdv@sfdv.th", designation: "Test Engineer", workingShift: 1 },
      { id: 6, firstName: "fvd", lastName: "vvv", email: "sdfvd@sdg.sdgv", designation: "dsv", workingShift: 1 },
      { id: 7, firstName: "dcsv", lastName: "asc", email: "df@sd.fgfh", designation: "sf", workingShift: 1 }
    ];

    const shiftData: Shift[] = [
      { id: 1, shiftName: "SIT GENERL SHIFT", checkInTime: "10:00", checkOutTime: "18:30" },
      { id: 2, shiftName: "SIt first ship", checkInTime: "08:00", checkOutTime: "16:00" }
    ];

    setEmployees(employeeData);
    setShifts(shiftData);

    const initialAssignments: AssignedShifts = {};
    employeeData.forEach(emp => {
      initialAssignments[emp.id] = emp.workingShift || '';
    });
    setAssignedShifts(initialAssignments);
  }, []);

  const getShiftLabel = (id: number | null): string => {
    const shift = shifts.find(s => s.id === id);
    return shift ? `${shift.shiftName} (${shift.checkInTime} - ${shift.checkOutTime})` : 'Not Assigned';
  };

  const handleShiftChange = (empId: number, shiftId: number) => {
    setAssignedShifts(prev => ({
      ...prev,
      [empId]: shiftId,
    }));
  };

  const handleSave = (empId: number) => {
    const selectedShift = assignedShifts[empId];
    console.log(`Saving: Employee ${empId} => Shift ${selectedShift}`);

    // TODO: Send API call to save the shift
    // Example:
    // axios.post('/api/assign-shift', { empId, shiftId: selectedShift })

    alert(`Shift saved for employee ${empId}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Assign Shifts to Employees</h2>
      <table className="table table-bordered align-middle">
        <thead className="table-light">
          <tr>
            <th>Employee</th>
            <th>Email</th>
            <th>Designation</th>
            <th>Current Shift</th>
            <th>Assign New Shift</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.firstName} {emp.lastName}</td>
              <td>{emp.email}</td>
              <td>{emp.designation}</td>
              <td>{getShiftLabel(emp.workingShift)}</td>
              <td>
                <select
                  className="form-select"
                  value={assignedShifts[emp.id] || ''}
                  onChange={(e) => handleShiftChange(emp.id, parseInt(e.target.value))}
                >
                  <option value="">-- Select Shift --</option>
                  {shifts.map(shift => (
                    <option key={shift.id} value={shift.id}>
                      {shift.shiftName}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleSave(emp.id)}
                  disabled={!assignedShifts[emp.id]}
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftAssignment;
