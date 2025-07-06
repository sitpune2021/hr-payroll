import { Op } from 'sequelize';
import models from '../models/index.js';

const {
    User,
    LeaveTemplate,
    WeeklyOffPattern,
    Holiday,
    Attendance,
    LeaveRecord,
} = models;

export const getAttendanceSummary = async (userId, startDate, endDate) => {
    console.log('Fetching attendance summary for:', { userId, startDate, endDate });

    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    console.log('User found:', user.toJSON());

    const leaveTemplate = await LeaveTemplate.findByPk(user.leaveTemplateId);
    if (!leaveTemplate) throw new Error('Leave Template not found');
    console.log('Leave Template:', leaveTemplate.toJSON());

    const weeklyOffs = await WeeklyOffPattern.findAll({
        where: {
            leaveTemplateId: leaveTemplate.id,
            isActive: true,
        },
    });
    console.log('Weekly Offs:', weeklyOffs.map(w => w.toJSON()));

    const holidays = await Holiday.findAll({
        where: {
            holidayGroupId: leaveTemplate.holidayGroupId,
            holidayDate: {
                [Op.between]: [startDate, endDate],
            },
        },
    });
    const holidayDates = holidays.map(h => h.holidayDate.toString());
    console.log('Holidays:', holidayDates);

    const attendanceRecords = await Attendance.findAll({
        where: {
            employeeId: userId,
            date: {
                [Op.between]: [startDate, endDate],
            },
        },
    });
    const attendanceMap = Object.fromEntries(
        attendanceRecords.map(a => [a.date.toString(), a])
    );
    console.log('Attendance Records:', attendanceRecords.map(a => a.toJSON()));

    const leaveRecords = await LeaveRecord.findAll({
        where: {
            userId,
            status: 'Approved',
            [Op.or]: [
                { fromDate: { [Op.between]: [startDate, endDate] } },
                { toDate: { [Op.between]: [startDate, endDate] } },
                {
                    fromDate: { [Op.lte]: startDate },
                    toDate: { [Op.gte]: endDate },
                },
            ],
        },
    });
    console.log('Approved Leave Records:', leaveRecords.map(l => l.toJSON()));

    const paidLeaveDates = new Set();
    const unpaidLeaveDates = new Set();

    for (const record of leaveRecords) {
        const from = new Date(record.fromDate);
        const to = new Date(record.toDate);
        for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            if (record.leaveType === 'Unpaid') {
                unpaidLeaveDates.add(dateStr);
            } else {
                paidLeaveDates.add(dateStr);
            }
        }
    }

    console.log('Paid Leave Dates:', Array.from(paidLeaveDates));
    console.log('Unpaid Leave Dates:', Array.from(unpaidLeaveDates));

    const getDateArray = (start, end) => {
        const arr = [];
        const dt = new Date(start);
        while (dt <= new Date(end)) {
            arr.push(new Date(dt));
            dt.setDate(dt.getDate() + 1);
        }
        return arr;
    };

    const getWeekNumberOfMonth = (date) => {
        const first = new Date(date.getFullYear(), date.getMonth(), 1);
        const dayOffset = first.getDay(); // Sunday = 0
        return Math.floor((date.getDate() + dayOffset - 1) / 7) + 1;
    };

    const isWeeklyOff = (date, patterns) => {
        const dow = date.getDay(); // Sunday = 0
        const weekNum = getWeekNumberOfMonth(date);
        for (const off of patterns) {
            if (off.dayOfWeek !== dow) continue;
            if (off.isFixed) return true;
            if (
                off.isAlternate &&
                off.weekNumbers?.split(',').map(Number).includes(weekNum)
            ) {
                return true;
            }
        }
        return false;
    };

    const allDates = getDateArray(startDate, endDate);
    console.log('Date Range:', allDates.map(d => d.toISOString().split('T')[0]));

    const stats = {
        totalDays: allDates.length,
        workingDays: 0,
        presentDays: 0,
        halfDayCount:0,
        paidLeaveDays: 0,
        unpaidLeaveDays: 0,
        holidays: 0,
        weeklyOffs: 0,
        absentDays: 0,
        totalHoursWorked: 0,
        totalOvertimeWorked: 0,
    };

    for (const d of allDates) {
        const dateStr = d.toISOString().split('T')[0];
        console.log(`Processing ${dateStr}...`);

        if (holidayDates.includes(dateStr)) {
            stats.holidays++;
            console.log('→ Holiday');
        } else if (isWeeklyOff(d, weeklyOffs)) {
            stats.weeklyOffs++;
            console.log('→ Weekly Off');
        } else {
            stats.workingDays++;
            if (paidLeaveDates.has(dateStr)) {
                stats.paidLeaveDays++;
                console.log('→ Paid Leave');
            } else if (unpaidLeaveDates.has(dateStr)) {
                stats.unpaidLeaveDays++;
                console.log('→ Unpaid Leave');
            } else {
                const att = attendanceMap[dateStr];

                if (att?.status === 'Present' || att?.status === 'Unscheduled') {
                    stats.presentDays++;
                    const hours = parseFloat(att.workingHours || 0);
                    const hoursOt = parseFloat(att.overtimeHours || 0);
                    stats.totalHoursWorked += hours;
                    stats.totalOvertimeWorked += hoursOt;
                    console.log(`→ Present (${hours} hours)`);

                } else if (att?.status === 'Half-Day') {
                    stats.halfDayCount++;  // ✅ Count half-day separately
                    stats.presentDays += 0.5;  // ✅ Optional: Add to overall presence if required
                    const hours = parseFloat(att.workingHours || 0);
                    const hoursOt = parseFloat(att.overtimeHours || 0);
                    stats.totalHoursWorked += hours;
                    stats.totalOvertimeWorked += hoursOt;
                    console.log(`→ Half-Day (${hours} hours)`);

                } else if (att?.checkIn && !att?.checkOut) {
                    stats.halfDayCount++;  // ✅ Consider check-in only as half-day too
                    stats.presentDays += 0.5;
                    console.log('→ Check-in only (treated as Half-Day)');

                } else {
                    stats.absentDays++;
                    console.log('→ Absent');
                }


            }
        }
    }

    console.log('Final Stats:', stats);

    return {
        userId,
        startDate,
        endDate,
        ...stats,
    };
};
