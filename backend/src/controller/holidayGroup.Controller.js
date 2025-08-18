import { where } from 'sequelize';
import models from '../models/index.js';
import logger from '../config/logger.js';

const { HolidayGroup, Company } = models;

export const createHolidayGroup = async (req, res) => {
  try {
    logger.info(`${req.user.id}-- create holiday group controller called`)
    const { groupName, companyId } = req.body;

    const company = await Company.findByPk(companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    const existing = await HolidayGroup.findOne({
      where: { groupName, companyId },
    });
    if (existing) {
      return res.status(409).json({ message: 'Group already exists with this name.' });
    }

    const group = await HolidayGroup.create({ groupName, companyId });

       logger.info(`${req.user.id}-- holiday group created successfully`)
    return res.status(201).json({ message: 'Holiday group created', group });

  } catch (err) {
    logger.error(`${req.user.id}-- error creating holiday group ${err.message}`)
    return res.status(500).json({ message: 'Error creating group', error: err.message });
  }
};


export const listHolidayGroups = async (req, res) => {
  try {
    logger.info(`${req.user.id}-- list holiday groups controller called`)
    const companyId = req.query.companyId;

    const whereClause = {};
    if (companyId) whereClause.companyId = Number(companyId);

    const groups = await HolidayGroup.findAll({
      where: whereClause,
      attributes: ['id', 'groupName', 'companyId'], // only these fields, no include
    });
     
    logger.info(`${req.user.id}-- holiday groups listed successfully`)
    res.status(200).json(groups);
  } catch (err) {
    logger.error(`${req.user.id}-- error listing holiday groups ${err}`)
    res.status(500).json({ message: 'Error fetching holiday groups', error: err.message });
  }
};

export const deleteHolidayGroup = async (req, res) => {
  try {
    logger.info(`${req.user.id}-- delete holiday group controller called`)
    const { id } = req.params;

    const group = await models.HolidayGroup.findByPk(id);
    if (!group) return res.status(404).json({ message: 'Holiday group not found' });

    // Delete associated holidays
    await models.Holiday.destroy({ where: { holidayGroupId: id } });

    await group.destroy();
    logger.info(`${req.user.id}-- holiday group deleted successfully`)
    return res.status(200).json({ message: 'Holiday group and related holidays deleted successfully' });

  } catch (err) {
    logger.error(`${req.user.id}-- error deleting holiday group ${err.message}`)
    return res.status(500).json({ message: 'Error deleting holiday group', error: err.message });
  }
};


