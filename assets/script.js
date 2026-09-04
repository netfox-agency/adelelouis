/* ============================================================
   Landing démoussage Eure (27)
   - capture gclid / utm_* pour rattacher chaque lead à sa campagne
   - envoi Web3Forms (FormData obligatoire : le JSON déclenche un
     preflight CORS que Web3Forms refuse)
   - événements dataLayer : generate_lead, phone_call, form_start
   ============================================================ */
(function () {
  'use strict';

  var dl = (window.dataLayer = window.dataLayer || []);
  var STORE = 'lp_demoussage_src';

  /* ---------- 1. Traçabilité Google Ads ---------- */
  var params = new URLSearchParams(window.location.search);
  var src = {
    gclid: params.get('gclid') || params.get('wbraid') || params.get('gbraid') || '',
    source: params.get('utm_source') || '',
    campagne: params.get('utm_campaign') || '',
    mot_cle: params.get('utm_term') || params.get('keyword') || ''
  };
  /* On garde la source d'origine même si le visiteur revient plus tard sans paramètres. */
  try {
    if (src.gclid || src.source || src.campagne) {
      sessionStorage.setItem(STORE, JSON.stringify(src));
    } else {
      var saved = sessionStorage.getItem(STORE);
      if (saved) src = JSON.parse(saved);
    }
  } catch (e) { /* navigation privée : on continue sans mémoriser */ }

  function fill(name, value) {
    document.querySelectorAll('input[type="hidden"][name="' + name + '"]').forEach(function (el) {
      el.value = value || '';
    });
  }
  fill('gclid', src.gclid);
  fill('source', src.source || (document.referrer ? 'referrer' : 'direct'));
  fill('campagne', src.campagne);
  fill('mot_cle', src.mot_cle);
  fill('page', window.location.href);

  /* ---------- 1bis. Liens annexes Google Ads : ?s=<section> scrolle vers la section ---------- */
  var section = new URLSearchParams(window.location.search).get('s');
  if (section) {
    var cible = document.getElementById(section);
    /* instantané : un clic d'annonce doit atterrir sur la section, pas la chercher */
    if (cible) cible.scrollIntoView({ behavior: 'instant', block: 'start' });
  }

  /* ---------- 1ter. Bandeau de consentement (Consent Mode v2) ---------- */
  var bar = document.getElementById('consent-bar');
  if (bar && window.CONSENT_CHOIX === null) bar.hidden = false;
  function choisir(valeur) {
    try { localStorage.setItem('consent-ads', valeur); } catch (e) {}
    if (valeur === 'granted' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: 'granted', ad_user_data: 'granted',
        ad_personalization: 'granted', analytics_storage: 'granted'
      });
    }
    if (bar) bar.hidden = true;
  }
  var okBtn = document.getElementById('consent-ok');
  var nonBtn = document.getElementById('consent-non');
  if (okBtn) okBtn.addEventListener('click', function () { choisir('granted'); });
  if (nonBtn) nonBtn.addEventListener('click', function () { choisir('denied'); });

  /* ---------- 2. Conversion Google Ads ---------- */
  /* Deux actions distinctes : ADS_CONVERSION (devis) et ADS_CONVERSION_APPEL. */
  function sendTo(id) {
    if (typeof window.gtag === 'function' && id && id.indexOf('XXXX') === -1) {
      window.gtag('event', 'conversion', { send_to: id });
    }
  }
  function reportConversion(type) {
    sendTo(window.ADS_CONVERSION || '');
    dl.push({ event: type, form_location: 'landing_demoussage_eure' });
  }

  /* ---------- 3. Clic téléphone ---------- */
  document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
    a.addEventListener('click', function () {
      dl.push({ event: 'phone_call', link_url: a.getAttribute('href') });
      sendTo(window.ADS_CONVERSION_APPEL || window.ADS_CONVERSION || '');
    });
  });

  /* ---------- 4. Formulaires (haut de page et bas de page) ---------- */
  var started = false;
  document.querySelectorAll('form.js-devis').forEach(function (form) {
    form.addEventListener('input', function () {
      if (started) return;
      started = true;
      dl.push({ event: 'form_start', form_location: 'landing_demoussage_eure' });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var success = form.querySelector('.form-success');
      var error = form.querySelector('.form-error');
      var btn = form.querySelector('button[type="submit"]');
      success.style.display = 'none';
      error.style.display = 'none';

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var key = form.querySelector('[name="access_key"]').value;
      if (!key || key.indexOf('REMPLACER') !== -1) {
        error.style.display = 'block';
        return;
      }

      /* Enhanced Conversions : téléphone au format E.164 + nom, transmis à
         gtag AVANT le reset du formulaire (améliore l'attribution des leads) */
      var telBrut = (form.querySelector('[name="tel"]').value || '').replace(/[^\d+]/g, '');
      var telE164 = telBrut.charAt(0) === '0' ? '+33' + telBrut.slice(1) : telBrut;
      var nomBrut = (form.querySelector('[name="nom"]').value || '').trim();
      var userData = { phone_number: telE164 };
      if (nomBrut.indexOf(' ') > 0) {
        userData.address = { first_name: nomBrut.split(' ')[0], last_name: nomBrut.split(' ').slice(1).join(' ') };
      }

      var data = new FormData(form);
      data.append('subject', 'Adele Louis · nouvelle demande de devis démoussage');
      data.append('from_name', 'Adele Louis · landing démoussage Eure');
      data.append('formulaire', form.id === 'devis-form' ? 'haut de page' : 'bas de page');

      btn.disabled = true;
      var label = btn.textContent;
      btn.textContent = 'Envoi en cours…';

      fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
        .then(function (r) { return r.json(); })
        .then(function (json) {
          if (json.success) {
            form.reset();
            form.classList.add('is-sent');
            success.style.display = 'block';
            if (typeof window.gtag === 'function') window.gtag('set', 'user_data', userData);
            reportConversion('generate_lead');
            success.scrollIntoView({ block: 'center', behavior: 'smooth' });
          } else {
            error.style.display = 'block';
          }
        })
        .catch(function () { error.style.display = 'block'; })
        .finally(function () { btn.disabled = false; btn.textContent = label; });
    });
  });

  /* ---------- 5. Année ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
