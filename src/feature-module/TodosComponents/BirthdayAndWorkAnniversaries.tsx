import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Gift, Award, Users, Clock, Search, Filter, ChevronDown } from "lucide-react";
import CollapseHeader from "../../core/common/collapse-header/collapse-header";
import { all_routes } from "../router/all_routes";
import { useAppSelector } from "../../core/data/redux/hooks";


interface EventDisplay {
  id: number;
  name: string;
  date: string;
  type: "birthday" | "anniversary";
  years?: number;
  designation: string;
  avatar?: string;
}

const BirthdayAndWorkAnniversaries = () => {
  // Use your Redux selector here, fallback to mock data for testing
  const { birthdays, anniversaries } = useAppSelector((state) => state.birthDayAnniversary);
  // const { birthdays, anniversaries } = reduxData?.birthdays ? reduxData : mockData;
  
  const routes = all_routes;
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'all'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'birthday' | 'anniversary'>('all');


  const isToday = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false;

  const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
  // console.log(month,day,"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  
  const today = new Date();
  console.log(month,"@@",today.getMonth()+1);
  console.log(day,"@@",today.getDate());
  
  
  return (
    month === today.getMonth() + 1 &&
    day === today.getDate()
  );
};

 

const isWithinNext30Days = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false;

  const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
  const today = new Date();
  const eventDate = new Date(today.getFullYear(), month - 1, day);

  // Agar event already ho chuka hai to next year ka le
  if (eventDate < today) {
    eventDate.setFullYear(today.getFullYear() + 1);
  }

  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 && diffDays <= 30;
};

  const getCompletedYears = (dateString: string | null | undefined): number => {
    if (!dateString) return 0;
    
    const inputDatePart = dateString.split("T")[0];
    const [inputYear, inputMonth, inputDay] = inputDatePart.split("-").map(Number);
    
    const today = new Date();
    let years = today.getFullYear() - inputYear;
    
    const hasHadAnniversaryThisYear = 
      today.getMonth() + 1 > inputMonth ||
      (today.getMonth() + 1 === inputMonth && today.getDate() >= inputDay);
    
    if (!hasHadAnniversaryThisYear) {
      years -= 1;
    }
    
    return Math.max(0, years);
  };

const getDaysUntil = (dateString: string): number => {
  const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
  const today = new Date();
  const eventDate = new Date(today.getFullYear(), month - 1, day);

  if (eventDate < today) {
    eventDate.setFullYear(today.getFullYear() + 1);
  }

  const diffTime = eventDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Create event displays
  const todayBirthdays: EventDisplay[] = useMemo(() => {
    return birthdays
      .filter((b) => isToday(b.birthDate))
      .map((b) => ({
        id: b.id,
        name: `${b.firstName} ${b.lastName}`,
        date: b.birthDate!,
        type: "birthday" as const,
        designation: b.designation,
      }));
  }, [birthdays]);

  const todayAnniversaries: EventDisplay[] = useMemo(() => {
    return anniversaries
      .filter((a) => isToday(a.joiningDate))
      .map((a) => ({
        id: a.id,
        name: `${a.firstName} ${a.lastName}`,
        date: a.joiningDate!,
        type: "anniversary" as const,
        years: getCompletedYears(a.joiningDate),
        designation: a.designation,
      }));
  }, [anniversaries]);

  const upcomingEvents: EventDisplay[] = useMemo(() => {
    const all: EventDisplay[] = [
      ...birthdays.map((b) => ({
        id: b.id,
        name: `${b.firstName} ${b.lastName}`,
        date: b.birthDate!,
        type: "birthday" as const,
        designation: b.designation,
      })),
      ...anniversaries.map((a) => ({
        id: a.id,
        name: `${a.firstName} ${a.lastName}`,
        date: a.joiningDate!,
        type: "anniversary" as const,
        years: getCompletedYears(a.joiningDate),
        designation: a.designation,
      })),
    ];
    
    return all
      .filter((e) => isWithinNext30Days(e.date))
      .sort((a, b) => getDaysUntil(a.date) - getDaysUntil(b.date));
  }, [birthdays, anniversaries]);

  const allEvents: EventDisplay[] = useMemo(() => {
    const all: EventDisplay[] = [
      ...birthdays.map((b) => ({
        id: b.id,
        name: `${b.firstName} ${b.lastName}`,
        date: b.birthDate!,
        type: "birthday" as const,
        designation: b.designation,
      })),
      ...anniversaries.map((a) => ({
        id: a.id,
        name: `${a.firstName} ${a.lastName}`,
        date: a.joiningDate!,
        type: "anniversary" as const,
        years: getCompletedYears(a.joiningDate),
        designation: a.designation,
      })),
    ];
    
    return all.sort((a, b) => {
      const aDate = formatDate(a.date);
      const bDate = formatDate(b.date);
      return aDate.localeCompare(bDate);
    });
  }, [birthdays, anniversaries]);

  // Filter events based on search and filter type
  const filterEvents = (events: EventDisplay[]) => {
    return events.filter(event => {
      const matchesSearch = searchQuery === '' || 
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.designation.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'all' || event.type === filterType;
      
      return matchesSearch && matchesType;
    });
  };

  const getCurrentEvents = () => {
    switch(activeTab) {
      case 'today':
        return filterEvents([...todayBirthdays, ...todayAnniversaries]);
      case 'upcoming':
        return filterEvents(upcomingEvents);
      case 'all':
        return filterEvents(allEvents);
      default:
        return [];
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const EventCard = ({ event }: { event: EventDisplay }) => (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-4">
        <div className="d-flex align-items-center mb-3">
          <div className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3 ${
            event.type === 'birthday' ? 'bg-pink' : 'bg-primary'
          }`} style={{width: '48px', height: '48px', fontSize: '14px'}}>
            {getInitials(event.name)}
          </div>
          
          <div className="flex-grow-1">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <h6 className="mb-0 fw-semibold text-dark">{event.name}</h6>
              <div className="d-flex align-items-center">
                {event.type === 'birthday' ? (
                  <i className="ti ti-gift text-pink me-1"></i>
                ) : (
                  <i className="ti ti-award text-primary me-1"></i>
                )}
                <small className="text-muted fw-medium">
                  {formatDate(event.date)}
                </small>
              </div>
            </div>
            
            <p className="text-muted small mb-2">{event.designation}</p>
            
            <div className="d-flex align-items-center justify-content-between">
              <span className={`badge rounded-pill px-2 py-1 ${
                event.type === 'birthday' 
                  ? 'bg-pink-transparent text-pink' 
                  : 'bg-primary-transparent text-primary'
              }`}>
                {event.type === 'birthday' ? 'Birthday' : `${event.years} Year${event.years !== 1 ? 's' : ''}`}
              </span>
              
              {activeTab === 'upcoming' && (
                <small className="text-muted d-flex align-items-center">
                  <i className="ti ti-clock me-1"></i>
                  {getDaysUntil(event.date)} day{getDaysUntil(event.date) !== 1 ? 's' : ''}
                </small>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const currentEvents = getCurrentEvents();

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper vh-100 d-flex flex-column justify-content-between">
        <div className="content flex-fill h-100">
          {/* Breadcrumb */}
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Birthdays & Work Anniversaries</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">Pages</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Birthdays & Anniversaries
                  </li>
                </ol>
              </nav>
            </div>
            <div className="head-icons ms-2">
              <CollapseHeader />
            </div>
          </div>
          {/* /Breadcrumb */}

          {/* Header Stats */}
          <div className="row mb-4">
            <div className="col-md-6 col-lg-3 mb-3">
              <div className="card border-0 shadow-sm bg-primary-light">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary rounded-circle p-3 me-3">
                      <i className="ti ti-calendar text-white"></i>
                    </div>
                    <div>
                      <h4 className="mb-1 text-primary fw-bold">{todayBirthdays.length + todayAnniversaries.length}</h4>
                      <p className="mb-0 text-muted small">Today's Events</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3 mb-3">
              <div className="card border-0 shadow-sm bg-success-light">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-success rounded-circle p-3 me-3">
                      <i className="ti ti-gift text-white"></i>
                    </div>
                    <div>
                      <h4 className="mb-1 text-success fw-bold">{todayBirthdays.length}</h4>
                      <p className="mb-0 text-muted small">Birthdays Today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3 mb-3">
              <div className="card border-0 shadow-sm bg-info-light">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-info rounded-circle p-3 me-3">
                      <i className="ti ti-award text-white"></i>
                    </div>
                    <div>
                      <h4 className="mb-1 text-info fw-bold">{todayAnniversaries.length}</h4>
                      <p className="mb-0 text-muted small">Anniversaries Today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3 mb-3">
              <div className="card border-0 shadow-sm bg-warning-light">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-warning rounded-circle p-3 me-3">
                      <i className="ti ti-clock text-white"></i>
                    </div>
                    <div>
                      <h4 className="mb-1 text-warning fw-bold">{upcomingEvents.length}</h4>
                      <p className="mb-0 text-muted small">Upcoming (30 Days)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="card border-0 shadow-sm">
            <div className="card-header border-0 pb-0">
              <ul className="nav nav-tabs border-0" role="tablist">
                <li className="nav-item" role="presentation">
                  <button 
                    className={`nav-link border-0 px-4 py-3 ${activeTab === 'today' ? 'active' : ''}`}
                    onClick={() => setActiveTab('today')}
                  >
                    <i className="ti ti-calendar-event me-2"></i>
                    Today's Events
                    <span className="badge bg-primary ms-2">{todayBirthdays.length + todayAnniversaries.length}</span>
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button 
                    className={`nav-link border-0 px-4 py-3 ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                  >
                    <i className="ti ti-clock me-2"></i>
                    Upcoming (30 Days)
                    <span className="badge bg-warning ms-2">{upcomingEvents.length}</span>
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button 
                    className={`nav-link border-0 px-4 py-3 ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                  >
                    <i className="ti ti-list me-2"></i>
                    All Events
                    <span className="badge bg-secondary ms-2">{allEvents.length}</span>
                  </button>
                </li>
              </ul>
            </div>

            <div className="card-body">
              {/* Search and Filter */}
              <div className="row mb-4">
                <div className="col-md-8 mb-3 mb-md-0">
                  <div className="position-relative">
                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input
                      type="text"
                      className="form-control ps-5"
                      placeholder="Search by name or designation..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                  >
                    <option value="all">All Events</option>
                    <option value="birthday">Birthdays Only</option>
                    <option value="anniversary">Anniversaries Only</option>
                  </select>
                </div>
              </div>

              {/* Events Grid */}
              {currentEvents.length > 0 ? (
                <div className="row">
                  {currentEvents.map((event) => (
                    <div key={`${event.type}-${event.id}`} className="col-md-6 col-xl-4 mb-4">
                      <EventCard event={event} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <div className="mb-4">
                    <i className="ti ti-calendar-x" style={{fontSize: '4rem', color: '#e9ecef'}}></i>
                  </div>
                  <h5 className="text-muted mb-2">No events found</h5>
                  <p className="text-muted">
                    {searchQuery || filterType !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : activeTab === 'today'
                      ? 'No birthdays or anniversaries today.'
                      : activeTab === 'upcoming'
                      ? 'No events in the next 30 days.'
                      : 'No events available.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
          <p className="mb-0">2014 - 2025 © SmartHR.</p>
          <p>
            Designed &amp; Developed By{" "}
            <Link to="#" className="text-primary">
              Dreams
            </Link>
          </p>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default BirthdayAndWorkAnniversaries;