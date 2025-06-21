import models from '../models/index.js';
const { Role, Permission, RolePermission, Company, LeaveTemplate, WeeklyOffPattern} = models

const addNewLeaveTemplate = async (req, res) => {
    try {
        const { name,paidLeaveQuota,sickLeaveQuota,casualLeaveQuota,holidayGroupId, companyId } = req.body;
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
        const newTemplate = await LeaveTemplate.create({ name,paidLeaveQuota,sickLeaveQuota,casualLeaveQuota,holidayGroupId, companyId });

        return res.status(201).json({
            message: 'New template added successfully',
            template: newTemplate
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error adding new template',
            error: error.message
        });
    }
};



const editLeaveTemplateWithComponents = async (req, res) => {
  try {
    const { templateId } = req.params;
    const {
      name,
      companyId,
      paidLeaveQuota,
      sickLeaveQuota,
      casualLeaveQuota,
      holidayGroupId,
      weeklyOffs = []
    } = req.body;

    // Step 1: Update base leave template
    await LeaveTemplate.update(
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

    // Step 2: Handle WeeklyOffPattern updates

    // Fetch existing weekly offs
    const existingWeeklyOffs = await WeeklyOffPattern.findAll({
      where: { leaveTemplateId: templateId },
    });

    const existingIds = existingWeeklyOffs.map(w => w.id);
    const incomingIds = weeklyOffs.filter(w => w.id).map(w => w.id);

    // Delete removed patterns
    const toDeleteIds = existingIds.filter(id => !incomingIds.includes(id));
    if (toDeleteIds.length > 0) {
      await WeeklyOffPattern.destroy({ where: { id: toDeleteIds } });
    }

    // Upsert weekly off entries
    for (const off of weeklyOffs) {
      if (off.id) {
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

    res.status(200).json({
      message: 'Leave template and components updated successfully.', 
    });

  } catch (error) {
    console.error('Error updating leave template:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};


export {addNewLeaveTemplate , editLeaveTemplateWithComponents}