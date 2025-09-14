import schedule from 'node-schedule';
import { getDeviceLogs } from '../utils/smartOfficeIntegration.js';


/**
 * Crone to get the logs every 2 mins
 */
schedule.scheduleJob('0/2 * * * *', function () {

    // Get device logs, and then insert into database. 
});
