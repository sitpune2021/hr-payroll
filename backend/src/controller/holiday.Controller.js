import models from '../models/index.js';
const { Holiday, HolidayGroup } = models;

export const addHoliday = async (req, res) => {
  try {
    const { holidayGroupId, holidayDate, name } = req.body;

    const group = await HolidayGroup.findByPk(holidayGroupId);
    if (!group) return res.status(404).json({ message: 'Holiday group not found' });

    const holiday = await Holiday.create({
      holidayGroupId, holidayDate, name
    });

    res.status(201).json({ message: 'Holiday created', holiday });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating holiday', error: err.message });
  }
};

export const getHolidaysByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const holidays = await Holiday.findAll({ where: { holidayGroupId: groupId } });
    res.json(holidays);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching holidays', error: err.message });
  }
};

export const deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;

    const holiday = await models.Holiday.findByPk(id);
    if (!holiday) return res.status(404).json({ message: 'Holiday not found' });

    await holiday.destroy();
    return res.status(200).json({ message: 'Holiday deleted successfully' });

  } catch (err) {
    console.error('Error deleting holiday:', err);
    return res.status(500).json({ message: 'Error deleting holiday', error: err.message });
  }
};


