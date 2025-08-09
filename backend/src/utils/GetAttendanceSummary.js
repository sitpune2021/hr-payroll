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

    let weeklyOffs = [];
    let holidayDates = [];

    if (user.leaveTemplateId) {
        const leaveTemplate = await LeaveTemplate.findByPk(user.leaveTemplateId);
        if (leaveTemplate) {
            console.log('Leave Template:', leaveTemplate.toJSON());

            weeklyOffs = await WeeklyOffPattern.findAll({
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
            holidayDates = holidays.map(h => new Date(h.holidayDate).toISOString().split('T')[0]);

            console.log('Holidays:', holidayDates);
        } else {
            console.log(`Leave Template ID ${user.leaveTemplateId} not found → ignoring leave template.`);
        }
    } else {
        console.log(`User ${userId} does not have leaveTemplateId → skipping weekly offs & holidays.`);
    }

    const attendanceRecords = await Attendance.findAll({
        where: {
            employeeId: userId,
            date: {
                [Op.between]: [startDate, endDate],
            },
        },
    });
    const attendanceMap = Object.fromEntries(
        attendanceRecords.map(a => {
            const dateStr = typeof a.date === 'string'
                ? a.date
                : new Date(a.date).toISOString().split('T')[0];
            return [dateStr, a];
        })
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
        const dayOffset = first.getDay();
        return Math.floor((date.getDate() + dayOffset - 1) / 7) + 1;
    };

    const isWeeklyOff = (date, patterns) => {
        if (!patterns.length) return false;
        const dow = date.getDay();
        const weekNum = getWeekNumberOfMonth(date);
        for (const off of patterns) {
            if (off.dayOfWeek !== dow) continue;
            if (off.isFixed) return true;
            if (off.isAlternate && off.weekNumbers?.split(',').map(Number).includes(weekNum)) {
                return true;
            }
        }
        return false;
    };

    const allDates = getDateArray(startDate, endDate);
    const stats = {
        totalDays: allDates.length,
        workingDays: 0,
        presentDays: 0,
        halfDayCount: 0,
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
        if (holidayDates.includes(dateStr)) {
            stats.holidays++;
        } else if (isWeeklyOff(d, weeklyOffs)) {
            stats.weeklyOffs++;
        } else {
            stats.workingDays++;
            if (paidLeaveDates.has(dateStr)) {
                stats.paidLeaveDays++;
            } else if (unpaidLeaveDates.has(dateStr)) {
                stats.unpaidLeaveDays++;
            } else {
                const att = attendanceMap[dateStr];
                if (att?.status === 'Present' || att?.status === 'Unscheduled') {
                    stats.presentDays++;
                    stats.totalHoursWorked += parseFloat(att.workingHours || 0);
                    stats.totalOvertimeWorked += parseFloat(att.overtimeHours || 0);
                } else if (att?.status === 'Half-Day') {
                    stats.halfDayCount++;
                    // stats.presentDays += 0.5;
                    stats.totalHoursWorked += parseFloat(att.workingHours || 0);
                    stats.totalOvertimeWorked += parseFloat(att.overtimeHours || 0);
                } else if (att?.checkIn && !att?.checkOut) {
                    stats.halfDayCount++;
                    stats.presentDays += 0.5;
                } else {
                    stats.absentDays++;
                }
            }
        }
    }

    return {
        userId,
        startDate,
        endDate,
        ...stats,
    };
};

