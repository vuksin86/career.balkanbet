/* ============================================================================
   JOB FILTER — shared by listanje.html and oglas-primer.html

   Two things live here, both needed by more than one page:

   1. The custom dropdown used in every filter bar. They are trigger buttons
      plus a panel, NOT <select>s, for the same reason as the homepage hero
      bar: on Windows Chrome a native <option> ignores padding and
      line-height, so its menu can never be given the spacing the rest of
      the site uses.

   2. `plural()` — Serbian needs three forms for a counted noun, and the
      results heading ("Pronašli smo N pozicija") is rendered from a live
      count, so it cannot be a fixed string.

   TWO SKINS, ONE MECHANIC. The dropdowns are structurally the same control in
   two costumes, so the behaviour is written once and the class names it
   reaches for come from SKINS:

     'jf'   — the compact bar on oglas-primer.html and the sort control on the
              listing panel. Its trigger has no chevron in the markup, so one
              is injected.
     'hero' — the big booking-style bar (.hero-search), used on the homepage
              and, filtering for real, at the top of listanje.html. Its markup
              already carries a chevron and a two-line label/value body.

   No backend anywhere: filtering is done in the page against markup that is
   already in the DOM.
============================================================================ */
(function () {
  'use strict';

  var CHEVRON =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
    ' stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';

  var SKINS = {
    jf: {
      trigger: '.jf-trigger', value: '.jf-value', menu: '.jf-menu',
      option: 'jf-option', check: '.jf-check input', submit: '.jf-submit',
      injectChevron: true,
    },
    hero: {
      trigger: '.hero-search__trigger', value: '.hero-search__value',
      menu: '.hero-search__menu', option: 'hero-search__option',
      check: '.hero-search__check input', submit: '.hero-search__submit',
      injectChevron: false,
    },
  };

  var fields = []; // every dropdown on the page, so one click can close the rest

  function closeAll(except) {
    fields.forEach(function (f) {
      if (f.root === except) return;
      f.menu.hidden = true;
      f.root.classList.remove('is-open');
      f.trigger.setAttribute('aria-expanded', 'false');
    });
  }

  /* One dropdown. `options` is [{value, label}]; the first entry is the
     default ("Svi gradovi" and friends), i.e. the no-filter state. */
  function buildField(root, options, onChange, skin) {
    var trigger = root.querySelector(skin.trigger);
    var valueEl = root.querySelector(skin.value);
    var menu = root.querySelector(skin.menu);

    if (skin.injectChevron) trigger.insertAdjacentHTML('beforeend', CHEVRON);
    menu.innerHTML = options
      .map(function (o, i) {
        return '<button type="button" role="option" class="' + skin.option +
               (i === 0 ? ' is-selected' : '') +
               '" data-value="' + o.value + '">' + o.label + '</button>';
      })
      .join('');
    menu.hidden = true;

    var field = { root: root, trigger: trigger, menu: menu, value: options[0].value };
    fields.push(field);

    valueEl.textContent = options[0].label;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var willOpen = menu.hidden;
      closeAll(willOpen ? root : null);
      menu.hidden = !willOpen;
      root.classList.toggle('is-open', willOpen);
      trigger.setAttribute('aria-expanded', String(willOpen));
      // Keep the checked row in view when reopening a long list (the location
      // list runs to every municipality in the country).
      if (willOpen) {
        var sel = menu.querySelector('.is-selected');
        if (sel) menu.scrollTop = Math.max(0, sel.offsetTop - menu.clientHeight / 2);
      }
    });

    menu.addEventListener('click', function (e) {
      var btn = e.target.closest('.' + skin.option);
      if (!btn) return;
      field.value = btn.dataset.value;
      valueEl.textContent = btn.textContent;
      Array.prototype.forEach.call(menu.children, function (c) {
        c.classList.toggle('is-selected', c === btn);
      });
      closeAll();
      if (onChange) onChange();
    });

    return field;
  }

  /* Wires a whole bar. `spec.fields` maps a [data-filter] name to its option
     list; `spec.onChange` gets {name: value} on every change, including the
     checkbox, so a page can filter as the user picks rather than only on
     "Pretraži". `spec.skin` selects the costume (default 'jf'). */
  function initBar(bar, spec) {
    var skin = SKINS[spec.skin || 'jf'];
    var built = {};

    Object.keys(spec.fields).forEach(function (name) {
      var root = bar.querySelector('[data-filter="' + name + '"]');
      if (!root) return;
      built[name] = buildField(root, spec.fields[name], emit, skin);
    });

    var checkbox = bar.querySelector(skin.check);
    if (checkbox) checkbox.addEventListener('change', emit);

    function values() {
      var out = {};
      Object.keys(built).forEach(function (n) { out[n] = built[n].value; });
      out.nocv = !!(checkbox && checkbox.checked);
      return out;
    }

    function emit() {
      if (spec.onChange) spec.onChange(values());
    }

    var submit = bar.querySelector(skin.submit);
    if (submit) {
      submit.addEventListener('click', function () {
        if (spec.onSubmit) spec.onSubmit(values());
        else emit();
      });
    }

    /* Rebuilds one field's option list in place — used when a choice in one
       tab invalidates another's list (picking "Posao u centrali" must not
       leave shop-floor positions on offer). Silent by design: the caller is
       already inside a change it is about to act on. */
    function refill(name, options) {
      var f = built[name];
      if (!f) return;
      f.menu.innerHTML = options
        .map(function (o, i) {
          return '<button type="button" role="option" class="' + skin.option +
                 (i === 0 ? ' is-selected' : '') +
                 '" data-value="' + o.value + '">' + o.label + '</button>';
        })
        .join('');
      f.value = options[0].value;
      f.root.querySelector(skin.value).textContent = options[0].label;
    }

    // Let a page pre-select values (used when arriving from another page
    // with ?lokacija=... in the URL).
    function set(name, value) {
      var f = built[name];
      if (!f) return;
      var btn = f.menu.querySelector('[data-value="' + value + '"]');
      if (btn) btn.click();
    }

    emit();
    return { values: values, set: set, refill: refill };
  }

  /* Serbian counted-noun forms: 1 poziciju / 2–4 pozicije / 5+ pozicija,
     with the usual 11–14 exception. forms = [one, few, many]. */
  function plural(n, forms) {
    var mod10 = n % 10;
    var mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return forms[0];
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
    return forms[2];
  }

  document.addEventListener('click', function () { closeAll(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });

  window.BBFilter = { initBar: initBar, plural: plural };
})();
