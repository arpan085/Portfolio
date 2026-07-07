document.addEventListener('DOMContentLoaded', () => {
  const content = window.siteContent;
  const body = document.body;
  const themeToggle = document.getElementById('theme-toggle');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    window.addEventListener('pointermove', (event) => {
      cursorGlow.classList.add('is-visible');
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    });

    window.addEventListener('pointerleave', () => {
      cursorGlow.classList.remove('is-visible');
    });

    window.addEventListener('pointerdown', () => {
      cursorGlow.classList.add('is-pressing');
    });

    window.addEventListener('pointerup', () => {
      cursorGlow.classList.remove('is-pressing');
    });

    document.querySelectorAll('.hero-card, .card, .project-card, .skill-card, .timeline-item, .resume-card, .contact-card, .cert-card, .blog-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
        card.style.setProperty('--tilt-x', `${(-y).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${x.toFixed(2)}deg`);
      });

      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  const progressBar = document.querySelector('.scroll-progress');

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.innerHTML = theme === 'dark'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.8"></circle><path d="M12 2.5v2"></path><path d="M12 19.5v2"></path><path d="M4.6 4.6l1.4 1.4"></path><path d="M18 18l1.4 1.4"></path><path d="M2.5 12h2"></path><path d="M19.5 12h2"></path><path d="M4.6 19.4l1.4-1.4"></path><path d="M18 6l1.4-1.4"></path></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 15.3A8.5 8.5 0 0 1 8.7 4a8.5 8.5 0 1 0 11.3 11.3Z"></path></svg>';
  };

  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  setTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open');
  });

  document.querySelectorAll('.site-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  const fillText = (selector, value) => {
    const node = document.querySelector(selector);
    if (node) node.innerHTML = value;
  };

  const renderIfPresent = (selector, markup) => {
    const node = document.querySelector(selector);
    if (node) node.innerHTML = markup;
  };

  fillText('#hero-name', content.hero.name);
  fillText('#hero-intro', content.hero.intro);
  const heroMeta = document.getElementById('hero-meta');
  const heroInlineLearning = document.getElementById('hero-inline-learning');
  const heroActions = document.getElementById('hero-actions');
  const heroSocials = document.getElementById('hero-socials');
  if (heroMeta) heroMeta.textContent = content.hero.roles.join(' · ');
  if (heroInlineLearning) heroInlineLearning.textContent = content.hero.learningLine;
  if (heroActions) heroActions.innerHTML = content.hero.buttons.map((button) => `<a class="button ${button.label === 'Contact' ? 'secondary' : 'primary'}" href="${button.href}"${button.download ? `download="${button.download}"` : ''}>${button.label}</a>`).join('');
  if (heroSocials) heroSocials.innerHTML = content.hero.socials.map((item) => `<a href="${item.href}" aria-label="${item.label}" target="_blank" rel="noreferrer">${item.icon}</a>`).join('');

  fillText('#about-intro', content.about.intro);
  fillText('#about-body', content.about.body);

  renderIfPresent('#journey-list', content.journey.map((item) => `
    <article class="timeline-item reveal">
      <div class="year">${item.year}</div>
      <h3>${item.title}</h3>
      <p class="muted">${item.text}</p>
    </article>
  `).join(''));

  const skillGroups = Object.entries(content.skills);
  renderIfPresent('#skills-grid', skillGroups.map(([groupName, items]) => `
    <article class="skill-card reveal">
      <h3>${groupName.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</h3>
      <div class="skill-list">
        ${items.map((skill) => '<div class="skill-meta"><strong>' + skill.name + '</strong><span>' + skill.level + '</span></div><p>' + skill.note + '</p>').join('')}
      </div>
    </article>
  `).join(''));

  renderIfPresent('#projects-grid', content.projects.map((project) => `
    <article class="project-card reveal">
      <img src="${project.image}" alt="${project.title} preview">
      <div class="project-body">
        <h3>${project.title}</h3>
        <p class="muted">${project.description}</p>
        <div class="stack">${project.stack.map((item) => '<span>' + item + '</span>').join('')}</div>
        <div class="project-links">
          <a href="${project.github}">GitHub</a>
          <a href="${project.demo}">Demo</a>
        </div>
      </div>
    </article>
  `).join(''));

  renderIfPresent('#learning-list', content.learning.map((item) => `<li>${item}</li>`).join(''));

  renderIfPresent('#certificates-grid', content.certificates.map((item) => `
    <article class="cert-card reveal">
      <h3>${item.title}</h3>
      <p class="muted">${item.issuer}</p>
      <p>${item.date}</p>
      <a href="${item.link}">View credential</a>
    </article>
  `).join(''));

  renderIfPresent('#blog-grid', content.blog.map((item) => `
    <article class="blog-card reveal">
      <h3>${item.title}</h3>
      <p class="muted">${item.excerpt}</p>
      <a href="${item.link}">Read note</a>
    </article>
  `).join(''));

  fillText('#resume-summary', content.resume.summary);
  renderIfPresent('#resume-highlights', content.resume.highlights.map((item) => `<li>${item}</li>`).join(''));

  fillText('#contact-email', content.contact.email);
  renderIfPresent('#contact-links', `
    <a href="mailto:${content.contact.email}">Email</a>
    <a href="${content.contact.github}" target="_blank" rel="noreferrer">GitHub</a>
    <a href="${content.contact.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a>
    <a href="${content.contact.instagram}" target="_blank" rel="noreferrer">Instagram</a>
    <p class="muted">Location: ${content.contact.location}</p>
  `);

  fillText('#footer-note', content.footer.note);
  document.getElementById('year').textContent = new Date().getFullYear();

  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get('name')?.toString().trim() || 'There';
      const email = formData.get('email')?.toString().trim() || 'contact@arpan-baral.com.np';
      const message = formData.get('message')?.toString().trim() || 'Hello';
      const mailtoLink = `mailto:${content.contact.email}?subject=${encodeURIComponent(`Portfolio contact from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
      window.location.href = mailtoLink;
      formStatus.textContent = 'Your email app should open with a draft message.';
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));

  const cheapflixToggle = document.getElementById('toggle-cheapflix-details');
  const cheapflixDetails = document.getElementById('cheapflix-details');
  const cheapflixBack = document.getElementById('back-cheapflix-details');

  if (cheapflixToggle && cheapflixDetails) {
    const setDetailsState = (isOpen) => {
      cheapflixDetails.hidden = !isOpen;
      cheapflixDetails.classList.toggle('is-open', isOpen);
      cheapflixToggle.textContent = isOpen ? 'Hide details' : 'More about this project';
      cheapflixToggle.setAttribute('aria-expanded', String(isOpen));
    };

    cheapflixToggle.addEventListener('click', () => {
      setDetailsState(cheapflixDetails.hidden);
    });

    if (cheapflixBack) {
      cheapflixBack.addEventListener('click', () => {
        setDetailsState(false);
      });
    }

    setDetailsState(false);
  }

  const createPlaceholderImage = (title, accent, glow) => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
        <rect width="1200" height="800" rx="36" fill="#050816"/>
        <rect x="60" y="60" width="1080" height="680" rx="28" fill="url(#g)" stroke="rgba(255,255,255,0.16)" stroke-width="2"/>
        <rect x="120" y="160" width="260" height="24" rx="12" fill="${accent}" opacity="0.8"/>
        <rect x="120" y="220" width="430" height="16" rx="8" fill="#f8fafc" opacity="0.85"/>
        <rect x="120" y="255" width="390" height="16" rx="8" fill="#cbd5e1" opacity="0.8"/>
        <rect x="120" y="330" width="240" height="170" rx="24" fill="rgba(255,255,255,0.12)"/>
        <rect x="395" y="330" width="260" height="70" rx="20" fill="${glow}" opacity="0.82"/>
        <rect x="395" y="430" width="200" height="16" rx="8" fill="#e2e8f0" opacity="0.85"/>
        <circle cx="930" cy="260" r="118" fill="${accent}" opacity="0.3"/>
        <circle cx="930" cy="260" r="74" fill="${glow}" opacity="0.28"/>
        <text x="120" y="640" fill="#f8fafc" font-family="Inter, Arial, sans-serif" font-size="44" font-weight="700">${title}</text>
        <text x="120" y="690" fill="#cbd5e1" font-family="Inter, Arial, sans-serif" font-size="24">Premium product-style showcase</text>
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
        </defs>
      </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  document.querySelectorAll('[data-gallery-image]').forEach((image) => {
    image.src = createPlaceholderImage(
      image.dataset.title || 'CheapFlix Nepal',
      image.dataset.accent || '#ff7a59',
      image.dataset.glow || '#38bdf8'
    );
  });

  const lightbox = document.getElementById('image-lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close');

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.gallery-card').forEach((button) => {
    button.addEventListener('click', () => {
      const image = button.querySelector('img');
      if (!image || !lightbox || !lightboxImage) return;
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });

  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox || event.target === lightboxClose) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });

  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = Number(counter.dataset.target || 0);
      const step = Math.max(1, Math.ceil(target / 30));
      let current = 0;
      const tick = () => {
        current += step;
        if (current >= target) {
          counter.textContent = target;
          counterObserver.unobserve(counter);
          return;
        }
        counter.textContent = current;
        window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  counters.forEach((counter) => counterObserver.observe(counter));

  const typedText = document.getElementById('typed-text');
  const roles = content.hero.roles;
  let index = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeLoop = () => {
    const currentRole = roles[index % roles.length];
    typedText.textContent = currentRole.slice(0, charIndex);
    if (!isDeleting && charIndex < currentRole.length) {
      charIndex += 1;
    } else if (isDeleting && charIndex > 0) {
      charIndex -= 1;
    } else if (!isDeleting) {
      isDeleting = true;
      setTimeout(typeLoop, 900);
      return;
    } else {
      isDeleting = false;
      index += 1;
    }
    setTimeout(typeLoop, isDeleting ? 45 : 95);
  };

  if (typedText && window.matchMedia('(prefers-reduced-motion: reduce)').matches === false) {
    typeLoop();
  }

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const percent = height > 0 ? scrollTop / height : 0;
    progressBar.style.transform = `scaleX(${percent})`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
});
