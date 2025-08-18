import models from '../models/index.js';
import logger from '../config/logger.js';

const { Role, Permission, RolePermission, Company, LeaveTemplate, WeeklyOffPattern } = models

const addNewLeaveTemplate = async (req, res) => {
  try {
    logger.info(`${req.user.id}--  add new leave template controller called`)
    const { name, paidLeaveQuota, sickLeaveQuota, casualLeaveQuota, allowedLateEntries, holidayGroupId, companyId } = req.body;
    const existingComp = await Company.findOne({ where: { id: companyId } });
    if (!existingComp) {
      return res.status(400).json({ message: "Company not found" });
    }

    // Check if template name already exists for the given company
    const existingTemplate = await LeaveTemplate.findOne({
      where: {
        name,
        companyId
      }
    });

    if (existingTemplate) {
      return res.status(400).json({ message: "Template already exists for this company" });
    }

    // Create the new template
    const newTemplate = await LeaveTemplate.create({ name, paidLeaveQuota, allowedLateEntries, sickLeaveQuota, casualLeaveQuota, holidayGroupId, companyId });
    logger.info(`${req.user.id}--leave template added successfully`)
    return res.status(201).json({
      message: 'New template added successfully',
      template: newTemplate
    });

  } catch (error) {
    logger.info(`${req.user.id}--${error}-error while adding new leave template`)
    return res.status(500).json({
      message: 'Error adding new template',
      error: error.message
    });
  }
};

const getListOfLeaveTemplate = async (req, res) => {
  try {
    logger.info(`${req.user.id}-- fetch list of leave template controller called`)
    const { companyId } = req.query;

    const whereClause = {};
    if (companyId) whereClause.companyId = companyId;

    const templates = await LeaveTemplate.findAll({
      attributes: ['id', 'name', 'paidLeaveQuota', 'sickLeaveQuota', 'casualLeaveQuota', 'holidayGroupId', 'allowedLateEntries', 'companyId'],
      where: whereClause,
    });

    console.log("Leave template fetched, count", templates.length);
    logger.info(`${req.user.id}-- fetched list of leave template successfully`)
    return res.status(200).json(templates);
  } catch (error) {
    logger.error(`${req.user.id}--${error.message}--error wile fetching list of leave template`)
    return res.status(500).json({ message: 'Error fetching list of templates', error: error.message });
  }
};

const editLeaveTemplateWithComponents = async (req, res) => {
  try {
    logger.info(`${req.user.id}-- edit leave template with components controller called`)
    const { templateId } = req.params;
    const {
      name,
      companyId,
      paidLeaveQuota,
      sickLeaveQuota,
      casualLeaveQuota,
      holidayGroupId,
      weeklyOffs = [],
    } = req.body;

    console.log('--- Incoming Edit Request ---');
    console.log('Template ID:', templateId);
    console.log('Request Body:', req.body);

    // Step 1: Update base leave template
    const [updatedCount] = await LeaveTemplate.update(
      {
        name,
        companyId,
        paidLeaveQuota,
        sickLeaveQuota,
        casualLeaveQuota,
        holidayGroupId,
      },
      {
        where: { id: templateId },
      }
    );

    console.log(`LeaveTemplate update result: ${updatedCount} row(s) affected`);

    // Step 2: Handle WeeklyOffPattern updates
    const existingWeeklyOffs = await WeeklyOffPattern.findAll({
      where: { leaveTemplateId: templateId },
    });

    const existingIds = existingWeeklyOffs.map((w) => w.id);
    const incomingIds = weeklyOffs.filter((w) => w.id).map((w) => w.id);
    console.log('Existing Weekly Off IDs:', existingIds);
    console.log('Incoming Weekly Off IDs:', incomingIds);

    const toDeleteIds = existingIds.filter((id) => !incomingIds.includes(id));
    console.log('Weekly Off IDs to delete:', toDeleteIds);

    if (toDeleteIds.length > 0) {
      await WeeklyOffPattern.destroy({ where: { id: toDeleteIds } });
      console.log(`Deleted ${toDeleteIds.length} WeeklyOffPattern(s)`);
    }

    for (const off of weeklyOffs) {
      if (off.id) {
        console.log(`Updating WeeklyOffPattern ID: ${off.id}`, off);
        await WeeklyOffPattern.update(
          {
            dayOfWeek: off.dayOfWeek,
            isFixed: off.isFixed || false,
            isAlternate: off.isAlternate || false,
            weekNumbers: off.weekNumbers || null,
            isActive: true,
          },
          { where: { id: off.id, leaveTemplateId: templateId } }
        );
      } else {
        console.log('Creating new WeeklyOffPattern:', off);
        await WeeklyOffPattern.create({
          leaveTemplateId: templateId,
          dayOfWeek: off.dayOfWeek,
          isFixed: off.isFixed || false,
          isAlternate: off.isAlternate || false,
          weekNumbers: off.weekNumbers || null,
          isActive: true,
        });
      }
    }
    logger.info(`${req.user.id}-- leave templete and components successfully`)
    res.status(200).json({
      message: 'Leave template and components updated successfully.',
    });

  } catch (error) {
    logger.error(`${req.user.id}--${error.message}--error while adding leave template and components`)
    res.status(500).json({
      message: 'Internal server error.',
      error: error.message,
    });
  }
};



export { addNewLeaveTemplate, editLeaveTemplateWithComponents, getListOfLeaveTemplate }