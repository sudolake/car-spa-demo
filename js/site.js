(function () {
  // mobilné menu
  var burger = document.querySelector('.burger');
  var drawer = document.getElementById('drawer');
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
      burger.innerHTML = open ? '<i class="ph ph-x"></i>' : '<i class="ph ph-list"></i>';
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) { drawer.classList.remove('open'); burger.setAttribute('aria-expanded', false); burger.innerHTML = '<i class="ph ph-list"></i>'; }
    });
  }

  // rezervačný formulár – kým nie je backend, otvorí e-mail s vyplnenými údajmi
  var form = document.getElementById('rezervacia');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('form-msg');
      var req = form.querySelectorAll('[required]');
      for (var i = 0; i < req.length; i++) {
        var f = req[i];
        if (!f.value.trim()) {
          f.focus();
          msg.textContent = 'Prosím, vyplňte meno, telefón a auto.';
          return;
        }
      }
      var d = new FormData(form);
      var lines = [
        'Meno: ' + d.get('meno'),
        'Telefón: ' + d.get('telefon'),
        'E-mail: ' + (d.get('email') || '-'),
        'Auto: ' + d.get('auto'),
        'Lak: ' + (d.get('lak') || '-'),
        'Služba: ' + (d.getAll('sluzba').join(', ') || '-'),
        'Termín: ' + (d.get('termin') || '-'),
        'Ozvať sa cez: ' + d.get('kontakt'),
        '',
        d.get('sprava') || ''
      ];
      var subject = 'Rezervácia – ' + d.get('auto');
      window.location.href = 'mailto:carspaba@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
      msg.textContent = 'Otvorili sme e-mail s vyplnenými údajmi. Stačí ho odoslať. Ak sa nič neotvorilo, napíšte nám na WhatsApp 0948 333 323.';
    });
  }

  // hero video: zvuk na kliknutie (video beží stlmené, inak by ho prehliadač nespustil)
  var yt = document.getElementById('hero-yt');
  var snd = document.querySelector('.hv-sound');
  if (yt) {
    var box = document.getElementById('hero-video');
    var show = function () { box.classList.add('playing'); };
    // YouTube pošle stav prehrávača; 1 = hrá
    window.addEventListener('message', function (e) {
      if (!/youtube/.test(e.origin)) return;
      try { var d = JSON.parse(e.data); if (d.info && (d.info.playerState === 1 || d.info.currentTime > 0)) show(); } catch (err) {}
    });
    yt.addEventListener('load', function () {
      yt.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 'hero-yt', channel: 'widget' }), '*');
    });
  }
  if (yt && snd) {
    var cmd = function (func) { yt.contentWindow.postMessage(JSON.stringify({ event: 'command', func: func, args: [] }), '*'); };
    snd.addEventListener('click', function () {
      var on = snd.getAttribute('aria-pressed') !== 'true';
      cmd(on ? 'unMute' : 'mute');
      if (on) cmd('playVideo');
      snd.setAttribute('aria-pressed', on);
      snd.innerHTML = on ? '<i class="ph ph-speaker-high"></i><span>Vypnúť zvuk</span>' : '<i class="ph ph-speaker-slash"></i><span>Zapnúť zvuk</span>';
    });
  }

  // naše práce: videá hrajú stlmené, keď sú na obrazovke
  var vids = [].slice.call(document.querySelectorAll('.tile-w video'));
  if (vids.length && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) { v.preload = 'auto'; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: .35 });
    vids.forEach(function (v) { io.observe(v); });
  }

  // zväčšenie fotky alebo videa
  var tiles = document.querySelectorAll('.tile-w:not(.ig)');
  if (tiles.length) {
    var lb = document.createElement('div');
    lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Zväčšenie');
    lb.innerHTML = '<button type="button" aria-label="Zavrieť"><i class="ph ph-x"></i></button><div class="lb-body"></div>';
    document.body.appendChild(lb);
    var body = lb.querySelector('.lb-body');
    var close = function () { lb.classList.remove('open'); body.innerHTML = ''; document.body.style.overflow = ''; };
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.closest('button')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.classList.contains('open')) close(); });
    tiles.forEach(function (t) {
      t.addEventListener('click', function (e) {
        e.preventDefault();
        var href = t.getAttribute('href');
        if (/\.mp4$/.test(href)) {
          body.innerHTML = '<video src="' + href + '" controls autoplay playsinline></video>';
        } else {
          var alt = (t.querySelector('img') || {}).alt || '';
          body.innerHTML = '<img src="' + href + '" alt="' + alt.replace(/"/g, '&quot;') + '">';
        }
        lb.classList.add('open'); document.body.style.overflow = 'hidden';
        lb.querySelector('button').focus();
      });
    });
  }
})();
