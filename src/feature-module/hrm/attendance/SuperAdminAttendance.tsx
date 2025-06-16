import React from "react";
import { Link } from "react-router-dom";
import { Table, Card, Row, Col } from "react-bootstrap";
import { all_routes } from "../../router/all_routes";
import CollapseHeader from "../../../core/common/collapse-header/collapse-header";

const SuperAdminAttendance = () => {
  const attendanceData = [
    { company: "ABC Corp", totalEmployees: 120, present: 110, absent: 10 },
    { company: "XYZ Pvt Ltd", totalEmployees: 75, present: 70, absent: 5 },
    { company: "Tech Solutions", totalEmployees: 90, present: 86, absent: 4 },
  ];

  const totalCompanies = attendanceData.length;
  const totalEmployees = attendanceData.reduce((acc, c) => acc + c.totalEmployees, 0);
  const totalPresent = attendanceData.reduce((acc, c) => acc + c.present, 0);
  const totalAbsent = attendanceData.reduce((acc, c) => acc + c.absent, 0);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper vh-100 d-flex flex-column justify-content-between">
        <div className="content flex-fill h-100">
          {/* Breadcrumb */}
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Super Admin - Attendance Dashboard</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={all_routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">Dashboard</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Super Admin Attendance
                  </li>
                </ol>
              </nav>
            </div>
            <div className="head-icons ms-2">
              <CollapseHeader />
            </div>
          </div>
          {/* /Breadcrumb */}

          {/* Summary Cards */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-center shadow-sm p-3 border-0 bg-primary text-white">
                <Card.Body>
                  <Card.Title>Total Companies</Card.Title>
                  <h2>{totalCompanies}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center shadow-sm p-3 border-0 bg-success text-white">
                <Card.Body>
                  <Card.Title>Total Present</Card.Title>
                  <h2>{totalPresent}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center shadow-sm p-3 border-0 bg-danger text-white">
                <Card.Body>
                  <Card.Title>Total Absent</Card.Title>
                  <h2>{totalAbsent}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center shadow-sm p-3 border-0 bg-info text-white">
                <Card.Body>
                  <Card.Title>Total Employees</Card.Title>
                  <h2>{totalEmployees}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Attendance Table */}
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Company-wise Attendance Summary</h5>
            </Card.Header>
            <Card.Body className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Company Name</th>
                    <th>Total Employees</th>
                    <th>Present Today</th>
                    <th>Absent Today</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{row.company}</td>
                      <td>{row.totalEmployees}</td>
                      <td>{row.present}</td>
                      <td>{row.absent}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>

        {/* Footer */}
        <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
          <p className="mb-0">2014 - 2025 © SmartHR.</p>
          <p>
            Designed &amp; Developed By{" "}
            <Link to="#" className="text-primary">
              Dreams
            </Link>
          </p>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default SuperAdminAttendance;
