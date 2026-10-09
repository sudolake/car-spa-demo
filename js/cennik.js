// Cenník: vykreslí kategórie z cennik-data.js a prepína ceny s DPH / bez DPH.
// Prepínač funguje rovnako ako na lakovaniediskov.sk: čísla dobehnú na novú hodnotu, voľba sa zapamätá.
(function () {
  var root = document.getElementById('cennik');
  if (!root || !window.CENNIK) return;

  var VAT = 0.23;
  var state = { vat: 'vat' };
  try { if (localStorage.getItem('carspa-price-vat') === 'net') state.vat = 'net'; } catch (e) {}
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  // ceny sú zapísané bez DPH; s DPH = net × 1,23 zaokrúhlené, ak nie je zadané ručne
  var gross = function (it) { return it.vat != null ? it.vat : Math.round(it.net * (1 + VAT)); };

  // jedna cena: data-vat a data-net ako na webe s diskami
  var amount = function (it, unit) {
    var shown = state.vat === 'vat' ? gross(it) : it.net;
    return '<div class="amount">' + (it.from ? '<span class="pre">od</span>' : '') + (it.plus ? '<span class="pre plus">+</span>' : '') +
      '<span class="num" data-vat="' + gross(it) + '" data-net="' + it.net + '">' + shown + '</span><span class="unit">€</span>' +
      '<span class="vat-label" data-base="' + esc(unit || '') + '">' + label(unit) + '</span></div>';
  };
  var label = function (unit) {
    var v = state.vat === 'vat' ? 's DPH' : 'bez DPH';
    return unit ? esc(unit) + ', ' + v : v;
  };

  var section = function (s) {
    var items = (s.items || []).filter(function (it) { return it && it.net != null; });
    var h = '<div class="pl-sec">';
    if (s.layout !== 'band') {
      h += '<h3>' + esc(s.title) + '</h3>' + (s.desc ? '<p class="sdesc">' + esc(s.desc) + '</p>' : '');
    }
    if (s.layout === 'list') {
      h += '<div class="list">';
      items.forEach(function (it) {
        h += '<div class="row"><b>' + esc(it.label) + (it.sub ? '<small>' + esc(it.sub) + '</small>' : '') + '</b>' + amount(it, it.unit || s.unit) + '</div>';
      });
      h += '</div>';
    } else if (s.layout === 'band') {
      var it = items[0];
      h += '<div class="band"><div><h4>' + esc(s.title) + '</h4>' + (s.desc ? '<p>' + esc(s.desc) + '</p>' : '') + '</div>' + (it ? amount(it, it.unit || s.unit) : '') + '</div>';
    } else {
      h += '<div class="tiles"' + (s.cols ? ' style="--cols:' + s.cols + '"' : '') + '>';
      items.forEach(function (it) {
        h += '<article class="tile"><span class="lbl">' + esc(it.label) + (it.sub ? '<small>' + esc(it.sub) + '</small>' : '') + '</span>' + amount(it, it.unit || s.unit) + '</article>';
      });
      h += '</div>';
    }
    if (s.note) h += '<p class="note"><i class="ph ph-info"></i>' + esc(s.note) + '</p>';
    return h + '</div>';
  };

  var html = '';
  window.CENNIK.forEach(function (c) {
    html += '<section class="pl-cat" id="' + esc(c.id) + '"><div class="wrap"><header><h2 class="h">' + esc(c.title) + '</h2><p class="desc">' + esc(c.desc) + '</p></header>';
    if (c.sections && c.sections.length) {
      c.sections.forEach(function (s) { html += section(s); });
    } else {
      // kým nie sú doplnené tabuľky, ukážeme cenu „od" a miesto na tabuľku
      html += '<div class="tiles">' +
        '<article class="tile from"><span class="lbl">' + esc(c.title) + '<small>najnižšia cena</small></span>' + amount({ net: c.from, from: true }, '') + '</article>' +
        '<article class="tile todo-tile"><b>Kompletné ceny dopĺňame</b><span>Podľa veľkosti auta. Dovtedy vám cenu povieme po telefóne alebo na WhatsApp.</span></article>' +
        '</div>';
    }
    html += '</div></section>';
  });
  root.innerHTML = html;

  var nums = [].slice.call(root.querySelectorAll('.num[data-vat]'));
  var labels = [].slice.call(root.querySelectorAll('.vat-label'));
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ease = function (t) { return 1 - Math.pow(1 - t, 3); };

  function countTo(el, to) {
    var from = parseInt(el.textContent, 10) || 0;
    if (reduce || from === to) { el.textContent = to; return; }
    el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick');
    var t0 = performance.now(), dur = 600;
    (function frame(now) { var p = Math.min((now - t0) / dur, 1); el.textContent = Math.round(from + (to - from) * ease(p)); if (p < 1) requestAnimationFrame(frame); })(t0);
  }
  function render(animate) {
    nums.forEach(function (n) { var v = +n.dataset[state.vat]; animate ? countTo(n, v) : (n.textContent = v); });
    labels.forEach(function (l) {
      l.textContent = label(l.dataset.base);
      if (animate) { l.classList.remove('swap'); void l.offsetWidth; l.classList.add('swap'); }
    });
  }

  var seg = document.getElementById('seg');
  function setMode(mode, animate) {
    state.vat = mode;
    seg.dataset.mode = mode;
    seg.querySelectorAll('button').forEach(function (b) { var on = b.dataset.mode === mode; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
    render(animate !== false);
    try { localStorage.setItem('carspa-price-vat', mode); } catch (e) {}
  }
  seg.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b && b.dataset.mode !== state.vat) setMode(b.dataset.mode); });
  seg.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    var next = state.vat === 'vat' ? 'net' : 'vat';
    setMode(next); seg.querySelector('[data-mode="' + next + '"]').focus();
  });
  if (state.vat === 'net') setMode('net', false);

  setTimeout(function () { document.getElementById('vat-dock').classList.remove('pre'); }, 400);
  if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
})();
