const defaultSlides = [
  'assets/images/man-in-suit-exiting-car-as-assistant-opens-door-2026-03-20-00-34-07-utc.JPG',
  'assets/images/business-professionals-arriving-from-sedan-at-busi-2026-01-08-23-42-57-utc.JPG',
  'assets/images/elegant-people-with-chauffeur-on-city-street-2026-01-08-23-44-37-utc.JPG'
];

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMenu();
  setActiveNav();
  initHeroSlides();
  initReveal();
  initCounters();
  initAccordions();
  initForms();
  initYear();
});

function initHeader(){
  const header = document.querySelector('.site-header');
  if(!header) return;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 18);
  update();
  window.addEventListener('scroll', update, {passive:true});
}

function initMenu(){
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-menu');
  if(!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

function setActiveNav(){
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    if(link.getAttribute('href') === current) link.classList.add('active');
  });
}

function initHeroSlides(){
  document.querySelectorAll('[data-hero-slides]').forEach(hero => {
    let slides = defaultSlides;
    try{
      const parsed = JSON.parse(hero.getAttribute('data-hero-slides'));
      if(Array.isArray(parsed) && parsed.length) slides = parsed;
    }catch(error){ slides = defaultSlides; }

    const bgA = document.createElement('div');
    const bgB = document.createElement('div');
    bgA.className = 'hero-bg is-zooming';
    bgB.className = 'hero-bg-next';
    bgA.style.backgroundImage = `url("${slides[0]}")`;
    hero.prepend(bgB);
    hero.prepend(bgA);

    slides.forEach(src => { const img = new Image(); img.src = src; });
    let active = 0;
    let showingA = true;
    if(slides.length < 2) return;

    setInterval(() => {
      const next = (active + 1) % slides.length;
      const visible = showingA ? bgA : bgB;
      const hidden = showingA ? bgB : bgA;
      hidden.style.backgroundImage = `url("${slides[next]}")`;
      hidden.classList.add('is-zooming');
      hidden.style.opacity = '1';
      visible.style.opacity = '0';
      setTimeout(() => {
        visible.classList.remove('is-zooming');
        visible.style.opacity = '0';
      }, 1300);
      active = next;
      showingA = !showingA;
    }, 5600);
  });
}

function initReveal(){
  const items = document.querySelectorAll('.reveal');
  if(!items.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.13, rootMargin:'0px 0px -20px 0px'});
  items.forEach(item => observer.observe(item));
}

function initCounters(){
  const counters = document.querySelectorAll('[data-count]');
  if(!counters.length) return;
  const animate = counter => {
    const target = Number(counter.dataset.count);
    const suffix = counter.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = value + suffix;
      if(progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.4});
  counters.forEach(counter => observer.observe(counter));
}

function initAccordions(){
  document.querySelectorAll('.accordion-trigger').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.accordion-item');
      const panel = item.querySelector('.accordion-panel');
      const isOpen = item.classList.toggle('is-open');
      button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      panel.style.maxHeight = isOpen ? panel.scrollHeight + 'px' : '0px';
    });
  });
}

function initForms(){
  document.querySelectorAll('[data-contact-form]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(form);
      const alert = form.querySelector('.alert');
      const formType = form.dataset.contactForm || 'Chauffeur Enquiry';
      const email = form.dataset.email || 'bookings@yourcompany.com';
      const lines = [`${formType}`, ''];
      data.forEach((value, key) => {
        if(String(value).trim()) lines.push(`${formatLabel(key)}: ${value}`);
      });
      const subject = encodeURIComponent(formType);
      const body = encodeURIComponent(lines.join('\n'));
      if(alert){
        alert.textContent = 'Thank you. Your enquiry is ready to send. Your email app will open with the journey details.';
        alert.classList.add('is-visible');
      }
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      setTimeout(() => form.reset(), 600);
    });
  });
}

function formatLabel(key){
  return key.replaceAll('-', ' ').replaceAll('_', ' ').replace(/\b\w/g, letter => letter.toUpperCase());
}

function initYear(){
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
}
