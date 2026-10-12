(function () {
  'use strict';
  var script = document.currentScript;
  var base = script.getAttribute('data-site-base') || '/';
  var supported = (script.getAttribute('data-site-languages') || 'en,ru,ar,de,es,fa,fr,hi,id,pt,tr,vi,zh').split(',');
  var key = 'agdm_rootchecker_lang';
  function valid(lang) { return supported.indexOf(lang) >= 0; }
  function normalize(lang) { return String(lang || '').toLowerCase().replace(/_/g, '-').split('-')[0].replace(/^in$/, 'id'); }
  function remember(lang) {
    try {
      if (lang === 'auto') { localStorage.removeItem(key); localStorage.removeItem('agdm_lang'); }
      else { localStorage.setItem(key, lang); localStorage.setItem('agdm_lang', lang); }
    } catch (e) {}
  }
  document.addEventListener('click', function (event) {
    var link = event.target.closest ? event.target.closest('a[data-site-lang]') : null;
    if (link) { var lang = link.getAttribute('data-site-lang'); if (valid(lang) || lang === 'auto') remember(lang); }
  }, true);
  if (location.pathname !== base && location.pathname !== base + 'index.html') return;
  var explicit = null;
  try { explicit = new URLSearchParams(location.search).get('lang'); } catch (e) {}
  if (explicit === 'auto') remember('auto');
  if (explicit && valid(explicit)) remember(explicit);
  var stored = null;
  try { stored = localStorage.getItem(key) || localStorage.getItem('agdm_lang'); } catch (e) {}
  var chosen = explicit && valid(explicit) ? explicit : valid(stored) ? stored : null;
  if (!chosen) {
    var languages = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    for (var i = 0; i < languages.length; i++) { var candidate = normalize(languages[i]); if (valid(candidate)) { chosen = candidate; break; } }
  }
  chosen = chosen || 'en';
  if (chosen !== 'en') location.replace(base + chosen + '/index.html' + location.search + location.hash);
})();
