/**
 * Be The Change Health & Wellness Center — Admin Blog CMS Controller
 * Controls Blog directory, full Add/Edit workflow (both modal and standalone page),
 * Media Library integration, live preview, formatting toolbar, and data persistence.
 */
(function () {
  "use strict";

  var PAGE = document.body.getAttribute("data-page") || "";
  var store = window.BTCBlogStore;

  function toast(msg, type) {
    if (window.BTCAdmin && window.BTCAdmin.toast) {
      window.BTCAdmin.toast(msg, type);
    } else {
      alert(msg);
    }
  }

  function getQueryParam(param) {
    var search = window.location.search.substring(1);
    if (!search) return null;
    var pairs = search.split("&");
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split("=");
      if (decodeURIComponent(pair[0]) === param) {
        return decodeURIComponent(pair[1] || "");
      }
    }
    return null;
  }

  function formatDate(isoStr) {
    if (!isoStr) return "";
    var d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[d.getUTCMonth()] + " " + d.getUTCDate() + ", " + d.getUTCFullYear();
  }

  function escapeAttr(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /* =========================================================================
     REUSABLE MEDIA LIBRARY MODAL CONTROLLER
     ========================================================================= */

  var activeMediaCallback = null;

  function initMediaLibraryModal() {
    var modalEl = document.getElementById("mediaLibraryModal");
    var gridEl = document.getElementById("media-library-grid");
    var searchInput = document.getElementById("media-library-search");
    if (!modalEl || !gridEl || !store) return;

    function renderMedia(filter) {
      var media = store.getClinicMedia();
      var q = (filter || "").toLowerCase().trim();
      gridEl.innerHTML = "";

      var filtered = media.filter(function (item) {
        if (!q) return true;
        return (item.name && item.name.toLowerCase().indexOf(q) !== -1) ||
               (item.title && item.title.toLowerCase().indexOf(q) !== -1) ||
               (item.cat && item.cat.toLowerCase().indexOf(q) !== -1);
      });

      if (filtered.length === 0) {
        gridEl.innerHTML = '<div class="text-center py-4 text-muted w-100"><i class="bi bi-images fs-3 d-block mb-1"></i>No media assets found matching search.</div>';
        return;
      }

      filtered.forEach(function (item) {
        var tile = document.createElement("div");
        tile.className = "media-picker-tile";
        tile.innerHTML =
          '<img src="' + item.url + '" alt="' + (item.title || "") + '" loading="lazy">' +
          '<div class="media-meta">' +
            '<strong>' + (item.title || item.name) + '</strong>' +
            '<span>' + (item.cat || "Media") + '</span>' +
          '</div>';

        tile.addEventListener("click", function () {
          if (activeMediaCallback) {
            activeMediaCallback(item.url, item);
          }
          var bsModal = bootstrap.Modal.getInstance(modalEl);
          if (bsModal) bsModal.hide();
        });

        gridEl.appendChild(tile);
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        renderMedia(searchInput.value);
      });
    }

    modalEl.addEventListener("show.bs.modal", function () {
      if (searchInput) searchInput.value = "";
      renderMedia("");
    });
  }

  function openMediaLibrary(onSelect) {
    activeMediaCallback = onSelect;
    var modalEl = document.getElementById("mediaLibraryModal");
    if (!modalEl) return;
    var modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }

  /* =========================================================================
     BLOG DIRECTORY & MODAL CMS WORKFLOW (Admin/pages/blog.html)
     ========================================================================= */

  function initBlogDirectory() {
    var tbody = document.getElementById("blog-table-body");
    if (!tbody || !store) return;

    var searchInput = document.getElementById("blog-search-input");
    var catFilter = document.getElementById("blog-filter-cat");
    var statusFilter = document.getElementById("blog-filter-status");
    var featuredFilter = document.getElementById("blog-filter-featured");
    var authorFilter = document.getElementById("blog-filter-author");
    var sortSelect = document.getElementById("blog-sort-select");
    var countEl = document.getElementById("blog-visible-count");
    var emptyEl = document.getElementById("blog-empty-state");
    var clearFiltersBtn = document.getElementById("btn-clear-filters");

    // Populate Author Filter
    function populateAuthorFilter() {
      if (!authorFilter) return;
      var authors = store.getAuthors();
      var cur = authorFilter.value;
      authorFilter.innerHTML = '<option value="all">All Authors</option>';
      authors.forEach(function (a) {
        var opt = document.createElement("option");
        opt.value = a;
        opt.textContent = a;
        if (a === cur) opt.selected = true;
        authorFilter.appendChild(opt);
      });
    }

    function renderStats() {
      var s = store.getStats();
      var elTotal = document.getElementById("stat-total-articles");
      var elPub = document.getElementById("stat-published-articles");
      var elDraft = document.getElementById("stat-draft-articles");
      var elFeatured = document.getElementById("stat-featured-title");

      if (elTotal) elTotal.textContent = String(s.total);
      if (elPub) elPub.textContent = String(s.published);
      if (elDraft) elDraft.textContent = String(s.drafts);
      if (elFeatured) elFeatured.textContent = s.featuredTitle || "None";
    }

    function renderList() {
      var opts = {
        search: searchInput ? searchInput.value : "",
        category: catFilter ? catFilter.value : "all",
        status: statusFilter ? statusFilter.value : "all",
        featured: featuredFilter && featuredFilter.value === "featured",
        sort: sortSelect ? sortSelect.value : "order"
      };

      var posts = store.getPosts(opts);

      // Client-side author filter
      if (authorFilter && authorFilter.value !== "all") {
        var selAuthor = authorFilter.value.toLowerCase();
        posts = posts.filter(function (p) {
          return p.author && p.author.toLowerCase() === selAuthor;
        });
      }

      if (countEl) countEl.textContent = String(posts.length);

      tbody.innerHTML = "";
      if (posts.length === 0) {
        if (emptyEl) emptyEl.classList.remove("d-none");
        return;
      } else {
        if (emptyEl) emptyEl.classList.add("d-none");
      }

      posts.forEach(function (p) {
        var tr = document.createElement("tr");
        tr.setAttribute("data-id", p.id);

        var isPub = p.status === "published";
        var statusBadge = isPub
          ? '<button type="button" class="badge-admin badge-published btn-toggle-status border-0" title="Click to Unpublish / Draft"><i class="bi bi-broadcast me-1"></i>Published</button>'
          : '<button type="button" class="badge-admin badge-draft btn-toggle-status border-0" title="Click to Publish to Live Website"><i class="bi bi-pencil-square me-1"></i>Draft</button>';

        var starClass = p.featured ? "active" : "";
        var starTitle = p.featured ? "Featured on Blog Landing Page" : "Click to set as Featured";

        var imgUrl = store.resolveImage(p.image, "admin", p.id);
        var formattedDate = formatDate(p.date);
        var fallbackSrc = store.FALLBACK_IMAGE;

        // Tags badges
        var tagBadges = (p.tags || []).slice(0, 3).map(function (t) {
          return '<span class="badge bg-light text-secondary border me-1 small">' + t + '</span>';
        }).join("");

        tr.innerHTML =
          '<td>' +
            '<button type="button" class="featured-star-btn ' + starClass + '" title="' + starTitle + '" data-action="feature">' +
              '<i class="bi ' + (p.featured ? "bi-star-fill" : "bi-star") + '"></i>' +
            '</button>' +
          '</td>' +
          '<td>' +
            '<div class="d-flex align-items-center gap-3">' +
              '<img src="' + escapeAttr(imgUrl) + '" alt="' + escapeAttr(p.title || "Article thumbnail") + '" class="table-thumb" onerror="this.onerror=null;this.src=\'' + fallbackSrc + '\';">' +
              '<div>' +
                '<a href="javascript:void(0)" class="fw-bold text-dark text-decoration-none d-block mb-1 hover-teal btn-edit-post-title" data-action="edit">' +
                  p.title +
                '</a>' +
                '<p class="text-muted small mb-1" style="max-width:380px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">' +
                  (p.excerpt || "") +
                '</p>' +
                '<div class="d-flex align-items-center gap-2 text-muted" style="font-size:0.75rem;">' +
                  '<span><i class="bi bi-person me-1"></i>' + (p.author || "Sultana Afrooz, D.O.") + '</span>' +
                  '<span>•</span>' +
                  '<span><i class="bi bi-clock me-1"></i>' + (p.readTime || "5 min read") + '</span>' +
                  '<span>•</span>' +
                  '<span class="text-primary font-monospace">/' + p.slug + '</span>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</td>' +
          '<td>' +
            '<span class="blog-cat-badge mb-1">' + (p.category || "Therapies") + '</span>' +
            '<div class="mt-1">' + tagBadges + '</div>' +
          '</td>' +
          '<td>' +
            '<span class="text-nowrap small text-dark fw-medium">' + formattedDate + '</span>' +
          '</td>' +
          '<td>' + statusBadge + '</td>' +
          '<td class="text-end">' +
            '<div class="d-flex justify-content-end align-items-center gap-1">' +
              '<button type="button" class="icon-action btn-edit-post" data-action="edit" title="Edit article in CMS">' +
                '<i class="bi bi-pencil"></i>' +
              '</button>' +
              '<a class="icon-action" href="blog-preview.html?post=' + encodeURIComponent(p.id) + '" title="Open Live Preview Screen" target="_blank">' +
                '<i class="bi bi-eye"></i>' +
              '</a>' +
              '<button type="button" class="icon-action" data-action="duplicate" title="Duplicate article as draft">' +
                '<i class="bi bi-copy"></i>' +
              '</button>' +
              '<button type="button" class="icon-action danger" data-action="delete" title="Delete article">' +
                '<i class="bi bi-trash"></i>' +
              '</button>' +
            '</div>' +
          '</td>';

        tbody.appendChild(tr);
      });
    }

    // Filter event listeners
    if (searchInput) searchInput.addEventListener("input", renderList);
    if (catFilter) catFilter.addEventListener("change", renderList);
    if (statusFilter) statusFilter.addEventListener("change", renderList);
    if (featuredFilter) featuredFilter.addEventListener("change", renderList);
    if (authorFilter) authorFilter.addEventListener("change", renderList);
    if (sortSelect) sortSelect.addEventListener("change", renderList);

    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", function () {
        if (searchInput) searchInput.value = "";
        if (catFilter) catFilter.value = "all";
        if (statusFilter) statusFilter.value = "all";
        if (featuredFilter) featuredFilter.value = "all";
        if (authorFilter) authorFilter.value = "all";
        if (sortSelect) sortSelect.value = "order";
        renderList();
      });
    }

    /* -----------------------------------------------------------------------
       MODAL FORM CMS WORKFLOW (#blogEditorModal)
       ----------------------------------------------------------------------- */

    var modalEl = document.getElementById("blogEditorModal");
    var modalLabel = document.getElementById("modal-article-title-text");
    var modalStatusBadge = document.getElementById("modal-status-badge");
    var modalPreviewLink = document.getElementById("modal-btn-open-preview");

    // Modal Form Inputs
    var mPostId = document.getElementById("modal-post-id");
    var mTitle = document.getElementById("modal-title");
    var mSlug = document.getElementById("modal-slug");
    var mSlugLockBtn = document.getElementById("modal-btn-slug-lock");
    var mSlugLockIcon = document.getElementById("modal-slug-lock-icon");
    var mExcerpt = document.getElementById("modal-excerpt");
    var mExcerptCount = document.getElementById("modal-excerpt-count");
    var mContent = document.getElementById("modal-content");
    var mWordCount = document.getElementById("modal-word-count");
    var mEstReadTime = document.getElementById("modal-est-read-time");
    var mStatus = document.getElementById("modal-status");
    var mFeatured = document.getElementById("modal-featured");
    var mAuthor = document.getElementById("modal-author");
    var mAuthorCustom = document.getElementById("modal-author-custom");
    var mCategory = document.getElementById("modal-category");
    var mCategoryCustom = document.getElementById("modal-category-custom");
    var mTags = document.getElementById("modal-tags");
    var mDate = document.getElementById("modal-date");
    var mReadTime = document.getElementById("modal-read-time");
    var mOrder = document.getElementById("modal-order");

    // Modal Image
    var mImageVal = document.getElementById("modal-image-val");
    var mImagePreview = document.getElementById("modal-image-preview-el");
    var mImageUrlInput = document.getElementById("modal-image-url-input");
    var mBtnChooseMedia = document.getElementById("modal-btn-choose-media");
    var mBtnUploadTrigger = document.getElementById("modal-btn-upload-trigger");
    var mFileInput = document.getElementById("modal-file-upload-input");
    var mBtnRemoveImage = document.getElementById("modal-btn-remove-image");

    // Modal CTA
    var mCtaToggle = document.getElementById("modal-cta-toggle");
    var mCtaFields = document.getElementById("modal-cta-fields");
    var mCtaHeading = document.getElementById("modal-cta-heading");
    var mCtaPrimaryText = document.getElementById("modal-cta-primary-text");
    var mCtaPrimaryLink = document.getElementById("modal-cta-primary-link");
    var mCtaSecondaryText = document.getElementById("modal-cta-secondary-text");
    var mCtaSecondaryLink = document.getElementById("modal-cta-secondary-link");

    // Modal SEO
    var mSeoTitle = document.getElementById("modal-seo-title");
    var mSeoTitleCount = document.getElementById("modal-seo-title-count");
    var mSeoDesc = document.getElementById("modal-seo-desc");
    var mSeoDescCount = document.getElementById("modal-seo-desc-count");
    var mSeoKeywords = document.getElementById("modal-seo-keywords");
    var mSerpTitle = document.getElementById("modal-serp-title");
    var mSerpSlug = document.getElementById("modal-serp-slug");
    var mSerpDesc = document.getElementById("modal-serp-desc");

    // Modal Live Card Preview
    var mPvImg = document.getElementById("modal-preview-card-img");
    var mPvCat = document.getElementById("modal-preview-card-cat");
    var mPvDate = document.getElementById("modal-preview-card-date");
    var mPvTitle = document.getElementById("modal-preview-card-title");
    var mPvExcerpt = document.getElementById("modal-preview-card-excerpt");
    var mPvAuthor = document.getElementById("modal-preview-card-author");

    // Modal Action Buttons
    var mBtnSaveDraft = document.getElementById("modal-btn-save-draft");
    var mBtnPublish = document.getElementById("modal-btn-publish");
    var mBtnDelete = document.getElementById("modal-btn-delete-article");

    var slugAutoGenerate = true;

    function updateModalLivePreview() {
      var title = (mTitle ? mTitle.value : "").trim() || "Article Headline";
      var slug = (mSlug ? mSlug.value : "").trim() || "article-slug";
      var excerpt = (mExcerpt ? mExcerpt.value : "").trim() || "Article teaser excerpt will appear here.";
      var author = mAuthor && mAuthor.value === "custom"
        ? ((mAuthorCustom ? mAuthorCustom.value : "").trim() || "Custom Author")
        : (mAuthor ? mAuthor.value : "Dr. Sultana Afrooz, D.O.");
      var category = mCategory && mCategory.value === "custom"
        ? ((mCategoryCustom ? mCategoryCustom.value : "").trim() || "General")
        : (mCategory ? mCategory.value : "Therapies");
      var dateStr = (mDate ? mDate.value : "") || new Date().toISOString().split("T")[0];
      var img = (mImageVal ? mImageVal.value : "") || "assets/uploads/2024/08/What-is-Microcurrent-1024x683-1.jpg";

      // Card Preview
      if (mPvTitle) mPvTitle.textContent = title;
      if (mPvExcerpt) mPvExcerpt.textContent = excerpt;
      if (mPvCat) mPvCat.textContent = category;
      if (mPvAuthor) mPvAuthor.textContent = author;
      if (mPvDate) mPvDate.textContent = formatDate(dateStr);
      if (mPvImg) {
        mPvImg.src = store.resolveImage(img, "admin");
        mPvImg.onerror = function () {
          this.onerror = null;
          this.src = store.FALLBACK_IMAGE;
        };
      }

      // SERP Preview
      var seoT = (mSeoTitle ? mSeoTitle.value : "").trim() || title;
      var seoD = (mSeoDesc ? mSeoDesc.value : "").trim() || excerpt;
      if (mSerpTitle) mSerpTitle.textContent = seoT;
      if (mSerpSlug) mSerpSlug.textContent = slug;
      if (mSerpDesc) mSerpDesc.textContent = seoD;

      // Status badge
      var status = mStatus ? mStatus.value : "draft";
      if (modalStatusBadge) {
        modalStatusBadge.textContent = status === "published" ? "Published (Live)" : "Draft";
        modalStatusBadge.className = "badge-admin ms-2 " + (status === "published" ? "badge-published" : "badge-draft");
      }
    }

    function openEditorModal(postOrNull) {
      if (!modalEl) return;
      var isNew = !postOrNull;

      // Switch to first tab
      var firstTab = document.getElementById("tab-content-btn");
      if (firstTab && window.bootstrap && bootstrap.Tab) {
        bootstrap.Tab.getOrCreateInstance(firstTab).show();
      }

      if (isNew) {
        if (modalLabel) modalLabel.textContent = "Add New Article";
        if (mBtnDelete) mBtnDelete.classList.add("d-none");
        if (modalPreviewLink) modalPreviewLink.classList.add("d-none");

        mPostId.value = "";
        mTitle.value = "";
        mSlug.value = "";
        slugAutoGenerate = true;
        if (mSlugLockIcon) mSlugLockIcon.className = "bi bi-lock-fill";

        mExcerpt.value = "";
        if (mExcerptCount) mExcerptCount.textContent = "0";

        mContent.value = "";
        if (mWordCount) mWordCount.textContent = "0";
        if (mEstReadTime) mEstReadTime.textContent = "1 min read";

        mStatus.value = "draft";
        mFeatured.checked = false;

        mAuthor.value = "Sultana Afrooz, D.O.";
        if (mAuthorCustom) { mAuthorCustom.classList.add("d-none"); mAuthorCustom.value = ""; }

        mCategory.value = "Therapies";
        if (mCategoryCustom) { mCategoryCustom.classList.add("d-none"); mCategoryCustom.value = ""; }

        mTags.value = "therapies, wellness";
        mDate.value = new Date().toISOString().split("T")[0];
        mReadTime.value = "5 min read";
        mOrder.value = store.getPosts().length + 1;

        var defImg = store.resolveImage("assets/uploads/2024/08/What-is-Microcurrent-1024x683-1.jpg", "admin");
        mImageVal.value = defImg;
        if (mImagePreview) {
          mImagePreview.src = defImg;
          mImagePreview.onerror = function () {
            this.onerror = null;
            this.src = store.FALLBACK_IMAGE;
          };
        }
        if (mImageUrlInput) mImageUrlInput.value = defImg;

        // CTA
        if (mCtaToggle) mCtaToggle.checked = true;
        if (mCtaHeading) mCtaHeading.value = "Ready to experience these therapies?";
        if (mCtaPrimaryText) mCtaPrimaryText.value = "REQUEST AN APPOINTMENT";
        if (mCtaPrimaryLink) mCtaPrimaryLink.value = "../contact.html";
        if (mCtaSecondaryText) mCtaSecondaryText.value = "Learn more about this service";
        if (mCtaSecondaryLink) mCtaSecondaryLink.value = "../services/index.html";

        // SEO
        if (mSeoTitle) mSeoTitle.value = "";
        if (mSeoTitleCount) mSeoTitleCount.textContent = "0";
        if (mSeoDesc) mSeoDesc.value = "";
        if (mSeoDescCount) mSeoDescCount.textContent = "0";
        if (mSeoKeywords) mSeoKeywords.value = "";
      } else {
        var p = postOrNull;
        if (modalLabel) modalLabel.textContent = "Edit Article: " + p.title;
        if (mBtnDelete) mBtnDelete.classList.remove("d-none");
        if (modalPreviewLink) {
          modalPreviewLink.classList.remove("d-none");
          modalPreviewLink.href = "blog-preview.html?post=" + encodeURIComponent(p.id);
        }

        mPostId.value = p.id || "";
        mTitle.value = p.title || "";
        mSlug.value = p.slug || "";
        slugAutoGenerate = false;
        if (mSlugLockIcon) mSlugLockIcon.className = "bi bi-unlock";

        mExcerpt.value = p.excerpt || "";
        if (mExcerptCount) mExcerptCount.textContent = String(p.excerpt ? p.excerpt.length : 0);

        mContent.value = p.content || "";
        var words = (p.content || "").replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
        if (mWordCount) mWordCount.textContent = String(words);
        if (mEstReadTime) mEstReadTime.textContent = (p.readTime || store.calcReadTime(p.content));

        mStatus.value = p.status || "published";
        mFeatured.checked = !!p.featured;

        var stdAuthors = ["Sultana Afrooz, D.O.", "Jessica Needle, N.D.", "Be The Change Staff"];
        if (stdAuthors.indexOf(p.author) !== -1) {
          mAuthor.value = p.author;
          if (mAuthorCustom) { mAuthorCustom.classList.add("d-none"); mAuthorCustom.value = ""; }
        } else {
          mAuthor.value = "custom";
          if (mAuthorCustom) { mAuthorCustom.classList.remove("d-none"); mAuthorCustom.value = p.author || ""; }
        }

        var stdCats = ["Therapies", "Wellness", "Detox", "Blog"];
        if (stdCats.indexOf(p.category) !== -1) {
          mCategory.value = p.category;
          if (mCategoryCustom) { mCategoryCustom.classList.add("d-none"); mCategoryCustom.value = ""; }
        } else {
          mCategory.value = "custom";
          if (mCategoryCustom) { mCategoryCustom.classList.remove("d-none"); mCategoryCustom.value = p.category || ""; }
        }

        mTags.value = Array.isArray(p.tags) ? p.tags.join(", ") : (p.tags || "");
        mDate.value = p.date ? p.date.split("T")[0] : new Date().toISOString().split("T")[0];
        mReadTime.value = p.readTime || "5 min read";
        mOrder.value = p.order || 1;

        var resolvedImg = store.resolveImage(p.image, "admin", p.id);
        mImageVal.value = resolvedImg;
        if (mImagePreview) {
          mImagePreview.src = resolvedImg;
          mImagePreview.onerror = function () {
            this.onerror = null;
            this.src = store.FALLBACK_IMAGE;
          };
        }
        if (mImageUrlInput) mImageUrlInput.value = resolvedImg;

        // CTA
        if (mCtaToggle) mCtaToggle.checked = p.ctaTitle !== false;
        if (mCtaHeading) mCtaHeading.value = p.ctaTitle || "Ready to experience these therapies?";
        if (mCtaPrimaryText) mCtaPrimaryText.value = p.ctaPrimaryText || "REQUEST AN APPOINTMENT";
        if (mCtaPrimaryLink) mCtaPrimaryLink.value = p.ctaPrimaryLink || "../contact.html";
        if (mCtaSecondaryText) mCtaSecondaryText.value = p.ctaSecondaryText || "Learn more about this service";
        if (mCtaSecondaryLink) mCtaSecondaryLink.value = p.ctaSecondaryLink || "../services/index.html";

        // SEO
        if (mSeoTitle) {
          mSeoTitle.value = p.seoTitle || "";
          if (mSeoTitleCount) mSeoTitleCount.textContent = String((p.seoTitle || "").length);
        }
        if (mSeoDesc) {
          mSeoDesc.value = p.seoDescription || "";
          if (mSeoDescCount) mSeoDescCount.textContent = String((p.seoDescription || "").length);
        }
        if (mSeoKeywords) mSeoKeywords.value = p.seoKeywords || "";
      }

      updateModalLivePreview();
      var bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
      bsModal.show();
    }

    // Bind Top Button "+ New Article"
    var btnOpenNew = document.getElementById("btn-open-new-article");
    if (btnOpenNew) {
      btnOpenNew.addEventListener("click", function () {
        openEditorModal(null);
      });
    }

    // Modal Slug lock toggle
    if (mSlugLockBtn) {
      mSlugLockBtn.addEventListener("click", function () {
        slugAutoGenerate = !slugAutoGenerate;
        if (mSlugLockIcon) {
          mSlugLockIcon.className = slugAutoGenerate ? "bi bi-lock-fill" : "bi bi-unlock";
        }
        if (slugAutoGenerate && mTitle.value.trim()) {
          mSlug.value = store.slugify(mTitle.value.trim());
          updateModalLivePreview();
        }
      });
    }

    // Title input auto-slug
    if (mTitle) {
      mTitle.addEventListener("input", function () {
        if (slugAutoGenerate) {
          mSlug.value = store.slugify(mTitle.value.trim());
        }
        updateModalLivePreview();
      });
    }

    // Excerpt counter
    if (mExcerpt) {
      mExcerpt.addEventListener("input", function () {
        if (mExcerptCount) mExcerptCount.textContent = String(mExcerpt.value.length);
        updateModalLivePreview();
      });
    }

    // Content word counter & read time
    if (mContent) {
      mContent.addEventListener("input", function () {
        var text = mContent.value.replace(/<[^>]*>/g, " ").trim();
        var words = text ? text.split(/\s+/).filter(Boolean).length : 0;
        if (mWordCount) mWordCount.textContent = String(words);
        var est = Math.max(1, Math.ceil(words / 200)) + " min read";
        if (mEstReadTime) mEstReadTime.textContent = est;
        if (mReadTime && (!mReadTime.value || mReadTime.value.indexOf("min read") !== -1)) {
          mReadTime.value = est;
        }
      });
    }

    // Formatting Toolbar in Modal
    var modalToolbar = document.getElementById("modal-editor-toolbar");
    if (modalToolbar && mContent) {
      modalToolbar.addEventListener("click", function (e) {
        var btn = e.target.closest("button");
        if (!btn) return;

        var start = mContent.selectionStart;
        var end = mContent.selectionEnd;
        var val = mContent.value;
        var sel = val.substring(start, end);
        var replacement = "";

        var cmd = btn.getAttribute("data-cmd");
        var valAttr = btn.getAttribute("data-val");
        var act = btn.getAttribute("data-action");

        if (cmd === "formatBlock") {
          if (valAttr === "h2") replacement = "<h2>" + (sel || "Heading 2") + "</h2>\n";
          else if (valAttr === "h3") replacement = "<h3>" + (sel || "Heading 3") + "</h3>\n";
          else if (valAttr === "h4") replacement = "<h4>" + (sel || "Heading 4") + "</h4>\n";
          else if (valAttr === "p") replacement = "<p>" + (sel || "Paragraph text...") + "</p>\n";
          else if (valAttr === "blockquote") replacement = "<blockquote>\n  <p>" + (sel || "Key quote or clinical takeaway...") + "</p>\n</blockquote>\n";
        } else if (cmd === "bold") {
          replacement = "<strong>" + (sel || "bold text") + "</strong>";
        } else if (cmd === "italic") {
          replacement = "<em>" + (sel || "italic text") + "</em>";
        } else if (cmd === "insertUnorderedList") {
          replacement = "<ul>\n  <li>" + (sel || "Bullet point item") + "</li>\n  <li>Second item</li>\n</ul>\n";
        } else if (cmd === "insertOrderedList") {
          replacement = "<ol>\n  <li>" + (sel || "First step") + "</li>\n  <li>Second step</li>\n</ol>\n";
        } else if (act === "insert-link") {
          var url = window.prompt("Enter link URL (e.g. ../services/ or https://):", "https://");
          if (url) {
            replacement = '<a href="' + url + '">' + (sel || "link text") + '</a>';
          } else {
            return;
          }
        } else if (act === "insert-image") {
          openMediaLibrary(function (imgUrl, item) {
            var imgTag = '<img src="' + imgUrl + '" alt="' + (item.title || "Clinic Image") + '" class="img-fluid rounded mb-3">\n';
            var s = mContent.selectionStart;
            var e = mContent.selectionEnd;
            var v = mContent.value;
            mContent.value = v.substring(0, s) + imgTag + v.substring(e);
            mContent.focus();
            mContent.dispatchEvent(new Event("input"));
          });
          return;
        } else if (act === "clear-tags") {
          replacement = sel.replace(/<[^>]*>/g, "");
        }

        if (replacement) {
          mContent.value = val.substring(0, start) + replacement + val.substring(end);
          mContent.focus();
          mContent.setSelectionRange(start + replacement.length, start + replacement.length);
          mContent.dispatchEvent(new Event("input"));
        }
      });
    }

    // Author custom toggle
    if (mAuthor) {
      mAuthor.addEventListener("change", function () {
        if (mAuthorCustom) {
          mAuthorCustom.classList.toggle("d-none", mAuthor.value !== "custom");
          if (mAuthor.value === "custom") mAuthorCustom.focus();
        }
        updateModalLivePreview();
      });
    }
    if (mAuthorCustom) mAuthorCustom.addEventListener("input", updateModalLivePreview);

    // Category custom toggle
    if (mCategory) {
      mCategory.addEventListener("change", function () {
        if (mCategoryCustom) {
          mCategoryCustom.classList.toggle("d-none", mCategory.value !== "custom");
          if (mCategory.value === "custom") mCategoryCustom.focus();
        }
        updateModalLivePreview();
      });
    }
    if (mCategoryCustom) mCategoryCustom.addEventListener("input", updateModalLivePreview);

    // Image management in modal
    if (mBtnChooseMedia) {
      mBtnChooseMedia.addEventListener("click", function () {
        openMediaLibrary(function (chosenUrl) {
          mImageVal.value = chosenUrl;
          if (mImagePreview) mImagePreview.src = chosenUrl;
          if (mImageUrlInput) mImageUrlInput.value = chosenUrl;
          updateModalLivePreview();
          toast("Image selected from Media Library.");
        });
      });
    }

    if (mBtnUploadTrigger && mFileInput) {
      mBtnUploadTrigger.addEventListener("click", function () {
        mFileInput.click();
      });

      mFileInput.addEventListener("change", function (e) {
        var file = e.target.files && e.target.files[0];
        if (file) {
          var reader = new FileReader();
          reader.onload = function (evt) {
            mImageVal.value = evt.target.result;
            if (mImagePreview) mImagePreview.src = evt.target.result;
            if (mImageUrlInput) mImageUrlInput.value = evt.target.result;
            updateModalLivePreview();
            toast("Custom image file loaded.");
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (mBtnRemoveImage) {
      mBtnRemoveImage.addEventListener("click", function () {
        var placeholder = store.resolveImage("assets/uploads/2024/08/What-is-Microcurrent-1024x683-1.jpg", "admin");
        mImageVal.value = placeholder;
        if (mImagePreview) {
          mImagePreview.src = placeholder;
          mImagePreview.onerror = function () {
            this.onerror = null;
            this.src = store.FALLBACK_IMAGE;
          };
        }
        if (mImageUrlInput) mImageUrlInput.value = "";
        updateModalLivePreview();
        toast("Featured image reset to default.");
      });
    }

    if (mImageUrlInput) {
      mImageUrlInput.addEventListener("input", function () {
        var url = mImageUrlInput.value.trim();
        if (url) {
          mImageVal.value = url;
          if (mImagePreview) {
            mImagePreview.src = store.resolveImage(url, "admin");
            mImagePreview.onerror = function () {
              this.onerror = null;
              this.src = store.FALLBACK_IMAGE;
            };
          }
          updateModalLivePreview();
        }
      });
    }

    // SEO counters
    if (mSeoTitle) {
      mSeoTitle.addEventListener("input", function () {
        if (mSeoTitleCount) mSeoTitleCount.textContent = String(mSeoTitle.value.length);
        updateModalLivePreview();
      });
    }
    if (mSeoDesc) {
      mSeoDesc.addEventListener("input", function () {
        if (mSeoDescCount) mSeoDescCount.textContent = String(mSeoDesc.value.length);
        updateModalLivePreview();
      });
    }

    // CTA toggle
    if (mCtaToggle && mCtaFields) {
      mCtaToggle.addEventListener("change", function () {
        mCtaFields.style.opacity = mCtaToggle.checked ? "1" : "0.4";
        mCtaFields.style.pointerEvents = mCtaToggle.checked ? "auto" : "none";
      });
    }

    // Save Article from Modal
    function saveModalArticle(overrideStatus) {
      var title = mTitle.value.trim();
      if (!title) {
        toast("Please enter an article title.", "warn");
        mTitle.focus();
        return false;
      }

      var author = mAuthor.value === "custom"
        ? (mAuthorCustom.value.trim() || "Sultana Afrooz, D.O.")
        : mAuthor.value;

      var category = mCategory.value === "custom"
        ? (mCategoryCustom.value.trim() || "General")
        : mCategory.value;

      var status = overrideStatus || (mStatus ? mStatus.value : "published");

      var postData = {
        id: mPostId.value || "",
        title: title,
        slug: mSlug.value.trim() || store.slugify(title),
        excerpt: mExcerpt.value.trim(),
        content: mContent.value.trim(),
        category: category,
        tags: mTags.value,
        author: author,
        date: mDate.value || new Date().toISOString().split("T")[0],
        readTime: mReadTime.value.trim() || "5 min read",
        featured: !!mFeatured.checked,
        status: status,
        order: parseInt(mOrder.value, 10) || 1,
        image: mImageVal.value || store.resolveImage("assets/uploads/2024/08/What-is-Microcurrent-1024x683-1.jpg", "admin"),
        ctaTitle: mCtaToggle && mCtaToggle.checked ? (mCtaHeading.value.trim() || "Ready to experience these therapies?") : false,
        ctaPrimaryText: mCtaPrimaryText ? mCtaPrimaryText.value.trim() : "REQUEST AN APPOINTMENT",
        ctaPrimaryLink: mCtaPrimaryLink ? mCtaPrimaryLink.value.trim() : "../contact.html",
        ctaSecondaryText: mCtaSecondaryText ? mCtaSecondaryText.value.trim() : "Learn more about this service",
        ctaSecondaryLink: mCtaSecondaryLink ? mCtaSecondaryLink.value.trim() : "../services/index.html",
        seoTitle: mSeoTitle ? mSeoTitle.value.trim() : "",
        seoDescription: mSeoDesc ? mSeoDesc.value.trim() : "",
        seoKeywords: mSeoKeywords ? mSeoKeywords.value.trim() : ""
      };

      var saved = store.savePost(postData);
      if (saved) {
        toast("Article saved successfully! (" + (saved.status === "published" ? "Published Live" : "Draft") + ")");
        var bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();
        renderStats();
        populateAuthorFilter();
        renderList();
        return true;
      }
      return false;
    }

    if (mBtnSaveDraft) {
      mBtnSaveDraft.addEventListener("click", function () {
        saveModalArticle("draft");
      });
    }

    if (mBtnPublish) {
      mBtnPublish.addEventListener("click", function () {
        saveModalArticle("published");
      });
    }

    if (mBtnDelete) {
      mBtnDelete.addEventListener("click", function () {
        var id = mPostId.value;
        if (!id) return;
        var p = store.getPost(id);
        var title = p ? p.title : "this article";
        if (window.confirm("Are you sure you want to permanently delete \"" + title + "\"?")) {
          store.deletePost(id);
          toast("Article deleted.");
          var bsModal = bootstrap.Modal.getInstance(modalEl);
          if (bsModal) bsModal.hide();
          renderStats();
          populateAuthorFilter();
          renderList();
        }
      });
    }

    // Table Row Actions delegation
    tbody.addEventListener("click", function (e) {
      var target = e.target;
      var tr = target.closest("tr");
      if (!tr) return;
      var id = tr.getAttribute("data-id");
      if (!id) return;

      // Status toggle
      if (target.closest(".btn-toggle-status")) {
        var newStatus = store.toggleStatus(id);
        toast("Article status changed to " + (newStatus === "published" ? "Published (Live)" : "Draft"));
        renderStats();
        renderList();
        return;
      }

      // Feature toggle
      if (target.closest("[data-action='feature']")) {
        store.setFeatured(id);
        var post = store.getPost(id);
        toast(post.featured ? "Set as primary Featured Article." : "Removed from Featured spotlight.");
        renderStats();
        renderList();
        return;
      }

      // Edit (Opens complete modal CMS form)
      if (target.closest("[data-action='edit']")) {
        var p = store.getPost(id);
        if (p) {
          openEditorModal(p);
        }
        return;
      }

      // Duplicate
      if (target.closest("[data-action='duplicate']")) {
        var copy = store.duplicatePost(id);
        if (copy) {
          toast("Article duplicated as draft: " + copy.title);
          renderStats();
          populateAuthorFilter();
          renderList();
        }
        return;
      }

      // Delete
      if (target.closest("[data-action='delete']")) {
        var pDel = store.getPost(id);
        var title = pDel ? pDel.title : "this article";
        if (window.confirm("Are you sure you want to permanently delete \"" + title + "\"? This action cannot be undone.")) {
          store.deletePost(id);
          toast("Article deleted from CMS.");
          renderStats();
          populateAuthorFilter();
          renderList();
        }
        return;
      }
    });

    // Reset Defaults buttons
    var btnReset = document.getElementById("btn-reset-blog-defaults");
    var btnTopReset = document.getElementById("btn-top-reset-defaults");
    function doReset() {
      if (window.confirm("Reset all blog articles to clinic original defaults (4 articles)? Any newly created test articles will be removed.")) {
        store.resetToDefaults();
        toast("Blog articles restored to clinic defaults.");
        renderStats();
        populateAuthorFilter();
        renderList();
      }
    }
    if (btnReset) btnReset.addEventListener("click", doReset);
    if (btnTopReset) btnTopReset.addEventListener("click", doReset);

    // Initial render
    populateAuthorFilter();
    renderStats();
    renderList();

    // Listen to store updates
    window.addEventListener("btc-blog-updated", function () {
      renderStats();
      populateAuthorFilter();
      renderList();
    });
  }

  /* =========================================================================
     STANDALONE FULL-PAGE BLOG EDITOR (Admin/pages/blog-edit.html)
     ========================================================================= */

  function initBlogEditor() {
    var form = document.getElementById("blog-editor-form");
    if (!form || !store) return;

    var postIdInput = document.getElementById("blog-post-id");
    var postSelector = document.getElementById("edit-post-selector");
    var titleInput = document.getElementById("blog-title");
    var slugInput = document.getElementById("blog-slug");
    var slugLockBtn = document.getElementById("btn-slug-lock");
    var excerptInput = document.getElementById("blog-excerpt");
    var excerptCount = document.getElementById("excerpt-char-count");
    var contentInput = document.getElementById("blog-content");
    var statusSelect = document.getElementById("blog-status");
    var featuredCheck = document.getElementById("blog-featured-toggle");
    var authorSelect = document.getElementById("blog-author");
    var customAuthorInput = document.getElementById("blog-author-custom");
    var categorySelect = document.getElementById("blog-category");
    var tagsInput = document.getElementById("blog-tags");
    var dateInput = document.getElementById("blog-date");
    var readTimeInput = document.getElementById("blog-read-time");
    var orderInput = document.getElementById("blog-order");
    var imageInput = document.getElementById("blog-image");
    var imagePreview = document.getElementById("blog-image-preview");
    var fileUploadInput = document.getElementById("blog-image-file");

    // In-Article CTA
    var ctaToggle = document.getElementById("blog-cta-toggle");
    var ctaHeading = document.getElementById("blog-cta-heading");
    var ctaPrimaryText = document.getElementById("blog-cta-primary-text");
    var ctaPrimaryLink = document.getElementById("blog-cta-primary-link");
    var ctaSecondaryText = document.getElementById("blog-cta-secondary-text");
    var ctaSecondaryLink = document.getElementById("blog-cta-secondary-link");

    // SEO
    var seoTitleInput = document.getElementById("blog-seo-title");
    var seoDescInput = document.getElementById("blog-seo-desc");
    var seoKeywordsInput = document.getElementById("blog-seo-keywords");

    // Live preview elements
    var pvImage = document.getElementById("pv-card-img");
    var pvCat = document.getElementById("pv-card-cat");
    var pvTitle = document.getElementById("pv-card-title");
    var pvExcerpt = document.getElementById("pv-card-excerpt");
    var pvDate = document.getElementById("pv-card-date");
    var pvAuthor = document.getElementById("pv-card-author");
    var pvReadTime = document.getElementById("pv-card-readtime");
    var pvBadge = document.getElementById("badge-post-status-label");

    // SERP Preview
    var serpTitle = document.getElementById("serp-preview-title");
    var serpUrl = document.getElementById("serp-preview-url");
    var serpDesc = document.getElementById("serp-preview-desc");

    var slugLocked = true;

    function populateSelector(activeId) {
      if (!postSelector) return;
      var posts = store.getPosts();
      postSelector.innerHTML = '<option value="new">+ Create Blank / New Blog Post</option>';
      posts.forEach(function (p) {
        var opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = (p.status === "draft" ? "[Draft] " : "") + p.title;
        if (p.id === activeId) opt.selected = true;
        postSelector.appendChild(opt);
      });
    }

    function loadPost(idOrSlug) {
      if (!idOrSlug || idOrSlug === "new") {
        postIdInput.value = "";
        titleInput.value = "";
        slugInput.value = "";
        slugLocked = false;
        excerptInput.value = "";
        contentInput.value = "";
        statusSelect.value = "draft";
        featuredCheck.checked = false;
        authorSelect.value = "Sultana Afrooz, D.O.";
        if (customAuthorInput) customAuthorInput.classList.add("d-none");
        categorySelect.value = "Therapies";
        tagsInput.value = "";
        dateInput.value = new Date().toISOString().split("T")[0];
        readTimeInput.value = "5 min read";
        orderInput.value = store.getPosts().length + 1;
        imageInput.value = store.resolveImage("assets/uploads/2024/08/What-is-Microcurrent-1024x683-1.jpg", "admin");

        // CTA defaults
        if (ctaToggle) ctaToggle.checked = true;
        if (ctaHeading) ctaHeading.value = "Ready to experience these therapies?";
        if (ctaPrimaryText) ctaPrimaryText.value = "REQUEST AN APPOINTMENT";
        if (ctaPrimaryLink) ctaPrimaryLink.value = "../contact.html";
        if (ctaSecondaryText) ctaSecondaryText.value = "Learn more about this service";
        if (ctaSecondaryLink) ctaSecondaryLink.value = "../services/index.html";

        // SEO defaults
        seoTitleInput.value = "";
        seoDescInput.value = "";
        seoKeywordsInput.value = "";

        updateCrumb("Create New Article");
        updateLivePreview();
        return;
      }

      var post = store.getPost(idOrSlug);
      if (!post) {
        toast("Article not found: " + idOrSlug, "warn");
        loadPost("new");
        return;
      }

      postIdInput.value = post.id;
      titleInput.value = post.title || "";
      slugInput.value = post.slug || "";
      slugLocked = true;
      excerptInput.value = post.excerpt || "";
      contentInput.value = post.content || "";
      statusSelect.value = post.status || "published";
      featuredCheck.checked = !!post.featured;

      var standardAuthors = ["Sultana Afrooz, D.O.", "Jessica Needle, N.D.", "Be The Change Staff"];
      if (standardAuthors.indexOf(post.author) !== -1) {
        authorSelect.value = post.author;
        if (customAuthorInput) customAuthorInput.classList.add("d-none");
      } else {
        authorSelect.value = "custom";
        if (customAuthorInput) {
          customAuthorInput.classList.remove("d-none");
          customAuthorInput.value = post.author || "";
        }
      }

      categorySelect.value = post.category || "Therapies";
      tagsInput.value = Array.isArray(post.tags) ? post.tags.join(", ") : (post.tags || "");
      dateInput.value = post.date ? post.date.split("T")[0] : new Date().toISOString().split("T")[0];
      readTimeInput.value = post.readTime || store.calcReadTime(post.content);
      orderInput.value = post.order || 1;
      imageInput.value = store.resolveImage(post.image, "admin", post.id);

      // CTA
      if (ctaToggle) ctaToggle.checked = post.ctaTitle !== false;
      if (ctaHeading) ctaHeading.value = post.ctaTitle || "Ready to experience these therapies?";
      if (ctaPrimaryText) ctaPrimaryText.value = post.ctaPrimaryText || "REQUEST AN APPOINTMENT";
      if (ctaPrimaryLink) ctaPrimaryLink.value = post.ctaPrimaryLink || "../contact.html";
      if (ctaSecondaryText) ctaSecondaryText.value = post.ctaSecondaryText || "Learn more about this service";
      if (ctaSecondaryLink) ctaSecondaryLink.value = post.ctaSecondaryLink || "../services/index.html";

      // SEO
      seoTitleInput.value = post.seoTitle || "";
      seoDescInput.value = post.seoDescription || "";
      seoKeywordsInput.value = post.seoKeywords || "";

      updateCrumb(post.title);
      updateLivePreview();
    }

    function updateCrumb(name) {
      var crumbEl = document.getElementById("article-crumb-label");
      if (crumbEl) crumbEl.textContent = name;
      var headerPreview = document.getElementById("btn-header-preview");
      if (headerPreview) {
        headerPreview.href = "blog-preview.html?post=" + encodeURIComponent(postIdInput.value || slugInput.value || "new");
      }
    }

    function updateLivePreview() {
      var title = titleInput.value.trim() || "Article Headline";
      var slug = slugInput.value.trim() || "article-slug";
      var excerpt = excerptInput.value.trim() || "Article teaser excerpt will appear here.";
      var author = authorSelect.value === "custom"
        ? (customAuthorInput.value.trim() || "Custom Author")
        : authorSelect.value;
      var category = categorySelect.value || "Therapies";
      var dateStr = dateInput.value || new Date().toISOString().split("T")[0];
      var readTime = readTimeInput.value || "5 min read";
      var img = imageInput.value || "assets/uploads/2024/08/What-is-Microcurrent-1024x683-1.jpg";

      // Update Card Preview
      if (pvTitle) pvTitle.textContent = title;
      if (pvExcerpt) pvExcerpt.textContent = excerpt;
      if (pvAuthor) pvAuthor.textContent = author;
      if (pvCat) pvCat.textContent = category;
      if (pvDate) pvDate.textContent = formatDate(dateStr);
      if (pvReadTime) pvReadTime.textContent = readTime;
      if (pvImage) {
        pvImage.src = store.resolveImage(img, "admin");
        pvImage.onerror = function () {
          this.onerror = null;
          this.src = store.FALLBACK_IMAGE;
        };
      }
      if (imagePreview) {
        imagePreview.src = store.resolveImage(img, "admin");
        imagePreview.onerror = function () {
          this.onerror = null;
          this.src = store.FALLBACK_IMAGE;
        };
      }

      // Status badge
      var status = statusSelect.value;
      if (pvBadge) {
        pvBadge.textContent = status === "published" ? "Published (Live)" : "Draft";
        pvBadge.className = "badge-admin " + (status === "published" ? "badge-published" : "badge-draft");
      }

      // SERP Preview
      var seoTitle = seoTitleInput.value.trim() || title;
      var seoDesc = seoDescInput.value.trim() || excerpt;
      if (serpTitle) serpTitle.textContent = seoTitle;
      if (serpUrl) serpUrl.textContent = "https://bethechangehealth.com/blog/" + slug;
      if (serpDesc) serpDesc.textContent = seoDesc;

      // Counters
      if (excerptCount) excerptCount.textContent = String(excerptInput.value.length);
    }

    // Slug lock
    if (slugLockBtn) {
      slugLockBtn.addEventListener("click", function () {
        slugLocked = !slugLocked;
        slugLockBtn.innerHTML = slugLocked ? '<i class="bi bi-lock-fill"></i>' : '<i class="bi bi-unlock"></i>';
        if (!slugLocked) {
          slugInput.focus();
        } else {
          slugInput.value = store.slugify(titleInput.value);
          updateLivePreview();
        }
      });
    }

    titleInput.addEventListener("input", function () {
      if (slugLocked && titleInput.value.trim()) {
        slugInput.value = store.slugify(titleInput.value.trim());
      }
      updateLivePreview();
    });

    slugInput.addEventListener("input", updateLivePreview);
    excerptInput.addEventListener("input", updateLivePreview);
    statusSelect.addEventListener("change", updateLivePreview);
    categorySelect.addEventListener("change", updateLivePreview);
    dateInput.addEventListener("change", updateLivePreview);
    readTimeInput.addEventListener("input", updateLivePreview);
    seoTitleInput.addEventListener("input", updateLivePreview);
    seoDescInput.addEventListener("input", updateLivePreview);
    if (customAuthorInput) customAuthorInput.addEventListener("input", updateLivePreview);

    authorSelect.addEventListener("change", function () {
      if (customAuthorInput) {
        customAuthorInput.classList.toggle("d-none", authorSelect.value !== "custom");
      }
      updateLivePreview();
    });

    // Content input read-time calculation
    contentInput.addEventListener("input", function () {
      readTimeInput.value = store.calcReadTime(contentInput.value);
      updateLivePreview();
    });

    // Toolbar formatting
    var toolbar = document.querySelector(".blog-editor-toolbar");
    if (toolbar) {
      toolbar.addEventListener("click", function (e) {
        var btn = e.target.closest("button");
        if (!btn) return;
        var tag = btn.getAttribute("data-tag");
        if (!tag) return;

        var start = contentInput.selectionStart;
        var end = contentInput.selectionEnd;
        var val = contentInput.value;
        var sel = val.substring(start, end);
        var replacement = "";

        if (tag === "h2") replacement = "<h2>" + (sel || "Heading 2") + "</h2>\n";
        else if (tag === "h3") replacement = "<h3>" + (sel || "Heading 3") + "</h3>\n";
        else if (tag === "h4") replacement = "<h4>" + (sel || "Heading 4") + "</h4>\n";
        else if (tag === "p") replacement = "<p>" + (sel || "Paragraph text...") + "</p>\n";
        else if (tag === "strong") replacement = "<strong>" + (sel || "bold text") + "</strong>";
        else if (tag === "em") replacement = "<em>" + (sel || "italic text") + "</em>";
        else if (tag === "ul") replacement = "<ul>\n  <li>" + (sel || "List item 1") + "</li>\n  <li>List item 2</li>\n</ul>\n";
        else if (tag === "ol") replacement = "<ol>\n  <li>" + (sel || "First step") + "</li>\n  <li>Second step</li>\n</ol>\n";
        else if (tag === "blockquote") replacement = "<blockquote>\n  <p>" + (sel || "Inspiring quote or key takeaway...") + "</p>\n</blockquote>\n";
        else if (tag === "link") replacement = '<a href="https://">' + (sel || "Link label") + '</a>';
        else if (tag === "clear") replacement = sel.replace(/<[^>]*>/g, "");

        contentInput.value = val.substring(0, start) + replacement + val.substring(end);
        contentInput.focus();
        contentInput.setSelectionRange(start + replacement.length, start + replacement.length);
        readTimeInput.value = store.calcReadTime(contentInput.value);
        updateLivePreview();
      });
    }

    // Media Preset choice
    document.querySelectorAll(".image-preset-choice").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".image-preset-choice").forEach(function (b) { b.classList.remove("selected", "border-teal"); });
        btn.classList.add("selected", "border-teal");
        var src = btn.getAttribute("data-src");
        if (src) {
          imageInput.value = src;
          updateLivePreview();
          toast("Preset featured image selected.");
        }
      });
    });

    // Choose from Media Library button
    var btnEditChooseMedia = document.getElementById("btn-edit-choose-media");
    var btnEditRemoveMedia = document.getElementById("btn-edit-remove-media");

    if (btnEditChooseMedia) {
      btnEditChooseMedia.addEventListener("click", function () {
        openMediaLibrary(function (chosenUrl) {
          imageInput.value = chosenUrl;
          updateLivePreview();
          toast("Featured image selected from Media Library.");
        });
      });
    }

    if (btnEditRemoveMedia) {
      btnEditRemoveMedia.addEventListener("click", function () {
        imageInput.value = store.resolveImage("assets/uploads/2024/08/What-is-Microcurrent-1024x683-1.jpg", "admin");
        updateLivePreview();
        toast("Featured image reset to default.");
      });
    }

    if (fileUploadInput) {
      fileUploadInput.addEventListener("change", function (e) {
        var file = e.target.files && e.target.files[0];
        if (file) {
          var reader = new FileReader();
          reader.onload = function (evt) {
            imageInput.value = evt.target.result;
            updateLivePreview();
            toast("Custom featured image loaded.");
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Selector change
    if (postSelector) {
      postSelector.addEventListener("change", function () {
        var val = postSelector.value;
        loadPost(val);
      });
    }

    // Save Article
    function saveArticle(overrideStatus) {
      var title = titleInput.value.trim();
      if (!title) {
        toast("Please enter an article title.", "warn");
        titleInput.focus();
        return false;
      }

      var author = authorSelect.value === "custom" ? (customAuthorInput.value.trim() || "Sultana Afrooz, D.O.") : authorSelect.value;
      var status = overrideStatus || statusSelect.value || "published";

      var postData = {
        id: postIdInput.value || "",
        title: title,
        slug: slugInput.value.trim() || store.slugify(title),
        excerpt: excerptInput.value.trim(),
        content: contentInput.value.trim(),
        category: categorySelect.value,
        tags: tagsInput.value,
        author: author,
        date: dateInput.value || new Date().toISOString().split("T")[0],
        readTime: readTimeInput.value.trim() || "5 min read",
        featured: !!featuredCheck.checked,
        status: status,
        order: parseInt(orderInput.value, 10) || 1,
        image: imageInput.value || store.resolveImage("assets/uploads/2024/08/What-is-Microcurrent-1024x683-1.jpg", "admin"),
        ctaTitle: ctaToggle && ctaToggle.checked ? (ctaHeading.value.trim() || "Ready to experience these therapies?") : false,
        ctaPrimaryText: ctaPrimaryText ? ctaPrimaryText.value.trim() : "REQUEST AN APPOINTMENT",
        ctaPrimaryLink: ctaPrimaryLink ? ctaPrimaryLink.value.trim() : "../contact.html",
        ctaSecondaryText: ctaSecondaryText ? ctaSecondaryText.value.trim() : "Learn more about this service",
        ctaSecondaryLink: ctaSecondaryLink ? ctaSecondaryLink.value.trim() : "../services/index.html",
        seoTitle: seoTitleInput.value.trim(),
        seoDescription: seoDescInput.value.trim(),
        seoKeywords: seoKeywordsInput.value.trim()
      };

      var saved = store.savePost(postData);
      if (saved) {
        postIdInput.value = saved.id;
        populateSelector(saved.id);
        updateCrumb(saved.title);
        toast("Article saved successfully! (" + (saved.status === "published" ? "Published Live" : "Draft") + ")");
        return true;
      }
      return false;
    }

    var btnSavePost = document.getElementById("btn-save-post");
    var btnSaveDraft = document.getElementById("btn-save-draft");
    var btnPublishSidebar = document.getElementById("btn-publish-sidebar");
    var btnDeletePost = document.getElementById("btn-delete-post");

    if (btnSavePost) btnSavePost.addEventListener("click", function () { saveArticle(); });
    if (btnSaveDraft) btnSaveDraft.addEventListener("click", function () { saveArticle("draft"); });
    if (btnPublishSidebar) btnPublishSidebar.addEventListener("click", function () { saveArticle("published"); });

    if (btnDeletePost) {
      btnDeletePost.addEventListener("click", function () {
        var id = postIdInput.value;
        if (!id) {
          toast("No active saved post to delete.", "warn");
          return;
        }
        var p = store.getPost(id);
        var title = p ? p.title : "this article";
        if (window.confirm("Are you sure you want to permanently delete \"" + title + "\"? This action cannot be undone.")) {
          store.deletePost(id);
          toast("Article deleted from CMS.");
          window.location.href = "blog.html";
        }
      });
    }

    // Load initial article from query
    var targetPost = getQueryParam("post") || "what-is-frequency-specific-microcurrent-therapy";
    populateSelector(targetPost);
    loadPost(targetPost);
  }

  /* =========================================================================
     BLOG PREVIEW SCREEN (Admin/pages/blog-preview.html)
     ========================================================================= */

  function initBlogPreview() {
    var titleEl = document.getElementById("pv-article-title") || document.getElementById("preview-title");
    if (!titleEl || !store) return;

    var dateEl = document.getElementById("pv-article-date") || document.getElementById("preview-date");
    var authorEl = document.getElementById("pv-article-author") || document.getElementById("preview-author");
    var catEl = document.getElementById("pv-article-cat") || document.getElementById("preview-cat");
    var readTimeEl = document.getElementById("pv-article-readtime") || document.getElementById("preview-readtime");
    var heroImgEl = document.getElementById("pv-article-hero-img") || document.getElementById("preview-hero-img");
    var contentEl = document.getElementById("pv-article-content") || document.getElementById("preview-body-content");
    var ctaBoxEl = document.getElementById("pv-article-cta-box") || document.getElementById("preview-cta-box");
    var ctaHeadingEl = document.getElementById("pv-cta-heading") || document.getElementById("preview-cta-heading");
    var ctaBtnEl = document.getElementById("pv-cta-btn") || document.getElementById("preview-cta-btn");
    var ctaSecEl = document.getElementById("pv-cta-service-link") || document.getElementById("preview-cta-service-link");
    var recentListEl = document.getElementById("pv-recent-posts-list") || document.getElementById("preview-recent-articles");
    var crumbTitleEl = document.getElementById("pv-crumb-article-title") || document.getElementById("preview-crumb-title");
    var editLinkEl = document.getElementById("pv-btn-edit-article") || document.getElementById("preview-edit-link");
    var publishBtn = document.getElementById("pv-btn-publish-now");

    var targetId = getQueryParam("post") || "what-is-frequency-specific-microcurrent-therapy";
    var post = store.getPost(targetId) || store.getFeaturedPost() || store.getPosts()[0];

    if (!post) {
      titleEl.textContent = "No Article Selected";
      return;
    }

    titleEl.textContent = post.title;
    if (crumbTitleEl) crumbTitleEl.textContent = post.title;
    if (dateEl) dateEl.textContent = formatDate(post.date);
    if (authorEl) authorEl.textContent = post.author || "Sultana Afrooz, D.O.";
    if (catEl) catEl.textContent = post.category || "Therapies";
    if (readTimeEl) readTimeEl.textContent = post.readTime || "5 min read";
    if (heroImgEl) {
      heroImgEl.src = store.resolveImage(post.image, "admin", post.id);
      heroImgEl.onerror = function () {
        this.onerror = null;
        this.src = store.FALLBACK_IMAGE;
      };
    }
    if (contentEl) contentEl.innerHTML = post.content || "<p>No content entered for this article.</p>";

    if (editLinkEl) {
      editLinkEl.href = "blog-edit.html?post=" + encodeURIComponent(post.id);
    }

    if (publishBtn) {
      publishBtn.textContent = post.status === "published" ? "Unpublish to Draft" : "Publish to Live Website";
      publishBtn.className = "btn " + (post.status === "published" ? "btn-outline-warning" : "btn-success") + " btn-sm";
      publishBtn.addEventListener("click", function () {
        var newStatus = store.toggleStatus(post.id);
        toast("Article status changed to " + (newStatus === "published" ? "Published (Live)" : "Draft"));
        publishBtn.textContent = newStatus === "published" ? "Unpublish to Draft" : "Publish to Live Website";
        publishBtn.className = "btn " + (newStatus === "published" ? "btn-outline-warning" : "btn-success") + " btn-sm";
      });
    }

    // In-article CTA
    if (ctaBoxEl) {
      if (post.ctaTitle) {
        ctaBoxEl.classList.remove("d-none");
        if (ctaHeadingEl) ctaHeadingEl.textContent = post.ctaTitle;
        if (ctaBtnEl) {
          ctaBtnEl.textContent = post.ctaPrimaryText || "REQUEST AN APPOINTMENT";
          ctaBtnEl.href = post.ctaPrimaryLink || "../contact.html";
        }
        if (ctaSecEl) {
          ctaSecEl.textContent = post.ctaSecondaryText || "Learn more about this service";
          ctaSecEl.href = post.ctaSecondaryLink || "../services/index.html";
        }
      } else {
        ctaBoxEl.classList.add("d-none");
      }
    }

    // Sidebar Recent Articles
    if (recentListEl) {
      var allPosts = store.getPublishedPosts();
      recentListEl.innerHTML = "";
      allPosts.slice(0, 4).forEach(function (rp) {
        var itemImg = store.resolveImage(rp.image, "admin", rp.id);
        var isUl = recentListEl.tagName === "UL" || recentListEl.tagName === "OL";
        var el = document.createElement(isUl ? "li" : "div");
        el.className = isUl ? "mb-3 pb-3 border-bottom" : "d-flex gap-3 align-items-center";
        if (isUl) {
          el.innerHTML =
            '<a href="blog-preview.html?post=' + encodeURIComponent(rp.id) + '" class="fw-semibold text-dark text-decoration-none d-block mb-1 hover-teal">' +
              rp.title +
            '</a>' +
            '<div class="d-flex align-items-center gap-2 text-muted" style="font-size:0.75rem;">' +
              '<span><i class="bi bi-calendar3 me-1"></i>' + formatDate(rp.date) + '</span>' +
              '<span>•</span>' +
              '<span>' + (rp.readTime || "5 min read") + '</span>' +
            '</div>';
        } else {
          el.innerHTML =
            '<img src="' + escapeAttr(itemImg) + '" class="rounded" width="64" height="64" style="object-fit:cover; flex-shrink:0;" alt="' + escapeAttr(rp.title) + '" onerror="this.onerror=null;this.src=\'' + store.FALLBACK_IMAGE + '\';">' +
            '<div>' +
              '<a href="blog-preview.html?post=' + encodeURIComponent(rp.id) + '" class="fw-semibold text-dark text-decoration-none d-block hover-teal" style="font-size:0.85rem;">' +
                rp.title +
              '</a>' +
              '<small class="text-muted">' + formatDate(rp.date) + '</small>' +
            '</div>';
        }
        recentListEl.appendChild(el);
      });
    }

    // Responsive Viewport Switcher
    var deviceBtns = document.querySelectorAll(".preview-viewport-toolbar .device-btn");
    var container = document.querySelector(".preview-viewport-container");
    if (deviceBtns && container) {
      deviceBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          deviceBtns.forEach(function (b) { b.classList.remove("active"); });
          btn.classList.add("active");
          var vp = btn.getAttribute("data-viewport");
          container.setAttribute("data-device", vp);
        });
      });
    }
  }

  /* =========================================================================
     BLOG PAGE CMS CONTROLLER (Admin/pages/blog-content.html)
     ========================================================================= */

  function initBlogContentPage() {
    if (!store) return;

    function val(id) {
      var el = document.getElementById(id);
      return el ? el.value : "";
    }

    function setVal(id, v) {
      var el = document.getElementById(id);
      if (el) {
        el.value = v == null ? "" : v;
        el.dispatchEvent(new Event('input'));
      }
    }

    function loadAllFields() {
      var content = store.getPageContent();
      if (!content) return;

      // 01. Hero
      setVal("hero-title", content.hero.title);
      setVal("hero-subtitle", content.hero.subtitle);
      setVal("hero-breadcrumb", content.hero.breadcrumb);

      // 02. Toolbar & Categories
      setVal("toolbar-placeholder", content.intro.searchPlaceholder);
      setVal("toolbar-categories", Array.isArray(content.intro.categories) ? content.intro.categories.join(", ") : content.intro.categories);
      setVal("toolbar-empty-msg", content.intro.emptyMessage);

      // 03. Featured Article Spotlight
      var featToggle = document.getElementById("featured-enabled");
      if (featToggle) featToggle.checked = content.featured.enabled !== false;
      setVal("featured-badge", content.featured.badgeText);
      setVal("featured-category", content.featured.category);
      setVal("featured-title", content.featured.title);
      setVal("featured-excerpt", content.featured.excerpt);
      setVal("featured-date", content.featured.date);
      setVal("featured-btn-text", content.featured.buttonText);
      setVal("featured-link", content.featured.link);
      setVal("featured-image", content.featured.image);
      var featImgPrev = document.getElementById("featured-image-preview");
      if (featImgPrev) {
        featImgPrev.src = store.resolveImage(content.featured.image, "admin");
        featImgPrev.onerror = function () {
          this.onerror = null;
          this.src = store.FALLBACK_IMAGE;
        };
      }

      // 04. Articles Grid Header
      setVal("grid-heading", content.articlesHeader.title);
      setVal("grid-subtitle", content.articlesHeader.subtitle);
      setVal("grid-readmore-text", content.articlesHeader.readMoreText);

      // 05. CTA Band
      setVal("cta-title", content.cta.title);
      setVal("cta-desc", content.cta.description);
      setVal("cta-btn1-text", content.cta.primaryBtnText);
      setVal("cta-btn1-link", content.cta.primaryBtnLink);
      setVal("cta-btn2-text", content.cta.secondaryBtnText);
      setVal("cta-btn2-link", content.cta.secondaryBtnLink);

      // 06. SEO & OG
      setVal("seo-title", content.seo.title);
      setVal("seo-desc", content.seo.description);
      setVal("seo-keywords", content.seo.keywords);
      setVal("seo-canonical", content.seo.canonicalUrl);
      setVal("og-title", content.seo.ogTitle);
      setVal("og-desc", content.seo.ogDescription);
      setVal("og-image", content.seo.ogImage);
      var ogImgPrev = document.getElementById("og-image-preview");
      if (ogImgPrev) {
        ogImgPrev.src = store.resolveImage(content.seo.ogImage, "admin");
        ogImgPrev.onerror = function () {
          this.onerror = null;
          this.src = store.FALLBACK_IMAGE;
        };
      }

      // SERP Simulation
      var previewTitle = document.getElementById("seo-preview-title");
      var previewDesc = document.getElementById("seo-preview-desc");
      if (previewTitle) previewTitle.textContent = content.seo.title || "Blog - Be The Change";
      if (previewDesc) previewDesc.textContent = content.seo.description || "";

      // Quick Stats Banner
      var stats = store.getStats();
      var statTotal = document.getElementById("stat-total-articles");
      var statPub = document.getElementById("stat-published-articles");
      var statCats = document.getElementById("stat-categories-count");
      var statFeat = document.getElementById("stat-featured-title");
      if (statTotal) statTotal.textContent = stats.total;
      if (statPub) statPub.textContent = stats.published;
      if (statCats) {
        var catsArr = Array.isArray(content.intro.categories) ? content.intro.categories : (content.intro.categories || "").split(",");
        statCats.textContent = catsArr.length;
      }
      if (statFeat) statFeat.textContent = content.featured.title || stats.featuredTitle || "Frequency Specific Microcurrent";
    }

    // Populate article picker
    function populateArticlePicker() {
      var sel = document.getElementById("featured-select-post");
      if (!sel) return;
      var posts = store.getPosts();
      sel.innerHTML = '<option value="">-- Choose an article from library to auto-fill --</option>';
      posts.forEach(function (p) {
        var opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = (p.featured ? "★ " : "") + p.title + " (" + (p.category || "Therapies") + ")";
        sel.appendChild(opt);
      });

      sel.addEventListener("change", function () {
        var selectedId = sel.value;
        if (!selectedId) return;
        var p = store.getPost(selectedId);
        if (!p) return;

        setVal("featured-title", p.title);
        setVal("featured-category", p.category || "Therapies");
        setVal("featured-excerpt", p.excerpt || "");
        setVal("featured-date", p.date || "");
        setVal("featured-link", p.slug ? p.slug + ".html" : "");
        setVal("featured-image", p.image || "");
        var featImgPrev = document.getElementById("featured-image-preview");
        if (featImgPrev) {
          featImgPrev.src = store.resolveImage(p.image, "admin", p.id);
          featImgPrev.onerror = function () {
            this.onerror = null;
            this.src = store.FALLBACK_IMAGE;
          };
        }

        toast("Loaded article details for: " + p.title);
      });
    }

    function saveHeroSection() {
      var data = {
        title: val("hero-title").trim() || "Be The Change Blog",
        subtitle: val("hero-subtitle").trim(),
        breadcrumb: val("hero-breadcrumb").trim() || "Blog"
      };
      store.saveHero(data);
      toast("Hero section saved.");
    }

    function saveToolbarSection() {
      var catsRaw = val("toolbar-categories");
      var cats = catsRaw.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
      if (!cats.length) cats = ["All", "Therapies", "Wellness", "Detox", "Blog"];

      var data = {
        searchPlaceholder: val("toolbar-placeholder").trim() || "Search articles…",
        categories: cats,
        emptyMessage: val("toolbar-empty-msg").trim() || "No articles match your search. Try another keyword or category."
      };
      store.saveIntro(data);
      var statCats = document.getElementById("stat-categories-count");
      if (statCats) statCats.textContent = cats.length;
      toast("Search & category toolbar saved.");
    }

    function saveFeaturedSection() {
      var enabledBox = document.getElementById("featured-enabled");
      var data = {
        enabled: enabledBox ? enabledBox.checked : true,
        badgeText: val("featured-badge").trim() || "Featured Article",
        category: val("featured-category").trim() || "Therapies",
        title: val("featured-title").trim() || "What Is Frequency-specific Microcurrent Therapy?",
        excerpt: val("featured-excerpt").trim(),
        date: val("featured-date").trim(),
        buttonText: val("featured-btn-text").trim() || "Read More",
        link: val("featured-link").trim() || "what-is-frequency-specific-microcurrent-therapy.html",
        image: val("featured-image").trim() || store.resolveImage("assets/uploads/2024/08/What-is-Microcurrent-1024x683-1.jpg", "admin")
      };
      store.saveFeaturedSection(data);
      var statFeat = document.getElementById("stat-featured-title");
      if (statFeat) statFeat.textContent = data.title;
      toast("Featured article spotlight saved.");
    }

    function saveArticlesSection() {
      var data = {
        title: val("grid-heading").trim() || "All Articles",
        subtitle: val("grid-subtitle").trim() || "Explore our wellness library.",
        readMoreText: val("grid-readmore-text").trim() || "Read More"
      };
      store.saveArticlesHeader(data);
      toast("Articles grid header section saved.");
    }

    function saveCtaSection() {
      var data = {
        title: val("cta-title").trim() || "Ready to experience these therapies?",
        description: val("cta-desc").trim(),
        primaryBtnText: val("cta-btn1-text").trim() || "Book Appointment",
        primaryBtnLink: val("cta-btn1-link").trim() || "../book-appointment.html",
        secondaryBtnText: val("cta-btn2-text").trim() || "Contact Us",
        secondaryBtnLink: val("cta-btn2-link").trim() || "../contact.html"
      };
      store.saveCta(data);
      toast("Consultation CTA band saved.");
    }

    function saveSeoSection() {
      var data = {
        title: val("seo-title").trim(),
        description: val("seo-desc").trim(),
        keywords: val("seo-keywords").trim(),
        canonicalUrl: val("seo-canonical").trim() || "Frontend/blog/index.html",
        ogTitle: val("og-title").trim(),
        ogDescription: val("og-desc").trim(),
        ogImage: val("og-image").trim()
      };
      store.saveSeo(data);

      var previewTitle = document.getElementById("seo-preview-title");
      var previewDesc = document.getElementById("seo-preview-desc");
      if (previewTitle) previewTitle.textContent = data.title || "Blog - Be The Change";
      if (previewDesc) previewDesc.textContent = data.description || "";

      toast("SEO & Open Graph settings saved.");
    }

    function saveAllSections() {
      saveHeroSection();
      saveToolbarSection();
      saveFeaturedSection();
      saveArticlesSection();
      saveCtaSection();
      saveSeoSection();
      toast("All Blog Page sections saved successfully!");
    }

    // Media library pickers
    var btnPickFeat = document.getElementById("btn-pick-featured-img");
    if (btnPickFeat) {
      btnPickFeat.addEventListener("click", function () {
        openMediaLibrary(function (url) {
          setVal("featured-image", url);
          var prev = document.getElementById("featured-image-preview");
          if (prev) prev.src = store.resolveImage(url, "admin");
          toast("Featured image updated.");
        });
      });
    }

    var btnPickOg = document.getElementById("btn-pick-og-img");
    if (btnPickOg) {
      btnPickOg.addEventListener("click", function () {
        openMediaLibrary(function (url) {
          setVal("og-image", url);
          var prev = document.getElementById("og-image-preview");
          if (prev) prev.src = store.resolveImage(url, "admin");
          toast("Social share image updated.");
        });
      });
    }

    // Image upload inputs
    var fileFeat = document.getElementById("file-featured-img");
    if (fileFeat) {
      fileFeat.addEventListener("change", function () {
        if (fileFeat.files && fileFeat.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            setVal("featured-image", e.target.result);
            var prev = document.getElementById("featured-image-preview");
            if (prev) prev.src = e.target.result;
            toast("Featured image uploaded.");
          };
          reader.readAsDataURL(fileFeat.files[0]);
        }
      });
    }

    var fileOg = document.getElementById("file-og-img");
    if (fileOg) {
      fileOg.addEventListener("change", function () {
        if (fileOg.files && fileOg.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            setVal("og-image", e.target.result);
            var prev = document.getElementById("og-image-preview");
            if (prev) prev.src = e.target.result;
            toast("Social share image uploaded.");
          };
          reader.readAsDataURL(fileOg.files[0]);
        }
      });
    }

    // Live SERP Snippet updates
    var seoTitleInput = document.getElementById("seo-title");
    var seoDescInput = document.getElementById("seo-desc");
    if (seoTitleInput) {
      seoTitleInput.addEventListener("input", function () {
        var pt = document.getElementById("seo-preview-title");
        if (pt) pt.textContent = seoTitleInput.value || "Blog - Be The Change Health and Wellness Center";
      });
    }
    if (seoDescInput) {
      seoDescInput.addEventListener("input", function () {
        var pd = document.getElementById("seo-preview-desc");
        if (pd) pd.textContent = seoDescInput.value || "";
      });
    }

    // Section save button listeners
    var btnHero = document.getElementById("btn-save-hero");
    if (btnHero) btnHero.addEventListener("click", saveHeroSection);

    var btnToolbar = document.getElementById("btn-save-toolbar");
    if (btnToolbar) btnToolbar.addEventListener("click", saveToolbarSection);

    var btnFeat = document.getElementById("btn-save-featured");
    if (btnFeat) btnFeat.addEventListener("click", saveFeaturedSection);

    var btnArticles = document.getElementById("btn-save-articles");
    if (btnArticles) btnArticles.addEventListener("click", saveArticlesSection);

    var btnCta = document.getElementById("btn-save-cta");
    if (btnCta) btnCta.addEventListener("click", saveCtaSection);

    var btnSeo = document.getElementById("btn-save-seo");
    if (btnSeo) btnSeo.addEventListener("click", saveSeoSection);

    var btnAllTop = document.getElementById("btn-save-all-content");
    if (btnAllTop) btnAllTop.addEventListener("click", saveAllSections);

    var btnAllBot = document.getElementById("btn-save-all-bottom");
    if (btnAllBot) btnAllBot.addEventListener("click", saveAllSections);

    var btnPublish = document.getElementById("btn-publish-live");
    if (btnPublish) {
      btnPublish.addEventListener("click", function () {
        saveAllSections();
        toast("Blog Page published to live website!");
      });
    }

    // Reset Defaults
    var btnReset = document.getElementById("btn-reset-content-defaults");
    if (btnReset) {
      btnReset.addEventListener("click", function () {
        if (window.confirm("Reset all Blog Page sections (Hero, Search/Filter, Featured Spotlight, Articles Header, CTA, and SEO) to default?")) {
          store.resetPageContentToDefaults();
          loadAllFields();
          toast("Blog Page content restored to default.");
        }
      });
    }

    // Live Preview Modal
    function updateLivePreviewModal() {
      var content = store.getPageContent();
      var pvHeroTitle = document.getElementById("pv-page-hero-title");
      var pvHeroSubtitle = document.getElementById("pv-page-hero-sub");
      var pvHeroCrumb = document.getElementById("pv-page-hero-crumb");
      var pvSearch = document.getElementById("pv-page-search");
      var pvCats = document.getElementById("pv-page-cats");
      var pvFeatArticle = document.getElementById("pv-page-featured");
      var pvFeatBadge = document.getElementById("pv-page-feat-badge");
      var pvFeatCat = document.getElementById("pv-page-feat-cat");
      var pvFeatTitle = document.getElementById("pv-page-feat-title");
      var pvFeatExcerpt = document.getElementById("pv-page-feat-excerpt");
      var pvFeatDate = document.getElementById("pv-page-feat-date");
      var pvFeatBtn = document.getElementById("pv-page-feat-btn");
      var pvFeatImg = document.getElementById("pv-page-feat-img");
      var pvGridHeading = document.getElementById("pv-page-grid-heading");
      var pvGridSub = document.getElementById("pv-page-grid-sub");
      var pvCtaHeading = document.getElementById("pv-page-cta-heading");
      var pvCtaDesc = document.getElementById("pv-page-cta-desc");
      var pvCtaBtn1 = document.getElementById("pv-page-cta-btn1");
      var pvCtaBtn2 = document.getElementById("pv-page-cta-btn2");

      if (pvHeroTitle) pvHeroTitle.textContent = val("hero-title") || content.hero.title;
      if (pvHeroSubtitle) pvHeroSubtitle.textContent = val("hero-subtitle") || content.hero.subtitle;
      if (pvHeroCrumb) pvHeroCrumb.textContent = val("hero-breadcrumb") || content.hero.breadcrumb;
      if (pvSearch) pvSearch.placeholder = val("toolbar-placeholder") || content.intro.searchPlaceholder;

      if (pvCats) {
        var rawC = val("toolbar-categories") || (content.intro.categories || []).join(", ");
        var arr = rawC.split(",").map(function (c) { return c.trim(); }).filter(Boolean);
        pvCats.innerHTML = arr.map(function (cat, i) {
          return '<button type="button" class="btn btn-sm ' + (i === 0 ? "btn-secondary text-white" : "btn-outline-secondary") + ' rounded-pill px-3 py-1 me-1 mb-1">' + cat + '</button>';
        }).join("");
      }

      var featCheck = document.getElementById("featured-enabled");
      var isFeatOn = featCheck ? featCheck.checked : content.featured.enabled !== false;
      if (pvFeatArticle) {
        pvFeatArticle.style.display = isFeatOn ? "" : "none";
      }
      if (pvFeatBadge) pvFeatBadge.textContent = val("featured-badge") || content.featured.badgeText;
      if (pvFeatCat) pvFeatCat.textContent = val("featured-category") || content.featured.category;
      if (pvFeatTitle) pvFeatTitle.textContent = val("featured-title") || content.featured.title;
      if (pvFeatExcerpt) pvFeatExcerpt.textContent = val("featured-excerpt") || content.featured.excerpt;
      if (pvFeatDate) pvFeatDate.textContent = val("featured-date") || content.featured.date;
      if (pvFeatBtn) pvFeatBtn.textContent = val("featured-btn-text") || content.featured.buttonText;
      if (pvFeatImg) {
        var featImgVal = val("featured-image") || content.featured.image;
        pvFeatImg.src = store.resolveImage(featImgVal, "admin");
        pvFeatImg.onerror = function () {
          this.onerror = null;
          this.src = store.FALLBACK_IMAGE;
        };
      }

      if (pvGridHeading) pvGridHeading.textContent = val("grid-heading") || content.articlesHeader.title;
      if (pvGridSub) pvGridSub.textContent = val("grid-subtitle") || content.articlesHeader.subtitle;

      if (pvCtaHeading) pvCtaHeading.textContent = val("cta-title") || content.cta.title;
      if (pvCtaDesc) pvCtaDesc.textContent = val("cta-desc") || content.cta.description;
      if (pvCtaBtn1) pvCtaBtn1.textContent = val("cta-btn1-text") || content.cta.primaryBtnText;
      if (pvCtaBtn2) pvCtaBtn2.textContent = val("cta-btn2-text") || content.cta.secondaryBtnText;
    }

    var previewModalEl = document.getElementById("blogPagePreviewModal");
    if (previewModalEl) {
      previewModalEl.addEventListener("show.bs.modal", updateLivePreviewModal);
    }

    var previewDeviceBtns = document.querySelectorAll("#blogPagePreviewModal .device-btn");
    var previewFrame = document.getElementById("pv-page-screen-frame");
    if (previewDeviceBtns && previewFrame) {
      previewDeviceBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          previewDeviceBtns.forEach(function (b) { b.classList.remove("active"); });
          btn.classList.add("active");
          var vp = btn.getAttribute("data-viewport");
          if (vp === "mobile") {
            previewFrame.style.maxWidth = "390px";
          } else if (vp === "tablet") {
            previewFrame.style.maxWidth = "768px";
          } else {
            previewFrame.style.maxWidth = "100%";
          }
        });
      });
    }

    // Initial load
    populateArticlePicker();
    loadAllFields();
  }

  // Initialize depending on active page
  document.addEventListener("DOMContentLoaded", function () {
    initMediaLibraryModal();

    if (PAGE === "blog") {
      initBlogDirectory();
    } else if (PAGE === "blog-edit") {
      initBlogEditor();
    } else if (PAGE === "blog-preview") {
      initBlogPreview();
    } else if (PAGE === "blog-content") {
      initBlogContentPage();
    }
  });

})();
