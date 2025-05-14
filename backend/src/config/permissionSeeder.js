const SidebarDataTest = [
  {
    tittle: 'Dashboard main',
    icon: 'airplay',
    showAsTab: true,
    separateRoute: false,
    submenuItems: [
      {
        label: 'Dashboard',
        link: 'index',
        submenu: false,
        showSubRoute: false,
        icon: 'smart-home',
        base: 'dashboard',
        materialicons: 'start',
        // dot: true,
      },
      {
        label: 'Companies',
        icon: 'layout-grid-add',
        link: '',
        base: 'companies',
      },

      {
        label: 'Branches',
        icon: 'layout-grid-add',
        link: '',
        base: 'ranches',
      },
      {
        label: 'Users',
        icon: 'user-star',
        link: '',
        base: 'users',
      },
      {
        label: 'Features',
        icon: 'layout-grid-add',
        link: '',
        base: 'ranches',
      },
      {
        label: 'Roles',
        icon: 'layout-grid-add',
        link: '',
        base: 'roles-permissions',
      },
      {
        label: 'Permission',
        icon: 'layout-grid-add',
        link: '',
        base: 'roles-permissions',
      },
      {
        label: 'Departments',
        icon: 'layout-grid-add',
        link: '',
        base: 'ranches',
      },
    ]
  },
  {
    tittle: 'Main Menu',
    icon: 'airplay',
    showAsTab: true,
    separateRoute: false,
    submenuItems: [
      // {
      //   label: 'Dashboard',
      //   link: 'index',
      //   submenu: true,
      //   showSubRoute: false,
      //   icon: 'smart-home',
      //   base: 'dashboard',
      //   materialicons: 'start',
      //   dot: true,
      //   submenuItems: [
      //     { label: "Admin Dashboard", link: '' },
      //     { label: "Employee Dashboard", link: '' },
      //     { label: "Deals Dashboard", link: '' },
      //     { label: "Leads Dashboard", link: '' },

      //   ],
      // },
      {
        label: 'Applications',
        link: 'apps',
        submenu: true,
        showSubRoute: false,
        icon: 'layout-grid-add',
        base: 'application',
        materialicons: 'dashboard',
        submenuItems: [
          {
            label: 'Chat',
            link: '',
            base: 'chats',
            customSubmenuTwo: false,
          },
          {
            label: 'Calls',
            customSubmenuTwo: true,
            submenu: true,
            showSubRoute: false,
            link: '',
            page1: 'voice-call',
            page2: 'videocall',
            base: 'calls',
            submenuItems: [
              {
                label: 'Voice Call',
                link: '',
                submenu: false,
                showSubRoute: false,
                base: 'voice-call',
              },
              {
                label: 'Video Call',
                link: '',
                submenu: false,
                showSubRoute: false,
                base: 'video-call',
              },
              {
                label: 'Outgoing Call',
                link: '',
                submenu: false,
                showSubRoute: false,
                base: 'outgoing-call',
              },
              {
                label: 'Incoming Call',
                link: '',
                submenu: false,
                showSubRoute: false,
                base: 'incoming-call',
              },
              {
                label: 'Call History',
                link: '',
                submenu: false,
                showSubRoute: false,
                base: 'call-history',
              },
            ],
          },
          {
            label: 'Calendar',
            showSubRoute: false,
            link: '',
            customSubmenuTwo: false,
            base: 'calendar',
          },

          {
            label: 'Email',
            showSubRoute: false,
            link: '',
            customSubmenuTwo: false,
            base: 'email',
          },
          {
            label: 'To Do',
            showSubRoute: false,
            link: '',
            customSubmenuTwo: false,
            base: 'todo',
          },
          {
            label: 'Notes',
            showSubRoute: false,
            link: '',
            customSubmenuTwo: false,
            base: 'notes',
          },
          {
            label: 'Social Feed',
            showSubRoute: false,
            link: '',
            customSubmenuTwo: false,
            base: 'social-feed',
          },
          {
            label: 'File Manager',
            showSubRoute: false,
            link: '',
            customSubmenuTwo: false,
            base: 'file-manager',
          },
          {
            label: 'Kanban',
            showSubRoute: false,
            link: '',
            customSubmenuTwo: false,
            base: 'kanban',
          },
          {
            label: 'Invoices',
            showSubRoute: false,
            link: '',
            customSubmenuTwo: false,
            base: 'invoices',
          },
        ],
      },
      {
        label: 'Super Admin',
        link: 'index',
        submenu: true,
        showSubRoute: false,
        icon: 'user-star',
        base: 'super-admin',
        materialicons: '',
        submenuItems: [
          {
            label: 'Dashboard',
            link: '',
            base: 'super-admin-dashboard',
          },
          {
            label: 'Companies',
            link: '',
            base: 'companies',
          },
          {
            label: 'Subscriptions',
            link: '',
            base: 'subscriptions',
          },
          {
            label: 'Packages',
            link: '',
            base: 'packages',
            base2: 'packages-grid',
          },
          {
            label: 'Domain',
            link: '',
            base: 'domain',
          },
          {
            label: 'Purchase Transaction',
            link: '',
            base: 'purchase-transaction',
          },
        ],
      },
    ],
  },
  {
    tittle: 'LAYOUT',
    icon: 'file',
    showAsTab: false,
    separateRoute: false,
    submenuItems: [
      {
        label: 'Horizontal',
        link: '',
        submenu: false,
        showSubRoute: false,
        base: 'layout-horizontal',
        icon: 'layout-navbar',
        materialicons: 'confirmation_number',
        submenuItems: [],
      },
      {
        label: 'Detached',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'details',
        base: 'layout-detached',
        materialicons: 'shopping_bag',
        submenuItems: [],
      },
      {
        label: 'Modern',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'layout-board-split',
        base: 'layout-modern',
        materialicons: 'shopping_bag',
        submenuItems: [],
      },
      {
        label: 'Two Column',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'columns-2',
        base: 'layout-twocolumn',
        materialicons: 'shopping_bag',
        submenuItems: [],
      },
      {
        label: 'Hovered',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'column-insert-left',
        base: 'layout-hovered',
        materialicons: 'shopping_bag',
        submenuItems: [],
      },
      {
        label: 'Boxed',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'layout-align-middle',
        base: 'layout-boxed',
        materialicons: 'shopping_bag',
        submenuItems: [],
      },
      {
        label: 'Horizontal Single',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'layout-navbar-inactive',
        base: 'layout-horizontal-single',
        materialicons: 'shopping_bag',
        submenuItems: [],
      },
      {
        label: 'Horizontal Overlay',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'layout-collage',
        base: 'layout-horizontal-overlay',
        materialicons: 'shopping_bag',
        submenuItems: [],
      },
      {
        label: 'Horizontal Box',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'layout-board',
        base: 'layout-horizontal-box',
        materialicons: 'shopping_bag',
        submenuItems: [],
      },
      {
        label: 'Menu Aside',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'table',
        base: 'layout-horizontal-sidemenu',
        materialicons: 'shopping_bag',
        submenuItems: [],
      },
      {
        label: 'Transparent',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'layout',
        base: 'layout-transparent',
        materialicons: 'shopping_bag',
        submenuItems: [],
      },
      {
        label: 'Without Header',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'layout-sidebar',
        base: 'layout-without-header',
        materialicons: 'shopping_bag',
        submenuItems: [],
      },
      {
        label: 'RTL',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'text-direction-rtl',
        base: 'layout-rtl',
        materialicons: 'shopping_bag',
        submenuItems: [],
      },
      {
        label: 'Dark',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'moon',
        base: 'layout-dark',
        materialicons: 'shopping_bag',
        submenuItems: [],
      },
    ],
  },
  {
    tittle: 'PROJECTS',
    icon: 'layers',
    showAsTab: false,
    separateRoute: false,
    submenuItems: [
      {
        label: 'Clients',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'users-group',
        base: 'client',
        materialicons: 'person',
        submenuItems: [],
      },
      {
        label: 'Projects',
        link: '',
        submenu: true,
        showSubRoute: false,
        icon: 'box',
        base: 'projects',
        materialicons: 'topic',
        submenuItems: [
          {
            label: 'Projects',
            link: '',
            base: 'project-grid',
            base2: 'project-list',
            base3: 'project-details',
          },
          { label: 'Tasks', link: 'tasks', base: 'tasks' },
          {
            label: 'Task Board',
            link: '',
            base: 'task-board',
          },
        ],
      },
    ],
  },
  {
    tittle: 'CRM',
    icon: 'file',
    showAsTab: false,
    separateRoute: false,
    submenuItems: [
      {
        label: 'Contacts',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'user-shield',
        base: 'contact',
        materialicons: 'confirmation_number',
        submenuItems: [],
      },
      {
        label: 'Companies',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'building',
        base: 'company',
        materialicons: 'shopping_bag',
        submenuItems: [],
      },
      {
        label: 'Deals',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'heart-handshake',
        base: 'deals',
        materialicons: 'account_balance_wallet',
        submenuItems: [],
      },
      {
        label: 'Leads',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'user-check',
        base: 'leads',
        materialicons: 'request_quote',
        submenuItems: [],
      },
      {
        label: 'Pipeline',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'timeline-event-text',
        base: 'pipeline',
        materialicons: 'verified_user',
        submenuItems: [],
      },
      {
        label: 'Analytics',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'graph',
        base: 'analytics',
        materialicons: 'report_gmailerrorred',
        submenuItems: [],
      },
      {
        label: 'Activities',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'activity',
        base: 'activity',
        materialicons: 'shutter_speed',
        submenuItems: [],
      },
    ],
  },
  {
    tittle: 'HRM',
    icon: 'file',
    showAsTab: false,
    separateRoute: false,
    submenuItems: [
      {
        label: 'Employees',
        link: '',
        submenu: true,
        showSubRoute: false,
        icon: 'users',
        base: 'employees',
        materialicons: 'people',
        submenuItems: [
          {
            label: 'Employees List',
            link: '',
            base: 'employees',
            base2: 'employee-list',
          },
          {
            label: 'Employees Grid',
            link: '',
            base: 'employees',
            base2: 'employee-grid',
          },
          {
            label: 'Employees Details',
            link: '',
            base: 'employees',
            base2: 'employee-details',
          },
          {
            label: 'Departments',
            link: '',
            base: 'departments',
          },
          {
            label: 'Designations',
            link: '',
            base: 'designations',
          },
          {
            label: 'Policies',
            link: '',
            base: 'employees',
            base2: 'policy',
          },
        ],
      },
      {
        label: 'Tickets',
        link: 'ticketList',
        submenu: true,
        showSubRoute: false,
        icon: 'ticket',
        base: 'tickets',
        materialicons: 'leaderboard',
        submenuItems: [
          {
            label: 'Tickets',
            link: '',
            base: 'ticket-list',
          },
          {
            label: 'Tickets Detail',
            link: '',
            base: 'ticket-details',
          },
        ],
      },
      {
        label: 'Holidays',
        link: '',
        base: 'holidays',
        submenu: false,
        showSubRoute: false,
        icon: 'calendar-event',
        materialicons: 'confirmation_number',
        submenuItems: [],
      },
      {
        label: 'Attendance',
        link: 'sales',
        submenu: true,
        showSubRoute: false,
        icon: 'file-time',
        base: 'sales',
        materialicons: 'track_changes',
        submenuItems: [
          {
            label: 'Leaves',
            customSubmenuTwo: true,
            submenu: true,
            showSubRoute: false,
            link: '',
            base: 'leaves',
            submenuItems: [
              {
                label: 'Leaves (Admin)',
                link: '',
                submenu: false,
                showSubRoute: false,
              },
              {
                label: 'Leaves (Employee)',
                link: '',
                submenu: false,
                showSubRoute: false,
              },
              {
                label: 'Leave Settings',
                link: '',
                submenu: false,
                showSubRoute: false,
              },
            ],
          },

          {
            label: 'Attendance (Admin)',
            link: '',
            base: 'attendance-admin',
            customSubmenuTwo: false,
          },
          {
            label: 'Attendance (Employee)',
            link: '',
            base: 'attendance-employee',
            customSubmenuTwo: false,
          },

          {
            label: 'Timesheet',
            link: '',
            base: 'timesheet',
            customSubmenuTwo: false,
          },
          {
            label: 'Shift & Schedule',
            link: '',
            base: 'shift-schedule',
            customSubmenuTwo: false,
          },
          {
            label: 'Overtime',
            link: '',
            base: 'overtime',
            customSubmenuTwo: false,
          },
        ],
      },
      {
        label: 'Performance',
        link: 'performanceIndicator',
        submenu: true,
        showSubRoute: false,
        icon: 'school',
        base: 'performance',
        materialicons: 'work_outline',
        submenuItems: [
          {
            label: 'Performance Indicator',
            link: '',
            base: 'indicator',
          },
          {
            label: 'Performance Review',
            link: '',
            base: 'review',
          },
          {
            label: 'Performance Appraisal',
            link: '',
            base: 'appraisal',
          },
          {
            label: 'Goal List',
            link: '',
            base: 'appraisal',
          },
          {
            label: 'Goal Type',
            link: '',
            base: 'appraisal',
          },
        ],
      },
      {
        label: 'Training',
        link: 'trainingLists',
        submenu: true,
        showSubRoute: false,
        icon: 'edit',
        base: 'training',
        materialicons: 'toggle_off',
        submenuItems: [
          { label: 'Training List', link: '', base: 'lists' },
          { label: 'Trainers', link: '', base: 'trainer' },
          { label: 'Training Type', link: '', base: 'types' },
        ],
      },
      {
        label: 'Promotion',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'speakerphone',
        base: 'promotion',
        materialicons: 'group_add',
        submenuItems: [],
      },
      {
        label: 'Resignation',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'external-link',
        base: 'resignation',
        materialicons: 'settings',
        submenuItems: [],
      },
      {
        label: 'Termination',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'circle-x',
        base: 'termination',
        materialicons: 'manage_accounts',
        submenuItems: [],
      },
    ],
  },
  {
    tittle: 'RECRUITMENT',
    icon: 'file',
    showAsTab: false,
    separateRoute: false,
    submenuItems: [
      {
        label: 'Jobs',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'timeline',
        base: 'jobs',
        materialicons: 'confirmation_number',
        submenuItems: [],
      },
      {
        label: 'Candidates',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'user-shield',
        base: 'candidates',
        materialicons: 'shopping_bag',
        submenuItems: [],
      },
      {
        label: 'Refferals',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'ux-circle',
        base: 'refferals',
        materialicons: 'account_balance_wallet',
        submenuItems: [],
      },

    ],
  },
  {
    tittle: 'Finance & Accounts',
    icon: 'file',
    showAsTab: false,
    separateRoute: false,
    submenuItems: [
      {
        label: 'Sales',
        base: 'sales',
        submenu: true,
        showSubRoute: false,
        icon: 'shopping-cart-dollar',
        submenuItems: [
          {
            label: 'Estimates',
            link: '',
            base: 'estimates',
          },
          {
            label: 'Invoices',
            link: '',
            base: 'invoices',
          },
          {
            label: 'Payments',
            link: '',
            base: 'payments',
          },
          {
            label: 'Expenses',
            link: '',
            base: 'expenses',
          },
          {
            label: 'Provident Fund',
            link: '',
            base: 'provident-fund',
          },
          {
            label: 'Taxes',
            link: '',
            base: 'taxes',
          },
        ],
      },
      {
        label: 'Accounting',
        base: 'accounting',
        submenu: true,
        showSubRoute: false,
        icon: 'file-dollar',
        submenuItems: [
          {
            label: 'Categories',
            link: '',
            base: 'categories',
          },
          {
            label: 'Budgets',
            link: '',
            base: 'budgets',
          },
          {
            label: 'Budget Expenses',
            link: '',
            base: 'budget-expenses',
          },
          {
            label: 'Budget Revenues',
            link: '',
            base: 'budget-revenues',
          },
        ],
      },
      {
        label: 'Payroll',
        base: 'payroll',
        submenu: true,
        showSubRoute: false,
        icon: 'cash',
        submenuItems: [
          {
            label: 'Employee Salary',
            link: '',
            base: 'employee-salary',
          },
          {
            label: 'Payslip',
            link: '',
            base: 'payslip',
          },
          {
            label: 'Payroll Items',
            link: '',
            base: 'payroll-items',
          },
        ],
      },
    ],
  },
  {
    tittle: 'Administration',
    showAsTab: false,
    separateRoute: false,
    submenuItems: [
      {
        label: 'Assets',
        base: 'assets',
        submenu: true,
        showSubRoute: false,
        icon: 'cash',
        submenuItems: [
          {
            label: 'Assets',
            link: '',
            base: 'asset-list',
          },
          {
            label: 'Asset Categories',
            link: '',
            base: 'asset-categories',
          },
        ],
      },
      {
        label: 'Help & Supports',
        base: 'supports',
        submenu: true,
        showSubRoute: false,
        icon: 'headset',
        submenuItems: [
          {
            label: 'Knowledge Base',
            link: '',
            base: 'knowledgebase',
            base2: 'knowledgebase-view',
            base3: 'knowledgebase-details',
          },
          {
            label: 'Activities',
            link: '',
            base: 'activities',
          },
        ],
      },
      // {
      //   label: 'User Management',
      //   base: 'user-management',
      //   submenu: true,
      //   showSubRoute: false,
      //   icon: 'user-star',
      //   submenuItems: [
      //     {
      //       label: 'Users',
      //       link: '',
      //       base: 'users',
      //     },
      //     {
      //       label: 'Roles & Permissions',
      //       link: '',
      //       base: 'roles-permissions',
      //     },
      //   ],
      // },
      {
        label: 'Reports',
        base: 'reports',
        submenu: true,
        showSubRoute: false,
        icon: 'user-star',
        submenuItems: [
          {
            label: 'Expense Report',
            link: '',
            base: 'expenses-report',
          },
          {
            label: 'Invoice Report',
            link: '',
            base: 'invoice-report',
          },
          {
            label: 'Payment Report',
            link: '',
            base: 'payment-report',
          },
          {
            label: 'Project Report',
            link: '',
            base: 'project-report',
          },
          {
            label: 'Task Report',
            link: '',
            base: 'task-report',
          },
          {
            label: 'User Report',
            link: '',
            base: 'user-report',
          },
          {
            label: 'Employee Report',
            link: '',
            base: 'employee-report',
          },
          {
            label: 'Payslip Report',
            link: '',
            base: 'payslip-report',
          },
          {
            label: 'Attendance Report',
            link: '',
            base: 'attendance-report',
          },
          {
            label: 'Leave Report',
            link: '',
            base: 'leave-report',
          },
          {
            label: 'Daily Report',
            link: '',
            base: 'daily-report',
          },
        ],
      },
      {
        label: 'Settings',
        submenu: true,
        showSubRoute: false,
        icon: 'settings',
        base: 'settings',
        submenuItems: [
          {
            label: 'General Settings',
            customSubmenuTwo: true,
            base: 'general-settings',
            submenuItems: [
              {
                label: 'Profile',
                link: '',
                base: 'profile-settings',
                submenu: false,
                showSubRoute: false,
              },
              {
                label: 'Security',
                link: '',
                base: 'security-settings',
                submenu: false,
                showSubRoute: false,
              },
              {
                label: 'Notifications',
                link: '',
                base: 'notification-settings',
                submenu: false,
                showSubRoute: false,
              },
              {
                label: 'Connected Apps',
                link: '',
                base: 'connected-apps',
                submenu: false,
                showSubRoute: false,
              },
            ],
          },
          {
            label: 'Website Settings',
            customSubmenuTwo: true,
            base: 'website-settings',
            submenuItems: [
              {
                label: 'Business Settings',
                link: '',
                base: 'bussiness-settings',
              },
              {
                label: 'SEO Settings',
                link: '',
                base: 'seo-settings',
              },
              {
                label: 'Localization',
                link: '',
                base: 'localization-settings',
              },
              {
                label: 'Prefixes',
                link: '',
                base: 'prefixes',
              },
              {
                label: 'Preferences',
                link: '',
                base: 'preferences',
              },
              {
                label: 'Appearance',
                link: '',
                base: 'appearance',
              },
              {
                label: 'Language',
                link: '',
                base: 'language',
                base2: 'add-language',
              },
              {
                label: 'Authentication',
                link: '',
                base: 'authentication-settings',
              },
              {
                label: 'AI Settings',
                link: '',
                base: 'ai-settings',
              },
            ],
          },
          {
            label: 'App Settings',
            customSubmenuTwo: true,
            base: 'app-settings',
            submenuItems: [
              {
                label: 'Salary Settings',
                link: '',
                base: 'salary-settings',
              },
              {
                label: 'Approval Settings',
                link: '',
                base: 'approval-settings',
              },
              {
                label: 'Invoice Settings',
                link: '',
                base: 'invoice-settings',
              },
              {
                label: 'Leave Type',
                link: '',
                base: 'leave-type',
              },
              {
                label: 'Custom Fields',
                link: '',
                base: 'custom-fields',
              },
            ],
          },
          {
            label: 'System Settings',
            customSubmenuTwo: true,
            base: 'system-settings',
            submenuItems: [
              {
                label: 'Email Settings',
                link: '',
                base: 'email-settings',
              },
              {
                label: 'Email Templates',
                link: '',
                base: 'email-template',
              },
              {
                label: 'SMS Settings',
                link: '',
                base: 'sms-settings',
              },
              {
                label: 'SMS Templates',
                link: '',
                base: 'sms-template',
              },
              {
                label: 'OTP',
                link: '',
                base: 'otp-settings',
              },
              {
                label: 'GDPR Cookies',
                link: '',
                base: 'gdpr',
              },
              {
                label: 'Maintenance Mode',
                link: '',
                base: 'maintenance-mode',
              },
            ],
          },
          {
            label: 'Financial Settings',
            customSubmenuTwo: true,
            base: 'financial-settings',
            submenuItems: [
              {
                label: 'Payment Gateways',
                link: '',
                base: 'payment-gateways',
              },
              {
                label: 'Tax Rate',
                link: '',
                base: 'tax-rates',
              },
              {
                label: 'Currencies',
                link: '',
                base: 'currencies',
              },
            ],
          },
          {
            label: 'Other Settings',
            customSubmenuTwo: true,
            base: 'other-settings',
            submenuItems: [
              {
                label: 'Custom CSS',
                link: '',
                base: 'custom-css',
              },
              {
                label: 'Custom JS',
                link: '',
                base: 'custom-js',
              },
              {
                label: 'Cronjob',
                link: '',
                base: 'cronjob',
              },
              {
                label: 'Storage',
                link: '',
                base: 'storage-settings',
              },
              {
                label: 'Ban IP Address',
                link: '',
                base: 'ban-ip-address',
              },
              {
                label: 'Backup',
                link: '',
                base: 'backup',
              },
              {
                label: 'Clear Cache',
                link: '',
                base: 'clear-cache',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    tittle: 'Content',
    showAsTab: false,
    separateRoute: false,
    submenuItems: [
      {
        label: 'Pages',
        link: '',
        base: 'pages',
        submenu: false,
        showSubRoute: false,
        icon: 'box-multiple',
        submenuItems: [],
      },
      {
        label: 'Blogs',
        submenu: true,
        showSubRoute: false,
        icon: 'brand-blogger',
        base: 'blogs',
        submenuItems: [
          {
            label: 'All Blogs',
            link: '',
            base2: 'All Blogs',
          },
          {
            label: 'Categories',
            link: '',
            base: '/blog-categories',
          },
          {
            label: 'Comments',
            link: '',
            base: '/blog-comments',
          },
          {
            label: 'Blog Tags',
            link: '',
            base: '/blog-tags',
          },
        ],
      },
      {
        label: 'Locations',
        submenu: true,
        showSubRoute: false,
        icon: 'map-pin-check',
        base: 'location',
        submenuItems: [
          {
            label: 'Countries',
            link: '',
            base: 'countries',
          },
          {
            label: 'States',
            link: '',
            base: 'states',
          },
          {
            label: 'Cities',
            link: '',
            base: 'cities',
          },
        ],
      },
      {
        label: 'Testimonials',
        link: '',
        base: 'testimonials',
        submenu: false,
        showSubRoute: false,
        icon: 'message-2',
        submenuItems: [],
      },
      {
        label: 'FAQ’S',
        link: '',
        base: 'faq',
        submenu: false,
        showSubRoute: false,
        icon: 'question-mark',
        submenuItems: [],
      },
    ],
  },
  {
    tittle: 'Pages',
    showAsTab: false,
    separateRoute: false,
    submenuItems: [
      {
        label: 'Starter',
        link: '',
        base: 'starter',
        submenu: false,
        showSubRoute: false,
        icon: 'layout-sidebar',
        submenuItems: [],
      },
      {
        label: 'Profile',
        link: '',
        base: 'profile',
        submenu: false,
        showSubRoute: false,
        icon: 'user-circle',
        submenuItems: [],
      },
      {
        label: 'Gallery',
        link: '',
        base: 'gallery',
        submenu: false,
        showSubRoute: false,
        icon: 'photo',
        submenuItems: [],
      },
      {
        label: 'Search Results',
        link: '',
        base: 'search-result',
        submenu: false,
        showSubRoute: false,
        icon: 'list-search',
        submenuItems: [],
      },
      {
        label: 'Timeline',
        link: '',
        base: 'timeline',
        submenu: false,
        showSubRoute: false,
        icon: 'timeline',
        submenuItems: [],
      },
      {
        label: 'Pricing',
        link: '',
        base: 'pricing',
        submenu: false,
        showSubRoute: false,
        icon: 'file-dollar',
        submenuItems: [],
      },
      {
        label: 'Coming Soon',
        link: '',
        base: 'coming-soon',
        submenu: false,
        showSubRoute: false,
        icon: 'progress-bolt',
        submenuItems: [],
      },
      {
        label: 'Under Maintenance',
        link: '',
        base: 'under-maintenance',
        submenu: false,
        showSubRoute: false,
        icon: 'alert-octagon',
        submenuItems: [],
      },
      {
        label: 'Under Construction',
        link: '',
        base: 'under-construction',
        submenu: false,
        showSubRoute: false,
        icon: 'barrier-block',
        submenuItems: [],
      },
      {
        label: 'API Keys',
        link: '',
        base: 'api-keys',
        submenu: false,
        showSubRoute: false,
        icon: 'api',
        submenuItems: [],
      },
      {
        label: 'Privacy Policy',
        link: '',
        base: 'privacy-policy',
        submenu: false,
        showSubRoute: false,
        icon: 'file-description',
        submenuItems: [],
      },
      {
        label: 'Terms & Conditions',
        link: '',
        base: 'terms-condition',
        submenu: false,
        showSubRoute: false,
        icon: 'file-check',
        submenuItems: [],
      },
    ],
  },
  {
    tittle: 'Authentication',
    showAsTab: false,
    separateRoute: false,
    submenuItems: [
      {
        label: 'Login',
        submenu: true,
        showSubRoute: false,
        icon: 'login',
        submenuItems: [
          {
            label: 'Cover',
            link: '',
          },
          {
            label: 'Illustration',
            link: '',
          },
          {
            label: 'Basic',
            link: '',
          },
        ],
      },
      {
        label: 'Register',
        submenu: true,
        showSubRoute: false,
        icon: 'forms',
        submenuItems: [
          {
            label: 'Cover',
            link: '',
          },
          {
            label: 'Illustration',
            link: '',
          },
          {
            label: 'Basic',
            link: '',
          },
        ],
      },
      {
        label: 'Forgot Password',
        submenu: true,
        showSubRoute: false,
        icon: 'help-triangle',
        submenuItems: [
          {
            label: 'Cover',
            link: '',
          },
          {
            label: 'Illustration',
            link: '',
          },
          {
            label: 'Basic',
            link: '',
          },
        ],
      },
      {
        label: 'Reset Password',
        submenu: true,
        showSubRoute: false,
        icon: 'restore',
        submenuItems: [
          {
            label: 'Cover',
            link: '',
          },
          {
            label: 'Illustration',
            link: '',
          },
          {
            label: 'Basic',
            link: '',
          },
        ],
      },
      {
        label: 'Email Verification',
        submenu: true,
        showSubRoute: false,
        icon: 'mail-exclamation',
        submenuItems: [
          {
            label: 'Cover',
            link: '',
          },
          {
            label: 'Illustration',
            link: '',
          },
          {
            label: 'Basic',
            link: '',
          },
        ],
      },
      {
        label: '2 Step Verification',
        submenu: true,
        showSubRoute: false,
        icon: 'password',
        submenuItems: [
          {
            label: 'Cover',
            link: '',
          },
          {
            label: 'Illustration',
            link: '',
          },
          {
            label: 'Basic',
            link: '',
          },
        ],
      },
      {
        label: 'Lock Screen',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'lock-square',
        submenuItems: [],
      },
      {
        label: '404 Error',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'error-404',
        submenuItems: [],
      },
      {
        label: '500 Error',
        link: '',
        submenu: false,
        showSubRoute: false,
        icon: 'server',
        submenuItems: [],
      },
    ],
  },
  {
    tittle: 'UI Interface',
    icon: 'file',
    showAsTab: false,
    separateRoute: false,
    submenuItems: [
      {
        label: 'Base UI',
        link: 'index',
        submenu: true,
        showSubRoute: false,
        icon: 'hierarchy-2',
        base: 'base-ui',
        materialicons: 'description',
        submenuItems: [
          {
            label: 'Alerts',
            link: '',
            base: 'ui-alerts',
          },
          {
            label: 'Accordions',
            link: '',
            base: 'ui-accordion',
          },
          { label: 'Avatar', link: '', base: 'ui-avatar' },
          { label: 'Badges', link: '', base: 'ui-badges' },
          { label: 'Borders', link: '', base: 'ui-borders' },
          {
            label: 'Buttons',
            link: '',
            base: 'ui-buttons',
          },
          {
            label: 'Button Group',
            link: '',
            base: 'ui-buttons-group',
          },
          {
            label: 'Breadcrumb',
            link: '',
            base: 'ui-breadcrumb',
          },
          { label: 'Cards', link: '', base: 'ui-cards' },
          {
            label: 'Carousel',
            link: '',
            base: 'ui-carousel',
          },
          {
            label: 'Colors',
            link: '',
            base: 'ui-colors',
          },
          {
            label: 'Dropdowns',
            link: '',
            base: 'ui-dropdowns',
          },
          { label: 'Grid', link: '', base: 'ui-grid' },
          { label: 'Images', link: '', base: 'ui-images' },
          {
            label: 'Lightbox',
            link: '',
            base: 'ui-lightbox',
          },
          { label: 'Media', link: '', base: 'ui-media' },
          { label: 'Modals', link: '', base: 'ui-modals' },
          {
            label: 'Offcanvas',
            link: '',
            base: 'ui-offcanvas',
          },
          {
            label: 'Pagination',
            link: '',
            base: 'ui-pagination',
          },

          {
            label: 'Progress Bars',
            link: '',
            base: 'ui-progress',
          },
          {
            label: 'Placeholders',
            link: '',
            base: 'ui-placeholders',
          },

          {
            label: 'Spinner',
            link: '',
            base: 'ui-spinner',
          },
          {
            label: 'Range Slider',
            link: '',
            base: 'ui-rangeslider',
          },

          { label: 'Toasts', link: '', base: 'ui-toasts' },
          {
            label: 'Tooltip',
            link: '',
            base: 'ui-tooltips',
          },
          {
            label: 'Typography',
            link: '',
            base: 'ui-typography',
          },
          { label: 'Videos', link: '', base: 'ui-video' },
          { label: 'Sortable', link: '', base: 'ui-sortable' },
          { label: 'SwiperJs', link: '', base: 'ui-swiperjs' },
        ],
      },
      {
        label: 'Advanced Ui',
        submenu: true,
        showSubRoute: false,
        base: 'advancedUi',
        icon: 'hierarchy-3',
        materialicons: 'sync_alt',
        submenuItems: [
          { label: 'Ribbon', link: '', base: 'ui-ribbon' },
          {
            label: 'Clipboard',
            link: '',
            base: 'ui-clipboard',
          },
          {
            label: 'Drag & Drop',
            link: '',
            base: 'ui-drag-drop',
          },
          {
            label: 'Rating',
            link: '',
            base: 'ui-rating',
          },
          {
            label: 'Text Editor',
            link: '',
            base: 'ui-text-editor',
          },
          {
            label: 'Counter',
            link: '',
            base: 'ui-counter',
          },
          {
            label: 'Scrollbar',
            link: '',
            base: 'ui-scrollbar',
          },
          {
            label: 'Timeline',
            link: '',
            base: 'ui-timeline',
          },
        ],
      },
      {
        label: 'Charts',
        submenu: true,
        showSubRoute: false,
        base: 'charts',
        icon: 'chart-line',
        materialicons: 'library_add_check',
        submenuItems: [
          {
            label: 'Apex Charts',
            link: '',
            base: 'apex-charts',
          },
          {
            label: 'Prime Charts',
            link: '',
            base: 'prime-charts',
          },
          {
            label: 'Chart JS',
            link: '',
            base: 'chart-js',
          },
        ],
      },
      {
        label: 'Icons',
        submenu: true,
        showSubRoute: false,
        icon: 'icons',
        base: 'icon',
        materialicons: 'people',
        submenuItems: [
          {
            label: 'Fontawesome Icons',
            link: '',
            base: 'icon-fontawesome',
          },
          {
            label: 'Bootstrap Icons',
            link: '',
            base: 'icon-bootstrap',
          },
          {
            label: 'Remix Icons',
            link: '',
            base: 'icon-remix',
          },
          {
            label: 'Feather Icons',
            link: '',
            base: 'icon-feather',
          },
          {
            label: 'Ionic Icons',
            link: '',
            base: 'icon-ionic',
          },
          {
            label: 'Material Icons',
            link: '',
            base: 'icon-material',
          },
          { label: 'pe7 Icons', link: '', base: 'icon-pe7' },
          {
            label: 'Simpleline Icons',
            link: '',
            base: 'icon-simple-line',
          },
          {
            label: 'Themify Icons',
            link: '',
            base: 'icon-themify',
          },
          {
            label: 'Weather Icons',
            link: '',
            base: 'icon-weather',
          },
          {
            label: 'Typicon Icons',
            link: '',
            base: 'icon-typicon',
          },
          { label: 'Flag Icons', link: '', base: 'icon-flag' },
        ],
      },
      {
        label: 'Forms',
        icon: 'input-search',
        base: 'forms',
        submenu: true,
        showSubRoute: false,
        materialicons: 'view_day',
        submenuItems: [
          {
            label: 'Form Elements',
            base: 'form-elements',
            customSubmenuTwo: true,
            submenu: true,
            showSubRoute: false,
            submenuItems: [
              {
                label: 'Basic Inputs',
                link: '',
                submenu: false,
                showSubRoute: false,
                base: 'form-basic-inputs',
              },
              {
                label: 'Checkbox & Radios',
                link: '',
                submenu: false,
                showSubRoute: false,
                base: 'form-checkbox-radios',

              },
              {
                label: 'Input Groups',
                link: '',
                submenu: false,
                showSubRoute: false,
                base: 'form-input-groups',

              },
              {
                label: 'Grid & Gutters',
                link: '',
                submenu: false,
                showSubRoute: false,
                base: 'form-grid-gutters',
              },
              {
                label: 'Form Select',
                link: '',
                submenu: false,
                showSubRoute: false,
                base: 'form-select',

              },
              {
                label: 'Input Masks',
                link: '',
                submenu: false,
                showSubRoute: false,
                base: 'form-mask',
              },
              {
                label: 'File Uploads',
                link: '',
                submenu: false,
                showSubRoute: false,
                base: 'form-fileupload',
              },
            ],
          },
          {
            label: 'Layouts',
            customSubmenuTwo: true,
            base: 'layouts',
            submenu: true,
            showSubRoute: false,
            submenuItems: [
              {
                label: 'Horizontal Form',
                link: '',
                submenu: false,
                showSubRoute: false,
                base: 'form-horizontal'
              },
              {
                label: 'Vertical Form',
                link: '',
                submenu: false,
                showSubRoute: false,
                base: 'form-vertical',
              },
              {
                label: 'Floating Labels',
                link: '',
                submenu: false,
                showSubRoute: false,
                base: 'form-floating-labels',

              },
            ],
          },
          {
            label: 'Form Validation',
            link: '',
            submenu: false,
            showSubRoute: false,
            customSubmenuTwo: false,
            base: 'form-validation',
          },
          {
            label: 'Form Wizard',
            link: '',
            submenu: false,
            showSubRoute: false,
            customSubmenuTwo: false,
            base: 'form-wizard',
          },
          {
            label: 'Form Picker',
            link: '',
            submenu: false,
            showSubRoute: false,
            customSubmenuTwo: false,
            base: 'form-picker',
          },
        ],
      },
      {
        label: 'Tables',
        link: 'tables',
        submenu: true,
        showSubRoute: false,
        icon: 'table',
        base: 'tables',
        materialicons: 'table_rows',
        submenuItems: [
          {
            label: 'Basic Tables',
            link: '',
            base: 'tables-basic',
          },
          {
            label: 'Data Tables',
            link: '',
            base: 'data-basic',
          },
        ],
      },
      {
        label: 'Maps',
        submenu: true,
        showSubRoute: false,
        icon: 'table-plus',
        base: 'maps',
        materialicons: 'people',
        submenuItems: [
          {
            label: 'Leaflets',
            link: '',
            base: 'leaflets',
          },

        ],
      },
    ],
  },
  {
    tittle: 'Extras',
    icon: 'file',
    showAsTab: false,
    separateRoute: false,
    submenuItems: [
      {
        label: 'Documentation',
        submenu: false,
        showSubRoute: false,
        icon: 'file-text',
        base: '1',
        materialicons: 'description',
        submenuItems: [],
      },
      {
        label: 'Change Log',
        changeLogVersion: true,
        submenu: false,
        showSubRoute: false,
        icon: 'exchange',
        base: '1',
        materialicons: 'sync_alt',
        submenuItems: [],
      },
    ],
  },
];

const extractLabels = (menuItems) => {
  const labels = [];

  const traverse = (items) => {
    items.forEach((item) => {
      if (item.label) {
        labels.push(item.label);
      }
      if (item.submenuItems && item.submenuItems.length) {
        traverse(item.submenuItems);
      }
    });
  };

  traverse(menuItems);
  return labels;
};


const seedPermissions = async (models) => {
  const { Permission, Role } = models;



  // Extract all labels from SidebarDataTest
  const allLabels = extractLabels(SidebarDataTest);



  const permissions = [
    { name: 'Dashboard', description: 'Permission to access dashboard' },
    { name: 'Companies', description: 'Permission to access companies' },
    { name: 'FetchCompany', description: 'Permission to fetch company details' },
    { name: 'AddCompany', description: 'Permission to add a new company' },
    { name: 'EditCompany', description: 'Permission to edit company details' },
    { name: 'User Management', description: 'Permission to manage users' },
    { name: 'Users', description: 'Permission to access user details' },
    { name: 'EditUser', description: 'Permission to edit user details' },
    { name: 'AddUser', description: 'Permission to add new users' },
    { name: 'Branches', description: 'Permission to manage branches' },
    { name: 'AddBranch', description: 'Permission to add a new branch' },
    { name: 'EditBranch', description: 'Permission to edit branch details' },
    { name: 'Features', description: 'Permission to access features details' },
    { name: 'AddFeature', description: 'Permission to add new Feature' },
    { name: 'editFeature', description: 'Permission to edit existing feature' },
    { name: 'Departments', description: 'Permission to access departments' },
    { name: 'AddDepartments', description: 'Permission to add new Departments' },
    { name: 'Roles', description: 'Permission to access Roles' },
    { name: 'AddRole', description: 'Permission to add new Roles' },
    { name: 'Permission', description: 'Permission to edit System Permissions' },
    { name: 'fetchRolesPermissions', description: 'Permission to access Role wise permissions' },
    { name: 'Shift Management', description: 'Permission to open shift management page' },
    { name: 'AddShift', description: 'Permission to add new shift/shift settings' },
    { name: 'EditShift', description: 'Permission to edit shift' },
    { name: 'Payroll Templates', description: 'Permission access payroll page' },



  ];

  try {
    for (const permission of permissions) {
      const [result, created] = await Permission.findOrCreate({
        where: { name: permission.name },
        defaults: { description: permission.description },
      });

      if (created) {
        console.log(`Permission "${result.name}" created.`);
      } else {
        console.log(`Permission "${result.name}" already exists.`);
      }
    }

    for (const permission of allLabels) {
      const [result, created] = await Permission.findOrCreate({
        where: { name: permission},
        defaults: { description: "description"},
      });

      if (created) {
        console.log(`Permission "${result.name}" created.`);
      } else {
        console.log(`Permission "${result.name}" already exists.`);
      }
    }


    console.log('Permissions seeding completed!');
  } catch (error) {
    console.error('Error seeding permissions:', error);
  }
};

export default seedPermissions;
