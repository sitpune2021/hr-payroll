import models from '../models/index.js';
import logger from '../config/logger.js';


const { Holiday, HolidayGroup } = models;

export const addHoliday = async (req, res) => {
  try {
    logger.info(`${req.user.id}-- add new holiday controller called`)
    const { holidayGroupId, holidayDate, name } = req.body;

    const group = await HolidayGroup.findByPk(holidayGroupId);
    if (!group) return res.status(404).json({ message: 'Holiday group not found' });

    const holiday = await Holiday.create({
      holidayGroupId, holidayDate, name
    });
    logger.info(`${req.user.id}-- new holiday created successfully`)
    res.status(201).json({ message: 'Holiday created', holiday });

  } catch (err) {
    logger.error(`${req.user.id}-- error adding new holiday ${err}`)
    res.status(500).json({ message: 'Error creating holiday', error: err.message });
  }
};

export const getHolidaysByGroup = async (req, res) => {
  try {
    logger.info(`${req.user.id}-- get holidays by group controller called`)
    const { groupId } = req.params;
    const holidays = await Holiday.findAll({ where: { holidayGroupId: groupId } });
    logger.info(`${req.user.id}-- holidays by group retrieved successfully`)
    res.json(holidays);
  } catch (err) {
    logger.error(`${req.user.id}-- error getting holidays by group ${err}`)
    res.status(500).json({ message: 'Error fetching holidays', error: err.message });
  }
};

export const deleteHoliday = async (req, res) => {
  try {
    logger.info(`${req.user.id}-- delete holiday controller called`)
    const { id } = req.params;

    const holiday = await models.Holiday.findByPk(id);
    if (!holiday) return res.status(404).json({ message: 'Holiday not found' });

    await holiday.destroy();
    logger.info(`${req.user.id}-- holiday deleted successfully`)
    return res.status(200).json({ message: 'Holiday deleted successfully' });

  } catch (err) {
    logger.error(`${req.user.id}-- error deleting holiday ${err}`)
    return res.status(500).json({ message: 'Error deleting holiday', error: err.message });
  }
};


