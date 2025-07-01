import models from '../models/index.js';
const { Role, Permission, RolePermission, Company, LeaveTemplate, WeeklyOffPattern} = models


const getWeeklyOffComponentsByTemplateId = async (req, res) => {
  try {
    const { templateId } = req.params; 

    const weeklyOffs = await WeeklyOffPattern.findAll({
      where: { leaveTemplateId: templateId },
      attributes: ['id', 'dayOfWeek', 'isFixed', 'isAlternate', 'weekNumbers', 'isActive'],
    });

    return res.status(200).json(weeklyOffs);
  } catch (error) {
    console.error('Error fetching weekly off components:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export {getWeeklyOffComponentsByTemplateId}