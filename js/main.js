/**
 * Main Interactive Engine for Shravan Kumar's Portfolio
 * B.Tech Mechanical Engineering Student | First Year
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. THEME SWITCHER (Dark/Light with localStorage persistence)
  // -------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('shravan_portfolio_theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('shravan_portfolio_theme', theme);
    if (typeof window.update3DTheme === 'function') {
      window.update3DTheme();
    }
  }

  if (storedTheme) {
    applyTheme(storedTheme);
  } else if (prefersLight) {
    applyTheme('light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme === 'light' ? 'Light' : 'Engineering Dark'} theme`);
    });
  }

  // -------------------------------------------------------------------------
  // 2. STICKY NAVBAR & ACTIVE LINK SCROLL SPY
  // -------------------------------------------------------------------------
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Scroll spy
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // -------------------------------------------------------------------------
  // 3. MOBILE NAVIGATION DRAWER
  // -------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', String(isActive));
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close on link click
    navMenu.querySelectorAll('.nav-link, .btn').forEach((item) => {
      item.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // -------------------------------------------------------------------------
  // 4. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // -------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // -------------------------------------------------------------------------
  // 5. ANIMATED NUMBER COUNTERS (for CGPA, percentages, rank)
  // -------------------------------------------------------------------------
  const counterElements = document.querySelectorAll('[data-counter-target]');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );

  const eduSection = document.getElementById('education');
  if (eduSection) counterObserver.observe(eduSection);

  function animateCounters() {
    counterElements.forEach((el) => {
      const targetStr = el.getAttribute('data-counter-target') || '0';
      const isDecimal = targetStr.includes('.');
      const target = parseFloat(targetStr);
      const suffix = el.getAttribute('data-counter-suffix') || '';
      const prefix = el.getAttribute('data-counter-prefix') || '';
      const duration = 1600;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = target * easeOut;

        el.textContent = `${prefix}${isDecimal ? currentVal.toFixed(1) : Math.round(currentVal)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = `${prefix}${targetStr}${suffix}`;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // -------------------------------------------------------------------------
  // 6. EDUCATION & ACHIEVEMENTS FILTER TABS
  // -------------------------------------------------------------------------
  const tabBtns = document.querySelectorAll('.tab-btn');
  const eduItems = document.querySelectorAll('[data-category]');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';

      eduItems.forEach((item) => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = '';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 7. 1-CLICK COPY EMAIL TO CLIPBOARD
  // -------------------------------------------------------------------------
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  const targetEmail = 'shravan284687@gmail.com';

  copyEmailBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(targetEmail).then(() => {
        showToast('Email copied to clipboard: ' + targetEmail);
      }).catch(() => {
        showToast('Direct email: ' + targetEmail);
      });
    });
  });

  // -------------------------------------------------------------------------
  // 8. TOAST NOTIFICATION UTILITY
  // -------------------------------------------------------------------------
  const toast = document.getElementById('toast-banner');
  const toastText = document.getElementById('toast-text');
  let toastTimeout;

  function showToast(message) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }

  // -------------------------------------------------------------------------
  // 9. CONTACT FORM INTERACTION
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('sender-name');
      const emailInput = document.getElementById('sender-email');
      const subjectInput = document.getElementById('sender-subject');
      const messageInput = document.getElementById('sender-message');
      const submitBtn = document.getElementById('contact-submit-btn');

      const name = nameInput?.value.trim();
      const email = emailInput?.value.trim();
      const subject = subjectInput?.value.trim() || 'Portfolio Inquiry';
      const message = messageInput?.value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.');
        return;
      }

      // Visual feedback
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        Preparing Message...
      `;

      setTimeout(() => {
        // Construct mailto link for fail-safe transmission directly to Shravan's email
        const mailtoUrl = `mailto:shravan284687@gmail.com?subject=${encodeURIComponent(
          `[Portfolio Contact] ${subject} - from ${name}`
        )}&body=${encodeURIComponent(
          `Sender Name: ${name}\nSender Email: ${email}\n\nMessage:\n${message}\n\n---\nSent via Shravan Kumar Portfolio`
        )}`;

        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactForm.reset();

        showToast('Thank you! Opening your email client to dispatch to Shravan...');
        window.location.href = mailtoUrl;
      }, 700);
    });
  }

  // -------------------------------------------------------------------------
  // 10. RESUME / CV MODAL
  // -------------------------------------------------------------------------
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtns = document.querySelectorAll('.open-resume-btn');
  const closeResumeBtn = document.getElementById('close-resume-modal');

  function openResume() {
    resumeModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeResume() {
    resumeModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  openResumeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openResume();
    });
  });

  closeResumeBtn?.addEventListener('click', closeResume);

  resumeModal?.addEventListener('click', (e) => {
    if (e.target === resumeModal) {
      closeResume();
    }
  });

  // Print resume button inside modal
  const printResumeBtn = document.getElementById('print-resume-btn');
  printResumeBtn?.addEventListener('click', () => {
    window.print();
  });

  // -------------------------------------------------------------------------
  // 11. PROFILE PHOTO LIVE PREVIEWER (Drop in your own photo in browser)
  // -------------------------------------------------------------------------
  const photoInput = document.getElementById('user-photo-upload');
  const avatarDisplays = document.querySelectorAll('.dynamic-avatar-img');

  // Check if user already loaded a photo before
  const savedAvatar = localStorage.getItem('shravan_avatar_data');
  if (savedAvatar) {
    avatarDisplays.forEach((img) => {
      img.src = savedAvatar;
    });
  }

  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (PNG, JPG, WebP).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUrl = loadEvent.target?.result;
        if (dataUrl) {
          avatarDisplays.forEach((img) => {
            img.src = dataUrl;
          });
          try {
            localStorage.setItem('shravan_avatar_data', dataUrl);
          } catch (err) {
            // Storage quota warning (safe ignore)
          }
          showToast('Profile photo updated successfully!');
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // -------------------------------------------------------------------------
  // 12. SMOOTH SCROLL FOR IN-PAGE ANCHOR LINKS
  // -------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
