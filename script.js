/* ==================== INITIAL SETUP ==================== */
/*
   Replace EMAILJS placeholders with:
   - emailjs.init('YOUR_PUBLIC_KEY');
   - const SERVICE_ID = 'YOUR_SERVICE_ID';
   - const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
*/

if (window.emailjs) {
  try { emailjs.init('YOUR_EMAILJS_PUBLIC_KEY'); }
  catch (e) { console.warn(e); }
}

const SERVICE_ID = 'YOUR_SERVICE_ID';
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

document.addEventListener('DOMContentLoaded', () => {

  /* ==================== ELEMENTS ==================== */
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('progressBar');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalVideo = document.getElementById('modalVideo');
  const modalTitle = document.getElementById('modalTitle');
  const dots = document.getElementById('dot');


  /* ==================== PRELOADER ==================== */
  let dotCount = 0;
  setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    if (dots) dots.textContent = '.'.repeat(dotCount);
  }, 350);

  window.addEventListener('load', () => {
    if (!preloader) return;
    preloader.style.opacity = '0';
    preloader.style.pointerEvents = 'none';
    setTimeout(() => preloader.style.display = 'none', 500);
  });


  /* ==================== SCROLL PROGRESS ==================== */
  const updateProgress = () => {
    const doc = document.documentElement;
    const scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    const height = doc.scrollHeight - doc.clientHeight;
    const scrolled = (scrollTop / height) * 100;
    progressBar.style.width = `${Math.min(Math.max(scrolled, 0), 100)}%`;
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });


  /* ==================== THEME TOGGLE ==================== */
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'light') html.classList.add('light');
  themeIcon.className = html.classList.contains('light')
    ? 'bi bi-sun-fill' 
    : 'bi bi-moon-fill';

  themeToggle.addEventListener('click', () => {
    html.classList.toggle('light');
    const isLight = html.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeIcon.className = isLight ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
  });


  /* ==================== CARD REVEAL (Intersection Observer) ==================== */
  const stager = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => {
        entry.target.classList.add('in-view');
      }, i * 80);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('[data-animate]').forEach(el => stager.observe(el));


  /* ==================== TILT EFFECT ==================== */
  function handleTilt(e) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2;
    const cy = r.height / 2;

    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;

    el.style.transform =
      `perspective(700px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg) translateY(-6px)`;
  }

  function resetTilt(e) {
    e.currentTarget.style.transform = '';
  }

  document.querySelectorAll('.tilt').forEach(el => {
    el.addEventListener('mousemove', handleTilt);
    el.addEventListener('mouseleave', resetTilt);
  });


  /* ==================== PROJECT VIDEO MODAL (AUTOPLAY) ==================== */

  document.querySelectorAll('.video-link').forEach(button => {
    button.addEventListener('click', () => {
      const src = button.getAttribute('data-video');
      if (!src) return;

      modalTitle.innerText = 'Project Video';
      modalVideo.src = src;

      modalVideo.setAttribute("playsinline", "");
      modalVideo.setAttribute("muted", "");
      modalVideo.setAttribute("autoplay", "");
      modalVideo.muted = true;

      modalVideo.load();

      // FORCE autoplay
      const playVideo = () => {
        const promise = modalVideo.play();
        if (promise) {
          promise.catch(() => {
            modalVideo.muted = true;
            modalVideo.play();
          });
        }
      };

      setTimeout(playVideo, 150);

      modalOverlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  modalClose.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  function closeModal() {
    modalOverlay.style.display = 'none';
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.src = '';
    document.body.style.overflow = '';
  }
/* ========== PROJECT GITHUB LINKS ========== */
const githubLinks = {
  portfolio: "https://github.com/nidigondashivani-code/CJITS_WEBPAGE",
  cafe: "https://nidigondashivani-code.github.io/cafe-pos-system/", 
  vsmk: "https://github.com/nidigondashivani-code"
};

document.querySelectorAll('.project-github').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.getAttribute('data-github');
    const url = githubLinks[key] || "https://github.com/nidigondashivani-code";
    window.open(url, "_blank");
  });
});



  /* ==================== SMOOTH SCROLL OFFSET ==================== */

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      const navHeight = document.querySelector('.floating-nav').offsetHeight + 10;

      const position = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: position,
        behavior: 'smooth'
      });
    });
  });

// ===== Open Certification PDF when clicked =====
const fccCert = document.getElementById("fcc-cert");
if (fccCert) {
  fccCert.addEventListener("click", () => {
   window.open("assets/freecodecertificates.pdf", "_blank");

  });
}

  /* ==================== CONTACT FORM (EmailJS) ==================== */

  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  function isEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isMobile(mobile) {
    return /^[\d+\-\s]{7,20}$/.test(mobile);
  }

  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = contactForm.user_name.value.trim();
    const email = contactForm.user_email.value.trim();
    const mobile = contactForm.user_mobile.value.trim();
    const github = contactForm.user_github.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !mobile || !message) {
      formStatus.style.color = "#ffb6b6";
      formStatus.textContent = "Please fill all required fields.";
      return;
    }

    if (!isEmail(email)) {
      formStatus.style.color = "#ffb6b6";
      formStatus.textContent = "Please enter a valid email.";
      return;
    }

    if (!isMobile(mobile)) {
      formStatus.style.color = "#ffb6b6";
      formStatus.textContent = "Invalid mobile number.";
      return;
    }

    if (!SERVICE_ID || !TEMPLATE_ID) {
      formStatus.style.color = "#ffd6a6";
      formStatus.textContent = "EmailJS not configured. Add your keys in script.js.";
      return;
    }

    formStatus.style.color = "#b7f0d6";
    formStatus.textContent = "Sending...";

    emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      user_name: name,
      user_email: email,
      user_mobile: mobile,
      user_github: github,
      message: message
    })
    .then(() => {
      formStatus.style.color = "#b7f0d6";
      formStatus.textContent = "Sent! I will reply soon.";
      contactForm.reset();
      setTimeout(() => formStatus.textContent = "", 6000);
    })
    .catch(err => {
      console.error(err);
      formStatus.style.color = "#ffb6b6";
      formStatus.textContent = "Failed to send. Try again later.";
    });
  });


  /* ==================== NAV SHADOW ON SCROLL ==================== */
  const nav = document.querySelector('.floating-nav');
  const hero = document.querySelector('#home');

  const navObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) nav.classList.add('nav-elev');
    else nav.classList.remove('nav-elev');
  }, {
    threshold: 0,
    rootMargin: "-120px 0px 0px 0px"
  });

  navObserver.observe(hero);

});
