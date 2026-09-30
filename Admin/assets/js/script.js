/**
 * Be The Change Health — Admin CMS shell & interactions
 */
(function () {
  "use strict";

  var normPath = location.pathname.replace(/\\/g, "/");
  var depth = 0;
  var pagesIdx = normPath.indexOf("/pages/");
  if (pagesIdx !== -1) {
    var afterPages = normPath.slice(pagesIdx + "/pages/".length);
    if (afterPages.indexOf("/") !== -1) {
      depth = 2;
    } else {
      depth = 1;
    }
  }

  var ROOT = depth === 2 ? "../../" : (depth === 1 ? "../" : "");
  var PAGES = depth === 2 ? "../" : (depth === 1 ? "" : "pages/");
  var FE = depth === 2 ? "../../../Frontend/" : (depth === 1 ? "../../Frontend/" : "../Frontend/");
  var PAGE = document.body.getAttribute("data-page") || "";

  var NAV = [
    { type: "link", id: "dashboard", label: "Dashboard", href: ROOT + "index.html", icon: "bi-grid-1x2" },
    { type: "label", label: "Website Pages" },
    {
      type: "group",
      id: "page-content-cms-group",
      label: "Page Content CMS",
      icon: "bi-window-stack",
      match: [
        "homepage", "about", "naturopathic", "integrative", "process", "doctor-jessica", "doctor-sultana",
        "conditions-landing", "condition-diabetes", "condition-heart-disease", "condition-concussion",
        "condition-chronic-fatigue", "condition-obesity", "condition-chronic-pain",
        "condition-toxins", "condition-hormone-imbalance",
        "services-landing", "service-constitutional-hydrotherapy",
        "service-frequency-specific-microcurrent", "service-infrared-sauna-therapy",
        "service-hyperbaric-oxygen-therapy", "service-iv-nutritional-infusions",
        "service-liquivida-iv-therapy", "service-reflexology", "service-ozone-therapy",
        "service-ion-foot-detox", "service-wellness-classes", "service-personalized-wellness-plans",
        "patients-content", "new-patient-questions-content",
        "membership-content", "blog-content", "contact", "contact-preview",
        "book-appointment-content", "header-footer", "seo",
        "privacy-policy", "terms-conditions"
      ],
      items: [
        { id: "homepage", label: "Homepage", href: PAGES + "homepage.html" },
        {
          type: "subgroup",
          id: "about-subgroup",
          label: "About",
          icon: "bi-info-circle",
          match: ["about", "naturopathic", "integrative", "process", "doctor-jessica", "doctor-sultana"],
          items: [
            { id: "about", label: "Practice Story", href: PAGES + "about/about.html" },
            { id: "naturopathic", label: "Naturopathic Medicine", href: PAGES + "about/naturopathic-medicine.html" },
            { id: "integrative", label: "Integrative Medicine", href: PAGES + "about/integrative-medicine.html" },
            { id: "process", label: "Our Process", href: PAGES + "about/our-process.html" },
            { id: "doctor-jessica", label: "Jessica Needle", href: PAGES + "doctors/doctor-jessica.html" },
            { id: "doctor-sultana", label: "Sultana Afrooz", href: PAGES + "doctors/doctor-sultana.html" }
          ]
        },
        {
          type: "subgroup",
          id: "conditions-subgroup",
          label: "Conditions",
          icon: "bi-clipboard2-pulse",
          match: [
            "conditions-landing",
            "condition-diabetes", "condition-heart-disease", "condition-concussion",
            "condition-chronic-fatigue", "condition-obesity", "condition-chronic-pain",
            "condition-toxins", "condition-hormone-imbalance"
          ],
          items: [
            { id: "conditions-landing", label: "Conditions Landing", href: PAGES + "conditions/conditions-landing.html" },
            { id: "condition-diabetes", label: "Diabetes", href: PAGES + "conditions/diabetes.html" },
            { id: "condition-heart-disease", label: "Heart Disease", href: PAGES + "conditions/heart-disease.html" },
            { id: "condition-concussion", label: "Concussion", href: PAGES + "conditions/concussion.html" },
            { id: "condition-chronic-fatigue", label: "Chronic Fatigue", href: PAGES + "conditions/chronic-fatigue.html" },
            { id: "condition-obesity", label: "Obesity", href: PAGES + "conditions/obesity.html" },
            { id: "condition-chronic-pain", label: "Chronic Pain", href: PAGES + "conditions/chronic-pain.html" },
            { id: "condition-toxins", label: "Toxins", href: PAGES + "conditions/toxins.html" },
            { id: "condition-hormone-imbalance", label: "Hormone Imbalance", href: PAGES + "conditions/hormone-imbalance.html" }
          ]
        },
        {
          type: "subgroup",
          id: "services-subgroup",
          label: "Services",
          icon: "bi-heart-pulse",
          match: [
            "services-landing", "service-constitutional-hydrotherapy",
            "service-frequency-specific-microcurrent", "service-infrared-sauna-therapy",
            "service-hyperbaric-oxygen-therapy", "service-iv-nutritional-infusions",
            "service-liquivida-iv-therapy", "service-reflexology", "service-ozone-therapy",
            "service-ion-foot-detox", "service-wellness-classes", "service-personalized-wellness-plans"
          ],
          items: [
            { id: "services-landing", label: "Services Landing", href: PAGES + "services/services-landing.html" },
            { id: "service-constitutional-hydrotherapy", label: "Constitutional Hydrotherapy", href: PAGES + "services/constitutional-hydrotherapy.html" },
            { id: "service-frequency-specific-microcurrent", label: "Frequency Specific Microcurrent", href: PAGES + "services/frequency-specific-microcurrent.html" },
            { id: "service-infrared-sauna-therapy", label: "Infrared Sauna Therapy", href: PAGES + "services/infrared-sauna-therapy.html" },
            { id: "service-hyperbaric-oxygen-therapy", label: "Hyperbaric Oxygen Therapy", href: PAGES + "services/hyperbaric-oxygen-therapy.html" },
            { id: "service-iv-nutritional-infusions", label: "IV Nutritional Infusions", href: PAGES + "services/iv-nutritional-infusions.html" },
            { id: "service-liquivida-iv-therapy", label: "Liquivida IV Therapy", href: PAGES + "services/liquivida-iv-therapy.html" },
            { id: "service-reflexology", label: "Reflexology", href: PAGES + "services/reflexology.html" },
            { id: "service-ozone-therapy", label: "Ozone Therapy", href: PAGES + "services/ozone-therapy.html" },
            { id: "service-ion-foot-detox", label: "Ion Foot Detox", href: PAGES + "services/ion-foot-detox.html" },
            { id: "service-wellness-classes", label: "Wellness Classes", href: PAGES + "services/wellness-classes.html" },
            { id: "service-personalized-wellness-plans", label: "Personalized Wellness Plans", href: PAGES + "services/personalized-wellness-plans.html" }
          ]
        },
        {
          type: "subgroup",
          id: "patients-subgroup",
          label: "Patients",
          icon: "bi-people",
          match: ["patients-content", "new-patient-questions-content"],
          items: [
            { id: "patients-content", label: "Existing Patients", href: PAGES + "patients/patients-content.html" },
            { id: "new-patient-questions-content", label: "New Patient Questions", href: PAGES + "patients/new-patient-questions-content.html" }
          ]
        },
        { id: "membership-content", label: "Membership", href: PAGES + "memberships/membership-content.html" },
        { id: "blog-content", label: "Blog", href: PAGES + "blog/blog-content.html" },
        { id: "contact", label: "Contact", href: PAGES + "contact/contact.html" },
        { id: "book-appointment-content", label: "Book Appointment", href: PAGES + "appointments/book-appointment-content.html" },
        { id: "header-footer", label: "Header & Footer", href: PAGES + "header-footer.html" },
        { id: "seo", label: "SEO", href: PAGES + "seo.html" },
        {
          type: "subgroup",
          id: "legal-subgroup",
          label: "Legal",
          icon: "bi-shield-check",
          match: ["privacy-policy", "terms-conditions"],
          items: [
            { id: "privacy-policy", label: "Privacy Policy", href: PAGES + "legal/privacy-policy.html" },
            { id: "terms-conditions", label: "Terms & Conditions", href: PAGES + "legal/terms-conditions.html" }
          ]
        }
      ]
    },
    { type: "label", label: "Practitioners" },
    {
      type: "group",
      id: "doctors-group",
      label: "Doctors",
      icon: "bi-person-badge",
      match: ["doctors", "doctor-sultana", "doctor-jessica"],
      items: [
        { id: "doctor-sultana", label: "Sultana Afrooz, D.O.", href: PAGES + "doctors/doctor-sultana.html" },
        { id: "doctor-jessica", label: "Jessica Needle, N.D.", href: PAGES + "doctors/doctor-jessica.html" }
      ]
    },
    { type: "label", label: "Care Operations" },
    { type: "link", id: "appointments", label: "Appointments", href: PAGES + "appointments/appointments.html", icon: "bi-calendar2-check" },
    { type: "link", id: "inquiries", label: "Contact / Inquiries", href: PAGES + "inquiries/inquiries.html", icon: "bi-envelope-open" },
    { type: "link", id: "memberships", label: "Memberships", href: PAGES + "memberships/memberships.html", icon: "bi-card-checklist" },
    { type: "link", id: "services", label: "Services", href: PAGES + "services/services.html", icon: "bi-heart-pulse" },
    { type: "link", id: "conditions", label: "Conditions", href: PAGES + "conditions/conditions.html", icon: "bi-clipboard2-pulse" },
    { type: "link", id: "blog", label: "Blog", href: PAGES + "blog/blog.html", icon: "bi-journal-richtext" },
    { type: "link", id: "notifications", label: "Notifications", href: PAGES + "notifications/notifications.html", icon: "bi-bell" },
    { type: "label", label: "Site" },
    { type: "link", id: "media", label: "Media Library", href: PAGES + "media.html", icon: "bi-images" },
    { type: "link", id: "seo", label: "SEO Settings", href: PAGES + "seo.html", icon: "bi-search" },
    { type: "link", id: "settings", label: "Site Settings", href: PAGES + "settings.html", icon: "bi-gear" }
  ];

  var TITLES = {
    dashboard: ["Overview", "Dashboard"],
    homepage: ["Website Pages", "Homepage"],
    about: ["Website Pages", "Practice Story"],
    integrative: ["Website Pages", "Integrative Medicine"],
    naturopathic: ["Website Pages", "Naturopathic Medicine"],
    process: ["Website Pages", "Our Process"],
    contact: ["Website Pages", "Contact Page"],
    "contact-preview": ["Website Pages", "Contact Page Live Preview"],
    doctors: ["Practitioners", "Doctors"],
    "doctor-sultana": ["Practitioners", "Sultana Afrooz, D.O."],
    "doctor-jessica": ["Practitioners", "Jessica Needle, N.D."],
    appointments: ["Care Operations", "Appointments"],
    inquiries: ["Care Operations", "Contact / Inquiries Inbox"],
    "inquiry-detail": ["Care Operations", "Inquiry Details & Reply"],
    memberships: ["Care Operations", "Health & Wellness Memberships"],
    "membership-content": ["Website Pages", "Membership Page"],
    "blog-content": ["Website Pages", "Blog Page Content"],
    "patients-content": ["Website Pages", "Existing Patients"],
    "new-patient-questions-content": ["Website Pages", "New Patient Questions"],
    "conditions-landing": ["Website Pages", "Conditions Landing"],
    "condition-diabetes": ["Website Pages", "Diabetes"],
    "condition-heart-disease": ["Website Pages", "Heart Disease"],
    "condition-concussion": ["Website Pages", "Concussion"],
    "condition-chronic-fatigue": ["Website Pages", "Chronic Fatigue"],
    "condition-obesity": ["Website Pages", "Obesity"],
    "condition-chronic-pain": ["Website Pages", "Chronic Pain"],
    "condition-toxins": ["Website Pages", "Toxins"],
    "condition-hormone-imbalance": ["Website Pages", "Hormone Imbalance"],
    "services-landing": ["Website Pages", "Services Landing"],
    "service-constitutional-hydrotherapy": ["Website Pages", "Constitutional Hydrotherapy"],
    "service-frequency-specific-microcurrent": ["Website Pages", "Frequency Specific Microcurrent"],
    "service-infrared-sauna-therapy": ["Website Pages", "Infrared Sauna Therapy"],
    "service-hyperbaric-oxygen-therapy": ["Website Pages", "Hyperbaric Oxygen Therapy"],
    "service-iv-nutritional-infusions": ["Website Pages", "IV Nutritional Infusions"],
    "service-liquivida-iv-therapy": ["Website Pages", "Liquivida IV Therapy"],
    "service-reflexology": ["Website Pages", "Reflexology"],
    "service-ozone-therapy": ["Website Pages", "Ozone Therapy"],
    "service-ion-foot-detox": ["Website Pages", "Ion Foot Detox"],
    "service-wellness-classes": ["Website Pages", "Wellness Classes"],
    "service-personalized-wellness-plans": ["Website Pages", "Personalized Wellness Plans"],
    "book-appointment-content": ["Website Pages", "Book Appointment Page Content"],
    "membership-edit": ["Care Operations", "Membership Plan Editor"],
    "membership-preview": ["Care Operations", "Membership Plans Preview"],
    "blog-edit": ["Care Operations", "Blog Post Editor"],
    "blog-preview": ["Care Operations", "Blog Live Preview"],
    "privacy-policy": ["Legal", "Privacy Policy"],
    "terms-conditions": ["Legal", "Terms & Conditions"],
    services: ["Care Operations", "Services"],
    conditions: ["Care Operations", "Conditions"],
    blog: ["Care Operations", "Blog Articles"],
    notifications: ["Care Operations", "Notifications"],
    media: ["Site", "Media Library"],
    "header-footer": ["Website Pages", "Header & Footer"],
    seo: ["Site", "SEO Settings"],
    settings: ["Site", "Site Settings"]
  };

  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function isActive(id) {
    if (PAGE === id) return true;
    if (id === "about" && PAGE === "about") return true;
    if (id === "integrative" && PAGE === "integrative") return true;
    if (id === "naturopathic" && PAGE === "naturopathic") return true;
    if (id === "process" && PAGE === "process") return true;
    if (id === "doctor-jessica" && PAGE === "doctor-jessica") return true;
    if (id === "doctor-sultana" && PAGE === "doctor-sultana") return true;
    if (id === "blog" && (PAGE === "blog-edit" || PAGE === "blog-preview")) return true;
    if (id === "contact" && (PAGE === "contact" || PAGE === "contact-preview")) return true;
    if (id === "inquiries" && (PAGE === "inquiries" || PAGE === "inquiry-detail")) return true;
    if (id === "memberships" && (PAGE === "memberships" || PAGE === "membership-edit" || PAGE === "membership-preview")) return true;
    if (id === "notifications" && PAGE === "notifications") return true;
    if (id === "membership-content" && PAGE === "membership-content") return true;
    if (id === "blog-content" && PAGE === "blog-content") return true;
    if (id === "patients-content" && PAGE === "patients-content") return true;
    if (id === "new-patient-questions-content" && PAGE === "new-patient-questions-content") return true;
    return false;
  }

  function groupOpen(group) {
    return group.match && group.match.indexOf(PAGE) !== -1;
  }

  function buildNav() {
    var html = "";
    NAV.forEach(function (item) {
      if (item.type === "label") {
        html += '<div class="nav-label">' + item.label + "</div>";
        return;
      }
      if (item.type === "group") {
        var open = groupOpen(item);
        html +=
          '<button type="button" class="nav-link-admin' +
          (open ? " active" : "") +
          '" data-toggle-group="' +
          item.id +
          '" aria-expanded="' + (open ? "true" : "false") + '">' +
          '<i class="bi ' +
          item.icon +
          '"></i><span>' +
          item.label +
          '</span><i class="bi bi-chevron-down nav-caret"></i></button>';
        html += '<div class="nav-sub' + (open ? " open" : "") + '" id="' + item.id + '">';
        item.items.forEach(function (sub) {
          if (sub.items && sub.items.length) {
            var subOpen = groupOpen(sub);
            html +=
              '<button type="button" class="nav-sub-group-btn' +
              (subOpen ? " active" : "") +
              '" data-toggle-group="' +
              sub.id +
              '" aria-expanded="' + (subOpen ? "true" : "false") + '">' +
              '<span>' + sub.label + '</span>' +
              '<i class="bi bi-chevron-down nav-caret"></i>' +
              '</button>';
            html += '<div class="nav-nested-sub' + (subOpen ? " open" : "") + '" id="' + sub.id + '">';
            sub.items.forEach(function (child) {
              html +=
                '<a href="' +
                child.href +
                '" class="' +
                (isActive(child.id) ? "active" : "") +
                '">' +
                child.label +
                "</a>";
            });
            html += "</div>";
          } else {
            html +=
              '<a href="' +
              sub.href +
              '" class="' +
              (isActive(sub.id) ? "active" : "") +
              '">' +
              sub.label +
              "</a>";
          }
        });
        html += "</div>";
        return;
      }
      html +=
        '<a class="nav-link-admin' +
        (isActive(item.id) ? " active" : "") +
        '" href="' +
        item.href +
        '"><i class="bi ' +
        item.icon +
        '"></i><span>' +
        item.label +
        "</span></a>";
    });
    return html;
  }

  function injectShell() {
    if (document.body.classList.contains("login-body")) return;

    var sidebar = document.getElementById("sidebar");
    var topbar = document.getElementById("topbar");
    if (!sidebar || !topbar) return;

    sidebar.innerHTML =
      '<button class="sidebar-close-btn" type="button" id="sidebar-close-btn" aria-label="Close menu"><i class="bi bi-x-lg"></i></button>' +
      '<div class="sidebar-brand">' +
      '<a href="' + ROOT + 'index.html" class="sidebar-brand-card" title="Be The Change Admin CMS">' +
      '<img src="' + ROOT + 'assets/uploads/2024/08/LOGO.jpg" alt="Be The Change Health & Wellness Center" width="528" height="140" loading="eager" onerror="if(this.src.indexOf(\'be-the-change-health.vercel.app\')===-1){this.src=\'https://be-the-change-health.vercel.app/assets/uploads/2024/08/LOGO.jpg\';}">' +
      '</a>' +
      '<div class="sidebar-brand-badge sidebar-brand-text">' +
      '<span class="brand-badge-dot"></span>' +
      '<span>ADMIN CMS</span>' +
      '</div>' +
      "</div>" +
      '<nav class="sidebar-nav">' +
      buildNav() +
      "</nav>" +
      '<div class="sidebar-foot">Columbia, MD · Out-of-network practice</div>';

    var title = TITLES[PAGE] || ["Admin", "CMS"];
    topbar.innerHTML =
      '<div class="topbar-left">' +
      '<button class="menu-toggle" type="button" id="menu-toggle" aria-label="Open menu"><i class="bi bi-list"></i></button>' +
      '<div class="page-title-bar"><p class="page-kicker">' +
      title[0] +
      "</p><h1>" +
      title[1] +
      "</h1></div></div>" +
      '<div class="topbar-right">' +
      '<div class="top-search"><i class="bi bi-search"></i><input type="search" placeholder="Search CMS…" id="cms-search"></div>' +
      '<div class="notification-dropdown-wrapper" id="notificationWrapper">' +
      '<button class="icon-btn notification-bell-btn" type="button" id="notificationBellBtn" aria-label="Notifications" aria-expanded="false" title="Notifications">' +
      '<i class="bi bi-bell"></i>' +
      '<span class="notification-badge" id="notificationBadge">3</span>' +
      "</button>" +
      '<div class="notification-dropdown-panel" id="notificationPanel" role="region" aria-labelledby="notificationBellBtn">' +
      '<div class="notification-panel-header">' +
      '<div class="d-flex align-items-center gap-2">' +
      "<h6>Notifications</h6>" +
      '<span class="notification-count-pill" id="notificationCountPill">3 new</span>' +
      "</div>" +
      '<button class="notification-mark-read-btn" type="button" id="markAllReadBtn" title="Mark all as read">Mark all read</button>' +
      "</div>" +
      '<div class="notification-list" id="notificationList">' +
      "</div>" +
      '<div class="notification-panel-footer">' +
      '<a href="' + PAGES + 'notifications/notifications.html" class="notification-view-all">View all notifications <i class="bi bi-arrow-right ms-1"></i></a>' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="user-chip">' +
      '<span class="user-avatar">SA</span>' +
      "<span><strong>Sultana Afrooz</strong><small>Practice Admin</small></span>" +
      '<a class="icon-action" href="' + ROOT + 'login.html" title="Sign out"><i class="bi bi-box-arrow-right"></i></a>' +
      "</div></div>";

    var menuToggle = document.getElementById("menu-toggle");
    if (menuToggle) menuToggle.addEventListener("click", toggleSidebar);

    var closeBtn = document.getElementById("sidebar-close-btn");
    if (closeBtn) closeBtn.addEventListener("click", toggleSidebar);

    bindNotifications();

    // Auto-close mobile sidebar when clicking a direct link
    sidebar.querySelectorAll("a[href]").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth < 992) {
          sidebar.classList.remove("open");
          var backdrop = document.getElementById("sidebar-backdrop");
          if (backdrop) backdrop.classList.remove("show");
        }
      });
    });

    document.querySelectorAll("[data-toggle-group]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        if (e) e.stopPropagation();
        var id = btn.getAttribute("data-toggle-group");
        var sub = document.getElementById(id);
        if (sub) {
          var willOpen = !sub.classList.contains("open");
          sub.classList.toggle("open", willOpen);
          btn.classList.toggle("active", willOpen);
          btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
        }
      });
    });

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (sidebar && sidebar.classList.contains("open")) {
          sidebar.classList.remove("open");
          var backdrop = document.getElementById("sidebar-backdrop");
          if (backdrop) backdrop.classList.remove("show");
        }
      }
    });
  }

  // ==========================================
  // SHARED NOTIFICATIONS SYSTEM (localStorage)
  // ==========================================
  var NOTIF_STORAGE_KEY = "adminNotifications";

  var DEFAULT_NOTIFS = [
    {
      id: "notif-1",
      type: "Appointment",
      title: "New appointment request",
      description: "Elle Adams requested an appointment",
      time: "5 minutes ago",
      timestamp: "2026-09-30T15:03:00.000Z",
      status: "Unread",
      read: false,
      patient: "Elle Adams",
      appointment: "Initial Consultation",
      date: "September 30, 2026",
      appointmentTime: "10:00 AM",
      provider: "Sultana Afrooz, D.O.",
      link: PAGES + "appointments/appointments.html"
    },
    {
      id: "notif-2",
      type: "Appointment",
      title: "Appointment confirmed",
      description: "Marcus Vance's appointment was confirmed",
      time: "20 minutes ago",
      timestamp: "2026-09-30T14:48:00.000Z",
      status: "Unread",
      read: false,
      patient: "Marcus Vance",
      appointment: "Follow-up Consultation",
      date: "September 30, 2026",
      appointmentTime: "11:30 AM",
      provider: "Jessica Needle, N.D.",
      link: PAGES + "appointments/appointments.html"
    },
    {
      id: "notif-3",
      type: "Schedule",
      title: "Schedule conflict",
      description: "Conflict detected in today's schedule",
      time: "1 hour ago",
      timestamp: "2026-09-30T14:00:00.000Z",
      status: "Unread",
      read: false,
      patient: "Dr. Sultana / Dr. Jessica",
      appointment: "Overlapping Treatment Suite 2",
      date: "September 30, 2026",
      appointmentTime: "02:00 PM",
      provider: "Clinic Facility Manager",
      link: PAGES + "appointments/appointments.html"
    },
    {
      id: "notif-4",
      type: "Patient",
      title: "Patient profile updated",
      description: "Sophia Davis updated medical history and insurance info",
      time: "2 hours ago",
      timestamp: "2026-09-30T13:00:00.000Z",
      status: "Read",
      read: true,
      patient: "Sophia Davis",
      appointment: "Annual Wellness Check",
      date: "September 29, 2026",
      appointmentTime: "09:15 AM",
      provider: "Sultana Afrooz, D.O.",
      link: PAGES + "patients/patients-content.html"
    },
    {
      id: "notif-5",
      type: "Appointment",
      title: "Appointment reschedule requested",
      description: "Liam Johnson requested to reschedule visit to Oct 3",
      time: "3 hours ago",
      timestamp: "2026-09-30T12:00:00.000Z",
      status: "Read",
      read: true,
      patient: "Liam Johnson",
      appointment: "Hyperbaric Oxygen Therapy",
      date: "October 03, 2026",
      appointmentTime: "03:00 PM",
      provider: "Jessica Needle, N.D.",
      link: PAGES + "appointments/appointments.html"
    },
    {
      id: "notif-6",
      type: "Patient",
      title: "New patient registration",
      description: "Emily Martinez registered new account via portal",
      time: "5 hours ago",
      timestamp: "2026-09-30T10:00:00.000Z",
      status: "Read",
      read: true,
      patient: "Emily Martinez",
      appointment: "Intake Questionnaire Pending",
      date: "September 28, 2026",
      appointmentTime: "04:30 PM",
      provider: "Sultana Afrooz, D.O.",
      link: PAGES + "patients/patients-content.html"
    },
    {
      id: "notif-7",
      type: "Payment",
      title: "Payment confirmation",
      description: "Payment of $245.00 received for Invoice #INV-8842",
      time: "Yesterday",
      timestamp: "2026-09-29T16:20:00.000Z",
      status: "Read",
      read: true,
      patient: "David Miller",
      appointment: "Constitutional Hydrotherapy",
      date: "September 27, 2026",
      appointmentTime: "01:00 PM",
      provider: "Practice Billing",
      link: PAGES + "appointments/appointments.html"
    },
    {
      id: "notif-8",
      type: "Reminder",
      title: "Appointment reminder",
      description: "Automated SMS/Email reminders sent to 6 patients for tomorrow",
      time: "Yesterday",
      timestamp: "2026-09-29T08:00:00.000Z",
      status: "Read",
      read: true,
      patient: "Multiple Patients (6)",
      appointment: "Daily Clinic Schedule",
      date: "September 27, 2026",
      appointmentTime: "08:00 AM",
      provider: "Automated Clinic Bot",
      link: PAGES + "appointments/appointments.html"
    },
    {
      id: "notif-9",
      type: "System",
      title: "System backup completed",
      description: "Daily encrypted database backup completed successfully (2.4 GB)",
      time: "2 days ago",
      timestamp: "2026-09-28T03:00:00.000Z",
      status: "Read",
      read: true,
      patient: "N/A",
      appointment: "System Maintenance",
      date: "September 26, 2026",
      appointmentTime: "03:00 AM",
      provider: "System Infrastructure",
      link: PAGES + "settings.html"
    },
    {
      id: "notif-10",
      type: "Inquiry",
      title: "New inquiry received",
      description: "General inquiry from Rachel Green regarding Ozone Therapy packages",
      time: "3 days ago",
      timestamp: "2026-09-27T11:45:00.000Z",
      status: "Read",
      read: true,
      patient: "Rachel Green",
      appointment: "Prospective Patient Inquiry",
      date: "September 25, 2026",
      appointmentTime: "11:45 AM",
      provider: "Care Coordinator",
      link: PAGES + "inquiries/inquiries.html"
    },
    {
      id: "notif-11",
      type: "Patient",
      title: "Membership renewal notice",
      description: "James Wilson upgraded to Gold Wellness Membership",
      time: "4 days ago",
      timestamp: "2026-09-26T14:15:00.000Z",
      status: "Read",
      read: true,
      patient: "James Wilson",
      appointment: "Membership Tier Upgrade",
      date: "September 24, 2026",
      appointmentTime: "02:15 PM",
      provider: "Membership Desk",
      link: PAGES + "memberships/memberships.html"
    },
    {
      id: "notif-12",
      type: "Patient",
      title: "Lab results uploaded",
      description: "New comprehensive metabolic panel results ready for review",
      time: "5 days ago",
      timestamp: "2026-09-25T10:30:00.000Z",
      status: "Read",
      read: true,
      patient: "Olivia Bennett",
      appointment: "Lab Review Session",
      date: "September 23, 2026",
      appointmentTime: "10:30 AM",
      provider: "Sultana Afrooz, D.O.",
      link: PAGES + "appointments/appointments.html"
    }
  ];

  window.AdminNotifications = {
    getAll: function () {
      try {
        var raw = localStorage.getItem(NOTIF_STORAGE_KEY);
        if (!raw) {
          localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFS));
          return DEFAULT_NOTIFS.slice();
        }
        var parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFS));
          return DEFAULT_NOTIFS.slice();
        }
        return parsed;
      } catch (e) {
        return DEFAULT_NOTIFS.slice();
      }
    },
    save: function (list) {
      try {
        localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(list));
      } catch (e) {}
      window.dispatchEvent(new CustomEvent("admin-notifications-changed", { detail: { list: list } }));
    },
    getUnreadCount: function () {
      var all = this.getAll();
      return all.filter(function (n) { return !n.read; }).length;
    },
    markAsRead: function (id) {
      var all = this.getAll();
      all.forEach(function (n) {
        if (n.id === id) {
          n.read = true;
          n.status = "Read";
        }
      });
      this.save(all);
    },
    markAsUnread: function (id) {
      var all = this.getAll();
      all.forEach(function (n) {
        if (n.id === id) {
          n.read = false;
          n.status = "Unread";
        }
      });
      this.save(all);
    },
    markAllAsRead: function () {
      var all = this.getAll();
      all.forEach(function (n) {
        n.read = true;
        n.status = "Read";
      });
      this.save(all);
    },
    delete: function (id) {
      var all = this.getAll();
      var filtered = all.filter(function (n) { return n.id !== id; });
      this.save(filtered);
    },
    clearRead: function () {
      var all = this.getAll();
      var remaining = all.filter(function (n) { return !n.read; });
      this.save(remaining);
    },
    resetDefaults: function () {
      this.save(DEFAULT_NOTIFS.slice());
    }
  };

  function getNotifIconInfo(type) {
    switch (type) {
      case "Appointment":
        return { icon: "bi-calendar-check", bgClass: "bg-confirmed" };
      case "Schedule":
        return { icon: "bi-calendar-event", bgClass: "bg-pending" };
      case "System":
        return { icon: "bi-gear", bgClass: "bg-system" };
      case "Patient":
        return { icon: "bi-person", bgClass: "bg-patient" };
      case "Payment":
        return { icon: "bi-credit-card", bgClass: "bg-payment" };
      case "Reminder":
        return { icon: "bi-bell", bgClass: "bg-reminder" };
      case "Inquiry":
        return { icon: "bi-envelope", bgClass: "bg-inquiry" };
      default:
        return { icon: "bi-bell", bgClass: "bg-confirmed" };
    }
  }

  function renderTopbarDropdown() {
    var badge = document.getElementById("notificationBadge");
    var countPill = document.getElementById("notificationCountPill");
    var list = document.getElementById("notificationList");
    if (!list) return;

    var notifs = window.AdminNotifications.getAll();
    var unreadCount = notifs.filter(function (n) { return !n.read; }).length;

    if (badge) {
      if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.classList.remove("hide");
      } else {
        badge.classList.add("hide");
      }
    }

    if (countPill) {
      countPill.textContent = unreadCount + " new";
      if (unreadCount === 0) {
        countPill.style.background = "#eef0f2";
        countPill.style.color = "#666";
      } else {
        countPill.style.background = "";
        countPill.style.color = "";
      }
    }

    if (notifs.length === 0) {
      list.innerHTML =
        '<div class="notification-empty-state">' +
        '<i class="bi bi-bell-slash"></i>' +
        "<h6>No notifications</h6>" +
        "<p>Your inbox is clear.</p>" +
        "</div>";
      return;
    }

    // Show latest preview notifications (first 5)
    var previews = notifs.slice(0, 5);
    var html = "";
    previews.forEach(function (n) {
      var iconInfo = getNotifIconInfo(n.type);
      var unreadClass = n.read ? "" : " unread";
      html +=
        '<a class="notification-item' + unreadClass + '" href="' + (n.link || PAGES + 'notifications/notifications.html') + '" data-notif-id="' + n.id + '">' +
        '<div class="notification-item-icon ' + iconInfo.bgClass + '"><i class="bi ' + iconInfo.icon + '"></i></div>' +
        '<div class="notification-item-content">' +
        '<div class="notification-item-title">' + n.title + '</div>' +
        '<div class="notification-item-desc">' + n.description + '</div>' +
        '<div class="notification-item-time"><i class="bi bi-clock me-1"></i>' + n.time + '</div>' +
        '</div>' +
        '<span class="notification-unread-dot"></span>' +
        '</a>';
    });

    list.innerHTML = html;

    // Clicking an item marks it as read
    list.querySelectorAll(".notification-item").forEach(function (item) {
      item.addEventListener("click", function () {
        var id = item.getAttribute("data-notif-id");
        if (id) {
          window.AdminNotifications.markAsRead(id);
        }
      });
    });
  }

  function bindNotifications() {
    var bellBtn = document.getElementById("notificationBellBtn");
    var panel = document.getElementById("notificationPanel");
    var wrapper = document.getElementById("notificationWrapper");
    var markAllBtn = document.getElementById("markAllReadBtn");

    if (!bellBtn || !panel || !wrapper) return;

    renderTopbarDropdown();

    bellBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var isShowing = panel.classList.contains("show");
      if (isShowing) {
        closeNotifications();
      } else {
        openNotifications();
      }
    });

    if (markAllBtn) {
      markAllBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.AdminNotifications.markAllAsRead();
        if (typeof toast === "function") {
          toast("All notifications marked as read.", "success");
        }
      });
    }

    document.addEventListener("click", function (e) {
      if (!wrapper.contains(e.target)) {
        closeNotifications();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeNotifications();
      }
    });

    window.addEventListener("admin-notifications-changed", function () {
      renderTopbarDropdown();
    });

    window.addEventListener("storage", function (e) {
      if (e.key === NOTIF_STORAGE_KEY) {
        renderTopbarDropdown();
      }
    });

    function openNotifications() {
      renderTopbarDropdown();
      panel.classList.add("show");
      bellBtn.classList.add("active");
      bellBtn.setAttribute("aria-expanded", "true");
    }

    function closeNotifications() {
      panel.classList.remove("show");
      bellBtn.classList.remove("active");
      bellBtn.setAttribute("aria-expanded", "false");
    }
  }

  function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    var backdrop = document.getElementById("sidebar-backdrop");
    if (sidebar) sidebar.classList.toggle("open");
    if (backdrop) backdrop.classList.toggle("show");
  }

  function bindBackdrop() {
    var backdrop = document.getElementById("sidebar-backdrop");
    if (backdrop) {
      backdrop.addEventListener("click", function () {
        var sidebar = document.getElementById("sidebar");
        if (sidebar) sidebar.classList.remove("open");
        backdrop.classList.remove("show");
      });
    }
  }

  function toast(message, type) {
    var stack = document.querySelector(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }
    var node = el(
      '<div class="toast-admin ' +
        (type || "success") +
        '"><i class="bi bi-check-circle-fill"></i><div>' +
        message +
        "</div></div>"
    );
    stack.appendChild(node);
    setTimeout(function () {
      node.remove();
    }, 2800);
  }

  function bindEditors() {
    document.querySelectorAll(".editor-head").forEach(function (head) {
      head.addEventListener("click", function () {
        head.parentElement.classList.toggle("open");
      });
    });
  }

  function bindSaves() {
    document.querySelectorAll("[data-save]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        toast(btn.getAttribute("data-save") || "Changes saved successfully.");
      });
    });
  }

  function bindDeletes() {
    document.querySelectorAll("[data-delete]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var row = btn.closest("tr");
        var label = btn.getAttribute("data-delete") || "this item";
        if (window.confirm("Delete " + label + "? This cannot be undone in the live site until you publish.")) {
          if (row) row.remove();
          toast(label + " removed from the draft list.");
        }
      });
    });
  }

  function bindUploads() {
    document.querySelectorAll(".upload-box input[type=file]").forEach(function (input) {
      input.addEventListener("change", function () {
        var file = input.files && input.files[0];
        if (!file) return;
        var preview = input.parentElement.querySelector(".upload-preview");
        if (preview) {
          preview.src = URL.createObjectURL(file);
          preview.hidden = false;
        }
        toast("Image selected — save the section to apply it.");
      });
    });
  }

  function applyTableFilters(table) {
    if (!table) return;
    var wrap = table.closest(".card-admin, main") || document;
    var search = wrap.querySelector("[data-table-search='" + table.id + "']");
    var q = search ? search.value.toLowerCase() : "";
    var visible = 0;
    table.querySelectorAll("tbody tr").forEach(function (row) {
      var show = !q || row.textContent.toLowerCase().indexOf(q) !== -1;
      wrap.querySelectorAll("[data-filter]").forEach(function (select) {
        var scoped = select.getAttribute("data-filter-table");
        if (scoped && scoped !== table.id) return;
        var val = select.value;
        var key = select.getAttribute("data-filter");
        if (val && row.getAttribute(key) !== val) show = false;
      });
      row.style.display = show ? "" : "none";
      if (show) visible += 1;
    });
    var count = wrap.querySelector("[data-result-count]");
    if (count) count.textContent = String(visible);
  }

  function bindFilters() {
    document.querySelectorAll("table[id]").forEach(applyTableFilters);
    document.querySelectorAll("[data-table-search]").forEach(function (input) {
      input.addEventListener("input", function () {
        applyTableFilters(document.getElementById(input.getAttribute("data-table-search")));
      });
    });
    document.querySelectorAll("[data-filter]").forEach(function (select) {
      select.addEventListener("change", function () {
        var tid = select.getAttribute("data-filter-table");
        if (tid) applyTableFilters(document.getElementById(tid));
        else document.querySelectorAll("table[id]").forEach(applyTableFilters);
      });
    });
  }

  function bindSlug() {
    if (window.BTCBlogStore) return;
    var title = document.getElementById("blog-title");
    var slug = document.getElementById("blog-slug");
    if (!title || !slug) return;
    title.addEventListener("input", function () {
      if (slug.dataset.locked === "1") return;
      slug.value = title.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    });
    slug.addEventListener("input", function () {
      slug.dataset.locked = "1";
    });
  }

  function bindReply() {
    var form = document.getElementById("inquiry-reply-form") || document.getElementById("reply-form");
    var tmplSelect = document.getElementById("reply-template-select");
    var textarea = document.getElementById("reply-message-textarea") || (form && form.querySelector("textarea"));
    var helper = document.getElementById("reply-channel-helper");
    var channelBtns = document.querySelectorAll(".channel-btn");

    var templates = {
      intake: "Hello Nas, thank you for reaching out to Be The Change Health & Wellness Center. We would love to help you schedule a new patient consultation with Dr. Sultana Afrooz, D.O. or Dr. Jessica Needle, N.D. Our new patient coordinator is available to answer any questions at 301-970-9724. You can also request your appointment online directly.",
      insurance: "Thank you for contacting us. Please note that our office is an out-of-network practice. While we do not bill insurance directly, we provide a detailed Superbill containing all diagnostic and treatment codes that you may submit to your insurer for potential reimbursement. Let us know if you would like more details.",
      hours: "Our office is located at 8808 Centre Park Drive, Suite 301, Columbia, MD 21045. Office hours are Monday through Friday, 10:00 AM to 5:00 PM. We have ample complimentary patient parking right outside the entrance. Telehealth appointments are also available.",
      telehealth: "We are pleased to offer Telehealth consultations for patients residing in Maryland. Telehealth visits are conducted securely online, allowing you to discuss your health goals and lab results comfortably from home.",
      services: "Thank you for your inquiry regarding our wellness therapies. We offer Frequency Specific Microcurrent, Hyperbaric Oxygen Therapy, Infrared Sauna, and IV Nutritional Infusions. We can discuss which therapies align best with your personalized wellness plan."
    };

    if (tmplSelect && textarea) {
      tmplSelect.addEventListener("change", function () {
        var key = tmplSelect.value;
        if (templates[key]) {
          textarea.value = templates[key];
          textarea.focus();
          toast("Template inserted into reply composer.");
        }
      });
    }

    var activeChannel = "Email";
    channelBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        channelBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var ch = btn.getAttribute("data-channel");
        if (ch === "sms") {
          activeChannel = "SMS Text";
          if (helper) helper.innerHTML = '<i class="bi bi-chat-dots"></i> Sending SMS text message via clinic primary line: <strong>301-970-9724</strong>.';
        } else {
          activeChannel = "Email";
          if (helper) helper.innerHTML = '<i class="bi bi-info-circle"></i> Replying via Email will send directly to the patient\'s submitted address.';
        }
      });
    });

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var box = textarea || form.querySelector("textarea");
        var text = box ? box.value.trim() : "";
        if (!text) {
          toast("Please enter a message before sending.", "warn");
          return;
        }
        var thread = document.getElementById("inquiry-conversation-thread") || document.getElementById("inquiry-thread");
        if (thread) {
          var bubble = el(
            '<div class="inquiry-bubble outbound">' +
              '<div class="inquiry-bubble-header">' +
                '<strong><i class="bi bi-person-badge text-teal me-1"></i> Sultana Afrooz, D.O. <span class="badge-admin badge-replied ms-2">Replied via ' + activeChannel + '</span></strong>' +
                '<small class="text-muted"><i class="bi bi-clock me-1"></i> Just now</small>' +
              '</div>' +
              '<div class="inquiry-bubble-body"></div>' +
            '</div>'
          );
          bubble.querySelector(".inquiry-bubble-body").textContent = text;
          thread.appendChild(bubble);
          thread.scrollTop = thread.scrollHeight;
        }

        if (box) box.value = "";
        var badge = document.getElementById("inquiry-top-status") || document.getElementById("inquiry-status-badge");
        if (badge) {
          badge.className = "badge-admin badge-replied";
          badge.textContent = "REPLIED";
        }
        var statusSelect = document.getElementById("inquiry-status-select") || document.getElementById("inquiry-status");
        if (statusSelect) statusSelect.value = "replied";
        toast("Reply sent via " + activeChannel + ". Status updated to Replied.");
      });
    }

    var noteForm = document.getElementById("add-note-form");
    if (noteForm) {
      noteForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = document.getElementById("internal-note-input");
        var val = input ? input.value.trim() : "";
        if (!val) return;
        var thread = document.getElementById("inquiry-conversation-thread");
        if (thread) {
          var noteBubble = el(
            '<div class="inquiry-bubble internal-note">' +
              '<div class="inquiry-bubble-header">' +
                '<strong><i class="bi bi-lock-fill text-warning me-1"></i> Internal Staff Note · Front Desk Coordinator</strong>' +
                '<small class="text-muted"><i class="bi bi-clock me-1"></i> Just now</small>' +
              '</div>' +
              '<div class="inquiry-bubble-body text-dark"></div>' +
            '</div>'
          );
          noteBubble.querySelector(".inquiry-bubble-body").textContent = val;
          thread.appendChild(noteBubble);
          thread.scrollTop = thread.scrollHeight;
        }
        if (input) input.value = "";
        toast("Private internal note added.");
      });
    }
  }

  function bindStatus() {
    var status = document.getElementById("inquiry-status-select") || document.getElementById("inquiry-status");
    var priority = document.getElementById("inquiry-priority-select");
    var archiveBtn = document.getElementById("btn-inquiry-archive");
    var deleteBtn = document.getElementById("btn-inquiry-delete");

    var map = {
      new: ["badge-admin badge-new", "NEW"],
      open: ["badge-admin badge-open", "OPEN"],
      replied: ["badge-admin badge-replied", "REPLIED"],
      closed: ["badge-admin badge-closed", "CLOSED"],
      archived: ["badge-admin badge-archived", "ARCHIVED"]
    };

    var priorityMap = {
      urgent: ["badge-admin badge-urgent", "URGENT"],
      high: ["badge-admin badge-high", "HIGH"],
      normal: ["badge-admin badge-normal", "NORMAL"],
      low: ["badge-admin badge-low", "LOW"]
    };

    if (status) {
      status.addEventListener("change", function () {
        var badge = document.getElementById("inquiry-top-status") || document.getElementById("inquiry-status-badge");
        var next = map[status.value] || map.open;
        if (badge) {
          badge.className = next[0];
          badge.textContent = next[1];
        }
        toast("Inquiry status updated to " + next[1] + ".");
      });
    }

    if (priority) {
      priority.addEventListener("change", function () {
        var badge = document.getElementById("inquiry-top-priority");
        var next = priorityMap[priority.value] || priorityMap.normal;
        if (badge) {
          badge.className = next[0];
          badge.textContent = next[1];
        }
        toast("Inquiry triage priority set to " + next[1] + ".");
      });
    }

    if (archiveBtn) {
      archiveBtn.addEventListener("click", function () {
        var badge = document.getElementById("inquiry-top-status");
        if (status) {
          if (status.value === "archived") {
            status.value = "open";
            if (badge) { badge.className = map.open[0]; badge.textContent = map.open[1]; }
            archiveBtn.innerHTML = '<i class="bi bi-archive me-1"></i> Archive Inquiry';
            toast("Inquiry unarchived and restored to Open.");
          } else {
            status.value = "archived";
            if (badge) { badge.className = map.archived[0]; badge.textContent = map.archived[1]; }
            archiveBtn.innerHTML = '<i class="bi bi-arrow-counterclockwise me-1"></i> Unarchive Inquiry';
            toast("Inquiry moved to archive.");
          }
        }
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", function () {
        if (window.confirm("Are you sure you want to delete this inquiry from Nas Moha? This action cannot be undone.")) {
          toast("Inquiry deleted from CMS.");
          setTimeout(function () {
            window.location.href = "inquiries.html";
          }, 800);
        }
      });
    }
  }

  function bindDeviceToggle() {
    var frame = document.getElementById("preview-screen-frame");
    if (!frame) return;
    document.querySelectorAll(".device-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".device-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var vp = btn.getAttribute("data-viewport");
        frame.classList.remove("tablet", "mobile");
        if (vp === "tablet") frame.classList.add("tablet");
        if (vp === "mobile") frame.classList.add("mobile");
      });
    });
  }

  function bindCopyButtons() {
    document.querySelectorAll(".copy-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var txt = btn.getAttribute("data-copy") || "";
        if (navigator.clipboard && txt) {
          navigator.clipboard.writeText(txt).then(function () {
            toast("Copied to clipboard: " + txt);
          }).catch(function () {
            toast("Copied: " + txt);
          });
        } else {
          toast("Copied: " + txt);
        }
      });
    });
  }

  function bindFilterPills() {
    var tabs = document.querySelectorAll(".filter-pill-tab");
    if (!tabs.length) return;
    var table = document.getElementById("inq-table");
    if (!table) return;

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
        var filterVal = tab.getAttribute("data-filter-status");
        var visibleCount = 0;
        table.querySelectorAll("tbody tr").forEach(function (row) {
          var rowStatus = row.getAttribute("data-status");
          if (!filterVal || rowStatus === filterVal) {
            row.style.display = "";
            visibleCount++;
          } else {
            row.style.display = "none";
          }
        });
        var countEl = document.getElementById("inquiry-visible-count");
        if (countEl) countEl.textContent = String(visibleCount);
      });
    });
  }

  function bindNewArticle() {
    if (window.BTCBlogStore) return;
    if (PAGE !== "blog-edit" || (location.search || "").indexOf("new=1") === -1) return;
    ["blog-title", "blog-slug", "blog-excerpt", "blog-body", "blog-seo-title", "blog-seo-desc", "blog-tags"].forEach(function (id) {
      var eln = document.getElementById(id);
      if (eln) eln.value = "";
    });
    var status = document.getElementById("blog-status");
    if (status) status.value = "draft";
  }

  function bindLogin() {
    var form = document.getElementById("login-form");
    if (!form) return;

    var toggleBtn = document.getElementById("password-toggle");
    var passInput = document.getElementById("password");
    var toggleIcon = document.getElementById("password-toggle-icon");
    if (toggleBtn && passInput) {
      toggleBtn.addEventListener("click", function (e) {
        e.preventDefault();
        var isPassword = passInput.getAttribute("type") === "password";
        passInput.setAttribute("type", isPassword ? "text" : "password");
        if (toggleIcon) {
          if (isPassword) {
            toggleIcon.className = "bi bi-eye-slash";
            toggleBtn.setAttribute("aria-label", "Hide password");
          } else {
            toggleIcon.className = "bi bi-eye";
            toggleBtn.setAttribute("aria-label", "Show password");
          }
        }
        passInput.focus();
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.email ? form.email.value.trim() : "";
      var password = form.password ? form.password.value : "";
      var err = document.getElementById("login-error");
      if (!email || !password) {
        if (err) {
          err.hidden = false;
          err.textContent = "Enter your email and password.";
        }
        return;
      }
      window.location.href = "index.html";
    });
  }

  /**
   * GLOBAL ADMIN FORM CONTROL DESIGN SYSTEM
   * Universal Custom Select & Calendar Engine across entire Admin CMS
   */
  var CAL_MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  var CAL_MONTH_SHORT = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  function closeAllCustomSelects() {
    document.querySelectorAll(".custom-select-panel").forEach(function (panel) {
      panel.style.display = "none";
    });
    document.querySelectorAll(".custom-select-trigger").forEach(function (trig) {
      trig.classList.remove("active");
      trig.setAttribute("aria-expanded", "false");
    });
    document.querySelectorAll(".custom-select-wrapper").forEach(function (wrapper) {
      wrapper.classList.remove("open");
    });
  }

  function closeAllGlobalCalendars() {
    document.querySelectorAll(".calendar-popover").forEach(function (pop) {
      pop.style.display = "none";
    });
    document.querySelectorAll(".calendar-picker-wrapper").forEach(function (wrapper) {
      wrapper.classList.remove("open");
    });
  }

  function initGlobalCustomSelects(rootEl) {
    var scope = rootEl || document;
    var wrappers = scope.querySelectorAll(".custom-select-wrapper");

    wrappers.forEach(function (wrapper) {
      if (wrapper.getAttribute("data-cs-init") === "true") return;
      wrapper.setAttribute("data-cs-init", "true");

      var trigger = wrapper.querySelector(".custom-select-trigger");
      var panel = wrapper.querySelector(".custom-select-panel");
      var hiddenInput = wrapper.querySelector("input[type=hidden]") || wrapper.querySelector("select");
      var primaryText = wrapper.querySelector(".custom-select-primary-text");
      var secondaryText = wrapper.querySelector(".custom-select-secondary-text");
      var searchInput = wrapper.querySelector(".custom-select-search-box input");

      if (!trigger || !panel) return;

      // Toggle panel open/close
      trigger.addEventListener("click", function (e) {
        e.stopPropagation();
        var isOpen = panel.style.display === "block";

        closeAllCustomSelects();
        closeAllGlobalCalendars();

        if (!isOpen) {
          panel.style.display = "block";
          wrapper.classList.add("open");
          trigger.classList.add("active");
          trigger.setAttribute("aria-expanded", "true");

          if (searchInput) {
            setTimeout(function () { searchInput.focus(); }, 50);
          }
        }
      });

      // Prevent clicks inside panel from closing dropdown unexpectedly
      panel.addEventListener("click", function (e) {
        if (!e.target.closest(".custom-select-option")) {
          e.stopPropagation();
        }
      });

      // Keyboard support
      trigger.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          trigger.click();
        } else if (e.key === "Escape") {
          closeAllCustomSelects();
        } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          if (panel.style.display !== "block") {
            trigger.click();
            return;
          }
          var options = Array.from(panel.querySelectorAll(".custom-select-option:not([style*='display: none'])"));
          if (!options.length) return;
          var curIndex = options.findIndex(function (opt) { return opt.classList.contains("selected"); });
          var nextIndex = e.key === "ArrowDown" ? curIndex + 1 : curIndex - 1;
          if (nextIndex >= 0 && nextIndex < options.length) {
            options[nextIndex].click();
          }
        }
      });

      // Search filtering inside panel
      if (searchInput) {
        searchInput.addEventListener("input", function (e) {
          var q = (e.target.value || "").toLowerCase().trim();
          panel.querySelectorAll(".custom-select-option").forEach(function (opt) {
            var txt = (opt.textContent || "").toLowerCase();
            opt.style.display = (!q || txt.indexOf(q) !== -1) ? "" : "none";
          });
        });
        searchInput.addEventListener("click", function (e) {
          e.stopPropagation();
        });
        searchInput.addEventListener("keydown", function (e) {
          e.stopPropagation();
          if (e.key === "Escape") {
            closeAllCustomSelects();
            trigger.focus();
          }
        });
      }

      // Option click binding
      panel.querySelectorAll(".custom-select-option").forEach(function (opt) {
        opt.addEventListener("click", function (e) {
          e.stopPropagation();
          var val = opt.getAttribute("data-value");
          var prim = opt.getAttribute("data-primary") || (opt.querySelector(".option-primary") ? opt.querySelector(".option-primary").textContent.trim() : opt.textContent.trim());
          var sec = opt.getAttribute("data-secondary") || (opt.querySelector(".option-secondary") ? opt.querySelector(".option-secondary").textContent.trim() : "");
          var chip = opt.getAttribute("data-chip");
          var iconClass = opt.getAttribute("data-icon");

          if (hiddenInput) {
            hiddenInput.value = val;
            hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
            hiddenInput.dispatchEvent(new Event("input", { bubbles: true }));
          }

          if (primaryText) primaryText.textContent = prim;
          if (secondaryText) {
            secondaryText.textContent = sec;
            secondaryText.style.display = sec ? "" : "none";
          }

          var chipEl = wrapper.querySelector(".provider-avatar-chip");
          if (chipEl && chip) {
            chipEl.textContent = chip;
            chipEl.className = chip === "JN" ? "provider-avatar-chip chip-teal" : "provider-avatar-chip";
          }

          var iconEl = wrapper.querySelector(".select-leading-icon");
          if (iconEl && iconClass) {
            var fullIcon = iconClass.indexOf("bi-") === -1 ? ("bi bi-" + iconClass) : ("bi " + iconClass);
            iconEl.className = fullIcon + " select-leading-icon";
          }

          panel.querySelectorAll(".custom-select-option").forEach(function (o) {
            o.classList.remove("selected");
            o.setAttribute("aria-selected", "false");
          });
          opt.classList.add("selected");
          opt.setAttribute("aria-selected", "true");

          panel.style.display = "none";
          wrapper.classList.remove("open");
          trigger.classList.remove("active");
          trigger.setAttribute("aria-expanded", "false");
          trigger.focus();

          if (window.toast && !wrapper.classList.contains("no-toast") && !wrapper.closest(".table-toolbar") && !wrapper.hasAttribute("data-no-toast")) {
            window.toast("Selected: " + prim);
          }
        });
      });
    });
  }

  function initGlobalDatePickers(rootEl) {
    var scope = rootEl || document;
    var wrappers = scope.querySelectorAll(".calendar-picker-wrapper");

    wrappers.forEach(function (wrapper) {
      if (wrapper.getAttribute("data-cal-init") === "true") return;
      wrapper.setAttribute("data-cal-init", "true");

      var displayInput = wrapper.querySelector(".calendar-input-trigger");
      var toggleBtn = wrapper.querySelector("button[id*='btnToggle'], button[id*='toggle'], button[aria-label*='Toggle']");
      var iconAddons = wrapper.querySelectorAll(".input-group-text");
      var popover = wrapper.querySelector(".calendar-popover");
      var hiddenInput = wrapper.querySelector("input[type=hidden]") || wrapper.querySelector("input[type=date]");
      var isRange = wrapper.getAttribute("data-range") === "true";

      if (!popover) return;

      var now = new Date();
      var calState = {
        year: now.getFullYear(),
        month: now.getMonth(),
        todayYear: now.getFullYear(),
        todayMonth: now.getMonth(),
        todayDay: now.getDate(),
        selectedYear: now.getFullYear(),
        selectedMonth: now.getMonth(),
        selectedDay: now.getDate(),
        rangeStart: null,
        rangeEnd: null
      };

      function syncFromHiddenInput() {
        if (hiddenInput && hiddenInput.value && !isRange) {
          var val = hiddenInput.value.trim();
          var parts = val.split("-");
          if (parts.length === 3) {
            var y = parseInt(parts[0], 10);
            var m = parseInt(parts[1], 10) - 1;
            var d = parseInt(parts[2], 10);
            if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
              calState.year = y;
              calState.month = m;
              calState.selectedYear = y;
              calState.selectedMonth = m;
              calState.selectedDay = d;
            }
          }
        }
      }

      syncFromHiddenInput();
      wrapper.syncFromHiddenInput = syncFromHiddenInput;
      wrapper.renderCalendar = renderCalendar;

      function formatReadable(y, m, d) {
        if (!y || m === null || !d) return "Select date...";
        return CAL_MONTH_SHORT[m] + " " + (d < 10 ? "0" + d : d) + ", " + y;
      }

      function formatISO(y, m, d) {
        if (!y || m === null || !d) return "";
        var mm = (m + 1) < 10 ? "0" + (m + 1) : (m + 1);
        var dd = d < 10 ? "0" + d : d;
        return y + "-" + mm + "-" + dd;
      }

      function renderCalendar() {
        var grid = popover.querySelector(".calendar-days-grid");
        var title = popover.querySelector(".calendar-month-year");
        var helper = popover.querySelector(".calendar-footer small, .calendar-footer span");
        if (!grid || !title) return;

        title.textContent = CAL_MONTH_NAMES[calState.month] + " " + calState.year;

        if (helper) {
          if (isRange) {
            if (calState.rangeStart && calState.rangeEnd) {
              helper.textContent = formatReadable(calState.rangeStart.year, calState.rangeStart.month, calState.rangeStart.day) + " – " + formatReadable(calState.rangeEnd.year, calState.rangeEnd.month, calState.rangeEnd.day);
            } else if (calState.rangeStart) {
              helper.textContent = "Choose end date...";
            } else {
              helper.textContent = "Select date range";
            }
          } else {
            if (calState.selectedDay) {
              helper.textContent = CAL_MONTH_SHORT[calState.selectedMonth] + " " + (calState.selectedDay < 10 ? "0" + calState.selectedDay : calState.selectedDay) + " selected";
            } else {
              helper.textContent = "No date chosen";
            }
          }
        }

        var firstDayIndex = new Date(calState.year, calState.month, 1).getDay();
        var daysInMonth = new Date(calState.year, calState.month + 1, 0).getDate();
        var prevMonthDays = new Date(calState.year, calState.month, 0).getDate();

        var html = "";

        // Prev month padding
        for (var p = firstDayIndex - 1; p >= 0; p--) {
          var prevDayNum = prevMonthDays - p;
          html += '<div class="calendar-day other-month disabled">' + prevDayNum + '</div>';
        }

        // Current month
        for (var day = 1; day <= daysInMonth; day++) {
          var isSelected = (
            !isRange &&
            calState.selectedYear === calState.year &&
            calState.selectedMonth === calState.month &&
            calState.selectedDay === day
          );
          var isToday = (
            calState.todayYear === calState.year &&
            calState.todayMonth === calState.month &&
            calState.todayDay === day
          );

          var classes = ["calendar-day"];
          if (isSelected) classes.push("selected");
          if (isToday) classes.push("today");

          if (isRange && calState.rangeStart) {
            var curDate = new Date(calState.year, calState.month, day).getTime();
            var startDate = new Date(calState.rangeStart.year, calState.rangeStart.month, calState.rangeStart.day).getTime();
            if (curDate === startDate) classes.push("range-start");
            if (calState.rangeEnd) {
              var endDate = new Date(calState.rangeEnd.year, calState.rangeEnd.month, calState.rangeEnd.day).getTime();
              if (curDate === endDate) classes.push("range-end");
              if (curDate > startDate && curDate < endDate) classes.push("in-range");
            }
          }

          html += '<div class="' + classes.join(" ") + '" data-cal-day="' + day + '" role="gridcell" tabindex="0">' + day + '</div>';
        }

        var totalCells = firstDayIndex + daysInMonth;
        var remainingCells = totalCells > 35 ? (42 - totalCells) : (35 - totalCells);
        for (var n = 1; n <= remainingCells; n++) {
          html += '<div class="calendar-day other-month disabled">' + n + '</div>';
        }

        grid.innerHTML = html;

        grid.querySelectorAll("[data-cal-day]").forEach(function (cell) {
          cell.addEventListener("click", function () {
            var chosenDay = parseInt(cell.getAttribute("data-cal-day"), 10);

            if (isRange) {
              if (!calState.rangeStart || (calState.rangeStart && calState.rangeEnd)) {
                calState.rangeStart = { year: calState.year, month: calState.month, day: chosenDay };
                calState.rangeEnd = null;
                renderCalendar();
              } else {
                var sDate = new Date(calState.rangeStart.year, calState.rangeStart.month, calState.rangeStart.day).getTime();
                var eDate = new Date(calState.year, calState.month, chosenDay).getTime();
                if (eDate < sDate) {
                  calState.rangeEnd = calState.rangeStart;
                  calState.rangeStart = { year: calState.year, month: calState.month, day: chosenDay };
                } else {
                  calState.rangeEnd = { year: calState.year, month: calState.month, day: chosenDay };
                }
                var rangeVal = formatReadable(calState.rangeStart.year, calState.rangeStart.month, calState.rangeStart.day) + " – " + formatReadable(calState.rangeEnd.year, calState.rangeEnd.month, calState.rangeEnd.day);
                var isoVal = formatISO(calState.rangeStart.year, calState.rangeStart.month, calState.rangeStart.day) + " to " + formatISO(calState.rangeEnd.year, calState.rangeEnd.month, calState.rangeEnd.day);
                if (displayInput) displayInput.value = rangeVal;
                if (hiddenInput) {
                  hiddenInput.value = isoVal;
                  hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
                  hiddenInput.dispatchEvent(new Event("input", { bubbles: true }));
                }
                renderCalendar();
                setTimeout(function () {
                  popover.style.display = "none";
                  wrapper.classList.remove("open");
                }, 140);
                if (window.toast) {
                  window.toast("Date range: " + rangeVal);
                }
              }
            } else {
              calState.selectedYear = calState.year;
              calState.selectedMonth = calState.month;
              calState.selectedDay = chosenDay;

              var isoVal = formatISO(calState.year, calState.month, chosenDay);
              var readableVal = formatReadable(calState.year, calState.month, chosenDay);

              if (displayInput) displayInput.value = readableVal;
              if (hiddenInput) {
                hiddenInput.value = isoVal;
                hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
                hiddenInput.dispatchEvent(new Event("input", { bubbles: true }));
              }

              renderCalendar();
              setTimeout(function () {
                popover.style.display = "none";
                wrapper.classList.remove("open");
              }, 140);

              if (window.toast && !wrapper.classList.contains("no-toast") && !wrapper.closest(".table-toolbar") && !wrapper.hasAttribute("data-no-toast")) {
                window.toast("Selected date: " + readableVal);
              }
            }
          });
        });
      }

      function togglePopover(e) {
        if (e) e.stopPropagation();
        var isHidden = popover.style.display === "none" || !popover.style.display;
        closeAllCustomSelects();
        closeAllGlobalCalendars();
        if (isHidden) {
          syncFromHiddenInput();
          popover.style.display = "block";
          wrapper.classList.add("open");
          renderCalendar();
        } else {
          popover.style.display = "none";
          wrapper.classList.remove("open");
        }
      }

      if (displayInput) displayInput.addEventListener("click", togglePopover);
      if (toggleBtn) toggleBtn.addEventListener("click", togglePopover);
      iconAddons.forEach(function (addon) {
        addon.style.cursor = "pointer";
        addon.addEventListener("click", togglePopover);
      });

      var prevBtn = popover.querySelector(".calendar-nav-btn:first-child, [id*='Prev']");
      var nextBtn = popover.querySelector(".calendar-nav-btn:last-child, [id*='Next']");
      var todayBtn = popover.querySelector("[id*='Today'], .calendar-footer .btn-link.text-teal");
      var clearBtn = popover.querySelector("[id*='Clear'], .calendar-footer .btn-link.text-muted");

      if (prevBtn) {
        prevBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          calState.month--;
          if (calState.month < 0) {
            calState.month = 11;
            calState.year--;
          }
          renderCalendar();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          calState.month++;
          if (calState.month > 11) {
            calState.month = 0;
            calState.year++;
          }
          renderCalendar();
        });
      }

      if (todayBtn) {
        todayBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          calState.year = calState.todayYear;
          calState.month = calState.todayMonth;
          calState.selectedYear = calState.todayYear;
          calState.selectedMonth = calState.todayMonth;
          calState.selectedDay = calState.todayDay;
          if (isRange) {
            calState.rangeStart = { year: calState.todayYear, month: calState.todayMonth, day: calState.todayDay };
            calState.rangeEnd = { year: calState.todayYear, month: calState.todayMonth, day: calState.todayDay };
          }
          var isoVal = formatISO(calState.todayYear, calState.todayMonth, calState.todayDay);
          var readableVal = formatReadable(calState.todayYear, calState.todayMonth, calState.todayDay);
          if (displayInput) displayInput.value = isRange ? readableVal + " – " + readableVal : readableVal;
          if (hiddenInput) {
            hiddenInput.value = isoVal;
            hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
            hiddenInput.dispatchEvent(new Event("input", { bubbles: true }));
          }
          renderCalendar();
          setTimeout(function () {
            popover.style.display = "none";
            wrapper.classList.remove("open");
          }, 140);
          if (window.toast && !wrapper.classList.contains("no-toast") && !wrapper.closest(".table-toolbar") && !wrapper.hasAttribute("data-no-toast")) {
            window.toast("Date set to Today (" + readableVal + ")");
          }
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          calState.selectedYear = null;
          calState.selectedMonth = null;
          calState.selectedDay = null;
          calState.rangeStart = null;
          calState.rangeEnd = null;
          if (displayInput) displayInput.value = isRange ? "" : "Select date...";
          if (hiddenInput) {
            hiddenInput.value = "";
            hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
            hiddenInput.dispatchEvent(new Event("input", { bubbles: true }));
          }
          renderCalendar();
          if (window.toast && !wrapper.classList.contains("no-toast") && !wrapper.closest(".table-toolbar") && !wrapper.hasAttribute("data-no-toast")) {
            window.toast("Date cleared");
          }
        });
      }

      popover.addEventListener("click", function (e) {
        e.stopPropagation();
      });

      renderCalendar();
    });
  }

  // ============================================================
  // CMS IMAGE SELECTOR & MEDIA GALLERY ENGINE
  // ============================================================

  var BTC_MEDIA_CATALOG = [
    // Logos & Branding
    { name: "LOGO.jpg", path: "assets/uploads/2024/08/LOGO.jpg", category: "Logos & Branding", tag: "Header Logo" },
    { name: "logo.png", path: "assets/uploads/2024/08/logo.png", category: "Logos & Branding", tag: "Footer Logo" },
    { name: "mobileLOGO.jpg", path: "assets/uploads/2025/02/mobileLOGO.jpg", category: "Logos & Branding", tag: "Mobile Nav" },
    { name: "fav.jpg", path: "assets/uploads/2025/02/fav.jpg", category: "Logos & Branding", tag: "Favicon" },
    { name: "wline.png", path: "assets/uploads/2024/08/wline.png", category: "Logos & Branding", tag: "Wave Divider" },

    // Hero & Banners
    { name: "home.jpg", path: "assets/uploads/2025/06/home.jpg", category: "Hero & Banners", tag: "Homepage Hero" },
    { name: "approach.jpg", path: "assets/uploads/2024/08/approach.jpg", category: "Hero & Banners", tag: "About Practice" },
    { name: "WeightLoss-Updated-banner-September-2022-11024_1.jpg", path: "assets/uploads/2025/02/WeightLoss-Updated-banner-September-2022-11024_1.jpg", category: "Hero & Banners", tag: "Wellness Classes" },
    { name: "bg1.jpg", path: "assets/uploads/2025/02/bg1.jpg", category: "Hero & Banners", tag: "Background Pattern" },

    // Doctors & Team
    { name: "sa.jpg", path: "assets/uploads/2024/08/sa.jpg", category: "Doctors & Team", tag: "Dr. Sultana Afrooz" },
    { name: "Sultana-Afrooz-pd6ddd2kete2du2tyy24v5o7z1bhnurc6jbos2s6lk.png", path: "assets/uploads/2024/10/Sultana-Afrooz-pd6ddd2kete2du2tyy24v5o7z1bhnurc6jbos2s6lk.png", category: "Doctors & Team", tag: "Dr. Sultana Bio" },
    { name: "jn-5.jpg", path: "assets/uploads/2025/02/jn-5.jpg", category: "Doctors & Team", tag: "Dr. Jessica Needle" },
    { name: "jessica.jpg", path: "assets/uploads/2025/02/jessica.jpg", category: "Doctors & Team", tag: "Dr. Jessica Profile" },
    { name: "IMG_4692-1.jpg", path: "assets/uploads/2025/02/IMG_4692-1.jpg", category: "Doctors & Team", tag: "Clinic Team" },

    // Services & Therapies
    { name: "IV.jpg", path: "assets/uploads/2024/08/IV.jpg", category: "Services & Therapies", tag: "IV Nutritional Infusions" },
    { name: "OX.jpg", path: "assets/uploads/2024/08/OX.jpg", category: "Services & Therapies", tag: "Hyperbaric Oxygen" },
    { name: "SAUNA.jpg", path: "assets/uploads/2024/08/SAUNA.jpg", category: "Services & Therapies", tag: "Infrared Sauna" },
    { name: "DETOX.jpg", path: "assets/uploads/2024/08/DETOX.jpg", category: "Services & Therapies", tag: "Ion Foot Detox" },
    { name: "Reflexology.webp", path: "assets/uploads/2025/02/Reflexology.webp", category: "Services & Therapies", tag: "Reflexology Therapy" },
    { name: "Ion-Foot-Detox1-2.jpeg", path: "assets/uploads/2025/02/Ion-Foot-Detox1-2.jpeg", category: "Services & Therapies", tag: "Detox Basin" },
    { name: "Ozone-Sauna-Health-Benefits.jpg", path: "assets/uploads/2025/02/Ozone-Sauna-Health-Benefits.jpg", category: "Services & Therapies", tag: "Ozone Sauna" },
    { name: "ozone-iv-therapy-phoenix-arizona-naturopathic-doctor.jpeg", path: "assets/uploads/2025/02/ozone-iv-therapy-phoenix-arizona-naturopathic-doctor.jpeg", category: "Services & Therapies", tag: "Ozone Therapy" },
    { name: "What-is-Microcurrent-1024x683-1.jpg", path: "assets/uploads/2024/08/What-is-Microcurrent-1024x683-1.jpg", category: "Services & Therapies", tag: "Microcurrent Banner" },
    { name: "Frequency-Specific-Microcurrent-treatment-cut.jpg", path: "assets/uploads/2024/08/Frequency-Specific-Microcurrent-treatment-cut.jpg", category: "Services & Therapies", tag: "FSM Treatment" },
    { name: "HYPERBARIC-OXYGEN-THERAPY-1024x683-1.jpg", path: "assets/uploads/2024/08/HYPERBARIC-OXYGEN-THERAPY-1024x683-1.jpg", category: "Services & Therapies", tag: "HBOT Chamber" },
    { name: "Redlight-Therapy-1024x683-1.jpg", path: "assets/uploads/2024/08/Redlight-Therapy-1024x683-1.jpg", category: "Services & Therapies", tag: "Red Light Panel" },
    { name: "Sauna-966x1024-1.webp", path: "assets/uploads/2024/08/Sauna-966x1024-1.webp", category: "Services & Therapies", tag: "Full Spectrum Sauna" },
    { name: "Sauna_RedLight2_01-1187x1536-1.jpg", path: "assets/uploads/2025/02/Sauna_RedLight2_01-1187x1536-1.jpg", category: "Services & Therapies", tag: "Sauna Interior" },
    { name: "Sauna_RedLight2_02-1187x1536-1.jpg", path: "assets/uploads/2025/02/Sauna_RedLight2_02-1187x1536-1.jpg", category: "Services & Therapies", tag: "Sauna Detail" },
    { name: "ct.jpg", path: "assets/uploads/2024/10/ct.jpg", category: "Services & Therapies", tag: "Hydrotherapy" },
    { name: "freq.jpg", path: "assets/uploads/2024/10/freq.jpg", category: "Services & Therapies", tag: "FSM Unit" },
    { name: "hh.jpg", path: "assets/uploads/2024/10/hh.jpg", category: "Services & Therapies", tag: "Integrative Health" },
    { name: "o2.jpg", path: "assets/uploads/2024/10/o2.jpg", category: "Services & Therapies", tag: "Oxygen Therapy" },
    { name: "bhrt.jpg", path: "assets/uploads/2024/08/bhrt.jpg", category: "Services & Therapies", tag: "BHRT Therapy" },
    { name: "The-Liquilift.png", path: "assets/uploads/2024/10/The-Liquilift.png", category: "Services & Therapies", tag: "Liquivida Liquilift" },
    { name: "The-Original-Myers-Cocktail.png", path: "assets/uploads/2024/10/The-Original-Myers-Cocktail.png", category: "Services & Therapies", tag: "Myers Cocktail" },
    { name: "Myers-IV.png", path: "assets/uploads/2024/10/Myers-IV.png", category: "Services & Therapies", tag: "Myers Infusion" },
    { name: "The-Executive.png", path: "assets/uploads/2024/10/The-Executive.png", category: "Services & Therapies", tag: "Executive IV" },
    { name: "Performance-Hydration.png", path: "assets/uploads/2024/10/Performance-Hydration.png", category: "Services & Therapies", tag: "Performance IV" },
    { name: "NAD.png", path: "assets/uploads/2024/10/NAD.png", category: "Services & Therapies", tag: "NAD+ Therapy" },
    { name: "Gluathione.png", path: "assets/uploads/2024/10/Gluathione.png", category: "Services & Therapies", tag: "Glutathione" },
    { name: "Hydration.png", path: "assets/uploads/2024/10/Hydration.png", category: "Services & Therapies", tag: "Hydration IV" },
    { name: "Immune-Boost.png", path: "assets/uploads/2024/10/Immune-Boost.png", category: "Services & Therapies", tag: "Immunity IV" },
    { name: "Liver-Cleanse.png", path: "assets/uploads/2024/10/Liver-Cleanse.png", category: "Services & Therapies", tag: "Liver Cleanse" },
    { name: "Natural-Defense.png", path: "assets/uploads/2024/10/Natural-Defense.png", category: "Services & Therapies", tag: "Natural Defense" },
    { name: "Phosphatidylcholine.png", path: "assets/uploads/2024/10/Phosphatidylcholine.png", category: "Services & Therapies", tag: "Plaquex / PC" },
    { name: "Re-Hydration.png", path: "assets/uploads/2024/10/Re-Hydration.png", category: "Services & Therapies", tag: "Re-Hydration" },
    { name: "Re-energize-or-Performance.png", path: "assets/uploads/2024/10/Re-energize-or-Performance.png", category: "Services & Therapies", tag: "Re-energize IV" },
    { name: "Chelation-Therapy.png", path: "assets/uploads/2024/10/Chelation-Therapy.png", category: "Services & Therapies", tag: "Chelation IV" },
    { name: "Anti-Aging-or-Skin-Brightening.png", path: "assets/uploads/2024/10/Anti-Aging-or-Skin-Brightening.png", category: "Services & Therapies", tag: "Anti-Aging IV" },
    { name: "Brain-Clarity.png", path: "assets/uploads/2024/10/Brain-Clarity.png", category: "Services & Therapies", tag: "Brain Clarity IV" },
    { name: "Joint-Sipport-or-Paint-Relief.png", path: "assets/uploads/2024/10/Joint-Sipport-or-Paint-Relief.png", category: "Services & Therapies", tag: "Joint Support IV" },
    { name: "FOUNTAIN-OF-YOUTH.png", path: "assets/uploads/2024/10/FOUNTAIN-OF-YOUTH.png", category: "Services & Therapies", tag: "Fountain of Youth" },
    { name: "Blood-Tests.png", path: "assets/uploads/2025/05/Blood-Tests.png", category: "Services & Therapies", tag: "Blood Testing" },
    { name: "craniosacral-therapy.png", path: "assets/uploads/2025/05/craniosacral-therapy.png", category: "Services & Therapies", tag: "Craniosacral" },
    { name: "hyperberic-oxygen-chamber.png", path: "assets/uploads/2025/05/hyperberic-oxygen-chamber.png", category: "Services & Therapies", tag: "HBOT Chamber" },
    { name: "iv-therapy.png", path: "assets/uploads/2025/05/iv-therapy.png", category: "Services & Therapies", tag: "IV Therapy Icon" },
    { name: "Ion-foot-detox.png", path: "assets/uploads/2025/05/Ion-foot-detox.png", category: "Services & Therapies", tag: "Foot Detox Icon" },
    { name: "P1.png", path: "assets/uploads/2025/02/P1.png", category: "Services & Therapies", tag: "Personalized Plan 1" },
    { name: "p2.png", path: "assets/uploads/2025/02/p2.png", category: "Services & Therapies", tag: "Personalized Plan 2" },
    { name: "P3.png", path: "assets/uploads/2025/02/P3.png", category: "Services & Therapies", tag: "Personalized Plan 3" },

    // Conditions
    { name: "Diabetes.jpg", path: "assets/uploads/2024/08/Diabetes.jpg", category: "Conditions", tag: "Diabetes Care" },
    { name: "Heart-Disease.jpg", path: "assets/uploads/2024/08/Heart-Disease.jpg", category: "Conditions", tag: "Cardiovascular" },
    { name: "Concussion.jpg", path: "assets/uploads/2024/08/Concussion.jpg", category: "Conditions", tag: "Concussion & TBI" },
    { name: "Chronic-fatigue-1.jpg", path: "assets/uploads/2024/08/Chronic-fatigue-1.jpg", category: "Conditions", tag: "Chronic Fatigue" },
    { name: "Hormone.jpg", path: "assets/uploads/2024/08/Hormone.jpg", category: "Conditions", tag: "Hormone Imbalance" },
    { name: "Pain-all-over-1024x1024-1.jpg", path: "assets/uploads/2024/08/Pain-all-over-1024x1024-1.jpg", category: "Conditions", tag: "Chronic Pain" },
    { name: "Pain-relief-Services.jpg", path: "assets/uploads/2024/08/Pain-relief-Services.jpg", category: "Conditions", tag: "Pain Relief" },
    { name: "Detoxification.jpg", path: "assets/uploads/2024/08/Detoxification.jpg", category: "Conditions", tag: "Toxins & Detox" },
    { name: "Medical-Weight-Loss.jpg", path: "assets/uploads/2024/08/Medical-Weight-Loss.jpg", category: "Conditions", tag: "Obesity & Weight" },
    { name: "toxic2.jpg", path: "assets/uploads/2024/08/toxic2.jpg", category: "Conditions", tag: "Environmental Toxins" },
    { name: "8_Main_Types_of_Heart_Disease.jpg", path: "assets/uploads/2024/08/8_Main_Types_of_Heart_Disease.jpg", category: "Conditions", tag: "Heart Disease Chart" },
    { name: "types-of-diabetes.jpg", path: "assets/uploads/2024/08/types-of-diabetes.jpg", category: "Conditions", tag: "Diabetes Infographic" },
    { name: "diabetes-factor.jpg", path: "assets/uploads/2024/08/diabetes-factor.jpg", category: "Conditions", tag: "Risk Factors" },
    { name: "Factors-Contributing-to-Hormonal.png", path: "assets/uploads/2024/08/Factors-Contributing-to-Hormonal.png", category: "Conditions", tag: "Hormone Diagram" },
    { name: "Dont-Lose-Weight-Lose-FAT.jpg", path: "assets/uploads/2024/08/Dont-Lose-Weight-Lose-FAT.jpg", category: "Conditions", tag: "Fat Loss Focus" },
    { name: "lowt2.jpg", path: "assets/uploads/2024/08/lowt2.jpg", category: "Conditions", tag: "Low Testosterone" },
    { name: "hormones.jpg", path: "assets/uploads/2024/08/hormones.jpg", category: "Conditions", tag: "Endocrine Health" },
    { name: "Stop-smoking-Six-foods-to-avoid-if-you-want-to-quit-the-habit-in-the-New-Year-1060863.jpg", path: "assets/uploads/2024/08/Stop-smoking-Six-foods-to-avoid-if-you-want-to-quit-the-habit-in-the-New-Year-1060863.jpg", category: "Conditions", tag: "Smoking Cessation" },

    // Pillars & Values
    { name: "Vision.jpg", path: "assets/uploads/2024/10/Vision.jpg", category: "Pillars & Values", tag: "Our Vision" },
    { name: "mission2.jpg", path: "assets/uploads/2024/10/mission2.jpg", category: "Pillars & Values", tag: "Our Goal" },
    { name: "core.jpg", path: "assets/uploads/2024/10/core.jpg", category: "Pillars & Values", tag: "Our Core Values" },
    { name: "therapeutic-order.png", path: "assets/uploads/2024/10/therapeutic-order.png", category: "Pillars & Values", tag: "Therapeutic Order" },
    { name: "Our-Integrative-Approach-to.png", path: "assets/uploads/2024/08/Our-Integrative-Approach-to.png", category: "Pillars & Values", tag: "Integrative Approach" },
    { name: "Naturopathic-Integrative-Medicine-Services.png", path: "assets/uploads/2024/08/Naturopathic-Integrative-Medicine-Services.png", category: "Pillars & Values", tag: "Medicine Services" },

    // Memberships & Ads
    { name: "Standard-Wellness-Membership-Ad-1.jpg", path: "assets/uploads/2024/10/Standard-Wellness-Membership-Ad-1.jpg", category: "Memberships & Ads", tag: "Standard Plan Ad" },
    { name: "Specialized-Wellness-Membership-Ad-1.jpg", path: "assets/uploads/2024/10/Specialized-Wellness-Membership-Ad-1.jpg", category: "Memberships & Ads", tag: "Specialized Plan Ad" },
    { name: "family-Wellness-Membership-Ad.png", path: "assets/uploads/2024/10/family-Wellness-Membership-Ad.png", category: "Memberships & Ads", tag: "Family Plan Ad" },
    { name: "medical-weight-management-options.png", path: "assets/uploads/2024/08/medical-weight-management-options.png", category: "Memberships & Ads", tag: "Weight Management" },

    // Diet & Wellness
    { name: "Blood-Sugar.jpg", path: "assets/uploads/2025/02/Blood-Sugar.jpg", category: "Diet & Wellness", tag: "Blood Sugar" },
    { name: "Blood-Sugar-Solution.jpg", path: "assets/uploads/2025/02/Blood-Sugar-Solution.jpg", category: "Diet & Wellness", tag: "Blood Sugar Solution" },
    { name: "The-Hormone-Cure.png", path: "assets/uploads/2025/02/The-Hormone-Cure.png", category: "Diet & Wellness", tag: "The Hormone Cure" },
    { name: "Estrogen-Matters-by-Avra-Bluming-book.png", path: "assets/uploads/2025/02/Estrogen-Matters-by-Avra-Bluming-book.png", category: "Diet & Wellness", tag: "Estrogen Matters" },
    { name: "Ultra-Metabolism.jpg", path: "assets/uploads/2025/02/Ultra-Metabolism.jpg", category: "Diet & Wellness", tag: "Ultra Metabolism" },
    { name: "meal-prrp-1080x675-1.jpg", path: "assets/uploads/2024/08/meal-prrp-1080x675-1.jpg", category: "Diet & Wellness", tag: "Meal Prep Guide" },
    { name: "food-n-me-12-weeks-program.jpg", path: "assets/uploads/2025/02/food-n-me-12-weeks-program.jpg", category: "Diet & Wellness", tag: "12 Weeks Program" },
    { name: "KETO.jpeg", path: "assets/uploads/2025/02/KETO.jpeg", category: "Diet & Wellness", tag: "Keto Protocol" },
    { name: "1Blue.jpg", path: "assets/uploads/2025/02/1Blue.jpg", category: "Diet & Wellness", tag: "Chromotherapy Blue" },
    { name: "1Green.jpg", path: "assets/uploads/2025/02/1Green.jpg", category: "Diet & Wellness", tag: "Chromotherapy Green" },
    { name: "1Orange.jpg", path: "assets/uploads/2025/02/1Orange.jpg", category: "Diet & Wellness", tag: "Chromotherapy Orange" },
    { name: "1Red.jpg", path: "assets/uploads/2025/02/1Red.jpg", category: "Diet & Wellness", tag: "Chromotherapy Red" },
    { name: "1Violet.jpg", path: "assets/uploads/2025/02/1Violet.jpg", category: "Diet & Wellness", tag: "Chromotherapy Violet" },
    { name: "1Yellow.jpg", path: "assets/uploads/2025/02/1Yellow.jpg", category: "Diet & Wellness", tag: "Chromotherapy Yellow" }
  ];

  function resolveAdminImagePath(rawPath) {
    if (!rawPath || typeof rawPath !== "string") return "";
    var trimmed = rawPath.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("data:") || trimmed.startsWith("blob:") || trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    var clean = trimmed.replace(/^(\.\.\/)+/, "").replace(/^\/+/, "");
    if (clean.startsWith("Frontend/")) {
      clean = clean.replace(/^Frontend\//, "");
    }
    return FE + clean;
  }

  var _activeMediaSelectCallback = null;

  function ensureMediaGalleryModal() {
    var modalEl = document.getElementById("cmsMediaGalleryModal");
    if (modalEl) return modalEl;

    var categories = ["All", "Logos & Branding", "Hero & Banners", "Doctors & Team", "Services & Therapies", "Conditions", "Pillars & Values", "Memberships & Ads", "Diet & Wellness"];

    var pillsHtml = categories.map(function (cat, idx) {
      return '<button type="button" class="cms-gallery-pill' + (idx === 0 ? ' active' : '') + '" data-category="' + cat + '">' + cat + '</button>';
    }).join("");

    var modalHtml = [
      '<div class="modal fade" id="cmsMediaGalleryModal" tabindex="-1" aria-labelledby="cmsMediaGalleryModalLabel" aria-hidden="true">',
      '  <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">',
      '    <div class="modal-content">',
      '      <div class="modal-header d-flex align-items-center justify-content-between">',
      '        <div>',
      '          <span class="badge bg-teal-subtle text-teal border px-2 py-1 small mb-1 d-inline-block">Project Media Library</span>',
      '          <h5 class="modal-title fw-bold text-navy mb-0" id="cmsMediaGalleryModalLabel">',
      '            <i class="bi bi-images text-teal me-2"></i>Choose Image from Gallery',
      '          </h5>',
      '        </div>',
      '        <div class="d-flex align-items-center gap-2">',
      '          <label class="btn btn-sm btn-btc mb-0" style="cursor: pointer;">',
      '            <i class="bi bi-upload me-1"></i> Upload New Image',
      '            <input type="file" accept=".jpg,.jpeg,.png,.webp,.svg,image/*" hidden id="cmsGalleryModalUploadInput">',
      '          </label>',
      '          <button type="button" class="btn-close ms-2" data-bs-dismiss="modal" aria-label="Close"></button>',
      '        </div>',
      '      </div>',
      '      <div class="modal-body">',
      '        <div class="cms-gallery-search-wrap">',
      '          <i class="bi bi-search search-icon"></i>',
      '          <input type="text" class="form-control" id="cmsGallerySearchInput" placeholder="Search images by filename, tag, or folder...">',
      '        </div>',
      '        <div class="cms-gallery-filter-pills" id="cmsGalleryPillsWrap">',
      '          ' + pillsHtml,
      '        </div>',
      '        <div class="d-flex justify-content-between align-items-center mb-2 px-1">',
      '          <span class="small text-muted" id="cmsGalleryItemCount">Showing all assets</span>',
      '          <span class="small text-muted"><i class="bi bi-cursor me-1"></i>Click any thumbnail to insert</span>',
      '        </div>',
      '        <div class="cms-gallery-grid" id="cmsGalleryGridContainer"></div>',
      '      </div>',
      '      <div class="modal-footer d-flex justify-content-between bg-white border-top py-2">',
      '        <span class="small text-muted" id="cmsGallerySelectedNote">No image selected yet</span>',
      '        <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join("\n");

    document.body.insertAdjacentHTML("beforeend", modalHtml);
    modalEl = document.getElementById("cmsMediaGalleryModal");

    // Bind Gallery events
    var searchInput = document.getElementById("cmsGallerySearchInput");
    var pillsWrap = document.getElementById("cmsGalleryPillsWrap");
    var uploadInput = document.getElementById("cmsGalleryModalUploadInput");

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        renderMediaGalleryGrid();
      });
    }

    if (pillsWrap) {
      pillsWrap.addEventListener("click", function (e) {
        var pill = e.target.closest(".cms-gallery-pill");
        if (!pill) return;
        pillsWrap.querySelectorAll(".cms-gallery-pill").forEach(function (p) { p.classList.remove("active"); });
        pill.classList.add("active");
        renderMediaGalleryGrid();
      });
    }

    if (uploadInput) {
      uploadInput.addEventListener("change", function () {
        var file = uploadInput.files && uploadInput.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (evt) {
          var dataUrl = evt.target.result;
          var newPath = "assets/uploads/2025/02/" + file.name;
          var newItem = {
            name: file.name,
            path: newPath,
            category: "Uploaded",
            tag: "Uploaded file",
            dataUrl: dataUrl
          };
          BTC_MEDIA_CATALOG.unshift(newItem);
          renderMediaGalleryGrid();
          if (_activeMediaSelectCallback) {
            _activeMediaSelectCallback(newItem);
            var bsModal = bootstrap.Modal.getInstance(modalEl);
            if (bsModal) bsModal.hide();
          }
          toast("Image uploaded: " + file.name);
        };
        reader.readAsDataURL(file);
        uploadInput.value = "";
      });
    }

    return modalEl;
  }

  function renderMediaGalleryGrid() {
    var grid = document.getElementById("cmsGalleryGridContainer");
    var countEl = document.getElementById("cmsGalleryItemCount");
    var searchInput = document.getElementById("cmsGallerySearchInput");
    var activePill = document.querySelector("#cmsGalleryPillsWrap .cms-gallery-pill.active");

    if (!grid) return;

    var q = searchInput ? searchInput.value.toLowerCase().trim() : "";
    var cat = activePill ? activePill.getAttribute("data-category") : "All";

    var filtered = BTC_MEDIA_CATALOG.filter(function (item) {
      var matchCat = (cat === "All" || item.category === cat);
      var matchQ = !q || item.name.toLowerCase().indexOf(q) !== -1 || (item.tag && item.tag.toLowerCase().indexOf(q) !== -1) || item.path.toLowerCase().indexOf(q) !== -1;
      return matchCat && matchQ;
    });

    if (countEl) {
      countEl.textContent = "Showing " + filtered.length + " image" + (filtered.length === 1 ? "" : "s");
    }

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="text-center py-5 text-muted col-span-full w-100" style="grid-column: 1/-1;"><i class="bi bi-images fs-1 d-block mb-2 text-slate-300"></i>No images match your search.</div>';
      return;
    }

    grid.innerHTML = filtered.map(function (item) {
      var imgSrc = item.dataUrl || resolveAdminImagePath(item.path);
      return [
        '<div class="cms-gallery-card" data-path="' + item.path + '" data-name="' + item.name + '" title="' + item.name + '">',
        '  <div class="cms-gallery-thumb-wrap">',
        '    <img src="' + imgSrc + '" alt="' + item.name + '" loading="lazy" onerror="this.src=\'' + imgSrc + '\'">',
        '  </div>',
        '  <div class="cms-gallery-meta">',
        '    <div class="cms-gallery-name">' + item.name + '</div>',
        '    <div class="cms-gallery-cat-badge">',
        '      <span>' + (item.tag || item.category) + '</span>',
        '    </div>',
        '    <button type="button" class="btn btn-sm btn-btc-outline cms-gallery-select-btn mt-1">',
        '      <i class="bi bi-check2 me-1"></i> Select',
        '    </button>',
        '  </div>',
        '</div>'
      ].join("");
    }).join("");

    grid.querySelectorAll(".cms-gallery-card").forEach(function (card) {
      card.addEventListener("click", function () {
        var p = card.getAttribute("data-path");
        var n = card.getAttribute("data-name");
        var item = BTC_MEDIA_CATALOG.find(function (it) { return it.path === p; }) || { name: n, path: p };
        if (_activeMediaSelectCallback) {
          _activeMediaSelectCallback(item);
        }
        var modalEl = document.getElementById("cmsMediaGalleryModal");
        if (modalEl) {
          var bsModal = bootstrap.Modal.getInstance(modalEl);
          if (bsModal) bsModal.hide();
        }
      });
    });
  }

  function openMediaGalleryModal(onSelect) {
    _activeMediaSelectCallback = onSelect;
    var modalEl = ensureMediaGalleryModal();
    renderMediaGalleryGrid();
    if (typeof bootstrap !== "undefined" && bootstrap.Modal) {
      var modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  function bindCmsImageFieldElement(fieldEl) {
    if (!fieldEl || fieldEl.getAttribute("data-cms-img-bound") === "true") return;
    fieldEl.setAttribute("data-cms-img-bound", "true");

    var input = fieldEl.querySelector(".js-cms-img-input") || fieldEl.querySelector("input[type=text]");
    var fileInput = fieldEl.querySelector(".js-cms-img-file-input") || fieldEl.querySelector("input[type=file]");
    var previewBox = fieldEl.querySelector(".cms-image-preview-box");
    var previewImg = fieldEl.querySelector(".cms-image-preview-img");
    var uploadBtn = fieldEl.querySelector(".js-cms-img-upload-btn");
    var galleryBtn = fieldEl.querySelector(".js-cms-img-gallery-btn");
    var changeBtn = fieldEl.querySelector(".js-cms-img-change");
    var removeBtn = fieldEl.querySelector(".js-cms-img-remove");

    function updatePreview(val, isDirectSrc) {
      if (!previewBox || !previewImg) return;
      var cleanVal = (val || "").trim();
      if (!cleanVal) {
        previewBox.classList.remove("has-image");
        previewImg.src = "";
        return;
      }
      var targetSrc = isDirectSrc ? cleanVal : resolveAdminImagePath(cleanVal);
      previewImg.src = targetSrc;
      previewBox.classList.add("has-image");
    }

    if (previewImg) {
      previewImg.addEventListener("error", function () {
        // If image fails to load, keep subtle or fallback
      });
    }

    if (input) {
      updatePreview(input.value);
      input.addEventListener("input", function () {
        updatePreview(input.value);
      });
      input.addEventListener("change", function () {
        updatePreview(input.value);
      });
    }

    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener("click", function (e) {
        e.preventDefault();
        fileInput.click();
      });
    }

    if (fileInput) {
      fileInput.addEventListener("change", function () {
        var file = fileInput.files && fileInput.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (evt) {
          var dataUrl = evt.target.result;
          var assignedPath = "assets/uploads/2025/02/" + file.name;
          if (input) {
            input.value = assignedPath;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
          }
          updatePreview(dataUrl, true);
          toast("Image selected: " + file.name);
        };
        reader.readAsDataURL(file);
      });
    }

    if (galleryBtn) {
      galleryBtn.addEventListener("click", function (e) {
        e.preventDefault();
        openMediaGalleryModal(function (selectedItem) {
          if (input) {
            input.value = selectedItem.path;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
          }
          if (selectedItem.dataUrl) {
            updatePreview(selectedItem.dataUrl, true);
          } else {
            updatePreview(selectedItem.path);
          }
          toast("Selected: " + selectedItem.name);
        });
      });
    }

    if (changeBtn) {
      changeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        openMediaGalleryModal(function (selectedItem) {
          if (input) {
            input.value = selectedItem.path;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
          }
          if (selectedItem.dataUrl) {
            updatePreview(selectedItem.dataUrl, true);
          } else {
            updatePreview(selectedItem.path);
          }
          toast("Updated: " + selectedItem.name);
        });
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (input) {
          input.value = "";
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
        if (fileInput) fileInput.value = "";
        updatePreview("");
        toast("Image removed");
      });
    }
  }

  function initAdminImageSelectors() {
    ensureMediaGalleryModal();
    document.querySelectorAll(".cms-image-field").forEach(function (field) {
      bindCmsImageFieldElement(field);
    });
  }

  // Global dismiss handlers
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".custom-select-wrapper")) {
      closeAllCustomSelects();
    }
    if (!e.target.closest(".calendar-picker-wrapper")) {
      closeAllGlobalCalendars();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAllCustomSelects();
      closeAllGlobalCalendars();
    }
  });

  document.addEventListener("hidden.bs.modal", function () {
    closeAllCustomSelects();
    closeAllGlobalCalendars();
  });

  document.addEventListener("DOMContentLoaded", function () {
    injectShell();
    bindEditors();
    bindSaves();
    bindDeletes();
    bindUploads();
    bindFilters();
    bindLogin();
    bindBackdrop();
    bindSlug();
    bindReply();
    bindStatus();
    bindDeviceToggle();
    bindCopyButtons();
    bindFilterPills();
    bindNewArticle();
    initGlobalCustomSelects();
    initGlobalDatePickers();
    initAdminImageSelectors();
  });

  window.BTCAdmin = {
    toast: toast,
    initGlobalCustomSelects: initGlobalCustomSelects,
    initGlobalDatePickers: initGlobalDatePickers,
    closeAllCustomSelects: closeAllCustomSelects,
    closeAllGlobalCalendars: closeAllGlobalCalendars,
    openMediaGallery: openMediaGalleryModal,
    initAdminImageSelectors: initAdminImageSelectors,
    resolveAdminImagePath: resolveAdminImagePath,
    catalog: BTC_MEDIA_CATALOG
  };
})();


