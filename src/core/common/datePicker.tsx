import React from 'react';
import { DateRangePicker } from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { setDateRange } from '../data/redux/dateRangeSlice';

const PredefinedDateRanges: React.FC = () => {
  const dispatch = useDispatch();
  const { start, end } = useSelector((state: any) => state.dateRange);

  const handleCallback = (
  newStart: moment.Moment,
  newEnd: moment.Moment,
  label?: string // ✅ now accepts undefined too
) => {
  if (label === 'All Dates') {
    dispatch(setDateRange({ start: null, end: null }));
  } else {
    dispatch(setDateRange({ start: newStart, end: newEnd }));
  }
};


  const labelText =
    start && end
      ? `${start.format('MM/DD/YYYY')} - ${end.format('MM/DD/YYYY')}`
      : 'All Dates';

  return (
    <DateRangePicker
      initialSettings={{
        startDate: start ? start.toDate() : moment().subtract(6, 'days').toDate(),
        endDate: end ? end.toDate() : moment().toDate(),
        ranges: {
          'All Dates': [moment().subtract(100, 'years').toDate(), moment().toDate()], // Dummy, handled manually
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
      onCallback={(start, end, label) =>
        handleCallback(moment(start), moment(end), label)
      }
    >
      <div className="new-date">
        <span>{labelText}</span>
      </div>
    </DateRangePicker>
  );
};

export default PredefinedDateRanges;
