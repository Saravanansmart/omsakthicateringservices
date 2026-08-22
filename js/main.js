/* ============================================================
   Om Sakthi Catering Services — main.js
   Dependency-free vanilla JS. All features null-guarded.
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* Google Apps Script Web App endpoint — lead form writes to the "Leads" tab.
     Same /exec URL as the offers page; the script routes by "type". */
  var LEAD_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbygZpjyxzHUYdwUySq-fTI6ZXxVX227Fq8o_7x5e2NQ3POUT_HUcdSggSW62AA3AfLujQ/exec';

  var header = document.getElementById('siteHeader');

  /* Helper: current sticky-header height for scroll offsets */
  function headerHeight() {
    return header ? header.offsetHeight : 0;
  }

  /* ---------- 1. MOBILE NAV ---------- */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  function closeNav() {
    if (!navToggle || !navMenu) return;
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when a nav link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    // Close when clicking outside the menu
    document.addEventListener('click', function (e) {
      if (!navMenu.classList.contains('open')) return;
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        closeNav();
      }
    });
  }

  /* ---------- 2. STICKY HEADER ---------- */
  if (header) {
    var onScrollHeader = function () {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScrollHeader, { passive: true });
    onScrollHeader();
  }

  /* ---------- 3. SMOOTH SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - headerHeight();
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---------- 4. ACTIVE NAV LINK ---------- */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var linkFor = function (id) {
      return document.querySelector('.nav-link[href="#' + id + '"]');
    };
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var link = linkFor(entry.target.id);
          if (!link) return;
          navLinks.forEach(function (l) { l.classList.remove('active'); });
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- 5. SCROLL REVEAL ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      reveals.forEach(function (el) { revealObserver.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* ---------- 6. STAT COUNTERS ---------- */
  var statNums = document.querySelectorAll('.stat-num');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var start = null;
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var value = Math.floor(easeOut(progress) * target);
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(step);
  }
  if (statNums.length) {
    if ('IntersectionObserver' in window) {
      var statObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      statNums.forEach(function (el) { statObserver.observe(el); });
    } else {
      statNums.forEach(animateCount);
    }
  }

  /* ---------- 7. MENU TABS ---------- */
  var menuTabs = document.querySelectorAll('.menu-tab');
  var menuPanels = document.querySelectorAll('.menu-panel');
  if (menuTabs.length && menuPanels.length) {
    menuTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var name = tab.getAttribute('data-tab');
        menuTabs.forEach(function (t) {
          var active = t === tab;
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        menuPanels.forEach(function (panel) {
          var match = panel.getAttribute('data-panel') === name;
          panel.classList.toggle('is-active', match);
          if (match) {
            panel.removeAttribute('hidden');
          } else {
            panel.setAttribute('hidden', '');
          }
        });
      });
    });
  }

  /* ---------- 8. TESTIMONIAL SLIDER ---------- */
  var slider = document.getElementById('testimonialSlider');
  if (slider) {
    var track = slider.querySelector('.testimonial-track');
    var cards = slider.querySelectorAll('.testimonial-card');
    var dotsWrap = document.getElementById('tDots');
    var prevBtn = slider.querySelector('.t-prev');
    var nextBtn = slider.querySelector('.t-next');
    var count = cards.length;
    var index = 0;
    var autoTimer = null;

    if (track && count > 0) {
      // Build dots
      var dots = [];
      if (dotsWrap) {
        dotsWrap.innerHTML = '';
        for (var i = 0; i < count; i++) {
          (function (i) {
            var dot = document.createElement('button');
            dot.className = 'tdot';
            dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
            dot.addEventListener('click', function () {
              goTo(i);
              restartAuto();
            });
            dotsWrap.appendChild(dot);
            dots.push(dot);
          })(i);
        }
      }

      function update() {
        track.style.transform = 'translateX(' + (-index * 100) + '%)';
        dots.forEach(function (d, i) {
          d.classList.toggle('is-active', i === index);
        });
      }
      function goTo(i) {
        index = (i + count) % count;
        update();
      }
      function next() { goTo(index + 1); }
      function prev() { goTo(index - 1); }

      if (nextBtn) nextBtn.addEventListener('click', function () { next(); restartAuto(); });
      if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restartAuto(); });

      // Auto-advance
      function startAuto() {
        if (count < 2) return;
        autoTimer = setInterval(next, 6000);
      }
      function stopAuto() {
        if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
      }
      function restartAuto() { stopAuto(); startAuto(); }

      slider.addEventListener('mouseenter', stopAuto);
      slider.addEventListener('mouseleave', startAuto);

      // Resize: reapply transform gracefully
      window.addEventListener('resize', update);

      update();
      startAuto();
    }
  }

  /* ---------- 9. GALLERY LIGHTBOX ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxEmoji = document.getElementById('lightboxEmoji');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.getElementById('lightboxClose');
  var galleryItems = document.querySelectorAll('.gallery-item');

  if (lightbox && galleryItems.length) {
    function openLightbox(emoji, caption) {
      if (lightboxEmoji) lightboxEmoji.textContent = emoji;
      if (lightboxCaption) lightboxCaption.textContent = caption;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var emojiEl = item.querySelector('.g-emoji');
        var emoji = emojiEl ? emojiEl.textContent : '';
        var caption = item.getAttribute('data-caption') || '';
        openLightbox(emoji, caption);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

    // Close on backdrop click (element itself, not its content)
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }

  /* ---------- 10. CONTACT FORM ---------- */
  var form = document.getElementById('enquiryForm');
  var formStatus = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (form.querySelector('#name') || {}).value || '';
      var phone = (form.querySelector('#phone') || {}).value || '';
      var eventType = (form.querySelector('#eventType') || {}).value || '';
      var email = (form.querySelector('#email') || {}).value || '';

      var missing = [];
      if (!name.trim()) missing.push('name');
      if (!phone.trim()) missing.push('phone');
      if (!eventType.trim()) missing.push('event type');

      var emailValid = true;
      if (email.trim()) {
        emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
      }

      function setStatus(msg, ok) {
        if (!formStatus) return;
        formStatus.textContent = msg;
        formStatus.classList.toggle('success', ok);
        formStatus.classList.toggle('error', !ok);
      }

      if (missing.length || !emailValid) {
        var parts = [];
        if (missing.length) {
          parts.push('please fill in your ' + missing.join(', '));
        }
        if (!emailValid) {
          parts.push('enter a valid email address');
        }
        setStatus('Oops — ' + parts.join(' and ') + '.', false);
        return;
      }

      // Collect all fields and send the lead to the "Leads" sheet tab.
      var payload = {
        type: 'lead',
        name: name,
        phone: phone,
        email: email,
        eventType: eventType,
        eventDate: (form.querySelector('#eventDate') || {}).value || '',
        guests: (form.querySelector('#guests') || {}).value || '',
        message: (form.querySelector('#message') || {}).value || ''
      };

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      setStatus('Sending your enquiry…', true);

      var done = function (ok) {
        if (submitBtn) submitBtn.disabled = false;
        if (ok) {
          setStatus("Thank you! Your enquiry has been received — we'll get back to you within one business day.", true);
          form.reset();
        } else {
          setStatus('Sorry, something went wrong sending your enquiry. Please call or WhatsApp us on +91 90871 09601.', false);
        }
      };

      if (!LEAD_SCRIPT_URL || LEAD_SCRIPT_URL.indexOf('PASTE_') === 0) {
        done(true); // no endpoint configured — don't block the user
        return;
      }

      fetch(LEAD_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // simple request, no CORS preflight
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json(); })
        .then(function (data) { done(data && data.ok); })
        .catch(function () { done(false); });
    });
  }

  /* ---------- 11. BACK TO TOP ---------- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    var onScrollTop = function () {
      backToTop.classList.toggle('show', window.scrollY > 600);
    };
    window.addEventListener('scroll', onScrollTop, { passive: true });
    onScrollTop();
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 12. FOOTER YEAR ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
