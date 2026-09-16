"use strict";
document.documentElement.classList.add("js-ready");

/**
 * Main Alpine.js component for the portfolio.
 *
 * Before publishing:
 * 1. Replace CONTACT_EMAIL with your real email address.
 * 2. Replace placeholder LinkedIn and GitHub URLs in index.html.
 * 3. Add resume.pdf beside index.html.
 */
function portfolioApp() {
  const CONTACT_EMAIL = "mntgmry36@outlook.com";

  return {
    darkMode: false,
    mobileMenuOpen: false,
    scrolled: false,
    activeSection: "home",
    currentYear: new Date().getFullYear(),
    formMessage: "",

    /**
     * Runs automatically when Alpine initializes the component.
     */
    init() {
      this.initializeTheme();
      this.initializeScrollTracking();
      this.initializeRevealAnimations();
      this.initializeSectionObserver();
      this.initializeKeyboardControls();
    },

    /**
     * Loads the saved theme or follows the user's operating-system preference.
     */
    initializeTheme() {
      const savedTheme = localStorage.getItem("theme");
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      this.darkMode =
        savedTheme === "dark" ||
        (savedTheme === null && prefersDarkMode);

      this.applyThemeClass();

      this.$watch("darkMode", () => {
        this.applyThemeClass();

        localStorage.setItem(
          "theme",
          this.darkMode ? "dark" : "light"
        );
      });
    },

    /**
     * Applies the dark class directly to the document root.
     */
    applyThemeClass() {
      document.documentElement.classList.toggle(
        "dark",
        this.darkMode
      );
    },

    /**
     * Toggles light and dark mode.
     */
    toggleTheme() {
      this.darkMode = !this.darkMode;
    },

    /**
     * Updates the header style while scrolling.
     */
    initializeScrollTracking() {
      const updateScrollState = () => {
        this.scrolled = window.scrollY > 20;
      };

      updateScrollState();

      window.addEventListener(
        "scroll",
        updateScrollState,
        { passive: true }
      );
    },

    /**
     * Reveals elements when they enter the viewport.
     */
    initializeRevealAnimations() {
      const revealElements = document.querySelectorAll(".reveal");

      if (
        !("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        revealElements.forEach((element) => {
          element.classList.add("is-visible");
        });

        return;
      }

      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -40px 0px"
        }
      );

      revealElements.forEach((element) => {
        revealObserver.observe(element);
      });
    },

    /**
     * Tracks which section is currently visible for desktop navigation.
     */
    initializeSectionObserver() {
      const sections = document.querySelectorAll("[data-section]");

      if (!("IntersectionObserver" in window)) {
        this.initializeSectionFallback(sections);
        return;
      }

      const sectionObserver = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries
            .filter((entry) => entry.isIntersecting)
            .sort(
              (first, second) =>
                second.intersectionRatio - first.intersectionRatio
            );

          if (visibleEntries.length === 0) {
            return;
          }

          this.activeSection = visibleEntries[0].target.id;
        },
        {
          threshold: [0.15, 0.3, 0.5, 0.7],
          rootMargin: "-20% 0px -55% 0px"
        }
      );

      sections.forEach((section) => {
        sectionObserver.observe(section);
      });
    },

    /**
     * Fallback section tracking for older browsers.
     */
    initializeSectionFallback(sections) {
      const updateActiveSection = () => {
        const scrollPosition = window.scrollY + 160;
        let currentSection = "home";

        sections.forEach((section) => {
          if (scrollPosition >= section.offsetTop) {
            currentSection = section.id;
          }
        });

        this.activeSection = currentSection;
      };

      updateActiveSection();

      window.addEventListener(
        "scroll",
        updateActiveSection,
        { passive: true }
      );
    },

    /**
     * Allows Escape to close the mobile navigation.
     */
    initializeKeyboardControls() {
      window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && this.mobileMenuOpen) {
          this.closeMobileMenu();
        }
      });
    },

    /**
     * Closes the mobile menu after a navigation link is selected.
     */
    closeMobileMenu() {
      this.mobileMenuOpen = false;
    },

    /**
     * Opens the user's email application with the contact form content.
     *
     * A static HTML site cannot send email directly without a service such as:
     * Formspree, Netlify Forms, EmailJS, or a custom backend.
     */
    submitContactForm(event) {
      const form = event.currentTarget;
      const formData = new FormData(form);

      const name = this.cleanFormValue(formData.get("name"));
      const email = this.cleanFormValue(formData.get("email"));
      const subject = this.cleanFormValue(formData.get("subject"));
      const message = this.cleanFormValue(formData.get("message"));

      if (!name || !email || !subject || !message) {
        this.formMessage =
          "Please complete every field before sending your message.";

        return;
      }

      if (!this.isValidEmail(email)) {
        this.formMessage =
          "Please enter a valid email address.";

        return;
      }

      if (
        CONTACT_EMAIL === "YOUR-EMAIL@example.com" ||
        CONTACT_EMAIL.trim() === ""
      ) {
        this.formMessage =
          "Add your real email address to CONTACT_EMAIL in js/app.js first.";

        return;
      }

      const emailSubject = encodeURIComponent(
        `Portfolio contact: ${subject}`
      );

      const emailBody = encodeURIComponent(
        [
          `Name: ${name}`,
          `Email: ${email}`,
          "",
          "Message:",
          message
        ].join("\n")
      );

      const mailtoUrl =
        `mailto:${CONTACT_EMAIL}` +
        `?subject=${emailSubject}` +
        `&body=${emailBody}`;

      this.formMessage =
        "Your email application should open now.";

      window.location.href = mailtoUrl;
    },

    /**
     * Converts a form value into a trimmed string.
     */
    cleanFormValue(value) {
      return typeof value === "string"
        ? value.trim()
        : "";
    },

    /**
     * Performs basic client-side email validation.
     */
    isValidEmail(email) {
      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      return emailPattern.test(email);
    }
  };
}