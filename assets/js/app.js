/* Renders the page from window.PROFILE (assets/js/profile.js) and wires up interactions. */
(function () {
  'use strict';

  var P = window.PROFILE;
  if (!P) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- small helpers ---------- */

  // Build a DOM node. Text is always set as text, never as HTML.
  function h(tag, props) {
    var node = document.createElement(tag);
    Object.keys(props || {}).forEach(function (key) {
      var val = props[key];
      if (val == null || val === false) return;
      if (key === 'class') node.className = val;
      else if (key === 'text') node.textContent = val;
      else if (key === 'dataset') Object.keys(val).forEach(function (d) { node.dataset[d] = val[d]; });
      else if (key.indexOf('on') === 0) node.addEventListener(key.slice(2), val);
      else node.setAttribute(key, val === true ? '' : val);
    });
    for (var i = 2; i < arguments.length; i++) {
      var kids = [].concat(arguments[i]);
      for (var j = 0; j < kids.length; j++) {
        var kid = kids[j];
        if (kid == null || kid === false) continue;
        node.append(kid.nodeType ? kid : document.createTextNode(kid));
      }
    }
    return node;
  }

  // "Some **bold** text" -> text and <strong> nodes.
  function rich(str) {
    var frag = document.createDocumentFragment();
    str.split(/\*\*(.+?)\*\*/g).forEach(function (part, i) {
      frag.append(i % 2 ? h('strong', { text: part }) : document.createTextNode(part));
    });
    return frag;
  }

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function parseYM(ym) { var p = ym.split('-').map(Number); return { y: p[0], m: p[1] }; }
  function fmtYM(ym) { if (!ym) return 'Present'; var d = parseYM(ym); return MONTHS[d.m - 1] + ' ' + d.y; }
  function monthsBetween(a, b) {
    var s = parseYM(a);
    var now = new Date();
    var e = b ? parseYM(b) : { y: now.getFullYear(), m: now.getMonth() + 1 };
    return (e.y - s.y) * 12 + (e.m - s.m) + 1;
  }
  function fmtDuration(n) {
    var y = Math.floor(n / 12), m = n % 12, out = [];
    if (y) out.push(y + (y === 1 ? ' year' : ' years'));
    if (m) out.push(m + (m === 1 ? ' month' : ' months'));
    return out.join(' ');
  }
  function dateRange(item) {
    return fmtYM(item.start) + ' to ' + fmtYM(item.end) + ' (' + fmtDuration(monthsBetween(item.start, item.end)) + ')';
  }

  var rtf = typeof Intl !== 'undefined' && Intl.RelativeTimeFormat ? new Intl.RelativeTimeFormat('en', { numeric: 'auto' }) : null;
  function ago(iso) {
    if (!rtf) return '';
    var diff = (new Date(iso).getTime() - Date.now()) / 1000;
    var units = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
    for (var i = 0; i < units.length; i++) {
      if (Math.abs(diff) >= units[i][1]) return rtf.format(Math.round(diff / units[i][1]), units[i][0]);
    }
    return 'just now';
  }

  /* ---------- skills highlight (shared across sections) ---------- */

  var skillNames = {};
  P.skills.forEach(function (g) { g.items.forEach(function (s) { skillNames[s] = true; }); });
  var activeSkill = null;

  function tagNode(name) {
    if (!skillNames[name]) return h('span', { class: 'tag plain', text: name });
    return h('button', {
      class: 'tag', type: 'button', 'aria-pressed': 'false', dataset: { skill: name },
      text: name, onclick: function () { setSkill(name); },
    });
  }

  function setSkill(name) {
    activeSkill = activeSkill === name ? null : name;
    $$('[data-skill]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.skill === activeSkill));
    });

    var roles = 0, projects = 0;
    $$('.entry[data-tech]').forEach(function (entry) {
      var match = !activeSkill || entry.dataset.tech.split('|').indexOf(activeSkill) !== -1;
      entry.classList.toggle('is-dim', !match);
      if (activeSkill && match) { if (entry.dataset.kind === 'role') roles++; else projects++; }
    });

    var bar = $('#skill-bar');
    if (activeSkill) {
      var parts = [];
      if (roles) parts.push(roles + (roles === 1 ? ' role' : ' roles'));
      if (projects) parts.push(projects + (projects === 1 ? ' project' : ' projects'));
      $('#skill-bar-text').textContent = activeSkill + ': ' + (parts.length ? parts.join(' and ') : 'listed in skills only');
      bar.hidden = false;
    } else {
      bar.hidden = true;
    }
  }

  /* ---------- hero ---------- */

  var runTimers = [];
  function renderRun() {
    $('#run-cmd').textContent = '$ run ' + P.run.suite;
    var list = $('#run-log');
    list.replaceChildren();
    P.run.lines.forEach(function (line) {
      list.append(h('li', { class: 'pending' },
        h('span', { class: 'ok', 'aria-hidden': 'true', text: '✓' }),
        h('span', { class: 'lbl' }, h('span', { class: 'sr', text: 'Passed: ' }), line.label),
        h('span', { class: 'txt', text: line.text })));
    });
    list.append(h('li', { class: 'pending' },
      h('span', { class: 'total' },
        h('span', { class: 'ok', 'aria-hidden': 'true', text: '✓' }),
        P.run.lines.length + ' passed, 0 failed')));
    playRun();
  }

  function playRun() {
    runTimers.forEach(clearTimeout);
    runTimers = [];
    var items = $$('#run-log li');
    if (reduceMotion) { items.forEach(function (li) { li.classList.remove('pending'); }); return; }
    items.forEach(function (li) { li.classList.add('pending'); });
    items.forEach(function (li, i) {
      runTimers.push(setTimeout(function () { li.classList.remove('pending'); }, 450 + i * 340));
    });
  }

  function renderStatus() {
    var el = $('#availability');
    if (!P.availability) return;
    el.textContent = P.availability;
    el.hidden = false;
  }

  /* ---------- sections ---------- */

  function renderExperience() {
    var root = $('#experience-list');
    P.experience.forEach(function (job) {
      root.append(h('article', { class: 'entry', dataset: { kind: 'role', tech: job.tech.join('|') } },
        h('div', { class: 'entry-top' },
          h('h3', { text: job.role }),
          h('p', { class: 'when', text: dateRange(job) })),
        h('p', { class: 'org', text: job.org + ', ' + job.place }),
        h('ul', { class: 'bullets' }, job.bullets.map(function (b) { return h('li', {}, rich(b)); })),
        h('div', { class: 'tags' }, job.tech.map(tagNode))));
    });
  }

  var projectFilter = 'All';
  function renderProjects() {
    var cats = ['All'];
    P.projects.forEach(function (p) { p.categories.forEach(function (c) { if (cats.indexOf(c) === -1) cats.push(c); }); });

    var filters = $('#project-filters');
    cats.forEach(function (cat) {
      filters.append(h('button', {
        class: 'tag', type: 'button', 'aria-pressed': String(cat === projectFilter), text: cat,
        onclick: function () {
          projectFilter = cat;
          $$('button', filters).forEach(function (b) { b.setAttribute('aria-pressed', String(b.textContent === cat)); });
          $$('#project-list .entry').forEach(function (el) {
            el.hidden = cat !== 'All' && el.dataset.cats.split('|').indexOf(cat) === -1;
          });
        },
      }));
    });

    var root = $('#project-list');
    P.projects.forEach(function (proj) {
      root.append(h('article', { class: 'entry', dataset: { kind: 'project', tech: proj.stack.join('|'), cats: proj.categories.join('|') } },
        h('div', { class: 'entry-top' },
          h('h3', {}, proj.name, proj.award ? h('span', { class: 'badge', text: proj.award }) : null)),
        h('ul', { class: 'bullets' }, proj.bullets.map(function (b) { return h('li', {}, rich(b)); })),
        h('div', { class: 'tags' }, proj.stack.map(tagNode)),
        proj.links && proj.links.length
          ? h('div', { class: 'links' }, proj.links.map(function (l) { return h('a', { href: l.href, target: '_blank', rel: 'noopener', text: l.label }); }))
          : null));
    });
  }

  function renderSkills() {
    var root = h('dl');
    P.skills.forEach(function (g) {
      root.append(h('div', { class: 'skill-group' },
        h('dt', { text: g.group }),
        h('dd', {}, g.items.map(tagNode))));
    });
    $('#skill-list').append(root);
  }

  function renderEducation() {
    var ed = P.education;
    $('#education-body').append(
      h('div', { class: 'edu-head' },
        h('h3', { text: ed.school }),
        h('p', { class: 'when', text: fmtYM(ed.start) + ' to ' + fmtYM(ed.end) })),
      h('p', { class: 'org', text: ed.degree + ', ' + ed.place }),
      h('ul', { class: 'roles', 'aria-label': 'Leadership and roles' }, ed.roles.map(function (r) {
        return h('li', {}, h('span', { text: r.title }), h('span', { class: 'where', text: r.org }));
      })));
  }

  function renderContact() {
    $('#contact-body').append(
      h('a', { class: 'email-link', href: 'mailto:' + P.email, text: P.email }),
      h('div', { class: 'contact-actions' },
        h('button', { class: 'btn btn-primary', type: 'button', 'data-copy-email': '', text: 'Copy email' }),
        h('a', { class: 'btn', href: P.links.linkedin, target: '_blank', rel: 'noopener', text: 'LinkedIn' }),
        h('a', { class: 'btn', href: P.links.github, target: '_blank', rel: 'noopener', text: 'GitHub' }),
        h('a', { class: 'btn', href: P.resume.href, download: P.resume.downloadName, text: 'Download resume' })),
      h('p', { class: 'contact-note', id: 'contact-note' }));
  }

  /* ---------- GitHub (live) ---------- */

  function slimRepo(r) {
    return { name: r.name, url: r.html_url, description: r.description, language: r.language,
      stars: r.stargazers_count, pushed: r.pushed_at, fork: r.fork, archived: r.archived };
  }

  function loadRepos() {
    var key = 'repos:' + P.github.user;
    try {
      var cached = JSON.parse(localStorage.getItem(key));
      if (cached && Date.now() - cached.t < 30 * 60 * 1000) return Promise.resolve(cached.d);
    } catch (e) { /* storage unavailable, fetch instead */ }

    return fetch('https://api.github.com/users/' + encodeURIComponent(P.github.user) + '/repos?per_page=100&sort=pushed', {
      headers: { Accept: 'application/vnd.github+json' },
    }).then(function (res) {
      if (!res.ok) throw new Error('GitHub responded ' + res.status);
      return res.json();
    }).then(function (data) {
      var slim = data.map(slimRepo);
      try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), d: slim })); } catch (e) { /* ignore */ }
      return slim;
    });
  }

  function renderRepos() {
    var root = $('#repo-list');
    var allLink = h('a', { class: 'more', href: P.links.github, target: '_blank', rel: 'noopener', text: 'See everything on GitHub' });
    root.append(h('p', { class: 'note', text: 'Loading repositories…' }));

    loadRepos().then(function (repos) {
      var site = repos.filter(function (r) { return r.name === P.github.siteRepo; })[0];
      if (site) $('#footer-right').textContent = 'Site last updated ' + ago(site.pushed);

      var shown = repos.filter(function (r) {
        return !r.fork && !r.archived && P.github.exclude.indexOf(r.name) === -1;
      }).sort(function (a, b) { return new Date(b.pushed) - new Date(a.pushed); }).slice(0, P.github.limit);

      root.replaceChildren();
      if (!shown.length) {
        root.append(h('p', { class: 'note', text: 'No public repositories to show yet.' }), allLink);
        return;
      }
      shown.forEach(function (r) {
        root.append(h('div', { class: 'repo' },
          h('div', {},
            h('a', { class: 'name', href: r.url, target: '_blank', rel: 'noopener', text: r.name }),
            h('p', { text: r.description || 'No description yet.' })),
          h('div', { class: 'meta' },
            r.language ? h('div', { class: 'lang', text: r.language }) : null,
            r.stars ? h('div', { text: r.stars + (r.stars === 1 ? ' star' : ' stars') }) : null,
            h('div', { text: 'Updated ' + ago(r.pushed) }))));
      });
      root.append(allLink);
    }).catch(function () {
      root.replaceChildren(
        h('p', { class: 'note', text: 'Could not load repositories from GitHub right now. Try again later or open the profile directly.' }),
        allLink);
    });
  }

  /* ---------- footer, time, copy ---------- */

  function renderFooter() {
    var left = $('#footer-left');
    left.textContent = '© ' + new Date().getFullYear() + ' ' + P.name + '. ';
    var time = h('span', { id: 'local-time' });
    left.append(P.location + ', ', time);
    function tick() {
      try {
        time.textContent = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: P.timezone }).format(new Date());
      } catch (e) { time.textContent = ''; }
    }
    tick();
    setInterval(tick, 30000);
  }

  function wireCopy() {
    $$('[data-copy-email]').forEach(function (btn) {
      var original = btn.textContent;
      btn.addEventListener('click', function () {
        function done(ok) {
          btn.textContent = ok ? 'Copied' : 'Press Ctrl+C to copy';
          var note = $('#contact-note');
          if (note) note.textContent = ok ? 'Email address copied to your clipboard.' : P.email;
          setTimeout(function () { btn.textContent = original; if (note) note.textContent = ''; }, 2200);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(P.email).then(function () { done(true); }, function () { done(false); });
        } else {
          done(false);
        }
      });
    });
  }

  /* ---------- nav, theme, scroll-spy ---------- */

  function wireNav() {
    var btn = $('#menu-btn'), nav = $('#site-nav');
    function setOpen(open) {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    btn.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });

    var links = $$('a', nav);
    var sections = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
    sections.unshift($('#top')); // the hero has no nav link, so reaching it clears the highlight
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (a) {
            if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
            else a.removeAttribute('aria-current');
          });
        });
      }, { rootMargin: '-35% 0px -60% 0px' });
      sections.forEach(function (s) { io.observe(s); });
    }
  }

  function wireTheme() {
    var btn = $('#theme-btn');
    function sync() {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      var meta = $('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', dark ? '#111111' : '#F3EEE3');
    }
    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
      sync();
    });
    sync();
  }

  /* ---------- boot ---------- */

  function applyProfileLinks() {
    $$('[data-resume]').forEach(function (a) {
      a.setAttribute('href', P.resume.href);
      a.setAttribute('download', P.resume.downloadName);
    });
  }

  renderStatus();
  renderRun();
  renderExperience();
  renderProjects();
  renderRepos();
  renderSkills();
  renderEducation();
  renderContact();
  renderFooter();
  applyProfileLinks();
  wireCopy();
  wireNav();
  wireTheme();

  $('#run-replay').addEventListener('click', playRun);
  $('#skill-bar-clear').addEventListener('click', function () { if (activeSkill) setSkill(activeSkill); });
})();
