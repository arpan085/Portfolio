document.addEventListener('DOMContentLoaded', () => {
  const content = window.siteContent;
  const body = document.body;
  const themeToggle = document.getElementById('theme-toggle');
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

  fillText('#hero-name', content.hero.name);
  fillText('#hero-intro', content.hero.intro);
  document.getElementById('hero-meta').textContent = content.hero.roles.join(' · ');
  document.getElementById('hero-inline-learning').textContent = content.hero.learningLine;
  document.getElementById('hero-actions').innerHTML = content.hero.buttons.map((button) => `<a class="button ${button.label === 'Contact' ? 'secondary' : 'primary'}" href="${button.href}"${button.download ? `download="${button.download}"` : ''}>${button.label}</a>`).join('');
  document.getElementById('hero-socials').innerHTML = content.hero.socials.map((item) => `<a href="${item.href}" aria-label="${item.label}" target="_blank" rel="noreferrer">${item.icon}</a>`).join('');

  fillText('#about-intro', content.about.intro);
  fillText('#about-body', content.about.body);

  document.getElementById('journey-list').innerHTML = content.journey.map((item) => `
    <article class="timeline-item reveal">
      <div class="year">${item.year}</div>
      <h3>${item.title}</h3>
      <p class="muted">${item.text}</p>
    </article>
  `).join('');

  const skillGroups = Object.entries(content.skills);
  document.getElementById('skills-grid').innerHTML = skillGroups.map(([groupName, items]) => `
    <article class="skill-card reveal">
      <h3>${groupName.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</h3>
      <div class="skill-list">
        ${items.map((skill) => `
          <div class="skill-meta">
            <strong>${skill.name}</strong>
            <span>${skill.level}</span>
          </div>
          <p>${skill.note}</p>
        `).join('')}
      </div>
    </article>
  `).join('');

  document.getElementById('projects-grid').innerHTML = content.projects.map((project) => `
    <article class="project-card reveal">
      <img src="${project.image}" alt="${project.title} preview">
      <div class="project-body">
        <h3>${project.title}</h3>
        <p class="muted">${project.description}</p>
        <div class="stack">${project.stack.map((item) => `<span>${item}</span>`).join('')}</div>
        <div class="project-links">
          <a href="${project.github}">GitHub</a>
          <a href="${project.demo}">Demo</a>
        </div>
      </div>
    </article>
  `).join('');

  document.getElementById('learning-list').innerHTML = content.learning.map((item) => `<li>${item}</li>`).join('');

  document.getElementById('certificates-grid').innerHTML = content.certificates.map((item) => `
    <article class="cert-card reveal">
      <h3>${item.title}</h3>
      <p class="muted">${item.issuer}</p>
      <p>${item.date}</p>
      <a href="${item.link}">View credential</a>
    </article>
  `).join('');

  document.getElementById('blog-grid').innerHTML = content.blog.map((item) => `
    <article class="blog-card reveal">
      <h3>${item.title}</h3>
      <p class="muted">${item.excerpt}</p>
      <a href="${item.link}">Read note</a>
    </article>
  `).join('');

  fillText('#resume-summary', content.resume.summary);
  document.getElementById('resume-highlights').innerHTML = content.resume.highlights.map((item) => `<li>${item}</li>`).join('');

  fillText('#contact-email', content.contact.email);
  document.getElementById('contact-links').innerHTML = `
    <a href="mailto:${content.contact.email}">Email</a>
    <a href="${content.contact.github}" target="_blank" rel="noreferrer">GitHub</a>
    <a href="${content.contact.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a>
    <a href="${content.contact.instagram}" target="_blank" rel="noreferrer">Instagram</a>
    <p class="muted">Location: ${content.contact.location}</p>
  `;

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

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches === false) {
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
