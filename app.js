// SeniorLink prototype behavior. No frameworks. Sample data only.
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Header: voice and help banners ---------- */
  var voiceBtn = $('#voiceBtn');
  var voiceBanner = $('#voiceBanner');
  var helpBtn = $('#helpBtn');
  var helpBanner = $('#helpBanner');

  function setVoice(on) {
    voiceBanner.hidden = !on;
    voiceBtn.setAttribute('aria-pressed', String(on));
    voiceBtn.classList.toggle('is-on', on);
    $('span', voiceBtn).textContent = on ? 'Stop voice' : 'Voice';
  }
  function setHelp(on) { helpBanner.hidden = !on; }

  if (voiceBtn) {
    voiceBtn.addEventListener('click', function () { setVoice(voiceBanner.hidden); });
    $('#voiceStop').addEventListener('click', function () { setVoice(false); });
    helpBtn.addEventListener('click', function () { setHelp(helpBanner.hidden); });
    $('#helpCancel').addEventListener('click', function () { setHelp(false); });
  }

  /* ---------- Text size (home page) ---------- */
  var zoomBtns = $$('[data-zoom]');
  zoomBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      $('main').style.zoom = btn.getAttribute('data-zoom');
      zoomBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
      });
    });
  });

  /* ---------- Daily check-in (home page) ---------- */
  var checkBtn = $('#checkinBtn');
  if (checkBtn) {
    checkBtn.addEventListener('click', function () {
      checkBtn.hidden = true;
      $('#checkinDone').hidden = false;
    });
    $('#checkinUndo').addEventListener('click', function () {
      $('#checkinDone').hidden = true;
      checkBtn.hidden = false;
    });
  }

  /* ---------- Toggle buttons: reminders and activities ---------- */
  function updateDoneCount() {
    var out = $('#doneText');
    if (!out) return;
    var items = $$('[data-reminder]');
    var n = items.filter(function (i) { return i.classList.contains('is-on'); }).length;
    out.textContent = n + ' of ' + items.length + ' done';
  }
  $$('[data-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.card');
      var on = !card.classList.contains('is-on');
      card.classList.toggle('is-on', on);
      btn.textContent = on ? btn.getAttribute('data-on') : btn.getAttribute('data-off');
      btn.classList.toggle('btn-primary', !on);
      btn.classList.toggle('btn-done', on);
      updateDoneCount();
    });
  });
  updateDoneCount();

  /* ---------- Services page ---------- */
  var list = $('#providerList');
  if (list) {
    var providers = [
      { id: 'kalinga', name: 'Kalinga Home Care', cat: 'Health', about: 'Licensed nurses visit you at home for blood pressure checks, wound care and medicine reviews.', cost: 'From PHP 500 per visit', by: 'Barangay Health Center' },
      { id: 'botika', name: 'Botika Malapit', cat: 'Medicine', about: 'Delivers your maintenance medicines and applies your senior citizen discount before you pay.', cost: 'Free delivery within 2 km', by: 'Senior Center' },
      { id: 'biyahe', name: 'Biyahe Kasama', cat: 'Transport', about: 'Door-to-door rides to the clinic or senior center with a trained companion beside you.', cost: 'PHP 150 to 300 per trip', by: 'City Office for Senior Citizens' },
      { id: 'lutong', name: 'Lutong Bahay Meals', cat: 'Food', about: 'Soft, low-salt home-style meals delivered every day. Menus can follow your doctor’s advice.', cost: 'PHP 90 per meal', by: 'Senior Center' },
      { id: 'ayos', name: 'Ayos Bahay', cat: 'Home help', about: 'Fixes light bulbs, installs grab bars and does light cleaning so your home stays safe.', cost: 'From PHP 350 per visit', by: 'Barangay Council' },
      { id: 'papel', name: 'Tulong Papel Volunteers', cat: 'Paperwork', about: 'Student volunteers help with senior citizen ID, pension and PhilHealth forms.', cost: 'Free', by: 'City Office for Senior Citizens' }
    ];
    var cats = ['All', 'Health', 'Medicine', 'Transport', 'Food', 'Home help', 'Paperwork'];
    var filter = 'All';
    var requested = {};
    var filterBox = $('#filters');
    var count = $('#countText');

    var check = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9.5l4 4 8-9"></path></svg>';

    function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

    function renderFilters() {
      filterBox.innerHTML = '';
      cats.forEach(function (c) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn' + (c === filter ? ' is-on' : '');
        b.setAttribute('aria-pressed', String(c === filter));
        b.textContent = c;
        b.addEventListener('click', function () { filter = c; renderFilters(); renderList(); });
        filterBox.appendChild(b);
      });
    }

    function renderList() {
      var shown = providers.filter(function (p) { return filter === 'All' || p.cat === filter; });
      count.textContent = 'Showing ' + shown.length + (shown.length === 1 ? ' verified provider' : ' verified providers');
      list.innerHTML = '';
      shown.forEach(function (p) {
        var r = !!requested[p.id];
        var art = document.createElement('article');
        art.className = 'card provider' + (r ? ' is-on' : '');
        art.innerHTML =
          '<div class="tags"><span class="badge">' + check + 'Verified</span><span class="badge badge-blue">' + esc(p.cat) + '</span></div>' +
          '<h3>' + esc(p.name) + '</h3>' +
          '<p class="text" style="font-size:22px">' + esc(p.about) + '</p>' +
          '<div class="meta"><span><strong>Cost:</strong> ' + esc(p.cost) + '</span><span><strong>Checked by:</strong> ' + esc(p.by) + '</span></div>' +
          '<div class="actions"><button type="button" class="btn ' + (r ? 'btn-done' : 'btn-primary') + '">' + (r ? 'Cancel request' : 'Request this service') + '</button>' +
          (r ? '<span class="sent">Request sent. A volunteer will call you to confirm.</span>' : '') + '</div>';
        $('button.btn', art).addEventListener('click', function () {
          requested[p.id] = !requested[p.id];
          renderList();
        });
        list.appendChild(art);
      });
    }
    renderFilters();
    renderList();
  }

  /* ---------- Family page ---------- */
  $$('.switch').forEach(function (sw) {
    sw.addEventListener('click', function () {
      var on = sw.getAttribute('aria-checked') !== 'true';
      sw.setAttribute('aria-checked', String(on));
      $('.state', sw).textContent = on ? 'On' : 'Off';
    });
  });
  var sentNote = $('#sentNote');
  $$('[data-message]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      sentNote.textContent = 'Sent to Lola: “' + btn.getAttribute('data-message') + '”';
      sentNote.hidden = false;
    });
  });
})();
