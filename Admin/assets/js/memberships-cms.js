/**
 * Membership Plan CMS — Directory, Editor, Live Card Preview & Sync
 * Be The Change Health & Wellness Center
 */
(function () {
  "use strict";

  var store = window.BTCMemberships;
  if (!store) {
    console.error("BTCMemberships store is not loaded.");
    return;
  }

  var PAGE = document.body.getAttribute("data-page") || "";

  function toast(msg, type) {
    if (window.BTCAdmin && window.BTCAdmin.toast) {
      window.BTCAdmin.toast(msg, type || "success");
    } else {
      alert(msg);
    }
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function param(name) {
    var params = new URLSearchParams(location.search);
    return params.get(name) || "";
  }

  function formatSaved(iso) {
    if (!iso) return "Not saved yet";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "Not saved yet";
    return d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  }

  function enrollmentLabel(value) {
    if (value === "closed") return "Closed";
    if (value === "waitlist") return "Waitlist";
    return "Open";
  }

  function statusBadge(plan) {
    if (plan.status === "active") {
      return '<span class="badge-admin badge-published"><i class="bi bi-broadcast me-1"></i>Active / Live</span>';
    }
    return '<span class="badge-admin badge-draft"><i class="bi bi-eye-slash me-1"></i>Draft / Hidden</span>';
  }

  function discountBadges(plan) {
    var html = "";
    if (plan.appointmentDiscount) {
      html += '<span class="badge bg-light text-dark border mb-1 d-inline-block"><i class="bi bi-tag-fill text-teal me-1"></i> ' + esc(plan.appointmentDiscount) + "</span><br>";
    }
    if (plan.ivDiscount) {
      html += '<span class="badge bg-light text-dark border mb-1 d-inline-block"><i class="bi bi-droplet-fill text-teal me-1"></i> ' + esc(plan.ivDiscount) + "</span><br>";
    }
    if (plan.saunaDiscount) {
      html += '<span class="badge bg-light text-dark border d-inline-block"><i class="bi bi-sun-fill text-teal me-1"></i> ' + esc(plan.saunaDiscount) + "</span>";
    }
    return html || '<span class="text-muted small">No discounts listed</span>';
  }

  function uniqueTherapies(plans) {
    var set = {};
    plans.forEach(function (p) {
      (p.services || []).forEach(function (s) { set[s] = true; });
    });
    return Object.keys(set).length;
  }

  function avgPrice(plans) {
    var active = plans.filter(function (p) { return p.status === "active"; });
    if (!active.length) return "$0";
    var sum = active.reduce(function (acc, p) {
      var val = parseFloat(p.price) || 0;
      return acc + val;
    }, 0);
    return "$" + Math.round(sum / active.length);
  }

  /* =========================================================================
     SERVICE / BENEFITS MANAGER (DRAG, ADD, REMOVE, PRESET CHIPS)
     ========================================================================= */

  function collectServices() {
    var list = document.getElementById("service-benefit-list");
    if (!list) return [];
    return Array.prototype.map.call(list.querySelectorAll(".service-benefit-title"), function (el) {
      return el.textContent.trim();
    }).filter(Boolean);
  }

  function serviceItemHtml(name) {
    return (
      '<div class="service-benefit-item">' +
        '<div class="service-benefit-left">' +
          '<i class="bi bi-grip-vertical service-drag-handle text-muted"></i>' +
          '<i class="bi bi-check-circle-fill text-teal"></i>' +
          '<span class="service-benefit-title">' + esc(name) + "</span>" +
          '<span class="badge-admin badge-published ms-2" style="font-size:0.65rem;">Included</span>' +
        "</div>" +
        '<div class="service-benefit-controls">' +
          '<button type="button" class="service-btn-icon btn-move-up" title="Move up"><i class="bi bi-chevron-up"></i></button>' +
          '<button type="button" class="service-btn-icon btn-move-down" title="Move down"><i class="bi bi-chevron-down"></i></button>' +
          '<button type="button" class="service-btn-icon danger btn-remove-service" title="Remove benefit"><i class="bi bi-trash"></i></button>' +
        "</div>" +
      "</div>"
    );
  }

  function renderServices(services) {
    var list = document.getElementById("service-benefit-list");
    if (!list) return;
    list.innerHTML = "";
    (services || []).forEach(function (name) {
      var wrap = document.createElement("div");
      wrap.innerHTML = serviceItemHtml(name);
      list.appendChild(wrap.firstElementChild);
    });
    updateLivePreviewCard();
  }

  function addServiceItem(val) {
    val = (val || "").trim();
    if (!val) return;
    var list = document.getElementById("service-benefit-list");
    if (!list) return;
    var existing = collectServices();
    if (existing.indexOf(val) !== -1) {
      toast('"' + val + '" is already in the included list.', "warn");
      return;
    }
    var wrap = document.createElement("div");
    wrap.innerHTML = serviceItemHtml(val);
    list.appendChild(wrap.firstElementChild);
    updateLivePreviewCard();
    toast('Added "' + val + '" to included services.');
  }

  function bindServiceManager() {
    var serviceList = document.getElementById("service-benefit-list");
    var addBtn = document.getElementById("btn-add-service");
    var addInput = document.getElementById("input-new-service");

    if (serviceList) {
      serviceList.addEventListener("click", function (e) {
        var btn = e.target.closest(".service-btn-icon");
        if (!btn) return;
        var item = btn.closest(".service-benefit-item");
        if (!item) return;

        if (btn.classList.contains("btn-move-up")) {
          var prev = item.previousElementSibling;
          if (prev) {
            serviceList.insertBefore(item, prev);
            updateLivePreviewCard();
          }
        } else if (btn.classList.contains("btn-move-down")) {
          var next = item.nextElementSibling;
          if (next) {
            serviceList.insertBefore(next, item);
            updateLivePreviewCard();
          }
        } else if (btn.classList.contains("btn-remove-service")) {
          var title = item.querySelector(".service-benefit-title");
          var label = title ? title.textContent : "Service";
          item.remove();
          updateLivePreviewCard();
          toast('Removed "' + label + '".');
        }
      });
    }

    if (addBtn && addInput) {
      addBtn.addEventListener("click", function () {
        var val = addInput.value.trim();
        if (!val) {
          toast("Please enter a treatment name.", "warn");
          return;
        }
        addServiceItem(val);
        addInput.value = "";
      });
      addInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          addBtn.click();
        }
      });
    }

    // Quick-add preset chips
    document.querySelectorAll(".therapy-preset-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var name = chip.getAttribute("data-service") || chip.textContent.trim();
        addServiceItem(name);
      });
    });
  }

  /* =========================================================================
     DIRECTORY LISTING (MEMBERSHIPS.HTML)
     ========================================================================= */

  function applyListFilters() {
    var table = document.getElementById("memberships-table");
    var gridView = document.getElementById("memberships-grid-view");
    var wrap = document.querySelector(".card-admin") || document;

    var search = wrap.querySelector("[data-table-search='memberships-table']");
    var q = search ? search.value.toLowerCase().trim() : "";
    var statusSel = wrap.querySelector("[data-filter='data-status']");
    var billingSel = wrap.querySelector("[data-filter='data-billing']");
    var status = statusSel ? statusSel.value : "";
    var billing = billingSel ? billingSel.value : "";

    if (table) {
      table.querySelectorAll("tbody tr").forEach(function (row) {
        var text = row.textContent.toLowerCase();
        var show = !q || text.indexOf(q) !== -1;
        if (status && row.getAttribute("data-status") !== status) show = false;
        if (billing && row.getAttribute("data-billing") !== billing) show = false;
        row.style.display = show ? "" : "none";
      });
    }

    if (gridView) {
      gridView.querySelectorAll(".plan-admin-card").forEach(function (card) {
        var text = card.textContent.toLowerCase();
        var show = !q || text.indexOf(q) !== -1;
        if (status && card.getAttribute("data-status") !== status) show = false;
        if (billing && card.getAttribute("data-billing") !== billing) show = false;
        card.style.display = show ? "" : "none";
      });
    }
  }

  function renderList() {
    var data = store.load();
    var plans = store.getPlans();
    var tbody = document.querySelector("#memberships-table tbody");
    var grid = document.getElementById("memberships-grid");
    var policy = document.getElementById("intro-policy-text");
    var published = store.getActivePlans();

    var publishedEl = document.getElementById("stat-published-plans");
    var therapyEl = document.getElementById("stat-therapy-count");
    var avgPriceEl = document.getElementById("stat-avg-price");

    if (publishedEl) publishedEl.textContent = String(published.length);
    if (therapyEl) therapyEl.textContent = String(uniqueTherapies(plans));
    if (avgPriceEl) avgPriceEl.textContent = avgPrice(plans);
    if (policy) policy.value = data.policyText || "";

    if (tbody) {
      if (!plans.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-5">No membership plans yet. Click "+ Create Membership Plan" to publish your first plan.</td></tr>';
      } else {
        tbody.innerHTML = plans.map(function (plan, idx) {
          var featuredBadge = plan.featured
            ? '<span class="badge bg-warning text-dark ms-1" style="font-size:0.65rem; font-weight:700;"><i class="bi bi-star-fill me-1"></i>FEATURED</span>'
            : "";
          var isFirst = idx === 0;
          var isLast = idx === plans.length - 1;

          var billingShort = plan.period ? plan.period.toLowerCase() : "";
          var billingFilterVal = "monthly";
          if (billingShort.indexOf("3 month") !== -1 || billingShort.indexOf("quarter") !== -1) billingFilterVal = "quarterly";
          else if (billingShort.indexOf("6 month") !== -1 || billingShort.indexOf("biannual") !== -1) billingFilterVal = "biannual";
          else if (billingShort.indexOf("year") !== -1 || billingShort.indexOf("annual") !== -1) billingFilterVal = "annual";

          return (
            '<tr data-status="' + esc(plan.status) + '" data-billing="' + esc(billingFilterVal) + '" data-plan-id="' + esc(plan.id) + '">' +
              '<td class="text-center align-middle">' +
                '<div class="d-flex flex-column align-items-center justify-content-center gap-1">' +
                  '<span class="fw-bold text-dark fs-6">#' + esc(plan.order) + "</span>" +
                  '<div class="btn-group btn-group-sm" role="group">' +
                    '<button type="button" class="btn btn-outline-secondary btn-sm py-0 px-1 btn-reorder-plan" data-dir="up" data-plan-id="' + esc(plan.id) + '" ' + (isFirst ? "disabled" : "") + ' title="Move Up"><i class="bi bi-arrow-up"></i></button>' +
                    '<button type="button" class="btn btn-outline-secondary btn-sm py-0 px-1 btn-reorder-plan" data-dir="down" data-plan-id="' + esc(plan.id) + '" ' + (isLast ? "disabled" : "") + ' title="Move Down"><i class="bi bi-arrow-down"></i></button>' +
                  '</div>' +
                '</div>' +
              '</td>' +
              '<td>' +
                '<div class="person">' +
                  '<img src="' + esc(store.resolveImage(plan.image, "admin", plan.id)) + '" alt="' + esc(plan.name) + '" class="plan-thumb" onerror="this.onerror=null;this.src=\'' + store.FALLBACK_IMAGE + '\';" style="width:58px; height:58px; border-radius:8px; object-fit:cover; background:#eef3f5; border:1px solid #dbe6ea; display:block; flex-shrink:0;">' +
                  "<span>" +
                    '<strong class="d-flex align-items-center flex-wrap gap-1 fs-6">' + esc(plan.name) + featuredBadge + "</strong>" +
                    '<small class="text-muted d-block">' + esc(plan.subtitle || plan.description || "No subtitle") + "</small>" +
                  "</span>" +
                "</div>" +
              "</td>" +
              '<td>' +
                '<div class="d-flex align-items-baseline gap-1">' +
                  '<span class="fw-bold text-navy fs-5">$' + esc(plan.price) + "</span>" +
                  '<span class="text-muted small fw-semibold">' + esc(plan.period) + "</span>" +
                '</div>' +
                '<span class="badge bg-light text-secondary border mt-1" style="font-size:0.7rem;">' + esc(enrollmentLabel(plan.enrollment)) + "</span>" +
              "</td>" +
              '<td>' + discountBadges(plan) + "</td>" +
              '<td>' +
                '<strong class="d-block text-dark small mb-1">' + esc(plan.perkNote || (plan.servicesCount + " services")) + "</strong>" +
                '<div class="text-muted small" style="max-width:280px; line-height:1.3;">' + esc((plan.services || []).join(", ") || "No services listed") + "</div>" +
              "</td>" +
              '<td>' + statusBadge(plan) + "</td>" +
              '<td class="text-end text-nowrap">' +
                '<a class="btn-btc-outline btn-sm-admin me-1" href="membership-edit.html?plan=' + encodeURIComponent(plan.id) + '" title="Edit Plan"><i class="bi bi-pencil me-1"></i> Edit</a>' +
                '<button type="button" class="icon-action me-1 btn-plan-toggle-status" data-plan-id="' + esc(plan.id) + '" title="' + (plan.status === "active" ? "Unpublish (make Draft)" : "Publish (make Live)") + '">' +
                  '<i class="bi ' + (plan.status === "active" ? "bi-eye-slash text-warning" : "bi-broadcast text-success") + '"></i>' +
                '</button>' +
                '<button type="button" class="icon-action me-1 btn-plan-duplicate" data-plan-id="' + esc(plan.id) + '" title="Duplicate Plan"><i class="bi bi-copy"></i></button>' +
                '<button type="button" class="icon-action danger btn-plan-delete" data-plan-id="' + esc(plan.id) + '" data-plan-name="' + esc(plan.name) + '" title="Delete Plan"><i class="bi bi-trash"></i></button>' +
              "</td>" +
            "</tr>"
          );
        }).join("");
      }
    }

    if (grid) {
      if (!plans.length) {
        grid.innerHTML = '<p class="text-muted p-4 text-center">No membership plans yet. Create one to see cards.</p>';
      } else {
        grid.innerHTML = plans.map(function (plan) {
          var featuredClass = plan.featured ? " featured" : "";
          var card = document.createElement("div");
          card.className = "plan-admin-card" + featuredClass;
          card.setAttribute("data-status", plan.status);
          card.setAttribute("data-billing", plan.billing || "monthly");

          var benefitLis = "";
          if (plan.appointmentDiscount) benefitLis += '<li><i class="bi bi-check-circle-fill text-teal"></i> ' + esc(plan.appointmentDiscount) + "</li>";
          if (plan.ivDiscount) benefitLis += '<li><i class="bi bi-check-circle-fill text-teal"></i> ' + esc(plan.ivDiscount) + "</li>";
          if (plan.saunaDiscount) benefitLis += '<li><i class="bi bi-check-circle-fill text-teal"></i> ' + esc(plan.saunaDiscount) + "</li>";

          card.innerHTML =
            '<div class="plan-media-wrap"><img src="' + esc(store.resolveImage(plan.image, "admin", plan.id)) + '" alt="' + esc(plan.name) + '" onerror="this.onerror=null;this.src=\'' + store.FALLBACK_IMAGE + '\';"></div>' +
            '<div class="plan-card-content">' +
              '<div class="d-flex justify-content-between align-items-center mb-2">' +
                statusBadge(plan) +
                '<span class="badge bg-light text-dark border">Order: #' + esc(plan.order) + "</span>" +
              "</div>" +
              '<h3 class="mb-1">' + esc(plan.name) + "</h3>" +
              '<p class="text-muted small mb-2">' + esc(plan.subtitle || "") + "</p>" +
              '<div class="plan-price-tag mb-3">' +
                '<span class="amount">$' + esc(plan.price) + '</span>' +
                '<span class="period">' + esc(plan.period) + '</span>' +
              '</div>' +
              '<ul class="plan-benefit-summary mb-2">' + benefitLis + "</ul>" +
              '<p class="small text-muted mb-2 fw-semibold">' + esc(plan.perkNote || "") + "</p>" +
              '<div class="plan-services-chips mb-3">' +
                (plan.services || []).map(function (s) {
                  return '<span class="service-pill-chip">' + esc(s) + '</span>';
                }).join("") +
              "</div>" +
              '<div class="plan-card-actions">' +
                '<a class="btn-btc btn-sm-admin" href="membership-edit.html?plan=' + encodeURIComponent(plan.id) + '"><i class="bi bi-pencil me-1"></i> Edit</a>' +
                '<div class="d-flex gap-1">' +
                  '<button type="button" class="icon-action btn-plan-toggle-status" data-plan-id="' + esc(plan.id) + '" title="Toggle Status"><i class="bi ' + (plan.status === "active" ? "bi-eye-slash" : "bi-broadcast") + '"></i></button>' +
                  '<button type="button" class="icon-action btn-plan-duplicate" data-plan-id="' + esc(plan.id) + '" title="Duplicate"><i class="bi bi-copy"></i></button>' +
                  '<button type="button" class="icon-action danger btn-plan-delete" data-plan-id="' + esc(plan.id) + '" data-plan-name="' + esc(plan.name) + '" title="Delete"><i class="bi bi-trash"></i></button>' +
                "</div>" +
              "</div>" +
            "</div>";
          return card.outerHTML;
        }).join("");
      }
    }

    applyListFilters();
  }

  function bindList() {
    var tableBtn = document.getElementById("view-table-btn");
    var gridBtn = document.getElementById("view-grid-btn");
    var tableView = document.getElementById("memberships-table-view");
    var gridView = document.getElementById("memberships-grid-view");

    if (tableBtn && gridBtn && tableView && gridView) {
      tableBtn.addEventListener("click", function () {
        tableBtn.classList.add("active");
        gridBtn.classList.remove("active");
        tableView.hidden = false;
        gridView.hidden = true;
      });
      gridBtn.addEventListener("click", function () {
        gridBtn.classList.add("active");
        tableBtn.classList.remove("active");
        tableView.hidden = true;
        gridView.hidden = false;
      });
    }

    // Sortable Table Headers
    document.querySelectorAll(".sortable-th").forEach(function (th) {
      th.addEventListener("click", function () {
        var table = th.closest("table");
        if (!table) return;
        var tbody = table.querySelector("tbody");
        var rows = Array.from(tbody.querySelectorAll("tr"));
        var colIndex = Array.from(th.parentElement.children).indexOf(th);
        var currentAsc = th.getAttribute("data-asc") === "true";
        var newAsc = !currentAsc;
        th.setAttribute("data-asc", String(newAsc));

        document.querySelectorAll(".sortable-th i").forEach(function (ic) {
          ic.className = "bi bi-arrow-down-up";
        });
        var icon = th.querySelector("i");
        if (icon) icon.className = newAsc ? "bi bi-arrow-up" : "bi bi-arrow-down";

        rows.sort(function (a, b) {
          var aVal = a.children[colIndex] ? a.children[colIndex].textContent.trim().replace(/[$,#]/g, "") : "";
          var bVal = b.children[colIndex] ? b.children[colIndex].textContent.trim().replace(/[$,#]/g, "") : "";
          var aNum = parseFloat(aVal);
          var bNum = parseFloat(bVal);
          if (!isNaN(aNum) && !isNaN(bNum)) return newAsc ? aNum - bNum : bNum - aNum;
          return newAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        });
        rows.forEach(function (r) { tbody.appendChild(r); });
      });
    });

    // Action button delegations: Reorder, Toggle Status, Duplicate, Delete
    document.addEventListener("click", function (e) {
      var reorderBtn = e.target.closest(".btn-reorder-plan");
      var toggleBtn = e.target.closest(".btn-plan-toggle-status");
      var dupBtn = e.target.closest(".btn-plan-duplicate");
      var delBtn = e.target.closest(".btn-plan-delete");

      if (reorderBtn) {
        var pid = reorderBtn.getAttribute("data-plan-id");
        var dir = reorderBtn.getAttribute("data-dir");
        store.reorderPlan(pid, dir);
        renderList();
        toast("Display order updated.");
      }

      if (toggleBtn) {
        var tid = toggleBtn.getAttribute("data-plan-id");
        var plan = store.getPlan(tid);
        if (!plan) return;
        var next = plan.status === "active" ? "draft" : "active";
        store.setStatus(tid, next);
        renderList();
        toast('"' + plan.name + '" ' + (next === "active" ? "published to live website." : "moved to drafts (hidden on frontend)."));
      }

      if (dupBtn) {
        var did = dupBtn.getAttribute("data-plan-id");
        var cloned = store.duplicatePlan(did);
        if (cloned) {
          renderList();
          toast('Created copy: "' + cloned.name + '". Click Edit to customize it.');
        }
      }

      if (delBtn) {
        var delId = delBtn.getAttribute("data-plan-id");
        var name = delBtn.getAttribute("data-plan-name") || "this plan";
        if (!window.confirm("Are you sure you want to delete " + name + "? This will remove it from the patient website.")) return;
        store.deletePlan(delId);
        renderList();
        toast(name + " deleted successfully.");
      }
    });

    // Save Policy Button
    var savePolicy = document.getElementById("btn-save-policy");
    var policyField = document.getElementById("intro-policy-text");
    if (savePolicy && policyField) {
      savePolicy.addEventListener("click", function () {
        store.savePolicy(policyField.value);
        toast("Membership policy statement saved and live!");
      });
    }

    // Reset to Defaults Button
    var resetBtn = document.getElementById("btn-reset-defaults");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (window.confirm("Reset all membership plans to the original clinic defaults (Standard, Specialized, Family)? Any custom plans will be replaced.")) {
          store.resetToDefaults();
          renderList();
          toast("Membership plans restored to original clinic defaults.");
        }
      });
    }

    // Search and filters
    var search = document.querySelector("[data-table-search='memberships-table']");
    if (search) search.addEventListener("input", applyListFilters);
    document.querySelectorAll("[data-filter-table='memberships-table']").forEach(function (sel) {
      sel.addEventListener("change", applyListFilters);
    });
  }

  /* =========================================================================
     EDITOR & LIVE PREVIEW WORKFLOW (MEMBERSHIP-EDIT.HTML)
     ========================================================================= */

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value : "";
  }

  function setVal(id, value) {
    var el = document.getElementById(id);
    if (el) el.value = value == null ? "" : value;
  }

  function extractDiscountNum(val) {
    if (val === null || val === undefined) return "";
    var match = String(val).match(/\d+/);
    return match ? match[0] : "";
  }

  function formatDiscountVal(inputVal, suffix) {
    if (!inputVal && inputVal !== 0) return "";
    var digits = String(inputVal).replace(/[^0-9]/g, "");
    if (!digits) return "";
    var num = parseInt(digits, 10);
    if (isNaN(num) || num <= 0) return "";
    return num + suffix;
  }

  function currentPlanId() {
    var hidden = document.getElementById("plan-id");
    return hidden ? hidden.value : param("plan");
  }

  function readForm() {
    var featured = document.getElementById("plan-featured");
    var price = val("plan-price").trim();
    var period = val("plan-period");
    var priceLabel = val("plan-price-label") || ("Membership Price $" + price + (period ? " " + period : ""));

    return {
      id: currentPlanId(),
      name: val("plan-name").trim(),
      subtitle: val("plan-subtitle").trim(),
      description: val("plan-desc").trim(),
      price: price,
      period: period,
      priceLabel: priceLabel,
      enrollment: val("plan-enrollment") || "open",
      featured: !!(featured && featured.checked),
      appointmentDiscount: formatDiscountVal(val("plan-appt-discount"), "% off All Appointments"),
      ivDiscount: formatDiscountVal(val("plan-iv-discount"), "% off All IV Therapies"),
      saunaDiscount: formatDiscountVal(val("plan-sauna-discount"), "% off All Infrared Sauna Therapy"),
      perkNote: val("plan-perk-note").trim(),
      servicesCount: parseInt(val("plan-services-count"), 10) || 2,
      servicesFrequency: val("plan-services-freq") || "month",
      services: collectServices(),
      image: val("plan-image") || (document.getElementById("plan-preview-img") && document.getElementById("plan-preview-img").getAttribute("data-src")) || "",
      ctaText: val("plan-cta-text").trim() || "Join Now",
      ctaLink: val("plan-cta-link").trim() || "book-appointment.html",
      order: parseInt(val("plan-order"), 10) || 1,
      status: val("plan-status") || "draft"
    };
  }

  function updateLivePreviewCard() {
    var preview = document.getElementById("live-card-preview-container");
    if (!preview) return;

    var plan = readForm();
    var featuredClass = plan.featured ? " membership-card-featured" : "";
    var bannerImg = store.resolveImage(plan.image, "admin", plan.id);

    var benefitsHtml = "";
    if (plan.appointmentDiscount) {
      benefitsHtml += '<li><i class="bi bi-check-circle-fill"></i> ' + esc(plan.appointmentDiscount) + "</li>";
    }
    if (plan.ivDiscount) {
      benefitsHtml += '<li><i class="bi bi-check-circle-fill"></i> ' + esc(plan.ivDiscount) + "</li>";
    }
    if (plan.saunaDiscount) {
      benefitsHtml += '<li><i class="bi bi-check-circle-fill"></i> ' + esc(plan.saunaDiscount) + "</li>";
    }

    var servicesHtml = (plan.services || []).map(function (s) {
      return "<li>" + esc(s) + "</li>";
    }).join("");

    var priceLabel = plan.priceLabel || ("Membership Price $" + (plan.price || "0") + (plan.period ? " " + plan.period : ""));

    preview.innerHTML =
      '<article class="membership-card' + featuredClass + '">' +
        '<div class="membership-card-media">' +
          '<img src="' + esc(bannerImg) + '" alt="' + esc(plan.name || "Membership Plan") + '" onerror="this.onerror=null;this.src=\'' + store.FALLBACK_IMAGE + '\';">' +
        "</div>" +
        '<div class="membership-card-body">' +
          "<h3>" + esc(plan.name || "Plan Name") + "</h3>" +
          '<div class="membership-price">' +
            '<span class="membership-amount">$' + esc(plan.price || "0") + "</span>" +
            '<span class="membership-period">' + esc(plan.period || "/Month") + "</span>" +
          "</div>" +
          '<p class="membership-price-label">' + esc(priceLabel) + "</p>" +
          "<h4>This Package Includes:</h4>" +
          '<ul class="membership-benefits">' + benefitsHtml + "</ul>" +
          (plan.perkNote ? '<p class="membership-perk-note">' + esc(plan.perkNote) + "</p>" : "") +
          '<ul class="membership-services">' + servicesHtml + "</ul>" +
          '<a class="btn-btc membership-join" href="#" onclick="return false;">' + esc(plan.ctaText || "Join Now") + "</a>" +
        "</div>" +
      "</article>";
  }

  function fillForm(plan, isNew) {
    var idField = document.getElementById("plan-id");
    if (idField) idField.value = isNew ? "new" : plan.id;
    setVal("plan-name", plan.name);
    setVal("plan-subtitle", plan.subtitle);
    setVal("plan-desc", plan.description);
    setVal("plan-price", plan.price);
    setVal("plan-period", plan.period);
    setVal("plan-price-label", plan.priceLabel);
    setVal("plan-enrollment", plan.enrollment || "open");
    setVal("plan-appt-discount", extractDiscountNum(plan.appointmentDiscount));
    setVal("plan-iv-discount", extractDiscountNum(plan.ivDiscount));
    setVal("plan-sauna-discount", extractDiscountNum(plan.saunaDiscount));
    setVal("plan-perk-note", plan.perkNote);
    setVal("plan-services-count", plan.servicesCount);
    setVal("plan-services-freq", plan.servicesFrequency || "month");
    setVal("plan-cta-text", plan.ctaText || "Join Now");
    setVal("plan-cta-link", plan.ctaLink || "book-appointment.html");
    setVal("plan-order", plan.order);
    setVal("plan-status", plan.status);
    setVal("plan-image", plan.image || "");

    var featured = document.getElementById("plan-featured");
    if (featured) featured.checked = !!plan.featured;

    var img = document.getElementById("plan-preview-img");
    if (img) {
      img.src = store.resolveImage(plan.image, "admin", plan.id);
      img.onerror = function () {
        this.onerror = null;
        this.src = store.FALLBACK_IMAGE;
      };
      img.setAttribute("data-src", plan.image || "");
    }

    renderServices(plan.services || []);
    updateStatusBadge(plan.status);

    var crumb = document.getElementById("plan-crumb-label");
    var last = document.getElementById("plan-last-saved");
    if (crumb) crumb.textContent = isNew ? "Create Membership Plan" : "Edit: " + (plan.name || "Plan");
    if (last) last.textContent = isNew ? "Not saved yet" : formatSaved(plan.updatedAt);

    var del = document.getElementById("btn-delete-plan");
    if (del) del.hidden = isNew;

    var selector = document.getElementById("edit-plan-selector");
    if (selector) selector.value = isNew ? "new" : plan.id;

    document.title = (isNew ? "Create Membership Plan" : "Edit Membership Plan") + " | Be The Change Admin";

    updateLivePreviewCard();
  }

  function updateStatusBadge(status) {
    var badge = document.getElementById("badge-plan-status-label");
    if (!badge) return;
    if (status === "active") {
      badge.className = "badge-admin badge-published";
      badge.innerHTML = '<i class="bi bi-broadcast me-1"></i>Active / Live';
    } else {
      badge.className = "badge-admin badge-draft";
      badge.innerHTML = '<i class="bi bi-eye-slash me-1"></i>Draft / Inactive';
    }
  }

  function populateSelector(selectedId) {
    var selector = document.getElementById("edit-plan-selector");
    if (!selector) return;
    var plans = store.getPlans();
    var html = plans
      .map(function (p, i) {
        var label = (i + 1) + ". " + p.name + " ($" + p.price + (p.featured ? " · Featured" : "") + ")";
        return '<option value="' + esc(p.id) + '">' + esc(label) + "</option>";
      })
      .join("");
    html += '<option value="new">+ Create Blank / New Plan</option>';
    selector.innerHTML = html;
    selector.value = selectedId || "new";
  }

  function validate(plan) {
    if (!plan.name.trim()) return "Please enter a membership plan name.";
    if (!plan.price) return "Please enter a membership fee ($).";
    if (!plan.period) return "Please select a billing period.";
    if (!plan.ctaText.trim()) return "Please enter CTA button text.";
    return "";
  }

  function persist(statusOverride) {
    var plan = readForm();
    if (statusOverride) plan.status = statusOverride;
    var err = validate(plan);
    if (err) {
      toast(err, "warn");
      return null;
    }
    var saved = store.upsertPlan(plan);
    fillForm(saved, false);
    populateSelector(saved.id);
    history.replaceState({}, "", "membership-edit.html?plan=" + encodeURIComponent(saved.id));
    return saved;
  }

  function bindEdit() {
    bindServiceManager();

    var planKey = param("plan") || "new";
    var isNew = planKey === "new" || !store.getPlan(planKey);
    var plan = isNew ? store.blankPlan() : store.getPlan(planKey);

    populateSelector(isNew ? "new" : plan.id);
    fillForm(plan, isNew);

    // Switcher
    var selector = document.getElementById("edit-plan-selector");
    if (selector) {
      selector.addEventListener("change", function () {
        var key = selector.value;
        if (key === "new") {
          fillForm(store.blankPlan(), true);
          history.replaceState({}, "", "membership-edit.html?plan=new");
        } else {
          var next = store.getPlan(key);
          if (next) {
            fillForm(next, false);
            history.replaceState({}, "", "membership-edit.html?plan=" + encodeURIComponent(key));
          }
        }
      });
    }

    // Auto-update live preview on any input change
    var form = document.getElementById("membership-plan-form");
    if (form) {
      form.addEventListener("input", function (e) {
        if (e.target.id === "plan-appt-discount" || e.target.id === "plan-iv-discount" || e.target.id === "plan-sauna-discount") {
          var raw = e.target.value;
          var cleaned = raw.replace(/[^0-9]/g, "");
          if (raw !== cleaned) {
            e.target.value = cleaned;
          }
        }
        if (e.target.id === "plan-price" || e.target.id === "plan-period") {
          var pVal = val("plan-price");
          var perVal = val("plan-period");
          var labelEl = document.getElementById("plan-price-label");
          if (labelEl) labelEl.value = "Membership Price $" + pVal + (perVal ? " " + perVal : "");
        }
        if (e.target.id === "plan-services-count" || e.target.id === "plan-services-freq") {
          var count = val("plan-services-count") || "2";
          var freq = val("plan-services-freq");
          var countWord = count === "1" ? "One" : (count === "2" ? "Two" : (count === "3" ? "Three" : count));
          var perkField = document.getElementById("plan-perk-note");
          if (perkField) {
            if (freq === "year") perkField.value = "Plus " + countWord + " of the following services each year";
            else if (freq === "month") perkField.value = "Plus " + countWord + " of the following services each month per person:";
            else if (freq === "quarter") perkField.value = "Plus " + countWord + " of the following services each 3 months:";
          }
        }
        updateLivePreviewCard();
      });

      form.addEventListener("change", function (e) {
        if (e.target.id === "plan-status") {
          updateStatusBadge(e.target.value);
        }
        updateLivePreviewCard();
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var saved = persist();
        if (saved) toast('"' + saved.name + '" saved. Changes are now live on the website!');
      });
    }

    // Save Buttons
    var saveTop = document.getElementById("btn-save-plan");
    var saveDraft = document.getElementById("btn-save-draft");
    var publish = document.getElementById("btn-publish-plan");
    var dupBtn = document.getElementById("btn-duplicate-plan");

    if (saveTop) {
      saveTop.addEventListener("click", function () {
        var saved = persist();
        if (saved) toast('"' + saved.name + '" saved successfully.');
      });
    }

    if (saveDraft) {
      saveDraft.addEventListener("click", function () {
        var saved = persist("draft");
        if (saved) toast('"' + saved.name + '" saved as Draft (hidden on patient frontend).');
      });
    }

    if (publish) {
      publish.addEventListener("click", function () {
        var saved = persist("active");
        if (saved) toast('"' + saved.name + '" published! It is now live on memberships.html.');
      });
    }

    if (dupBtn) {
      dupBtn.addEventListener("click", function () {
        var curId = currentPlanId();
        if (curId === "new") return;
        var cloned = store.duplicatePlan(curId);
        if (cloned) {
          toast('Created copy "' + cloned.name + '". Loading now...');
          setTimeout(function () {
            location.href = "membership-edit.html?plan=" + encodeURIComponent(cloned.id);
          }, 400);
        }
      });
    }

    // Delete Button
    var del = document.getElementById("btn-delete-plan");
    if (del) {
      del.addEventListener("click", function () {
        var id = currentPlanId();
        var name = val("plan-name") || "this plan";
        if (id === "new" || !store.getPlan(id)) return;
        if (!window.confirm("Delete " + name + "? This will remove it from the patient website.")) return;
        store.deletePlan(id);
        toast(name + " deleted.");
        setTimeout(function () { location.href = "memberships.html"; }, 600);
      });
    }

    // Image Upload
    var fileInput = document.querySelector("#plan-image-upload");
    if (fileInput) {
      fileInput.addEventListener("change", function () {
        var f = fileInput.files && fileInput.files[0];
        if (!f) return;
        if (f.size > 2000000) {
          toast("Please choose an image under 2MB.", "warn");
          return;
        }
        var reader = new FileReader();
        reader.onload = function () {
          var dataUrl = reader.result;
          setVal("plan-image", dataUrl);
          var img = document.getElementById("plan-preview-img");
          if (img) {
            img.src = dataUrl;
            img.setAttribute("data-src", dataUrl);
          }
          updateLivePreviewCard();
          toast("Banner photo attached! Remember to save the plan.");
        };
        reader.readAsDataURL(f);
      });
    }

    // Image preset gallery selection
    document.querySelectorAll(".image-preset-choice").forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        var path = thumb.getAttribute("data-img-path");
        if (!path) return;
        setVal("plan-image", path);
        var img = document.getElementById("plan-preview-img");
        if (img) {
          img.src = store.resolveImage(path, "admin");
          img.onerror = function () {
            this.onerror = null;
            this.src = store.FALLBACK_IMAGE;
          };
          img.setAttribute("data-src", path);
        }
        document.querySelectorAll(".image-preset-choice").forEach(function (el) {
          el.classList.remove("border-teal", "selected");
        });
        thumb.classList.add("border-teal", "selected");
        updateLivePreviewCard();
        toast("Applied clinic banner image.");
      });
    });
  }

  /* =========================================================================
     LIVE PREVIEW PAGE (MEMBERSHIP-PREVIEW.HTML)
     ========================================================================= */

  function bindPreview() {
    var frame = document.getElementById("membership-live-frame");
    var container = document.getElementById("preview-screen-frame");

    // Responsive device toggle buttons
    document.querySelectorAll(".device-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".device-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var view = btn.getAttribute("data-viewport");
        if (container) {
          container.className = "preview-screen-frame view-" + view;
          if (view === "mobile") {
            container.style.maxWidth = "390px";
            container.style.margin = "0 auto";
          } else if (view === "tablet") {
            container.style.maxWidth = "768px";
            container.style.margin = "0 auto";
          } else {
            container.style.maxWidth = "100%";
            container.style.margin = "0";
          }
        }
      });
    });

    var publish = document.getElementById("btn-publish-all");
    if (publish) {
      publish.addEventListener("click", function () {
        var plans = store.getPlans();
        plans.forEach(function (p) {
          store.setStatus(p.id, "active");
        });
        if (frame) frame.src = frame.src;
        toast("All membership plans are now published and active on the live website!");
      });
    }
  }

  /* =========================================================================
     INITIALIZE ON DOM READY
     ========================================================================= */

  document.addEventListener("DOMContentLoaded", function () {
    if (PAGE === "memberships") {
      renderList();
      bindList();
    }
    if (PAGE === "membership-edit") {
      bindEdit();
    }
    if (PAGE === "membership-preview") {
      bindPreview();
    }
  });
})();
