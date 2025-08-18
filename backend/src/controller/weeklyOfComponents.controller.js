import models from '../models/index.js';
const { Role, Permission, RolePermission, Company, LeaveTemplate, WeeklyOffPattern} = models;
import logger from '../config/logger.js';


const getWeeklyOffComponentsByTemplateId = async (req, res) => {
    logger.info(`${req.user.id}-- get weekly off components by template id controller entry.`)
  try {
    const { templateId } = req.params; 

    const weeklyOffs = await WeeklyOffPattern.findAll({
      where: { leaveTemplateId: templateId },
      attributes: ['id', 'dayOfWeek', 'isFixed', 'isAlternate', 'weekNumbers', 'isActive'],
    });
    logger.info(`${req.user.id}-- weekly off components by template id fetched successfully`)
    return res.status(200).json(weeklyOffs);
  } catch (error) {
    logger.error(`${req.user.id}-- error fetching weekly off components by template id--${error.message}`)
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export {getWeeklyOffComponentsByTemplateId}