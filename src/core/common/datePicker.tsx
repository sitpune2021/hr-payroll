import React, { useEffect } from 'react';
import { DateRangePicker } from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { setDateRange } from '../data/redux/dateRangeSlice';

const PredefinedDateRanges: React.FC = () => {
  const dispatch = useDispatch();
  const { start, end } = useSelector((state: any) => state.dateRange); // Access the date range from the Redux state

  const handleCallback = (newStart: moment.Moment, newEnd: moment.Moment) => {
    dispatch(setDateRange({ start: newStart, end: newEnd })); // Dispatch the new date range to the Redux store
  };

  useEffect(() => {
    // Ensure the initial date range is set
    dispatch(setDateRange({ start, end }));
  }, [start, end, dispatch]);

  const label = `${start.format('MM/DD/YYYY')} - ${end.format('MM/DD/YYYY')}`;

  return (
    <DateRangePicker
      initialSettings={{
        startDate: start.toDate(),
        endDate: end.toDate(),
        ranges: {
          Today: [moment().toDate(), moment().toDate()],
          Yesterday: [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()],
          'Last 7 Days': [moment().subtract(6, 'days').toDate(), moment().toDate()],
          'Last 30 Days': [moment().subtract(29, 'days').toDate(), moment().toDate()],
          'This Month': [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
          'Last Month': [
            moment().subtract(1, 'month').startOf('month').toDate(),
            moment().subtract(1, 'month').endOf('month').toDate(),
          ],
        },
      }}
      onCallback={handleCallback}
    >
      <div className="new-date">
        <span>{label}</span>
      </div>
    </DateRangePicker>
  );
};

export default PredefinedDateRanges;
