/* ==========================================================================
   DELIGHT ORPHANAGE FOUNDATION — SCRIPT.JS
   Vanilla JavaScript only. Keep it simple and readable.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------------------------------------------------
     1. CURRENT YEAR IN FOOTER
  ------------------------------------------------------------------ */
  var yearEls = document.querySelectorAll('[data-current-year]');
  yearEls.forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ------------------------------------------------------------------
     2. CLOSE MOBILE NAV ON LINK CLICK (nicer mobile UX)
  ------------------------------------------------------------------ */
  var navCollapse = document.getElementById('mainNav');
  var navLinks = document.querySelectorAll('.nav-link-custom, .nav-support-btn');
  if (navCollapse) {
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (navCollapse.classList.contains('show')) {
          var bsCollapse = bootstrap.Collapse.getInstance(navCollapse) || new bootstrap.Collapse(navCollapse);
          bsCollapse.hide();
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     3. HERO PHOTO SLIDESHOW
  ------------------------------------------------------------------ */
  var heroSlideshow = document.querySelector('[data-hero-slideshow]');
  if (heroSlideshow) {
    var heroPhotos = heroSlideshow.querySelectorAll('.hero-photo');
    var heroPhotoIndex = 0;
    window.setInterval(function () {
      heroPhotos[heroPhotoIndex].classList.remove('is-active');
      heroPhotoIndex = (heroPhotoIndex + 1) % heroPhotos.length;
      heroPhotos[heroPhotoIndex].classList.add('is-active');
    }, 5000);
  }

  /* ------------------------------------------------------------------
     4. SCROLL REVEAL ANIMATIONS
     Respects prefers-reduced-motion via CSS (transitions disabled there).
  ------------------------------------------------------------------ */
  var revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');

  if ('IntersectionObserver' in window && revealTargets.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(function (target) {
      observer.observe(target);
    });
  } else {
    // Fallback: just show everything
    revealTargets.forEach(function (target) {
      target.classList.add('is-visible');
    });
  }

  /* ------------------------------------------------------------------
     4. BACK TO TOP BUTTON
  ------------------------------------------------------------------ */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 480) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
     5. GENERIC FRONTEND FORM VALIDATION + "PREPARED" MESSAGE
     Applies to: Support form, Contact form.
     No backend exists yet — this only validates and confirms locally.
  ------------------------------------------------------------------ */
  var formsToValidate = document.querySelectorAll('form[data-validate]');

  formsToValidate.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) { firstInvalid.focus(); }
        return;
      }

      form.classList.add('was-validated');

      var successMsg = form.querySelector('.form-success-msg');
      if (successMsg) {
        successMsg.classList.add('show');
        successMsg.setAttribute('role', 'status');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Reset form after a short delay so the user can read the message first
      setTimeout(function () {
        form.reset();
        form.classList.remove('was-validated');
      }, 400);
    });
  });

  /* ------------------------------------------------------------------
     6. SIMPLE GALLERY LIGHTBOX
  ------------------------------------------------------------------ */
  var galleryItems = document.querySelectorAll('[data-lightbox-trigger]');
  var overlay = document.getElementById('lightboxOverlay');

  if (overlay && galleryItems.length) {
    var lightboxIcon = overlay.querySelector('.display-icon');
    var lightboxImage = overlay.querySelector('.display-image');
    var lightboxTitle = overlay.querySelector('.lightbox-title');
    var lightboxDesc = overlay.querySelector('.lightbox-desc');
    var lightboxClose = overlay.querySelector('.lightbox-close');

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var iconClass = item.getAttribute('data-icon') || 'bi-image';
        var title = item.getAttribute('data-title') || 'Gallery Image';
        var desc = item.getAttribute('data-desc') || 'Sample gallery placeholder.';
        var image = item.getAttribute('data-image');

        lightboxIcon.className = 'bi ' + iconClass + ' display-icon';
        lightboxIcon.style.display = image ? 'none' : '';
        if (lightboxImage) {
          lightboxImage.src = image || '';
          lightboxImage.alt = title;
          lightboxImage.style.display = image ? 'block' : 'none';
        }
        lightboxTitle.textContent = title;
        lightboxDesc.textContent = desc;

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        lightboxClose.focus();
      });
    });

    function closeLightbox() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) { closeLightbox(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  /* ------------------------------------------------------------------
     7. SUPPORT TYPE -> SHOW/HIDE AMOUNT FIELD (small UX touch)
  ------------------------------------------------------------------ */
  var supportType = document.getElementById('supportType');
  var amountGroup = document.getElementById('amountGroup');
  if (supportType && amountGroup) {
    function toggleAmount() {
      if (supportType.value === 'Financial Support' || supportType.value === 'Child Sponsorship') {
        amountGroup.style.display = 'block';
      } else {
        amountGroup.style.display = 'block'; // amount is optional regardless, always visible but labeled optional
      }
    }
    supportType.addEventListener('change', toggleAmount);
    toggleAmount();
  }

});
