


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
  
   SidebarDataTest = [
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

  // Extract all labels from SidebarDataTest
  const allLabels = extractLabels(SidebarDataTest);
  console.log(allLabels);
  
  
  