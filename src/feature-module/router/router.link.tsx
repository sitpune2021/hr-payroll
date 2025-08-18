import { Navigate, Route } from "react-router";
import { all_routes } from "./all_routes";
import Countries from "../content/location/countries";
import DataTable from "../tables/dataTable";
import BasicTable from "../tables/basicTable";
import DeleteRequest from "../userManagement/deleteRequest";
import Membershipplan from "../membership/membershipplan";
import MembershipAddon from "../membership/membershipaddon";
import Notes from "../application/notes";
import ComingSoon from "../pages/comingSoon";
import Login from "../auth/login/login";
import Register from "../auth/register/register";
import TwoStepVerification from "../auth/twoStepVerification/twoStepVerification";
import EmailVerification from "../auth/emailVerification/emailVerification";
import ResetPassword from "../auth/resetPassword/resetPassword";
import ForgotPassword from "../auth/forgotPassword/forgotPassword";
import Accordion from "../uiInterface/base-ui/accordion";
import Avatar from "../uiInterface/base-ui/avatar";
import Borders from "../uiInterface/base-ui/borders";
import Breadcrumb from "../uiInterface/base-ui/breadcrumb";
import Buttons from "../uiInterface/base-ui/buttons";
import ButtonsGroup from "../uiInterface/base-ui/buttonsgroup";
import Cards from "../uiInterface/base-ui/cards";
import Carousel from "../uiInterface/base-ui/carousel";
import Colors from "../uiInterface/base-ui/colors";
import Dropdowns from "../uiInterface/base-ui/dropdowns";
import Grid from "../uiInterface/base-ui/grid";
import Images from "../uiInterface/base-ui/images";
import Lightboxes from "../uiInterface/base-ui/lightbox";
import Media from "../uiInterface/base-ui/media";
import Modals from "../uiInterface/base-ui/modals";
import NavTabs from "../uiInterface/base-ui/navtabs";
import Offcanvas from "../uiInterface/base-ui/offcanvas";
import Pagination from "../uiInterface/base-ui/pagination";
import Popovers from "../uiInterface/base-ui/popover";
import RangeSlides from "../uiInterface/base-ui/rangeslider";
import Progress from "../uiInterface/base-ui/progress";
import Spinner from "../uiInterface/base-ui/spinner";
import Toasts from "../uiInterface/base-ui/toasts";
import Typography from "../uiInterface/base-ui/typography";
import Video from "../uiInterface/base-ui/video";
import Error404 from "../pages/error/error-404";
import Error500 from "../pages/error/error-500";
import UnderMaintenance from "../pages/underMaintenance";
import Email from "../application/email";
import Chat from "../application/chat";
import CallHistory from "../application/call/callHistory";
import FileManager from "../application/fileManager";
import MembershipTransaction from "../membership/membershiptrasaction";
import ClipBoard from "../uiInterface/advanced-ui/clipboard";
import Counter from "../uiInterface/advanced-ui/counter";
import DragAndDrop from "../uiInterface/advanced-ui/dragdrop";
import Rating from "../uiInterface/advanced-ui/rating";
import Stickynote from "../uiInterface/advanced-ui/stickynote";
import TextEditor from "../uiInterface/advanced-ui/texteditor";
import Timeline from "../uiInterface/advanced-ui/timeline";
import Scrollbar from "../uiInterface/advanced-ui/uiscrollbar";
import Apexchart from "../uiInterface/charts/apexcharts";
import FeatherIcons from "../uiInterface/icons/feathericon";
import FontawesomeIcons from "../uiInterface/icons/fontawesome";
import MaterialIcons from "../uiInterface/icons/materialicon";
import PE7Icons from "../uiInterface/icons/pe7icons";
import SimplelineIcons from "../uiInterface/icons/simplelineicon";
import ThemifyIcons from "../uiInterface/icons/themify";
import TypiconIcons from "../uiInterface/icons/typicons";
import WeatherIcons from "../uiInterface/icons/weathericons";
import BasicInputs from "../uiInterface/forms/formelements/basic-inputs";
import CheckboxRadios from "../uiInterface/forms/formelements/checkbox-radios";
import InputGroup from "../uiInterface/forms/formelements/input-group";
import GridGutters from "../uiInterface/forms/formelements/grid-gutters";
import FormSelect from "../uiInterface/forms/formelements/form-select";
import FormMask from "../uiInterface/forms/formelements/form-mask";
import FileUpload from "../uiInterface/forms/formelements/fileupload";
import FormHorizontal from "../uiInterface/forms/formelements/layouts/form-horizontal";
import FormVertical from "../uiInterface/forms/formelements/layouts/form-vertical";
import FloatingLabel from "../uiInterface/forms/formelements/layouts/floating-label";
import FormValidation from "../uiInterface/forms/formelements/layouts/form-validation";
import FormSelect2 from "../uiInterface/forms/formelements/layouts/form-select2";
import FormWizard from "../uiInterface/forms/formelements/form-wizard";
import DataTables from "../uiInterface/table/data-tables";
import TablesBasic from "../uiInterface/table/tables-basic";
import IonicIcons from "../uiInterface/icons/ionicicons";
import Badges from "../uiInterface/base-ui/badges";
import Placeholder from "../uiInterface/base-ui/placeholder";
import Alert from "../uiInterface/base-ui/alert";
import Tooltips from "../uiInterface/base-ui/tooltips";
import Ribbon from "../uiInterface/advanced-ui/ribbon";
import AdminDashboard from "../mainMenu/adminDashboard";
import AlertUi from "../uiInterface/base-ui/alert-ui";
import ResetPassword2 from "../auth/resetPassword/resetPassword-2";
import ResetPassword3 from "../auth/resetPassword/resetPassword-3";
import ResetPasswordSuccess from "../auth/resetPasswordSuccess/resetPasswordSuccess";
import ResetPasswordSuccess2 from "../auth/resetPasswordSuccess/resetPasswordSuccess-2";
import ResetPasswordSuccess3 from "../auth/resetPasswordSuccess/resetPasswordSuccess-3";
import Manageusers from "../userManagement/manageusers";
import Profilesettings from "../settings/generalSettings/profile-settings";
import Securitysettings from "../settings/generalSettings/security-settings";
import Notificationssettings from "../settings/generalSettings/notifications-settings";
import ConnectedApps from "../settings/generalSettings/connected-apps";
import Bussinesssettings from "../settings/websiteSettings/bussiness-settings";
import Seosettings from "../settings/websiteSettings/seo-settings";
import CompanySettings from "../settings/websiteSettings/companySettings";
import Localizationsettings from "../settings/websiteSettings/localization-settings";
import Prefixes from "../settings/websiteSettings/prefixes";
import Preference from "../settings/websiteSettings/preferences";
import Authenticationsettings from "../settings/websiteSettings/authentication-settings";
import Languagesettings from "../settings/websiteSettings/language";
import InvoiceSettings from "../settings/appSettings/invoiceSettings";
import CustomFields from "../settings/appSettings/customFields";
import EmailSettings from "../settings/systemSettings/emailSettings";
import Emailtemplates from "../settings/systemSettings/email-templates";
import SmsSettings from "../settings/systemSettings/smsSettings";
import OtpSettings from "../settings/systemSettings/otp-settings";
import GdprCookies from "../settings/systemSettings/gdprCookies";
import PaymentGateways from "../settings/financialSettings/paymentGateways";
import TaxRates from "../settings/financialSettings/taxRates";
import Storage from "../settings/otherSettings/storage";
import BanIpAddress from "../settings/otherSettings/banIpaddress";
import BlogCategories from "../content/blog/blogCategories";
import BlogComments from "../content/blog/blogComments";
import BlogTags from "../content/blog/blogTags";
import Cities from "../content/location/cities";
import States from "../content/location/states";
import Testimonials from "../content/testimonials";
import Profile from "../pages/profile";
import LockScreen from "../auth/lockScreen";
import EmployeeDashboard from "../mainMenu/employeeDashboard/employee-dashboard";
import LeadsDasboard from "../mainMenu/leadsDashboard";
import DealsDashboard from "../mainMenu/dealsDashboard";
import Leaflet from "../uiInterface/map/leaflet";
import BootstrapIcons from "../uiInterface/icons/bootstrapicons";
import RemixIcons from "../uiInterface/icons/remixIcons";
import FlagIcons from "../uiInterface/icons/flagicons";
import Swiperjs from "../uiInterface/base-ui/swiperjs";
import Sortable from "../uiInterface/base-ui/ui-sortable";
import PrimeReactChart from "../uiInterface/charts/prime-react-chart";
import ChartJSExample from "../uiInterface/charts/chartjs";
import FormPikers from "../uiInterface/forms/formelements/formpickers";
import VoiceCall from "../application/call/voiceCall";
import Videocallss from "../application/call/videocalls";
import OutgoingCalls from "../application/call/outgingcalls";
import IncomingCall from "../application/call/incomingcall";
import Calendars from "../mainMenu/apps/calendar";
import SocialFeed from "../application/socialfeed";
import KanbanView from "../application/kanbanView";
import Todo from "../application/todo/todo";
import TodoList from "../application/todo/todolist";
import StarterPage from "../pages/starter";
import SearchResult from "../pages/search-result";
import TimeLines from "../pages/timeline";
import Pricing from "../pages/pricing";
import ApiKeys from "../pages/api-keys";
import UnderConstruction from "../pages/underConstruction";
import PrivacyPolicy from "../pages/privacy-policy";
import TermsCondition from "../pages/terms-condition";
import Gallery from "../pages/gallery";
import EmailReply from "../application/emailReply";
import Blogs from "../content/blog/blogs";
import Page from "../content/page";
import Assets from "../administration/asset";
import AssetsCategory from "../administration/asset-category";
import Knowledgebase from "../administration/help-support/knowledgebase";
import Activity from "../administration/help-support/activity";
import Users from "../administration/user-management/users";
import RolesPermission from "../administration/user-management/rolePermission";
import Categories from "../accounting/categories";
import Budgets from "../accounting/budgets";
import BudgetExpenses from "../accounting/budget-expenses";
import BudgetRevenues from "../accounting/budget-revenues";
import Appearance from "../settings/websiteSettings/appearance";
import SuperAdminDashboard from "../super-admin/dashboard";
import ExpensesReport from "../administration/reports/expensereport";
import InvoiceReport from "../administration/reports/invoicereport";
import PaymentReport from "../administration/reports/paymentreport";
import ProjectReport from "../administration/reports/projectreport";
import InvoiceDetails from "../sales/invoiceDetails";
import TaskReport from "../administration/reports/taskreport";
import UserReports from "../administration/reports/userreports";
import EmployeeReports from "../administration/reports/employeereports";
import EmployeeDetails from "../hrm/employees/employeedetails";
import PayslipReport from "../administration/reports/payslipreport";
import AttendanceReport from "../administration/reports/attendencereport";
import LeaveReport from "../administration/reports/leavereport";
import DailyReport from "../administration/reports/dailyreport";
import PermissionPage from "../administration/user-management/permissionpage";
import JobGrid from "../recruitment/jobs/jobgrid";
import JobList from "../recruitment/joblist/joblist";
import CandidateGrid from "../recruitment/candidates/candidategrid";
import CandidateKanban from "../recruitment/candidates/candidatekanban";
import CandidatesList from "../recruitment/candidates/candidatelist";
import RefferalList from "../recruitment/refferal/refferallist";
import ClienttGrid from "../projects/clinet/clienttgrid";
import ClientList from "../projects/clinet/clientlist";
import ClientDetails from "../projects/clinet/clientdetails";
import Project from "../projects/project/project";
import ProjectDetails from "../projects/project/projectdetails";
import ProjectList from "../projects/project/projectlist";
import Task from "../projects/task/task";
import TaskDetails from "../projects/task/taskdetails";
import TaskBoard from "../projects/task/task-board";
import Extimates from "../finance-accounts/sales/estimates";
import AddInvoice from "../finance-accounts/sales/add_invoices";
import EditInvoice from "../finance-accounts/payrool/payslip";
import Payments from "../finance-accounts/sales/payment";
import Expenses from "../finance-accounts/sales/expenses";
import ProvidentFund from "../finance-accounts/sales/provident_fund";
import Taxes from "../finance-accounts/sales/taxes";
import EmployeeSalary from "../finance-accounts/payrool/employee_salary";
import PaySlip from "../finance-accounts/payrool/payslip";
import PayRoll from "../finance-accounts/payrool/payroll";
import PayRollOvertime from "../finance-accounts/payrool/payrollOvertime";
import PayRollDeduction from "../finance-accounts/payrool/payrollDedution";
import Tickets from "../tickets/tickets";
import TicketGrid from "../tickets/tickets-grid";
import TicketDetails from "../tickets/ticket-details";
import PerformanceIndicator from "../performance/performanceIndicator";
import Aisettings from "../settings/websiteSettings/ai-settings";
import Salarysettings from "../settings/appSettings/salary-settings";
import Approvalsettings from "../settings/appSettings/approval-settings";
import LeaveType from "../settings/appSettings/leave-type";
import SmsTemplate from "../settings/systemSettings/sms-template";
import Maintenancemode from "../settings/systemSettings/maintenance-mode";
import Currencies from "../settings/financialSettings/currencies";
import Customcss from "../settings/otherSettings/custom-css";
import Customjs from "../settings/otherSettings/custom-js";
import Cronjob from "../settings/otherSettings/cronjob";
import Cronjobschedule from "../settings/otherSettings/cronjobSchedule";
import Backup from "../settings/otherSettings/backup";
import Clearcache from "../settings/otherSettings/clearCache";
import Languageweb from "../settings/websiteSettings/language-web";
import Addlanguage from "../settings/websiteSettings/add-language";
import Department from "../hrm/employees/deparment";
import Designations from "../hrm/employees/designations";
import Policy from "../hrm/employees/policy";
import ContactDetails from "../crm/contacts/contactDetails";
import ContactList from "../crm/contacts/contactList";
import ContactGrid from "../crm/contacts/contactGrid";
import DealsGrid from "../crm/deals/dealsGrid";
import DealsList from "../crm/deals/dealsList";
import DealsDetails from "../crm/deals/dealsDetails";
import Pipeline from "../crm/pipeline/pipeline";
import Holidays from "../hrm/holidays";
import PerformanceReview from "../performance/performanceReview";
import PerformanceAppraisal from "../performance/performanceAppraisal";
import GoalTracking from "../performance/goalTracking";
import GoalType from "../performance/goalType";

import LeaveAdmin from "../hrm/attendance/leaves/leaveAdmin";
import LeaveEmployee from "../hrm/attendance/leaves/leaveEmployee";
import LeaveSettings from "../hrm/attendance/leaves/leavesettings";
import AttendanceAdmin from "../hrm/attendance/attendanceadmin";
import AttendanceEmployee from "../hrm/attendance/attendance_employee";
import TimeSheet from "../hrm/attendance/timesheet";
import ScheduleTiming from "../hrm/attendance/scheduletiming";
import OverTime from "../hrm/attendance/overtime";
import Companies from "../super-admin/companies";
import Subscription from "../super-admin/subscription";
import Packages from "../super-admin/packages/packagelist";
import PackageGrid from "../super-admin/packages/packagelist";
import TrainingType from "../training/trainingType";
import Domain from "../super-admin/domin";
import PurchaseTransaction from "../super-admin/purchase-transaction";
import Termination from "../hrm/termination";
import Resignation from "../hrm/resignation";
import Promotion from "../hrm/promotion";
import Trainers from "../training/trainers";
import TrainingList from "../training/trainingList";
import Invoices from "../finance-accounts/sales/invoices";
import DynamicDashboard from "../../utils/DynamicDashboard";
import Branches from "../Branches/Branches";
import NotAllowed from "../pages/NotAllowed";
import { label } from "yet-another-react-lightbox/*";
import Features from "../features/Features";
import ShiftsManagement from "../shift management/ShiftsManagement";
import PayrollTemplate from "../PayrollTemplate/PayrollTemplate";
import DynamicAttendance from "../hrm/attendance/DynamicAttendance";
import LeaveTemplate from "../leaveTemplate/LeaveTemplate";
import HolidayGroup from "../HolidayGroup/HolidayGroup";
import HolidayGroups from "../HolidayGroup/HolidayGroup";
import BirthdayAndWorkAnniversaries from "../TodosComponents/BirthdayAndWorkAnniversaries";
const routes = all_routes;

export const publicRoutes = [

  {
    path: "/not-allowed",
    element: <NotAllowed />,
    label: "Not Allowed" // optional, doesn't need to be filtered
  },
  {
    path: "/",
    name: "Root",
    element: <Navigate to="/login" />,
    route: Route,
    label: "login"
  },
  {
    path: routes.adminDashboard,
    element: <DynamicDashboard />,
    route: Route,
    label: "Dashboard"
  },
  
  {
    path: routes.birthdayWorkAnniversary,
    element: <BirthdayAndWorkAnniversaries />,
    route: Route,
    label: "Birthday & Work Anniversaries"
  },
  {
    path: routes.employeeDashboard,
    element: <EmployeeDashboard />,
    route: Route,
  },
  {
    path: routes.leadsDashboard,
    element: <LeadsDasboard />,
    route: Route,
  },
  {
    path: routes.dealsDashboard,
    element: <DealsDashboard />,
    route: Route,
  },
  {
    label: 'Estimates',
    path: routes.estimate,
    element: <Extimates />,
  },
  {
    label: 'Termination',
    path: routes.termination,
    element: <Termination />,
  },
  {
    label: 'Resignation',
    path: routes.resignation,
    element: <Resignation />,
  },
  {
    label: 'Promotion',
    path: routes.promotion,
    element: <Promotion />,
  },
  {
    path: routes.trainingType,
    element: <TrainingType />,
  },
  {
    path: routes.trainers,
    element: <Trainers />,
  },
  {
    path: routes.trainingList,
    element: <TrainingList />,
  },


  //Application
  {
    label: 'Chat',
    path: routes.chat,
    element: <Chat />,
    route: Route,
  },
  {
    label: 'Calls',
    path: routes.voiceCall,
    element: <VoiceCall />,
    route: Route,
  },

  {
    label: 'Video Call',
    path: routes.videoCall,
    element: <Videocallss />,
    route: Route,
  },
  {
    label: 'Outgoing Call',
    path: routes.outgoingCall,
    element: <OutgoingCalls />,
    route: Route,
  },
  {
    label: 'Incoming Call',
    path: routes.incomingCall,
    element: <IncomingCall />,
    route: Route,
  },
  {
    label: 'Call History',
    path: routes.callHistory,
    element: <CallHistory />,
    route: Route,
  },
  {
    label: 'Social Feed',
    path: routes.socialFeed,
    element: <SocialFeed />,
    route: Route,
  },
  {
    label: 'Kanban',
    path: routes.kanbanView,
    element: <KanbanView />,
    route: Route,
  },
  {
    label: 'Countries',
    path: routes.countries,
    element: <Countries />,
    route: Route,
  },
  {
    label: 'Starter',
    path: routes.starter,
    element: <StarterPage />,
    route: Route,
  },
  {
    label: 'Calendar',
    path: routes.calendar,
    element: <Calendars />,
    route: Route,
  },
  {
    label: 'Dashboard',
    path: routes.superAdminDashboard,
    element: <SuperAdminDashboard />,
    route: Route,
  },

  {
    path: routes.membershipplan,
    element: <Membershipplan />,
  },
  {
    path: routes.membershipAddon,
    element: <MembershipAddon />,
  },
  {
    path: routes.membershipTransaction,
    element: <MembershipTransaction />,
  },
  {
    label: 'Notes',
    path: routes.notes,
    element: <Notes />,
  },
  {
    label: 'Countries',
    path: routes.countries,
    element: <Countries />,
    route: Route,
  },
  {
    path: routes.customFields,
    element: <CustomFields />,
    route: Route,
  },
  {
    path: routes.dataTables,
    element: <DataTable />,
    route: Route,
  },
  {
    path: routes.tablesBasic,
    element: <BasicTable />,
    route: Route,
  },

  {
    path: routes.deleteRequest,
    element: <DeleteRequest />,
    route: Route,
  },
  {
    label: 'Cities',
    path: routes.cities,
    element: <Cities />,
    route: Route,
  },

  {
    label: 'Accordions',
    path: routes.accordion,
    element: <Accordion />,
    route: Route,
  },
  {
    label: 'Avatar',
    path: routes.avatar,
    element: <Avatar />,
    route: Route,
  },
  {
    label: 'Badges',
    path: routes.badges,
    element: <Badges />,
    route: Route,
  },
  {
    label: 'Borders',
    path: routes.border,
    element: <Borders />,
    route: Route,
  },
  {
    label: 'Breadcrumb',
    path: routes.breadcrums,
    element: <Breadcrumb />,
    route: Route,
  },
  {
    label: 'Buttons',
    path: routes.button,
    element: <Buttons />,
    route: Route,
  },
  {
    label: 'Button Group',
    path: routes.buttonGroup,
    element: <ButtonsGroup />,
    route: Route,
  },
  {
    label: 'Cards',
    path: routes.cards,
    element: <Cards />,
    route: Route,
  },
  {
    label: 'Carousel',
    path: routes.carousel,
    element: <Carousel />,
    route: Route,
  },
  {
    label: 'Colors',
    path: routes.colors,
    element: <Colors />,
    route: Route,
  },
  {
    label: 'Dropdowns',
    path: routes.dropdowns,
    element: <Dropdowns />,
    route: Route,
  },
  {
    label: 'Grid',
    path: routes.grid,
    element: <Grid />,
    route: Route,
  },
  {
    label: 'Images',
    path: routes.images,
    element: <Images />,
    route: Route,
  },
  {
    label: 'Lightbox',
    path: routes.lightbox,
    element: <Lightboxes />,
    route: Route,
  },
  {
    label: 'Media',
    path: routes.media,
    element: <Media />,
    route: Route,
  },
  {
    label: 'Modals',
    path: routes.modals,
    element: <Modals />,
    route: Route,
  },
  {
    path: routes.navTabs,
    element: <NavTabs />,
    route: Route,
  },
  {
    label: 'Offcanvas',
    path: routes.offcanvas,
    element: <Offcanvas />,
    route: Route,
  },
  {
    label: 'Pagination',
    path: routes.pagination,
    element: <Pagination />,
    route: Route,
  },
  {
    path: routes.popover,
    element: <Popovers />,
    route: Route,
  },
  {
    label: 'Range Slider',
    path: routes.rangeSlider,
    element: <RangeSlides />,
    route: Route,
  },
  {
    label: 'Progress Bars',
    path: routes.progress,
    element: <Progress />,
    route: Route,
  },
  {
    label: 'Spinner',
    path: routes.spinner,
    element: <Spinner />,
    route: Route,
  },
  {
    label: 'Typography',
    path: routes.typography,
    element: <Typography />,
    route: Route,
  },
  {
    label: 'Videos',
    path: routes.video,
    element: <Video />,
    route: Route,
  },
  {
    label: 'Sortable',
    path: routes.sortable,
    element: <Sortable />,
    route: Route,
  },
  {
    label: 'SwiperJs',
    path: routes.swiperjs,
    element: <Swiperjs />,
    route: Route,
  },
  {
    label: 'Bootstrap Icons',
    path: routes.bootstrapIcons,
    element: <BootstrapIcons />,
    route: Route,
  },
  {
    label: 'Toasts',
    path: routes.toasts,
    element: <Toasts />,
    route: Route,
  },
  {
    label: 'Leaflets',
    path: routes.mapLeaflet,
    element: <Leaflet />,
    route: Route,
  },
  {
    label: 'Remix Icons',
    path: routes.RemixIcons,
    element: <RemixIcons />,
    route: Route,
  },
  {
    label: 'Flag Icons',
    path: routes.FlagIcons,
    element: <FlagIcons />,
    route: Route,
  },
  {
    label: 'Ban IP Address',
    path: routes.banIpAddress,
    element: <BanIpAddress />,
    route: Route,
  },
  {
    label: 'To Do',
    path: routes.todo,
    element: <Todo />,
    route: Route,
  },
  {
    path: routes.TodoList,
    element: <TodoList />,
    route: Route,
  },
  {
    label: 'Email',
    path: routes.email,
    element: <Email />,
    route: Route,
  },
  {
    path: routes.EmailReply,
    element: <EmailReply />,
    route: Route,
  },
  {
    path: routes.chat,
    element: <Chat />,
    route: Route,
  },
  {
    label: 'Pages',
    path: routes.pages,
    element: <Page />,
    route: Route,
  },

  {
    label: 'File Manager',
    path: routes.fileManager,
    element: <FileManager />,
    route: Route,
  },
  {
    label: 'States',
    path: routes.states,
    element: <States />,
    route: Route,
  },
  {
    label: 'Testimonials',
    path: routes.testimonials,
    element: <Testimonials />,
    route: Route,
  },
  {
    label: 'Clipboard',
    path: routes.clipboard,
    element: <ClipBoard />,
    route: Route,
  },
  {
    label: 'Counter',
    path: routes.counter,
    element: <Counter />,
    route: Route,
  },
  {
    label: 'Drag & Drop',
    path: routes.dragandDrop,
    element: <DragAndDrop />,
    route: Route,
  },
  {
    label: 'Rating',
    path: routes.rating,
    element: <Rating />,
    route: Route,
  },
  {
    path: routes.stickyNotes,
    element: <Stickynote />,
    route: Route,
  },
  {
    label: 'Text Editor',
    path: routes.textEditor,
    element: <TextEditor />,
    route: Route,
  },
  {
    label: 'Timeline',
    path: routes.timeLine,
    element: <Timeline />,
    route: Route,
  },
  {
    label: 'Scrollbar',
    path: routes.scrollBar,
    element: <Scrollbar />,
    route: Route,
  },
  {
    label: 'Apex Charts',
    path: routes.apexChart,
    element: <Apexchart />,
    route: Route,
  },
  {
    label: 'Prime Charts',
    path: routes.primeChart,
    element: <PrimeReactChart />,
    route: Route,
  },
  {
    label: 'Chart JS',
    path: routes.chartJs,
    element: <ChartJSExample />,
    route: Route,
  },
  {
  label: 'Feather Icons',
    path: routes.featherIcons,
    element: <FeatherIcons />,
    route: Route,
  },
  {
    label: 'Fontawesome Icons',
    path: routes.fontawesome,
    element: <FontawesomeIcons />,
    route: Route,
  },
  {
    label: 'Material Icons',
    path: routes.materialIcon,
    element: <MaterialIcons />,
    route: Route,
  },
  {
    label: 'pe7 Icons',
    path: routes.pe7icon,
    element: <PE7Icons />,
    route: Route,
  },
  {
    label: 'Simpleline Icons',
    path: routes.simpleLineIcon,
    element: <SimplelineIcons />,
    route: Route,
  },
  {
    label: 'Themify Icons',
    path: routes.themifyIcon,
    element: <ThemifyIcons />,
    route: Route,
  },
  {
    label: 'Typicon Icons',
    path: routes.typicon,
    element: <TypiconIcons />,
    route: Route,
  },
  {
    label: 'Basic Inputs',
    path: routes.basicInput,
    element: <BasicInputs />,
    route: Route,
  },
  {
    label: 'Weather Icons',
    path: routes.weatherIcon,
    element: <WeatherIcons />,
    route: Route,
  },
  {
    label: 'Checkbox & Radios',
    path: routes.checkboxandRadion,
    element: <CheckboxRadios />,
    route: Route,
  },
  {
    label: 'Input Groups',
    path: routes.inputGroup,
    element: <InputGroup />,
    route: Route,
  },
  {
    label: 'Grid & Gutters',
    path: routes.gridandGutters,
    element: <GridGutters />,
    route: Route,
  },
  {
    label: 'Form Select',
    path: routes.formSelect,
    element: <FormSelect />,
    route: Route,
  },
  {
    label: 'Input Masks',
    path: routes.formMask,
    element: <FormMask />,
    route: Route,
  },
  {
    label: 'File Uploads',
    path: routes.fileUpload,
    element: <FileUpload />,
    route: Route,
  },
  {
    label: 'Horizontal Form',
    path: routes.horizontalForm,
    element: <FormHorizontal />,
    route: Route,
  },
  {
    label: 'Vertical Form',
    path: routes.verticalForm,
    element: <FormVertical />,
    route: Route,
  },
  {
    label: 'Floating Labels',
    path: routes.floatingLable,
    element: <FloatingLabel />,
    route: Route,
  },
  {
    label: 'Form Validation',
    path: routes.formValidation,
    element: <FormValidation />,
    route: Route,
  },
  {
    path: routes.reactSelect,
    element: <FormSelect2 />,
    route: Route,
  },
  {
    label: 'Form Wizard',
    path: routes.formWizard,
    element: <FormWizard />,
    route: Route,
  },
  {
    label: 'Form Picker',
    path: routes.formPicker,
    element: <FormPikers />,
    route: Route,
  },
  {
    label: 'Data Tables',
    path: routes.dataTables,
    element: <DataTables />,
    route: Route,
  },
  {
    label: 'Basic Tables',
    path: routes.tablesBasic,
    element: <TablesBasic />,
    route: Route,
  },
  {
    label: 'Ionic Icons',
    path: routes.iconicIcon,
    element: <IonicIcons />,
    route: Route,
  },
  // {
  //   path: routes.chart,
  //   element: <ChartJs />,
  //   route: Route,
  // },

  {
    label: 'Placeholders',
    path: routes.placeholder,
    element: <Placeholder />,
    route: Route,
  },
  {
    path: routes.sweetalert,
    element: <Alert />,
    route: Route,
  },
  {
    label: 'Alerts',
    path: routes.alert,
    element: <AlertUi />,
    route: Route,
  },
  {
    label: 'Tooltip',
    path: routes.tooltip,
    element: <Tooltips />,
    route: Route,
  },
  {
    label: 'Ribbon',
    path: routes.ribbon,
    element: <Ribbon />,
    route: Route,
  },
  {
    label: 'Categories',
    path: routes.categories,
    element: <Categories />,
    route: Route,
  },
  {
    label: 'Budgets',
    path: routes.budgets,
    element: <Budgets />,
    route: Route,
  },
  {
    label: 'Budget Expenses',
    path: routes.budgetexpenses,
    element: <BudgetExpenses />,
    route: Route,
  },
  {
    label: 'Budget Revenues',
    path: routes.budgetrevenues,
    element: <BudgetRevenues />,
    route: Route,
  },
  {
    label: 'Tickets',
    path: routes.tickets,
    element: <Tickets />,
    route: Route,
  },
  {
    path: routes.ticketGrid,
    element: <TicketGrid />,
    route: Route,
  },
  {
    label: 'Tickets Detail',
    path: routes.ticketDetails,
    element: <TicketDetails />,
    route: Route,
  },
  {
    label: 'Performance Indicator',
    path: routes.performanceIndicator,
    element: <PerformanceIndicator />,
    route: Route,
  },
  {
    label: 'Holidays',
    path: routes.holidays,
    element: <Holidays />,
    route: Route,
  },
  {
    label: 'Performance Review',
    path: routes.performanceReview,
    element: <PerformanceReview />,
    route: Route,
  },
  {
    path: routes.performanceAppraisal,
    label: 'Performance Appraisal',
    element: <PerformanceAppraisal />,
    route: Route,
  },
  {
    label: 'Goal List',
    path: routes.goalTracking,
    element: <GoalTracking />,
    route: Route,
  },
  {
    label: 'Goal Type',
    path: routes.goalType,
    element: <GoalType />,
    route: Route,
  },
  {
    label: 'Training List',
    path: routes.trainingList,
    element: <TrainingList />,
    route: Route,
  },
  {
    label: 'Trainers',
    path: routes.trainers,
    element: <Trainers />,
    route: Route,
  },
  {
    label: 'Training Type',
    path: routes.trainingType,
    element: <TrainingType />,
    route: Route,
  },

  //Settings

  {
    label: 'Profile',
    path: routes.profilesettings,
    element: <Profilesettings />,
  },
  {
    label: 'Security',
    path: routes.securitysettings,
    element: <Securitysettings />,
  },
  {
    label: 'Notifications',
    path: routes.notificationssettings,
    element: <Notificationssettings />,
  },
  {
    label: 'Connected Apps',
    path: routes.connectedApps,
    element: <ConnectedApps />,
  },
  {
    label: 'Business Settings',
    path: routes.bussinessSettings,
    element: <Bussinesssettings />,
  },
  {
    label: 'SEO Settings',
    path: routes.seoSettings,
    element: <Seosettings />,
  },
  {
    path: routes.companySettings,
    element: <CompanySettings />,
  },
  {
    label: 'Localization',
    path: routes.localizationSettings,
    element: <Localizationsettings />,
  },
  {
    label: 'Prefixes',
    path: routes.prefixes,
    element: <Prefixes />,
  },
  {
    label: 'Preferences',
    path: routes.preference,
    element: <Preference />,
  },
  {
    label: 'Authentication',
    path: routes.authenticationSettings,
    element: <Authenticationsettings />,
  },
  {
    label: 'AI Settings',
    path: routes.aiSettings,
    element: <Aisettings />,
  },
  {
    label: 'Salary Settings',
    path: routes.salarySettings,
    element: <Salarysettings />,
  },
  {
    label: 'Approval Settings',
    path: routes.approvalSettings,
    element: <Approvalsettings />,
  },
  {
    label: 'Appearance',
    path: routes.appearance,
    element: <Appearance />,
  },
  {
    label: 'Language',
    path: routes.language,
    element: <Languagesettings />,
  },
  {
    path: routes.languageWeb,
    element: <Languageweb />,
  },
  {
    path: routes.addLanguage,
    element: <Addlanguage />,
  },
  {
    label: 'Invoice Settings',
    path: routes.invoiceSettings,
    element: <InvoiceSettings />,
  },
  {
    label: 'Custom Fields',
    path: routes.customFields,
    element: <CustomFields />,
  },
  {
    label: 'Leave Type',
    path: routes.leaveType,
    element: <LeaveType />,
  },
  {
    label: 'Email Settings',
    path: routes.emailSettings,
    element: <EmailSettings />,
  },
  {
    label: 'Email Templates',
    path: routes.emailTemplates,
    element: <Emailtemplates />,
  },
  {
    label: 'SMS Settings',
    path: routes.smsSettings,
    element: <SmsSettings />,
  },
  {
    label: 'SMS Templates',
    path: routes.smsTemplate,
    element: <SmsTemplate />,
  },
  {
    label: 'OTP',
    path: routes.otpSettings,
    element: <OtpSettings />,
  },
  {
    label: 'GDPR Cookies',
    path: routes.gdprCookies,
    element: <GdprCookies />,
  },
  {
    label: 'Maintenance Mode',
    path: routes.maintenanceMode,
    element: <Maintenancemode />,
  },

  {
    label: 'Payment Gateways',
    path: routes.paymentGateways,
    element: <PaymentGateways />,
  },
  {
    label: 'Tax Rate',
    path: routes.taxRates,
    element: <TaxRates />,
  },
  {
    label: 'Currencies',
    path: routes.currencies,
    element: <Currencies />,
  },
  {
    label: 'Backup',
    path: routes.backup,
    element: <Backup />,
  },
  {
    label: 'Clear Cache',
    path: routes.clearcache,
    element: <Clearcache />,
  },
  {
    label: 'Custom CSS',
    path: routes.customCss,
    element: <Customcss />,
  },
  {
    label: 'Custom JS',
    path: routes.customJs,
    element: <Customjs />,
  },
  {
    label: 'Cronjob',
    path: routes.cronjob,
    element: <Cronjob />,
  },
  {
    path: routes.Cronjobschedule,
    element: <Cronjobschedule />,
  },
  {
    label: 'Storage',
    path: routes.storage,
    element: <Storage />,
  },
  {
    path: routes.permissionpage,
    element: <PermissionPage />,
    label: "Permission"
  },
  {
    label: 'Expense Report',
    path: routes.expensesreport,
    element: <ExpensesReport />,
  },
  {
    path: routes.invoicereport,
    label: 'Invoice Report',
    element: <InvoiceReport />,
  },
  {
    path: routes.paymentreport,
    label: 'Payment Report',
    element: <PaymentReport />,
  },
  {
    label: 'Project Report',
    path: routes.projectreport,
    element: <ProjectReport />,
  },
  {
    path: routes.manageusers,
    element: <Manageusers />,
  },
  {
    label: 'All Blogs',
    path: routes.blogs,
    element: <Blogs />,
  },
  {
    label: 'Categories',
    path: routes.blogCategories,
    element: <BlogCategories />,
    route: Route,
  },
  {
    label: 'Comments',
    path: routes.blogComments,
    element: <BlogComments />,
  },
  {
    label: 'Blog Tags',
    path: routes.blogTags,
    element: <BlogTags />,
  },

  {
    label: 'Profile',
    path: routes.profile,
    element: <Profile />,
  },
  {
    label: 'Gallery',
    path: routes.gallery,
    element: <Gallery />,
  },
  {
    label: 'Search Results',
    path: routes.searchresult,
    element: <SearchResult />,
  },
  {
    label: 'Timeline',
    path: routes.timeline,
    element: <TimeLines />,
  },
  {
    label: 'Pricing',
    path: routes.pricing,
    element: <Pricing />,
  },
  {
    label: 'API Keys',
    path: routes.apikey,
    element: <ApiKeys />,
  },

  {
    label: 'Privacy Policy',
    path: routes.privacyPolicy,
    element: <PrivacyPolicy />,
  },
  {
    label: 'Terms & Conditions',
    path: routes.termscondition,
    element: <TermsCondition />,
  },
  {
    label: 'Assets',
    path: routes.assetList,
    element: <Assets />,
  },
  {
    label: 'Asset Categories',
    path: routes.assetCategories,
    element: <AssetsCategory />,
  },
  {
    label: 'Knowledge Base',
    path: routes.knowledgebase,
    element: <Knowledgebase />,
  },
  {
    label: 'Activities',
    path: routes.activity,
    element: <Activity />,
  },
  {
    path: routes.users,
    element: <Users />,
    label: "User Management"
  },
  {
    path: routes.rolePermission,
    element: <RolesPermission />,
    label: "Roles"
  },
  {
    path: routes.invoiceDetails,
    element: <InvoiceDetails />,
  },
  {
    label: 'Task Report',
    path: routes.taskreport,
    element: <TaskReport />,
  },
  {
    label: 'User Report',
    path: routes.userreport,
    element: <UserReports />,
  },
  {
    label: 'Employee Report',
    path: routes.employeereport,
    element: <EmployeeReports />,
  },
  {
    label: 'Employees Details',
    path: routes.employeedetails,
    element: <EmployeeDetails />,
    route: Route,
  },
  {
    label: 'Payslip Report',
    path: routes.payslipreport,
    element: <PayslipReport />,
    route: Route,
  },
  {
    label: 'Attendance Report',
    path: routes.attendancereport,
    element: <AttendanceReport />,
    route: Route,
  },
  {
    label: 'Leave Report',
    path: routes.leavereport,
    element: <LeaveReport />,
    route: Route,
  },
  {
    label: 'Daily Report',
    path: routes.dailyreport,
    element: <DailyReport />,
    route: Route,
  },
  {
    label: 'Jobs',
    path: routes.jobgrid,
    element: <JobGrid />,
    route: Route,
  },
  {
    path: routes.joblist,
    element: <JobList />,
    route: Route,
  },
  {
    label: 'Candidates',
    path: routes.candidatesGrid,
    element: <CandidateGrid />,
    route: Route,
  },
  {
    path: routes.candidateslist,
    element: <CandidatesList />,
    route: Route,
  },
  {
    path: routes.candidateskanban,
    element: <CandidateKanban />,
    route: Route,
  },
  {
    label: 'Refferals',
    path: routes.refferal,
    element: <RefferalList />,
    route: Route,
  },
  {
    label: 'Clients',
    path: routes.clientgrid,
    element: <ClienttGrid />,
    route: Route,
  },
  {
    path: routes.clientlist,
    element: <ClientList />,
    route: Route,
  },
  {
    path: routes.clientdetils,
    element: <ClientDetails />,
    route: Route,
  },
  {
    label: 'Projects',
    path: routes.project,
    element: <Project />,
    route: Route,
  },
  {
    path: routes.projectdetails,
    element: <ProjectDetails />,
    route: Route,
  },
  {
    path: routes.projectlist,
    element: <ProjectList />,
    route: Route,
  },
  {
    label: 'Tasks',
    path: routes.tasks,
    element: <Task />,
    route: Route,
  },
  {
    path: routes.tasksdetails,
    element: <TaskDetails />,
    route: Route,
  },
  {
    label: 'Task Board',
    path: routes.taskboard,
    element: <TaskBoard />,
    route: Route,
  },
  {
    label: 'Invoices',
    path: routes.invoices,
    element: <Invoices />,
    route: Route,
  },
  {
    label: 'Invoices',
    path: routes.invoice,
    element: <Invoices />,
    route: Route,
  },
  {
    path: routes.addinvoice,
    element: <AddInvoice />,
    route: Route,
  },
  {
    path: routes.editinvoice,
    element: <EditInvoice />,
    route: Route,
  },
  {
    path: routes.invoicesdetails,
    element: <InvoiceDetails />,
    route: Route,
  },
  {
    label: 'Payments',
    path: routes.payments,
    element: <Payments />,
    route: Route,
  },
  {
    label: 'Expenses',
    path: routes.expenses,
    element: <Expenses />,
    route: Route,
  },
  {
    label: 'Provident Fund',
    path: routes.providentfund,
    element: <ProvidentFund />,
    route: Route,
  },
  {
    label: 'Taxes',
    path: routes.taxes,
    element: <Taxes />,
    route: Route,
  },
  {
    label: 'Employee Salary',
    path: routes.employeesalary,
    element: <EmployeeSalary />,
    route: Route,
  },
  {
    label: 'Payslip',
    path: routes.payslip,
    element: <PaySlip />,
    route: Route,
  },
  {
    label: 'Payroll Items',
    path: routes.payrollAddition,
    element: <PayRoll />,
    route: Route,
  },
  {
    path: routes.payrollOvertime,
    element: <PayRollOvertime />,
    route: Route,
  },
  {
    path: routes.payrollDeduction,
    element: <PayRollDeduction />,
    route: Route,
  },
  {
    path: routes.departments,
    element: <Department />,
    route: Route,
    label: 'Departments'
  },
  {
    label: 'Designations',
    path: routes.designations,
    element: <Designations />,
    route: Route,
  },
  {
    label: 'Policies',
    path: routes.policy,
    element: <Policy />,
    route: Route,
  },
  {
    label: 'Leaves',
    path: routes.leaveadmin,
    element: <LeaveAdmin />,
    route: Route,
  },
  {
    label: 'Leaves (Employee)',
    path: routes.leaveemployee,
    element: <LeaveEmployee />,
    route: Route,
  },
  {
    label: 'Leave Settings',
    path: routes.leavesettings,
    element: <LeaveSettings />,
    route: Route,
  },
  {
    label: 'Attendance (Admin)',
    path: routes.attendanceadmin,
    element: <AttendanceAdmin />,
    route: Route,
  },
  {
    label: 'Attendance (Employee)',
    path: routes.attendanceemployee,
    element: <AttendanceEmployee />,
    route: Route,
  },
  {
    label: 'Attendance',
    path: routes.attendance,
    element: <DynamicAttendance />,
    route: Route,
  },
  {
    label: 'Timesheet',
    path: routes.timesheet,
    element: <TimeSheet />,
    route: Route,
  },
  {
    label: 'Shift & Schedule',
    path: routes.scheduletiming,
    element: <ScheduleTiming />,
    route: Route,
  },
  {
    label: 'Overtime',
    path: routes.overtime,
    element: <OverTime />,
    route: Route,
  },

  //crm
  {
    path: routes.contactList,
    element: <ContactList />,
    route: Route,
  },
  {
    label: 'Contacts',
    path: routes.contactGrid,
    element: <ContactGrid />,
    route: Route,
  },
  {
    path: routes.contactDetails,
    element: <ContactDetails />,
    route: Route,
  },
  {
    label: 'Deals',
    path: routes.dealsGrid,
    element: <DealsGrid />,
    route: Route,
  },
  {
    path: routes.dealsList,
    element: <DealsList />,
    route: Route,
  },
  {
    path: routes.dealsDetails,
    element: <DealsDetails />,
    route: Route,
  },
  {
    label: 'Pipeline',
    path: routes.pipeline,
    element: <Pipeline />,
    route: Route,
  },
  {
    path: routes.superAdminCompanies,
    element: <Companies />,
    route: Route,
    label: "Companies"
  },
  {
    label: 'Subscriptions',
    path: routes.superAdminSubscriptions,
    element: <Subscription />,
    route: Route,
  },
  {
    label: 'Packages',
    path: routes.superAdminPackages,
    element: <Packages />,
    route: Route,
  },
  {
    path: routes.superAdminPackagesGrid,
    element: <PackageGrid />,
    route: Route,
  },
  {
    label: 'Domain',
    path: routes.superAdminDomain,
    element: <Domain />,
    route: Route,
  },
  {
    label: 'Purchase Transaction',
    path: routes.superAdminPurchaseTransaction,
    element: <PurchaseTransaction />,
    route: Route,
  },
  {
    path: routes.adminBranches,
    element: <Branches />,
    route: Route,
    label: "Branches"
  },
  {
    path: routes.adminFeatures,
    element: <Features />,
    route: Route,
    label: "Features"
  },  
  {
    path: routes.shiftManagement,
    element: <ShiftsManagement />,
    route: Route,
    label: "Shift Management"
  },
  {
    path: routes.payrollTemplate,
    element: <PayrollTemplate />,
    route: Route,
    label: "Payroll Templates"
  },
  {
    path: routes.leaveTemplate,
    element: <LeaveTemplate />,
    route: Route,
    label: "Leave Templates"
  },
  {
    path: routes.holidayGroup,
    element: <HolidayGroups />,
    route: Route,
    label: "Holiday Group"
  },
];

export const authRoutes = [
  {
    label: 'Coming Soon',
    path: routes.comingSoon,
    element: <ComingSoon />,
    route: Route,
  },
  {
    path: routes.login,
    element: <Login />,
    route: Route,
    label: 'login'
  },
  {
    label: 'Cover',
    path: routes.register,
    element: <Register />,
    route: Route,
  },
  {
    label: 'Cover',
    path: routes.twoStepVerification,
    element: <TwoStepVerification />,
    route: Route,
  },
  {
    label: 'Cover',
    path: routes.emailVerification,
    element: <EmailVerification />,
    route: Route,
  },
  {
    label: 'Cover',
    path: routes.register,
    element: <Register />,
    route: Route,
  },
  {
    label: 'Cover',
    path: routes.resetPassword,
    element: <ResetPassword />,
    route: Route,
  },
  {
    label: 'Illustration',
    path: routes.resetPassword2,
    element: <ResetPassword2 />,
    route: Route,
  },
  {
    label: 'Basic',
    path: routes.resetPassword3,
    element: <ResetPassword3 />,
    route: Route,
  },
  {
    label: 'Cover',
    path: routes.forgotPassword,
    element: <ForgotPassword />,
    route: Route,
  },
  {
    label: '404 Error',
    path: routes.error404,
    element: <Error404 />,
    route: Route,
  },
  {
    label: '500 Error',
    path: routes.error500,
    element: <Error500 />,
    route: Route,
  },
  {
    label: 'Under Maintenance',
    path: routes.underMaintenance,
    element: <UnderMaintenance />,
    route: Route,
  },
  {
    label: 'Under Construction',
    path: routes.underConstruction,
    element: <UnderConstruction />,
  },
  {
    label: 'Lock Screen',
    path: routes.lockScreen,
    element: <LockScreen />,
  },
  {
    path: routes.resetPasswordSuccess,
    element: <ResetPasswordSuccess />,
  },
  {
    path: routes.resetPasswordSuccess2,
    element: <ResetPasswordSuccess2 />,
  },
  {
    path: routes.resetPasswordSuccess3,
    element: <ResetPasswordSuccess3 />,
  },
];
