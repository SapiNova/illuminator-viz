const searchData = [
  { title: "Overview", section: "Getting Started", href: "/docs/", text: "Illuminator is a powerful 2D graph and network renderer and editor with GPU-accelerated rendering." },
  { title: "Features", section: "Getting Started", href: "/docs/#features", text: "Rich visual styling, powerful selection, multiple layout engines, flexible data import, console scripting, interactive tools." },
  { title: "Keyboard Shortcuts", section: "Getting Started", href: "/docs/shortcuts/", text: "F11 fullscreen, Ctrl+O open, Ctrl+A select all, Ctrl+I invert, Ctrl+G expand, Escape clear, number keys for tools, Shift quick translate." },
  { title: "Translation Tool", section: "Tools", href: "/docs/tools/#translate", text: "Default tool for moving nodes. Click and drag to translate selected nodes. Key 1." },
  { title: "Rotation Tool", section: "Tools", href: "/docs/tools/#rotate", text: "Rotate the current selection around its center. Key 2." },
  { title: "Scaling Tool", section: "Tools", href: "/docs/tools/#scale", text: "Scale the current selection relative to its center. Key 3." },
  { title: "Box Selector", section: "Tools", href: "/docs/tools/#box", text: "Click and drag to draw a rectangular selection box. All nodes inside will be selected. Key 4." },
  { title: "Line Layout Tool", section: "Tools", href: "/docs/tools/#line", text: "Arranges selected nodes in a straight line. Key 5." },
  { title: "Arc Layout Tool", section: "Tools", href: "/docs/tools/#arc", text: "Arranges selected nodes along a circular arc. Drag to adjust angle and radius. Key 6." },
  { title: "Force-Directed Layout", section: "Layout Algorithms", href: "/docs/layouts/#spring", text: "Live spring simulation. Repulsion strength, spring strength, ideal edge length. Fix selected nodes." },
  { title: "Random Layout", section: "Layout Algorithms", href: "/docs/layouts/#random", text: "Positions nodes at random locations with configurable spacing." },
  { title: "GRIP Layout", section: "Layout Algorithms", href: "/docs/layouts/#grip", text: "Multi-level graph drawing algorithm for large graphs. Ideal edge length, rounds per level." },
  { title: "Appearance Window", section: "User Interface", href: "/docs/ui/#appearance", text: "Node size shape rotation border colour, edge width colour, label content anchor distance rotation size colour highlight." },
  { title: "Selection Window", section: "User Interface", href: "/docs/ui/#selection", text: "Displays tables of selected nodes and edges with attributes. Highlight and filter rows." },
  { title: "Layout Window", section: "User Interface", href: "/docs/ui/#layout", text: "Collapsible sections for Force-Directed, Random, and GRIP layout parameters." },
  { title: "Subset Window", section: "User Interface", href: "/docs/ui/#subset", text: "Manage named subsets of nodes. Create with Ctrl+N or Selection menu." },
  { title: "Console", section: "User Interface", href: "/docs/ui/#console", text: "Command console for typing and executing commands. Toggle with View menu." },
  { title: "Menu Bar", section: "User Interface", href: "/docs/ui/#menus", text: "File, Script, Selection, Renderer, Layout, View menus with full feature access." },
  { title: "load command", section: "Commands", href: "/docs/commands/#load", text: "Load a graph from .ilu, .csv, or .tsv files. target delimiter header true false column indices attributes." },
  { title: "import command", section: "Commands", href: "/docs/commands/#import", text: "Add attributes from CSV TSV join graph attribute header false column index." },
  { title: "select command", section: "Commands", href: "/docs/commands/#select", text: "Select all, invert, clear, expand, where expression. +select -select ^select set operations." },
  { title: "set command", section: "Commands", href: "/docs/commands/#set", text: "Set node size shape rotation colour border, edge width colour, label content anchor size distance rotation colour." },
  { title: "map command", section: "Commands", href: "/docs/commands/#map", text: "Map a style property to a numeric attribute with linear interpolation. Colour channels r g b a." },
  { title: "create command", section: "Commands", href: "/docs/commands/#create", text: "Create a named subset from the current selection." },
  { title: "execute command", section: "Commands", href: "/docs/commands/#execute", text: "Run a script file. One command per line. Comments with //. Script menu for recent scripts." },
  { title: "Query Language", section: "Scripting", href: "/docs/query/", text: "Expression parser for select where. Operators == != < <= > >= && || ! parentheses. Float int32 uint32 string." },
  { title: "Script Files", section: "Scripting", href: "/docs/query/#scripting", text: "Plain text files with one command per line. Comments with //. Automate loading, selection, styling." },
  { title: "File Formats", section: "Data", href: "/docs/data/#formats", text: ".ilu native binary format. .csv and .tsv tabular import with headers and delimiters." },
  { title: "Attributes", section: "Data", href: "/docs/data/#attributes", text: "Typed attributes: float, int32, uint32, string, shared_string. Used for labels, filtering, and data-driven styling." },
];

(function () {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  let activeIndex = -1;

  function highlightMatch(text, query) {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return text.slice(0, idx) +
      '<mark style="background:var(--accent-dim);color:var(--accent);border-radius:2px;padding:0 1px">' +
      text.slice(idx, idx + query.length) + '</mark>' + text.slice(idx + query.length);
  }

  function doSearch(query) {
    if (!query.trim()) { results.classList.remove('visible'); return; }
    const q = query.toLowerCase();
    const matched = searchData.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.text.toLowerCase().includes(q) ||
      item.section.toLowerCase().includes(q)
    ).slice(0, 10);

    if (matched.length === 0) {
      results.innerHTML = '<div style="padding:14px;color:var(--text-muted);text-align:center">No results found</div>';
    } else {
      results.innerHTML = matched.map((r, i) => {
        let preview = r.text;
        const matchIdx = preview.toLowerCase().indexOf(q);
        if (matchIdx > 30) preview = '...' + preview.slice(matchIdx - 20);
        if (preview.length > 120) preview = preview.slice(0, 120) + '...';
        return `<div class="search-result-item${i === activeIndex ? ' active' : ''}" data-href="${r.href}" data-index="${i}">
          <div class="result-title">${highlightMatch(r.title, query)}</div>
          <div class="result-section">${r.section}</div>
          <div class="result-preview">${highlightMatch(preview, query)}</div>
        </div>`;
      }).join('');
    }
    results.classList.add('visible');
    activeIndex = -1;
  }

  input.addEventListener('input', e => doSearch(e.target.value));
  input.addEventListener('focus', e => { if (e.target.value) doSearch(e.target.value); });

  input.addEventListener('keydown', e => {
    const items = results.querySelectorAll('.search-result-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      items.forEach((el, i) => el.classList.toggle('active', i === activeIndex));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      items.forEach((el, i) => el.classList.toggle('active', i === activeIndex));
    } else if (e.key === 'Enter' && activeIndex >= 0 && items[activeIndex]) {
      e.preventDefault();
      window.location.href = items[activeIndex].dataset.href;
      results.classList.remove('visible');
      input.blur();
    } else if (e.key === 'Escape') {
      results.classList.remove('visible');
      input.blur();
    }
  });

  results.addEventListener('click', e => {
    const item = e.target.closest('.search-result-item');
    if (item) {
      window.location.href = item.dataset.href;
      results.classList.remove('visible');
      input.value = '';
    }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.header-search')) results.classList.remove('visible');
  });

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });
})();

// Active nav link tracking (for pages with anchors)
(function () {
  const navLinks = document.querySelectorAll('.nav-link');

  function docsSlugFromPath(pathname) {
    const path = pathname.replace(/\/$/, '');
    const match = path.match(/\/docs(?:\/([^/]+))?$/);
    return match ? (match[1] || '') : null;
  }

  function docsSlugFromHref(href) {
    const path = href.split('#')[0].replace(/\/$/, '');
    const match = path.match(/\/docs(?:\/([^/]+))?$/);
    return match ? (match[1] || '') : null;
  }

  function updateActiveNav() {
    const page = docsSlugFromPath(window.location.pathname);
    if (page === null) return;
    const hash = window.location.hash;
    let best = null;
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const linkPage = docsSlugFromHref(href);
      const linkHash = href.includes('#') ? href.split('#')[1] : '';
      if (linkPage === page && linkHash && hash === '#' + linkHash) {
        best = link;
      } else if (linkPage === page && !linkHash && !best) {
        best = link;
      }
    });
    navLinks.forEach(l => l.classList.remove('active'));
    if (best) best.classList.add('active');
  }

  if (document.querySelectorAll('[id]').length > 3) {
    window.addEventListener('scroll', () => {
      const page = docsSlugFromPath(window.location.pathname);
      if (page === null) return;
      let current = '';
      document.querySelectorAll('[id]').forEach(el => {
        if (el.offsetTop <= window.scrollY + 100) current = el.id;
      });
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const linkPage = docsSlugFromHref(href);
        const linkHash = href.includes('#') ? href.split('#')[1] : '';
        if (linkPage === page && linkHash) {
          link.classList.toggle('active', linkHash === current);
        } else if (linkPage === page && !linkHash) {
          link.classList.toggle('active', !current);
        }
      });
    }, { passive: true });
  }

  updateActiveNav();
  window.addEventListener('hashchange', updateActiveNav);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('sidebar').classList.remove('open');
    });
  });
})();
