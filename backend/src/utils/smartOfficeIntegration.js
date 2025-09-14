import axios, { RawAxiosRequestHeaders, AxiosRequestConfig } from "axios";

let apiKey = "";
let host = "";

/**
 * function to call the API
 * @param path 
 * @param headers 
 * @param body 
 */
async function callApi(method, path, headers, body = {}) {

    let response = {
        status_code: 0,
        status_message: "",
        headers: {},
        body: Object()
    }

    try {

        body["APIKey"] = this.apiKey;

        let url = this.host + path;
        let result = await axios({
            url,
            headers,
            method,
            data: body
        });

        response.status_code = result.status;
        response.headers = result.headers;
        response.body = result.data;

    } catch (error) {
        console.log('error: ', error);
    }

    return response;
}

async function getDeviceLogs(fromDate, toDate) {
    let return_data = {
        code: 1,
        message: "SUCCESS",
        data: {
            results: [],
            current_page: 1,
            rpp: 20
        }
    };

    let body = {
        FromDate: fromDate,
        ToDate: toDate
    }

    let result = await this.callApi("GET", "/api/v2/WebAPI/GetDeviceLogs", {}, body)
    if (result.status_code == 200) {
        return_data.data.results = result.body;
    }

    return return_data;
}

export async function addEmployee(employeeCode, name, gender, status) {
    let return_data = {
        code: 0,
        message: "SOMETHING BROKEN",
        data: {}
    };

    let body = {
        StaffCode: employeeCode,
        StaffName: name,
        Gender: gender,
        Status: status
    }

    let result = await this.callApi("POST", "/api/v2/WebAPI/AddEmployee", {}, body)
    if (result.status_code == 200) {
        return_data.code = 1;
        return_data.message = "SUCCESS";
        return_data.data = result.body;
    } else {
        return_data.message = result.status_message;
    }

    return return_data;
}

async function updateEmployee(employeeCode, name, cardNumber, serialNumber, verifyMode) {
    let return_data = {
        code: 0,
        message: "SOMETHING BROKEN",
        data: {}
    };


    let body = {
        StaffCode: employeeCode,
        StaffName: name,
        CardNumber: cardNumber,
        SerialNumbers: serialNumber,
        VerifyMode: verifyMode
    }

    let result = await this.callApi("POST", "/api/v2/WebAPI/UploadUser", {}, body)
    if (result.status_code == 200) {
        return_data.code = 1;
        return_data.message = "SUCCESS";
        return_data.data = result.body;
    } else {
        return_data.message = result.status_message;
    }

    return return_data;
}

export async function deleteEmployee(employeeCode, serialNumber) {
    let return_data = {
        code: 0,
        message: "SOMETHING BROKEN",
        data: {}
    };

    let body = {
        StaffCode: employeeCode,
        SerialNumbers: serialNumber
    }

    let result = await this.callApi("POST", "/api/v2/WebAPI/DeleteUser", {}, body)
    if (result.status_code == 200) {
        return_data.code = 1;
        return_data.message = "SUCCESS";
        return_data.data = result.body;
    } else {
        return_data.message = result.status_message;
    }

    return return_data;
}

async function addEmployeeExpiry(employeeCode, serialNumber, expirationDate) {
    let return_data = {
        code: 0,
        message: "SOMETHING BROKEN",
        data: {}
    };

    let body = {
        StaffCode: employeeCode,
        SerialNumbers: serialNumber,
        ExpirationDate: expirationDate
    }

    let result = await this.callApi("POST", "/api/v2/WebAPI/SetUserExpiration", {}, body)
    if (result.status_code == 200) {
        return_data.code = 1;
        return_data.message = "SUCCESS";
        return_data.data = result.body;
    } else {
        return_data.message = result.status_message;
    }

    return return_data;
}

const markNewAttendance = async (employeeId, punchDatetime) => {
    let return_data = {
        code: 0, 
        message: "Success",
        data: {}
    }

    try {

        logger.info(`[markNewAttendance] Request received from Smart Office integration`);

        if (!employeeId || !punchDatetime) {
            logger.info('[Validation Failed] Missing employeeId or punchDatetime');
            return_data.code = 400;
            return_data.message = 'Employee ID and punch time are required.';
            return return_data;
        }

        let date = moment(punchDatetime).format('YYYY-MM-DD');
        const time = moment(punchDatetime).format('HH:mm:ss');
        const punchMoment = moment(punchDatetime);
        console.log('[Parsed Date/Time] date:', date, 'time:', time);

        let shiftSchedule;
        let isPreviousDayUsed = false;

        // 1. Try to fetch today's shift
        shiftSchedule = await EmployeeShiftSchedule.findOne({
            where: { userId: employeeId, date },
            include: [AttendanceSetting],
        });
        console.log('[ShiftSchedule] fetched for date:', date, !!shiftSchedule);

        // 2. If no shift found, check if it's a punch-out for previous day
        if (!shiftSchedule) {
            const previousDate = moment(date).subtract(1, 'day').format('YYYY-MM-DD');
            console.log('[No shift today] Checking previous date:', previousDate);

            const yesterdayAttendance = await Attendance.findOne({
                where: { employeeId, date: previousDate },
            });
            console.log('[Yesterday Attendance] found:', !!yesterdayAttendance);

            if (yesterdayAttendance && !yesterdayAttendance.checkOut) {
                shiftSchedule = await EmployeeShiftSchedule.findOne({
                    where: { userId: employeeId, date: previousDate },
                    include: [AttendanceSetting],
                });
                console.log('[ShiftSchedule] fetched for previousDate:', previousDate, !!shiftSchedule);

                if (shiftSchedule) {
                    date = previousDate;
                    isPreviousDayUsed = true;
                    console.log('[Using Previous Day Shift] date updated to:', date);
                }
            }
        }

        const setting = shiftSchedule?.AttendanceSetting;
        const shiftStart = setting ? moment(`${date} ${setting.checkInTime}`) : null;
        let shiftEnd = setting ? moment(`${date} ${setting.checkOutTime}`) : null;
        console.log('[Shift Timing] start:', shiftStart?.format(), 'end:', shiftEnd?.format());

        if (shiftEnd && shiftStart && shiftEnd.isBefore(shiftStart)) {
            shiftEnd.add(1, 'day'); // Overnight shift
            console.log('[Overnight Shift] Adjusted shiftEnd:', shiftEnd.format());
        }

        const graceCheckIn = shiftStart?.clone().add(setting?.gracePeriodMinutes || 0, 'minutes');
        const earlyLeaveCutoff = shiftEnd?.clone().subtract(setting?.earlyLeaveAllowanceMinutes || 0, 'minutes');
        console.log('[Grace and Early Leave Cutoff] graceCheckIn:', graceCheckIn?.format(), 'earlyLeaveCutoff:', earlyLeaveCutoff?.format());

        // 3. Check attendance record for this date
        let attendance = await Attendance.findOne({ where: { employeeId, date } });
        console.log('[Attendance Record] found:', !!attendance);

        if (!attendance) {
            // First punch (check-in)
            const isLate = shiftStart ? punchMoment.isAfter(graceCheckIn) : false;
            console.log('[Check-in] isLate:', isLate);

            let initialStatus = 'Absent';
            if (shiftSchedule) {
                // Use shift duration to decide Half-Day or Absent
                const shiftDuration = shiftStart && shiftEnd
                    ? moment.duration(shiftEnd.diff(shiftStart)).asHours()
                    : 0;

                if (shiftDuration > 0) {
                    initialStatus = 'Half-Day';
                }
            } else {
                // No shift - treat unscheduled as Half-Day initially
                initialStatus = 'Half-Day';
            }
            attendance = await Attendance.create({
                employeeId,
                date,
                checkIn: time,
                isLate,
                status: initialStatus,
            });
            logger.info(`Attenddance created`);
        } else {
            // Already has attendance – update punch-out
            const actualIn = moment(`${date} ${attendance.checkIn}`);
            let actualOut = punchMoment.clone();

            console.log('[Existing Attendance] checkIn:', actualIn.format(), 'New Punch:', actualOut.format());

            if (actualOut.isBefore(actualIn)) {
                actualOut.add(1, 'day'); // Handle overnight checkout
                console.log('[Overnight checkout] adjusted actualOut:', actualOut.format());
            }

            let effectiveOut = shiftEnd && actualOut.isAfter(shiftEnd) ? shiftEnd.clone() : actualOut.clone();

            const workedHours = moment.duration(effectiveOut.diff(actualIn)).asHours();
            const overtime = shiftEnd && actualOut.isAfter(shiftEnd)
                ? moment.duration(actualOut.diff(shiftEnd)).asHours()
                : 0;

            const leftEarly = earlyLeaveCutoff ? actualOut.isBefore(earlyLeaveCutoff) : false;
            let shiftDuration = 0;
            if (shiftStart && shiftEnd) {
                shiftDuration = moment.duration(shiftEnd.diff(shiftStart)).asHours();
            }

            let isHalfDay = false;
            if (shiftDuration > 0) {
                isHalfDay = workedHours < shiftDuration * 0.5;
            }


            console.log('[Punch-out Calculations] workedHours:', workedHours.toFixed(2), 'overtime:', overtime.toFixed(2), 'leftEarly:', leftEarly, 'isHalfDay:', isHalfDay);

            attendance.checkOut = time;
            attendance.isEarlyLeave = leftEarly;
            attendance.workingHours = parseFloat(workedHours.toFixed(2));
            attendance.overtimeHours = parseFloat(overtime.toFixed(2));

            // Apply new status logic
            if (shiftSchedule) {
                // Scheduled Shift
                if (isHalfDay) {
                    attendance.status = 'Half-Day';
                } else {
                    attendance.status = 'Present';
                }
            } else {
                // Unscheduled Shift (no shiftSchedule)
                if (shiftDuration > 0) {
                    if (workedHours < shiftDuration * 0.5) {
                        attendance.status = 'Half-Day';
                    } else {
                        attendance.status = 'Present';
                    }
                } else {
                    // If even shift timings are not available, fallback to time-based threshold
                    attendance.status = workedHours >= 4 ? 'Present' : 'Half-Day';
                }
            }

            await attendance.save();
            logger.info(`Attenddance updated`)
        }

        return_data.code = 200;
        return_data.message = isPreviousDayUsed
                ? 'Punch-out updated for previous day.'
                : attendance.checkOut
                    ? 'Punch-out updated successfully.'
                    : 'Check-in marked successfully.';
        return_data.data = attendance;
        return return_data;

    } catch (error) {

        logger.error(`${error}--error while marking attendance`)
        console.error('Error in markNewAttendance:', error);

        return_data.code = 500;
        return_data.message = 'Internal Server Error';
        return_data.data.error = error.message;   
        return return_data;

    }
};

module.exports = { callApi, addEmployee, addEmployeeExpiry, getDeviceLogs, updateEmployee, deleteEmployee, markNewAttendance }