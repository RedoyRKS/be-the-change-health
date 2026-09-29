/**
 * Shared TopNav / site chrome for Be The Change Health.
 * Single source of truth for notice bar, header, nav links, and dropdown triggers.
 *
 * Usage (every MediLab page):
 *   <div data-site-header></div>
 *   <script src="[../]assets/js/site-header.js"></script>
 */
(function (global) {
  "use strict";

  var MOBILE_MQ = "(max-width: 1199px)";

  /** Central navigation configuration — edit here to update all pages */
  var NAV_CONFIG = {
    phone: "301-970-9724",
    phoneHref: "tel:3019709724",
    location: "Conveniently located in Columbia, MD",
    notice:
      'Now offering Telehealth appointments.' +
      '<span class="d-none d-md-inline"> Please note that our office is out-of-network. We cannot guarantee coverage for any services received in office.</span>',
    logo: {
      src: "assets/uploads/2024/08/LOGO.jpg",
      alt: "Be The Change Health and Wellness Center Logo",
    },
    cta: { label: "Book Appointment", href: "book-appointment.html" },
    topbarLinks: [
      { label: "Book a Service Online", href: "book-appointment.html" },
      { label: "Request An Appointment", href: "book-appointment.html", className: "fw-semibold" },
    ],
    items: [
      { id: "home", label: "Home", href: "index.html", homeHash: "#hero" },
      {
        id: "about",
        label: "About",
        type: "dropdown",
        children: [
          { id: "about-practice", label: "Our Practice", href: "about/index.html" },
          { id: "about-naturopathic", label: "Naturopathic Medicine", href: "about/naturopathic-medicine.html" },
          { id: "about-integrative", label: "Integrative Medicine", href: "about/integrative-medicine.html" },
          { id: "about-process", label: "Our Process", href: "our-process/index.html" },
          { id: "about-jessica", label: "Jessica Needle", href: "about/jessica-needle.html" },
          { id: "about-sultana", label: "Sultana Afrooz", href: "about/sultana-afrooz.html" },
        ],
      },
      {
        id: "conditions",
        label: "Conditions",
        type: "dropdown",
        children: [
          { id: "cond-diabetes", label: "Diabetes", href: "conditions/diabetes.html" },
          { id: "cond-heart", label: "Heart Disease", href: "conditions/heart-disease.html" },
          { id: "cond-concussion", label: "Concussion", href: "conditions/concussion.html" },
          { id: "cond-fatigue", label: "Chronic Fatigue", href: "conditions/chronic-fatigue.html" },
          { id: "cond-obesity", label: "Obesity", href: "conditions/obesity.html" },
          { id: "cond-pain", label: "Chronic Pain", href: "conditions/chronic-pain.html" },
          { id: "cond-toxins", label: "Toxins", href: "conditions/toxins.html" },
          { id: "cond-hormone", label: "Hormone Imbalance", href: "conditions/hormone-imbalance.html" },
        ],
        sectionMatch: /\/conditions\//,
      },
      {
        id: "services",
        label: "Services",
        type: "dropdown",
        children: [
          { id: "svc-fsm", label: "Frequency Specific Microcurrent", href: "services/frequency-specific-microcurrent.html" },
          { id: "svc-sauna", label: "Infrared Sauna Therapy", href: "services/infrared-sauna-therapy.html" },
          { id: "svc-hbot", label: "Hyperbaric Oxygen Therapy", href: "services/hyperbaric-oxygen-therapy.html" },
          { id: "svc-iv", label: "IV Nutritional Infusions", href: "services/iv-nutritional-infusions.html" },
          { id: "svc-liquivida", label: "Liquivida IV Therapy", href: "services/liquivida-iv-therapy.html" },
          { id: "svc-reflexology", label: "Reflexology", href: "services/reflexology.html" },
          { id: "svc-ozone", label: "Ozone Therapy", href: "services/ozone-therapy.html" },
          { id: "svc-detox", label: "Ion Foot Detox", href: "services/ion-foot-detox.html" },
          { id: "svc-classes", label: "Wellness Classes", href: "services/wellness-classes.html" },
          { id: "svc-plans", label: "Personalized Wellness Plans", href: "services/personalized-wellness-plans.html" },
          { id: "svc-hydro", label: "Constitutional Hydrotherapy", href: "services/constitutional-hydrotherapy.html" },
        ],
        sectionMatch: /\/services\//,
      },
      { id: "memberships", label: "Memberships", href: "memberships.html" },
      { id: "blog", label: "Blog", href: "blog/index.html", sectionMatch: /\/blog\// },
      {
        id: "patients",
        label: "Patients",
        type: "dropdown",
        children: [
          { id: "patients-existing", label: "Existing Patients", href: "patients.html" },
          { id: "patients-npq", label: "New Patient Questions", href: "new-patient-questions.html" },
        ],
      },
      { id: "contact", label: "Contact", href: "contact.html" },
    ],
  };

  function normalizePath(pathname) {
    var path = (pathname || "").replace(/\\/g, "/");
    path = path.split("?")[0].split("#")[0];
    if (path.length > 1 && path.charAt(path.length - 1) === "/") {
      path += "index.html";
    }
    return path;
  }

  function detectBase(pathname) {
    var path = normalizePath(pathname || global.location.pathname);
    if (/\/(about|conditions|services|blog|our-process)\//.test(path)) {
      return "../";
    }
    return "";
  }

  function isHomePath(path) {
    path = normalizePath(path);
    if (/\/(about|conditions|services|blog|our-process)\//.test(path)) return false;
    return /\/index\.html$/i.test(path) || /\/Frontend\/?$/i.test(path) || /\/Be%20The%20Change%20Health\/?$/i.test(path);
  }

  function pathMatchesHref(path, href) {
    path = normalizePath(path);
    var clean = (href || "").replace(/^\.\//, "").split("#")[0];
    if (!clean || clean === "#hero") return isHomePath(path);

    if (/^index\.html$/i.test(clean)) return isHomePath(path);

    // Directory index: about/index.html — only the hub page, not siblings
    if (/\/index\.html$/i.test(clean)) {
      var dir = clean.replace(/\/index\.html$/i, "");
      return (
        path.endsWith("/" + clean) ||
        path.endsWith("/" + dir) ||
        path.endsWith("/" + dir + "/")
      );
    }

    var file = clean.split("/").pop();
    return path.endsWith("/" + file) || path.endsWith(file);
  }

  function resolveHref(base, href, opts) {
    opts = opts || {};
    if (!href || href.charAt(0) === "#" || href.indexOf("tel:") === 0 || href.indexOf("mailto:") === 0) {
      return href;
    }
    var pagePath = opts.path || global.location.pathname;
    if (opts.homeHash && isHomePath(pagePath)) {
      return opts.homeHash;
    }
    return base + href;
  }

  function cls() {
    var parts = [];
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i]) parts.push(arguments[i]);
    }
    return parts.length ? ' class="' + parts.join(" ") + '"' : "";
  }

  function renderNavItems(base, path) {
    var html = "";
    NAV_CONFIG.items.forEach(function (item) {
      if (item.type === "dropdown") {
        var childActive = false;
        var childrenHtml = "";
        (item.children || []).forEach(function (child) {
          var active = pathMatchesHref(path, child.href);
          if (active) childActive = true;
          childrenHtml +=
            "<li><a href=\"" +
            resolveHref(base, child.href, { path: path }) +
            "\"" +
            cls(active && "active") +
            ">" +
            child.label +
            "</a></li>";
        });
        var sectionActive =
          childActive ||
          (item.sectionMatch && item.sectionMatch.test(normalizePath(path)));
        html +=
          '<li class="dropdown"><a href="#" role="button" aria-haspopup="true" aria-expanded="false"' +
          cls(sectionActive && "active") +
          "><span>" +
          item.label +
          '</span> <i class="bi bi-chevron-down toggle-dropdown" aria-hidden="true"></i></a><ul>' +
          childrenHtml +
          "</ul></li>";
      } else {
        var active =
          pathMatchesHref(path, item.href) ||
          (item.sectionMatch && item.sectionMatch.test(normalizePath(path)));
        if (item.id === "home") {
          active = isHomePath(path);
        }
        html +=
          "<li><a href=\"" +
          resolveHref(base, item.href, { homeHash: item.homeHash, path: path }) +
          "\"" +
          cls(active && "active") +
          ">" +
          item.label +
          "</a></li>";
      }
    });
    return html;
  }

  function render(options) {
    options = options || {};
    var base = options.base != null ? options.base : detectBase();
    var path = options.path || global.location.pathname;
    var logoSrc = resolveHref(base, NAV_CONFIG.logo.src);
    var homeHref = resolveHref(base, "index.html");

    var topbarLinks = NAV_CONFIG.topbarLinks
      .map(function (link) {
        return (
          '<a href="' +
          resolveHref(base, link.href) +
          '" class="text-white small' +
          (link.className ? " " + link.className : "") +
          '">' +
          link.label +
          "</a>"
        );
      })
      .join("");

    return (
      '<div class="notice-bar"><div class="container">' +
      NAV_CONFIG.notice +
      "</div></div>" +
      '<header id="header" class="header sticky-top">' +
      '<div class="topbar d-flex align-items-center">' +
      '<div class="container d-flex justify-content-center justify-content-md-between">' +
      '<div class="contact-info d-flex align-items-center flex-wrap justify-content-center">' +
      '<i class="bi bi-geo-alt d-none d-sm-flex align-items-center"><span>' +
      NAV_CONFIG.location +
      "</span></i>" +
      '<i class="bi bi-phone d-flex align-items-center ms-sm-4"><a href="' +
      NAV_CONFIG.phoneHref +
      '"><span>' +
      NAV_CONFIG.phone +
      "</span></a></i>" +
      "</div>" +
      '<div class="d-none d-md-flex align-items-center gap-3">' +
      topbarLinks +
      "</div></div></div>" +
      '<div class="branding d-flex align-items-center">' +
      '<div class="container position-relative d-flex align-items-center justify-content-between">' +
      '<a href="' +
      homeHref +
      '" class="logo d-flex align-items-center me-auto">' +
      '<img src="' +
      logoSrc +
      '" alt="' +
      NAV_CONFIG.logo.alt +
      '">' +
      "</a>" +
      '<nav id="navmenu" class="navmenu" aria-label="Primary">' +
      "<ul>" +
      renderNavItems(base, path) +
      "</ul>" +
      '<i class="mobile-nav-toggle d-xl-none bi bi-list" role="button" tabindex="0" aria-label="Toggle navigation"></i>' +
      "</nav>" +
      '<a class="cta-btn d-none d-sm-block" href="' +
      resolveHref(base, NAV_CONFIG.cta.href) +
      '">' +
      NAV_CONFIG.cta.label +
      "</a>" +
      "</div></div></header>"
    );
  }

  /* ——— Dropdown interactions (parent triggers never navigate) ——— */

  function isMobileNav() {
    return global.matchMedia(MOBILE_MQ).matches;
  }

  function setExpanded(trigger, open) {
    trigger.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function blurInside(el) {
    var active = document.activeElement;
    if (active && el.contains(active) && typeof active.blur === "function") {
      active.blur();
    }
  }

  function closeDropdown(li) {
    if (!li) return;
    li.classList.remove("is-open");
    var trigger = li.querySelector(":scope > a");
    var submenu = li.querySelector(":scope > ul");
    if (submenu) {
      submenu.classList.remove("dropdown-active");
      submenu.classList.remove("dropdown-align-end");
      submenu.style.left = "";
      submenu.style.right = "";
    }
    if (trigger) setExpanded(trigger, false);
    blurInside(li);
  }

  function closeAllSubmenus(root, exceptLi) {
    var scope = root || document;
    var dropdowns = [];
    if (scope.querySelectorAll) {
      if (scope.classList && scope.classList.contains("navmenu")) {
        dropdowns = scope.querySelectorAll("li.dropdown");
      } else {
        dropdowns = scope.querySelectorAll(".navmenu li.dropdown");
      }
    }
    Array.prototype.forEach.call(dropdowns, function (li) {
      if (exceptLi && li === exceptLi) return;
      closeDropdown(li);
    });
  }

  function openDropdown(li) {
    if (!li || !li.classList.contains("dropdown")) return;
    closeAllSubmenus(li.closest(".navmenu") || document, li);
    li.classList.add("is-open");
    var trigger = li.querySelector(":scope > a");
    var submenu = li.querySelector(":scope > ul");
    if (submenu && isMobileNav()) submenu.classList.add("dropdown-active");
    if (trigger) setExpanded(trigger, true);
    positionDesktopPanel(li);
  }

  /** Keep desktop dropdown panels inside the viewport */
  function positionDesktopPanel(li) {
    if (isMobileNav() || !li) return;
    var submenu = li.querySelector(":scope > ul");
    if (!submenu) return;
    submenu.style.left = "";
    submenu.style.right = "";
    submenu.classList.remove("dropdown-align-end");
    // Force layout so measurements reflect the open panel
    void submenu.offsetWidth;
    var rect = submenu.getBoundingClientRect();
    var pad = 12;
    if (rect.right > global.innerWidth - pad) {
      submenu.style.left = "auto";
      submenu.style.right = "0";
      submenu.classList.add("dropdown-align-end");
    }
    if (rect.left < pad && !submenu.classList.contains("dropdown-align-end")) {
      submenu.style.left = "0";
      submenu.style.right = "auto";
    }
  }

  function toggleSubmenu(trigger) {
    var li = trigger.parentElement;
    if (!li) return;
    if (li.classList.contains("is-open") || (trigger.nextElementSibling && trigger.nextElementSibling.classList.contains("dropdown-active"))) {
      closeDropdown(li);
    } else {
      openDropdown(li);
    }
  }

  function initDropdowns(root) {
    root = root || document;
    var navs = root.querySelectorAll ? root.querySelectorAll(".navmenu") : [];
    if (root.classList && root.classList.contains("navmenu")) {
      navs = [root];
    } else if (!navs.length && root.querySelector) {
      var single = root.querySelector(".navmenu");
      if (single) navs = [single];
    }

    Array.prototype.forEach.call(navs, function (nav) {
      if (nav.getAttribute("data-btc-nav-bound") === "1") return;
      nav.setAttribute("data-btc-nav-bound", "1");

      var topItems = nav.querySelectorAll(":scope > ul > li");

      topItems.forEach(function (li) {
        // Desktop: open on enter, close when leaving this item (or switching siblings)
        li.addEventListener("mouseenter", function () {
          if (isMobileNav()) return;
          if (li.classList.contains("dropdown")) {
            openDropdown(li);
          } else {
            closeAllSubmenus(nav);
          }
        });

        li.addEventListener("mouseleave", function (e) {
          if (isMobileNav()) return;
          // Only close if the pointer truly left this li (not into a child)
          var related = e.relatedTarget;
          if (related && li.contains(related)) return;
          if (li.classList.contains("dropdown")) {
            closeDropdown(li);
          }
        });

        // Keyboard / desktop focus: open on focus within dropdown, close when focus leaves.
        // Skip on mobile — touch fires focusin then click, which would open then immediately close.
        if (li.classList.contains("dropdown")) {
          li.addEventListener("focusin", function () {
            if (isMobileNav()) return;
            openDropdown(li);
          });
          li.addEventListener("focusout", function (e) {
            if (isMobileNav()) return;
            var related = e.relatedTarget;
            if (related && li.contains(related)) return;
            closeDropdown(li);
          });
        }
      });

      // Close when clicking any real nav link (submenu or leaf)
      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener(
          "click",
          function () {
            var isTrigger = link.parentElement && link.parentElement.classList.contains("dropdown") && link.parentElement.querySelector(":scope > a") === link && link.getAttribute("href") === "#";
            if (isTrigger) return; // handled below
            closeAllSubmenus(nav);
          },
          false
        );
      });

      // Parent triggers: never navigate; mobile toggles; desktop hover-only
      nav.querySelectorAll(".dropdown > a").forEach(function (trigger) {
        if (trigger.getAttribute("data-btc-dropdown-bound") === "1") return;
        trigger.setAttribute("data-btc-dropdown-bound", "1");

        if (!trigger.hasAttribute("aria-haspopup")) {
          trigger.setAttribute("aria-haspopup", "true");
        }
        if (!trigger.hasAttribute("aria-expanded")) {
          trigger.setAttribute("aria-expanded", "false");
        }

        trigger.addEventListener(
          "click",
          function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            if (isMobileNav()) {
              toggleSubmenu(trigger);
            }
          },
          true
        );

        trigger.addEventListener("keydown", function (e) {
          if (e.key !== " " && e.key !== "Enter") return;
          e.preventDefault();
          if (isMobileNav()) {
            toggleSubmenu(trigger);
          } else {
            openDropdown(trigger.parentElement);
          }
        });
      });

      // Leaving the whole nav closes everything
      nav.addEventListener("mouseleave", function () {
        if (isMobileNav()) return;
        closeAllSubmenus(nav);
      });
    });

    if (!global.__btcDropdownMqBound) {
      global.__btcDropdownMqBound = true;
      global.matchMedia(MOBILE_MQ).addEventListener("change", function (e) {
        if (!e.matches) closeAllSubmenus();
      });
      global.addEventListener("pageshow", function () {
        closeAllSubmenus();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeAllSubmenus();
      });
    }

    root.querySelectorAll(".mobile-nav-toggle").forEach(function (btn) {
      if (btn.getAttribute("data-btc-toggle-bound") === "1") return;
      btn.setAttribute("data-btc-toggle-bound", "1");
      btn.addEventListener("click", function () {
        global.setTimeout(function () {
          if (!document.body.classList.contains("mobile-nav-active")) {
            closeAllSubmenus();
          }
        }, 0);
      });
    });
  }

  function mount(selector, options) {
    var nodes =
      typeof selector === "string"
        ? document.querySelectorAll(selector)
        : selector && selector.nodeType
          ? [selector]
          : document.querySelectorAll("[data-site-header]");

    nodes.forEach(function (el) {
      var baseAttr = el.getAttribute("data-base");
      var opts = Object.assign({}, options || {});
      if (baseAttr != null && baseAttr !== "") opts.base = baseAttr;
      if (baseAttr === "") opts.base = "";
      var html = render(opts);
      var wrap = document.createElement("div");
      wrap.innerHTML = html;
      var parent = el.parentNode;
      var inserted = [];
      while (wrap.firstChild) {
        inserted.push(wrap.firstChild);
        parent.insertBefore(wrap.firstChild, el);
      }
      parent.removeChild(el);
      inserted.forEach(function (node) {
        if (node.nodeType === 1) initDropdowns(node);
      });
    });
  }

  var api = {
    config: NAV_CONFIG,
    render: render,
    mount: mount,
    initDropdowns: initDropdowns,
    detectBase: detectBase,
  };

  global.SiteHeader = api;

  // Auto-mount when placeholder is already in the DOM (sync script after placeholder)
  if (document.querySelector("[data-site-header]")) {
    mount("[data-site-header]");
  }
})(typeof window !== "undefined" ? window : this);
