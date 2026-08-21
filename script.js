(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const header = $('[data-header]');
  const menuButton = $('.menu-button');
  const siteNav = $('#site-nav');
  const parametersPanel = $('[data-parameters-panel]');
  const commandPanel = $('[data-command-panel]');
  const commandInput = $('[data-command-input]');
  let lastFocus = null;
  let typed = '';

  $$('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menuButton?.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
  $$('#site-nav a').forEach((link) => link.addEventListener('click', () => {
    siteNav.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  $$('.reveal').forEach((element) => observer.observe(element));

  const setLock = () => document.body.classList.toggle('panel-open', parametersPanel.classList.contains('is-open') || commandPanel.classList.contains('is-open'));
  const closeParameters = () => {
    parametersPanel.classList.remove('is-open');
    parametersPanel.setAttribute('aria-hidden', 'true');
    setLock();
    lastFocus?.focus?.();
  };
  const openParameters = () => {
    lastFocus = document.activeElement;
    closeCommand(false);
    parametersPanel.classList.add('is-open');
    parametersPanel.setAttribute('aria-hidden', 'false');
    setLock();
    $('[data-parameters-close]', parametersPanel)?.focus();
  };
  $$('[data-parameters-open]').forEach((button) => button.addEventListener('click', openParameters));
  $$('[data-parameters-close]').forEach((button) => button.addEventListener('click', closeParameters));

  function closeCommand(restoreFocus = true) {
    commandPanel.classList.remove('is-open');
    commandPanel.setAttribute('aria-hidden', 'true');
    setLock();
    if (restoreFocus) lastFocus?.focus?.();
  }
  const openCommand = () => {
    lastFocus = document.activeElement;
    commandPanel.classList.add('is-open');
    commandPanel.setAttribute('aria-hidden', 'false');
    setLock();
    setTimeout(() => commandInput?.focus(), 60);
  };
  $$('[data-command-open]').forEach((button) => button.addEventListener('click', openCommand));
  $$('[data-command-close]').forEach((button) => button.addEventListener('click', () => closeCommand()));
  $$('[data-target]', commandPanel).forEach((button) => button.addEventListener('click', () => {
    const target = $(button.dataset.target);
    closeCommand(false);
    target?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }));
  $('[data-open-parameters]', commandPanel)?.addEventListener('click', openParameters);
  commandInput?.addEventListener('input', () => {
    const query = commandInput.value.trim().toLowerCase();
    $$('.command-list button').forEach((button) => { button.hidden = query && !button.textContent.toLowerCase().includes(query); });
  });

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      commandPanel.classList.contains('is-open') ? closeCommand() : openCommand();
      return;
    }
    if (event.key === 'Escape') {
      if (parametersPanel.classList.contains('is-open')) closeParameters();
      if (commandPanel.classList.contains('is-open')) closeCommand();
      return;
    }
    if (event.target instanceof HTMLInputElement || event.target?.isContentEditable || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key.length === 1) {
      typed = (typed + event.key.toLowerCase()).slice(-6);
      if (typed === 'whoami') { typed = ''; openParameters(); }
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const panel = parametersPanel.classList.contains('is-open') ? parametersPanel : commandPanel.classList.contains('is-open') ? commandPanel : null;
    if (!panel) return;
    const focusables = $$('a[href], button:not([disabled]), input:not([disabled])', panel).filter((el) => !el.hidden);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
})();
