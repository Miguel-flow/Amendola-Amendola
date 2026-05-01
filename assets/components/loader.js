// =============================
// 1. APLICAR TEMA IMEDIATAMENTE
// =============================
(function applyThemeEarly() {
  const saved = localStorage.getItem("darkMode") === "true";
  if (saved) {
    document.documentElement.classList.add("dark-mode");
  }
})();

// =============================
// 2. FUNÇÃO PARA CARREGAR COMPONENTES
// =============================
async function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Erro ao carregar: ${file}`);
    el.innerHTML = await res.text();
    return true; 
  } catch (err) {
    console.error(err);
    return false;
  }
}

// =============================
//  DARK MODE
// =============================
function initDarkMode() {
  document.addEventListener("click", (e) => {
    const toggle = e.target.closest("#darkModeToggle");
    if (!toggle) return;

    const isDark = document.documentElement.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", isDark);
    console.log("Modo escuro:", isDark);
  });
}

// =============================
//  NAVBAR (Menu Mobile)
// =============================
function initNavbarLogic() {
  document.addEventListener('click', (e) => {
    const menuIcon = e.target.closest('#mobile-menu-icon');
    const navMenu = document.getElementById('navbar-menu');

    if (menuIcon && navMenu) {
      navMenu.classList.toggle('active');
      menuIcon.classList.toggle('open');
      menuIcon.setAttribute('aria-expanded', navMenu.classList.contains('active'));
    }

    if (e.target.closest('.navbar-links a') && navMenu) {
      navMenu.classList.remove('active');
      const button = document.getElementById('mobile-menu-icon');
      if (button) button.setAttribute('aria-expanded', 'false');
    }
  });
}

function initActiveNavLink() {
  function getPageSlug(value) {
    const cleanPath = (value || '').split(/[?#]/)[0];
    if (!cleanPath || cleanPath === '.' || cleanPath === './' || cleanPath.endsWith('/')) {
      return 'index';
    }

    return (cleanPath.split('/').pop() || 'index')
      .replace(/\.html$/i, '')
      .toLowerCase();
  }

  const currentPage = getPageSlug(window.location.pathname);

  document.querySelectorAll('.navbar-links a').forEach((link) => {
    const targetPage = getPageSlug(link.getAttribute('href'));
    if (targetPage === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

function initLocalCleanUrlFallback() {
  const localHosts = ['localhost', '127.0.0.1', '::1'];
  const isLocalPreview = localHosts.includes(window.location.hostname);

  if (!isLocalPreview) return;

  function toLocalHtmlPath(href) {
    if (!href || href.startsWith('#')) return null;
    if (/^(https?:|mailto:|tel:|whatsapp:)/i.test(href)) return null;
    if (/\.[a-z0-9]+$/i.test(href)) return null;

    const cleanHref = href.split(/[?#]/)[0].replace(/^\.\//, '').replace(/^\/+/, '').replace(/\/$/, '');
    if (!cleanHref || cleanHref === '.') return null;

    const pageFiles = {
      sas: 'SAS.html',
      sia: 'SIA.html',
      sis: 'SIS.html',
      sse: 'SSE.html'
    };

    return pageFiles[cleanHref.toLowerCase()] || `${cleanHref}.html`;
  }

  document.addEventListener('click', (e) => {
    const backButton = e.target.closest('.btn-back');
    if (backButton) {
      e.preventDefault();
      e.stopImmediatePropagation();
      window.location.href = 'sistemas.html';
      return;
    }

    const link = e.target.closest('a[href]');
    if (!link || e.button !== 0) return;

    const localPath = toLocalHtmlPath(link.getAttribute('href'));
    if (!localPath) return;

    e.preventDefault();
    if (link.target === '_blank') {
      window.open(localPath, '_blank');
    } else {
      window.location.href = localPath;
    }
  }, true);
}

// =============================
//  3. FOOTER (IDIOMA)
// =============================
function initFooter() {
  document.addEventListener("click", (e) => {
    const button = e.target.closest("#langButton");
    const menu = document.getElementById("langMenu");
    const selector = document.getElementById("langSelector");

    if (button && menu) {
      e.stopPropagation();
      menu.classList.toggle("active");
    } else if (menu && selector && !selector.contains(e.target)) {
      menu.classList.remove("active");
    }
  });
}

// =============================
//  5. INICIALIZAÇÃO GERAL
// =============================
async function initPage() {
  const tasks = [];

  if (document.getElementById("navbar")) {
    tasks.push(loadComponent("navbar", "assets/components/navbar.html"));
  }
  
 
  if (document.getElementById("footer-area")) {
    tasks.push(loadComponent("footer-area", "assets/components/footer.html"));
  }

  if (document.getElementById("cookies-area")) {
    tasks.push(loadComponent("cookies-area", "assets/components/cookies.html"));
  }
  
  if (document.getElementById("contato-area")) {
    tasks.push(loadComponent("contato-area", "assets/components/contato.html"));
  }

  await Promise.all(tasks);

  initActiveNavLink();
  initLocalCleanUrlFallback();
  initNavbarLogic(); 
  initFooter();      
  initDarkMode();    
}

document.addEventListener("DOMContentLoaded", initPage);
