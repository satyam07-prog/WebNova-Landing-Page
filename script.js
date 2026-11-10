/**
 * WebNova Agency - Interactive JavaScript
 * CodSoft Web Development Internship - Level 1 Task 2
 * Author: CodSoft Web Development Intern
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. DOM SELECTORS
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');
  const contactForm = document.getElementById('contact-form');
  const newsletterForm = document.getElementById('newsletter-form');
  const toastContainer = document.getElementById('toast-container');
  const currentYearSpan = document.getElementById('current-year');
  const statCounters = document.querySelectorAll('.counter');
  const statsSection = document.getElementById('stats-counter-section');

  /* --------------------------------------------------------------------------
     2. DYNAMIC YEAR
     -------------------------------------------------------------------------- */
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     3. STICKY HEADER ON SCROLL
     -------------------------------------------------------------------------- */
  const handleHeaderScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Initial check

  /* --------------------------------------------------------------------------
     4. MOBILE NAVIGATION DRAWER
     -------------------------------------------------------------------------- */
  const openMobileMenu = () => {
    navMenu.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
  };

  const closeMobileMenu = () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  };

  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close mobile drawer when clicking any link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close mobile drawer with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  /* --------------------------------------------------------------------------
     5. SCROLLSPY (ACTIVE NAV LINK ON SCROLL)
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  const handleScrollSpy = () => {
    const scrollPosition = window.scrollY + 120; // Offset for sticky navbar

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScrollSpy, { passive: true });

  /* --------------------------------------------------------------------------
     6. STATS COUNTER ANIMATION (INTERSECTION OBSERVER)
     -------------------------------------------------------------------------- */
  let countersAnimated = false;

  const animateCounters = () => {
    statCounters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      if (isNaN(target)) return;
      if (target === 0) {
        counter.textContent = '0';
        return;
      }
      const duration = 2000; // 2 seconds
      const stepTime = 20;   // Interval in ms
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.ceil(current);
        }
      }, stepTime);
    });
  };

  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  } else if (statCounters.length > 0) {
    // Fallback if observer not supported
    animateCounters();
  }

  /* --------------------------------------------------------------------------
     7. BACK TO TOP BUTTON
     -------------------------------------------------------------------------- */
  const handleBackToTopVisibility = () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleBackToTopVisibility, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     8. TOAST NOTIFICATION SYSTEM
     -------------------------------------------------------------------------- */
  const showToast = (message, type = 'success') => {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconClass = type === 'success' 
      ? 'fa-solid fa-circle-check' 
      : 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `
      <div class="toast-content">
        <i class="${iconClass} toast-icon"></i>
        <span class="toast-message">${message}</span>
      </div>
      <button class="toast-close" aria-label="Close notification">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    toastContainer.appendChild(toast);

    // Slide in animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Close button click handler
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      removeToast(toast);
    });

    // Auto dismiss after 5 seconds
    const dismissTimer = setTimeout(() => {
      removeToast(toast);
    }, 5000);

    const removeToast = (toastEl) => {
      clearTimeout(dismissTimer);
      toastEl.classList.remove('show');
      setTimeout(() => {
        if (toastEl.parentNode) {
          toastEl.parentNode.removeChild(toastEl);
        }
      }, 350);
    };
  };

  /* --------------------------------------------------------------------------
     9. CONTACT FORM VALIDATION & SUBMISSION
     -------------------------------------------------------------------------- */
  if (contactForm) {
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    const subjectInput = document.getElementById('user-subject');
    const messageInput = document.getElementById('user-message');
    const submitBtn = document.getElementById('submit-btn');

    // Validation helper functions
    const isValidEmail = (email) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(String(email).toLowerCase());
    };

    const setFieldError = (input, hasError) => {
      const formGroup = input.closest('.form-group');
      if (hasError) {
        formGroup.classList.add('has-error');
        formGroup.classList.remove('has-success');
      } else {
        formGroup.classList.remove('has-error');
        formGroup.classList.add('has-success');
      }
    };

    // Live validation feedback on input
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length >= 2) {
        setFieldError(nameInput, false);
      }
    });

    emailInput.addEventListener('input', () => {
      if (isValidEmail(emailInput.value.trim())) {
        setFieldError(emailInput, false);
      }
    });

    subjectInput.addEventListener('input', () => {
      if (subjectInput.value.trim().length >= 3) {
        setFieldError(subjectInput, false);
      }
    });

    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim().length >= 10) {
        setFieldError(messageInput, false);
      }
    });

    // Handle form submit
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const subjectVal = subjectInput.value.trim();
      const messageVal = messageInput.value.trim();

      let isValid = true;

      // Validate name
      if (nameVal.length < 2) {
        setFieldError(nameInput, true);
        isValid = false;
      } else {
        setFieldError(nameInput, false);
      }

      // Validate email
      if (!isValidEmail(emailVal)) {
        setFieldError(emailInput, true);
        isValid = false;
      } else {
        setFieldError(emailInput, false);
      }

      // Validate subject
      if (subjectVal.length < 3) {
        setFieldError(subjectInput, true);
        isValid = false;
      } else {
        setFieldError(subjectInput, false);
      }

      // Validate message
      if (messageVal.length < 10) {
        setFieldError(messageInput, true);
        isValid = false;
      } else {
        setFieldError(messageInput, false);
      }

      if (!isValid) {
        showToast('Please correct the highlighted fields before submitting.', 'error');
        return;
      }

      // Form is valid - Simulate asynchronous sending
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        // Display success toast notification
        showToast(`Thank you, ${nameVal}! Your message has been sent to Satyam Kumar. I will get back to you shortly.`, 'success');

        // Reset form inputs & remove success borders
        contactForm.reset();
        document.querySelectorAll('.form-group').forEach(group => {
          group.classList.remove('has-success', 'has-error');
        });
      }, 1200);
    });
  }

  /* --------------------------------------------------------------------------
     10. NEWSLETTER FORM HANDLER
     -------------------------------------------------------------------------- */
  if (newsletterForm) {
    const newsletterEmail = document.getElementById('newsletter-email');
    const newsletterFeedback = document.getElementById('newsletter-feedback');

    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail.value.trim();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(email)) {
        newsletterFeedback.textContent = 'Please enter a valid email address.';
        newsletterFeedback.className = 'newsletter-feedback error';
        return;
      }

      // Success
      newsletterFeedback.textContent = 'Subscribed successfully! Welcome to WebNova insights.';
      newsletterFeedback.className = 'newsletter-feedback success';
      newsletterForm.reset();
      showToast('Thank you for subscribing to WebNova updates!', 'success');

      setTimeout(() => {
        newsletterFeedback.textContent = '';
      }, 5000);
    });
  }

  /* --------------------------------------------------------------------------
     11. SMOOTH SCROLL FOR ALL ANCHOR LINKS
     -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* --------------------------------------------------------------------------
     12. AUTH MODALS (LOGIN & SIGN UP)
     -------------------------------------------------------------------------- */
  const authModalOverlay = document.getElementById('auth-modal-overlay');
  const authModalClose = document.getElementById('auth-modal-close');
  const authTriggers = document.querySelectorAll('.btn-auth-trigger');
  const tabLoginBtn = document.getElementById('tab-login-btn');
  const tabSignupBtn = document.getElementById('tab-signup-btn');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const authModalTitle = document.getElementById('auth-modal-title');
  const authModalSubtitle = document.getElementById('auth-modal-subtitle');
  const switchTabButtons = document.querySelectorAll('.switch-to-tab');
  const forgotPasswordLink = document.getElementById('forgot-password-link');
  const togglePasswordButtons = document.querySelectorAll('.toggle-password');

  const switchAuthTab = (tabName) => {
    if (tabName === 'login') {
      if (tabLoginBtn) {
        tabLoginBtn.classList.add('active');
        tabLoginBtn.setAttribute('aria-selected', 'true');
      }
      if (tabSignupBtn) {
        tabSignupBtn.classList.remove('active');
        tabSignupBtn.setAttribute('aria-selected', 'false');
      }

      if (loginForm) loginForm.classList.add('active');
      if (signupForm) signupForm.classList.remove('active');

      if (authModalTitle) authModalTitle.textContent = 'Welcome Back';
      if (authModalSubtitle) authModalSubtitle.textContent = 'Frontend demo featuring client-side form validation (No backend database)';
    } else {
      if (tabSignupBtn) {
        tabSignupBtn.classList.add('active');
        tabSignupBtn.setAttribute('aria-selected', 'true');
      }
      if (tabLoginBtn) {
        tabLoginBtn.classList.remove('active');
        tabLoginBtn.setAttribute('aria-selected', 'false');
      }

      if (signupForm) signupForm.classList.add('active');
      if (loginForm) loginForm.classList.remove('active');

      if (authModalTitle) authModalTitle.textContent = 'Create an Account';
      if (authModalSubtitle) authModalSubtitle.textContent = 'Frontend demo featuring client-side registration validation';
    }
  };

  const openAuthModal = (defaultTab = 'login') => {
    if (!authModalOverlay) return;
    switchAuthTab(defaultTab);
    authModalOverlay.classList.add('active');
    authModalOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');

    // Close mobile nav if open
    if (navMenu && navMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  };

  const closeAuthModal = () => {
    if (!authModalOverlay) return;
    authModalOverlay.classList.remove('active');
    authModalOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');

    // Clear validation error classes
    document.querySelectorAll('.auth-form .form-group').forEach(group => {
      group.classList.remove('has-error', 'has-success');
    });
    const termsGroup = document.querySelector('.auth-options');
    if (termsGroup) termsGroup.classList.remove('has-error');
  };

  authTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = btn.getAttribute('data-auth') || 'login';
      openAuthModal(tab);
    });
  });

  if (authModalClose) {
    authModalClose.addEventListener('click', closeAuthModal);
  }

  if (authModalOverlay) {
    authModalOverlay.addEventListener('click', (e) => {
      if (e.target === authModalOverlay) {
        closeAuthModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModalOverlay && authModalOverlay.classList.contains('active')) {
      closeAuthModal();
    }
  });

  if (tabLoginBtn) {
    tabLoginBtn.addEventListener('click', () => switchAuthTab('login'));
  }
  if (tabSignupBtn) {
    tabSignupBtn.addEventListener('click', () => switchAuthTab('signup'));
  }

  switchTabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-target');
      switchAuthTab(target);
    });
  });

  // Password visibility toggle
  togglePasswordButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.input-wrapper').querySelector('input');
      const icon = btn.querySelector('i');
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });

  // Forgot password handler
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Password reset instructions have been dispatched to your email.', 'success');
    });
  }

  // Login Form Submission & Validation
  if (loginForm) {
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const loginSubmitBtn = document.getElementById('login-submit-btn');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    loginEmail.addEventListener('input', () => {
      if (emailRegex.test(loginEmail.value.trim())) {
        loginEmail.closest('.form-group').classList.remove('has-error');
      }
    });

    loginPassword.addEventListener('input', () => {
      if (loginPassword.value.trim().length >= 6) {
        loginPassword.closest('.form-group').classList.remove('has-error');
      }
    });

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginEmail.value.trim();
      const password = loginPassword.value.trim();

      let valid = true;

      if (!emailRegex.test(email)) {
        loginEmail.closest('.form-group').classList.add('has-error');
        valid = false;
      } else {
        loginEmail.closest('.form-group').classList.remove('has-error');
      }

      if (password.length < 6) {
        loginPassword.closest('.form-group').classList.add('has-error');
        valid = false;
      } else {
        loginPassword.closest('.form-group').classList.remove('has-error');
      }

      if (!valid) {
        showToast('Please correct the highlighted fields to log in.', 'error');
        return;
      }

      loginSubmitBtn.classList.add('loading');
      loginSubmitBtn.disabled = true;

      setTimeout(() => {
        loginSubmitBtn.classList.remove('loading');
        loginSubmitBtn.disabled = false;
        showToast(`[Demo] Welcome back! Logged in as ${email} (Frontend client demo).`, 'success');
        closeAuthModal();
        loginForm.reset();
      }, 1000);
    });
  }

  // Sign Up Form Submission & Validation
  if (signupForm) {
    const signupName = document.getElementById('signup-name');
    const signupEmail = document.getElementById('signup-email');
    const signupPassword = document.getElementById('signup-password');
    const signupConfirmPassword = document.getElementById('signup-confirm-password');
    const termsAgree = document.getElementById('terms-agree');
    const signupSubmitBtn = document.getElementById('signup-submit-btn');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    signupName.addEventListener('input', () => {
      if (signupName.value.trim().length >= 2) {
        signupName.closest('.form-group').classList.remove('has-error');
      }
    });

    signupEmail.addEventListener('input', () => {
      if (emailRegex.test(signupEmail.value.trim())) {
        signupEmail.closest('.form-group').classList.remove('has-error');
      }
    });

    signupPassword.addEventListener('input', () => {
      if (signupPassword.value.trim().length >= 6) {
        signupPassword.closest('.form-group').classList.remove('has-error');
      }
    });

    signupConfirmPassword.addEventListener('input', () => {
      if (signupConfirmPassword.value.trim() === signupPassword.value.trim()) {
        signupConfirmPassword.closest('.form-group').classList.remove('has-error');
      }
    });

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = signupName.value.trim();
      const email = signupEmail.value.trim();
      const password = signupPassword.value.trim();
      const confirmPassword = signupConfirmPassword.value.trim();

      let valid = true;

      if (name.length < 2) {
        signupName.closest('.form-group').classList.add('has-error');
        valid = false;
      } else {
        signupName.closest('.form-group').classList.remove('has-error');
      }

      if (!emailRegex.test(email)) {
        signupEmail.closest('.form-group').classList.add('has-error');
        valid = false;
      } else {
        signupEmail.closest('.form-group').classList.remove('has-error');
      }

      if (password.length < 6) {
        signupPassword.closest('.form-group').classList.add('has-error');
        valid = false;
      } else {
        signupPassword.closest('.form-group').classList.remove('has-error');
      }

      if (confirmPassword !== password || confirmPassword === '') {
        signupConfirmPassword.closest('.form-group').classList.add('has-error');
        valid = false;
      } else {
        signupConfirmPassword.closest('.form-group').classList.remove('has-error');
      }

      const termsGroup = termsAgree.closest('.auth-options');
      if (!termsAgree.checked) {
        termsGroup.classList.add('has-error');
        valid = false;
      } else {
        termsGroup.classList.remove('has-error');
      }

      if (!valid) {
        showToast('Please fix the highlighted errors to create your account.', 'error');
        return;
      }

      signupSubmitBtn.classList.add('loading');
      signupSubmitBtn.disabled = true;

      setTimeout(() => {
        signupSubmitBtn.classList.remove('loading');
        signupSubmitBtn.disabled = false;
        showToast(`[Demo] Account created for ${name}! (Frontend client demo).`, 'success');
        closeAuthModal();
        signupForm.reset();
      }, 1000);
    });
  }

  console.log('✨ WebNova Agency Landing Page loaded successfully. CodSoft Internship Task 2 ready.');
});
