/* Harbor & Vine, interactive concept demo.
   Shared data layer. All state lives in localStorage under one versioned key,
   so the guest, owner, and staff pages read and write the same live data. */

var HV = (function () {
  'use strict';

  var KEY = 'hv_demo_state_v1';
  var VERSION = 1;
  var localSubs = [];

  /* ---------- Seed data ---------- */

  function seedMenu() {
    return [
      {
        id: 'calamari', category: 'Starters', price: 14, available: true, featured: false,
        allergens: ['shellfish', 'gluten'],
        kw: ['calamari', 'calamares', 'squid', 'كاليماري', 'حبار'],
        name: { en: 'Crispy Calamari', es: 'Calamares Crujientes', ar: 'كاليماري مقرمش' },
        desc: {
          en: 'Lightly fried squid with lemon aioli and pickled chili.',
          es: 'Calamares ligeramente fritos con alioli de limón y chile encurtido.',
          ar: 'حبار مقلي قليلا مع صلصة الأيولي بالليمون والفلفل المخلل.'
        }
      },
      {
        id: 'cornribs', category: 'Starters', price: 9, available: true, featured: true,
        allergens: ['dairy'],
        kw: ['corn', 'maiz', 'ذرة'],
        name: { en: 'Charred Corn Ribs', es: 'Costillas de Maíz Asadas', ar: 'أضلاع الذرة المشوية' },
        desc: {
          en: 'Fire charred corn with smoked butter and lime crema.',
          es: 'Maíz asado al fuego con mantequilla ahumada y crema de lima.',
          ar: 'ذرة مشوية على النار مع زبدة مدخنة وكريمة الليمون الأخضر.'
        }
      },
      {
        id: 'chowder', category: 'Starters', price: 12, available: true, featured: false,
        allergens: ['shellfish', 'dairy', 'gluten'],
        kw: ['chowder', 'soup', 'sopa', 'شوربة'],
        name: { en: 'Harbor Chowder', es: 'Sopa de Mariscos del Puerto', ar: 'شوربة المأكولات البحرية' },
        desc: {
          en: 'Creamy shellfish chowder with smoked bacon and sourdough.',
          es: 'Sopa cremosa de mariscos con tocino ahumado y pan de masa madre.',
          ar: 'شوربة كريمية بالمأكولات البحرية مع لحم مقدد مدخن وخبز محمص.'
        }
      },
      {
        id: 'salmon', category: 'Mains', price: 28, available: true, featured: true,
        allergens: ['fish'],
        kw: ['salmon', 'salmón', 'سلمون'],
        name: { en: 'Grilled Atlantic Salmon', es: 'Salmón Atlántico a la Parrilla', ar: 'سلمون أطلسي مشوي' },
        desc: {
          en: 'Grilled salmon with charred lemon, fennel, and herb butter.',
          es: 'Salmón a la parrilla con limón asado, hinojo y mantequilla de hierbas.',
          ar: 'سلمون مشوي مع ليمون محمص وشمر وزبدة الأعشاب.'
        }
      },
      {
        id: 'shortrib', category: 'Mains', price: 32, available: true, featured: false,
        allergens: ['gluten'],
        kw: ['short rib', 'rib', 'costilla de res', 'ضلع'],
        name: { en: 'Braised Short Rib', es: 'Costilla de Res Estofada', ar: 'ضلع بقري مطهو ببطء' },
        desc: {
          en: 'Slow braised short rib with red wine jus and root vegetables.',
          es: 'Costilla estofada lentamente con jugo de vino tinto y verduras de raíz.',
          ar: 'ضلع بقري مطهو ببطء مع صلصة غنية وخضروات جذرية.'
        }
      },
      {
        id: 'tagine', category: 'Mains', price: 19, available: true, featured: true,
        allergens: [],
        kw: ['tagine', 'tajin', 'chickpea', 'garbanzo', 'طاجن', 'حمص'],
        name: { en: 'Spiced Chickpea Tagine', es: 'Tajín de Garbanzos Especiado', ar: 'طاجن الحمص بالتوابل' },
        desc: {
          en: 'Warm spiced chickpeas with apricot, almonds, and herbed couscous. Vegan and gluten free as served.',
          es: 'Garbanzos con especias cálidas, albaricoque y almendras. Vegano y sin gluten tal como se sirve.',
          ar: 'حمص بتوابل دافئة مع المشمش واللوز. نباتي وخال من الغلوتين كما يقدم.'
        }
      },
      {
        id: 'chicken', category: 'Mains', price: 24, available: true, featured: false,
        allergens: [],
        kw: ['chicken', 'pollo', 'دجاج'],
        name: { en: 'Lemon Herb Roast Chicken', es: 'Pollo Asado al Limón y Hierbas', ar: 'دجاج مشوي بالليمون والأعشاب' },
        desc: {
          en: 'Half chicken roasted with lemon and thyme, with pan drippings.',
          es: 'Medio pollo asado con limón y tomillo, con sus jugos.',
          ar: 'نصف دجاجة مشوية مع الليمون والزعتر مع صلصة الشواء.'
        }
      },
      {
        id: 'risotto', category: 'Mains', price: 22, available: true, featured: false,
        allergens: ['dairy'],
        kw: ['risotto', 'mushroom', 'setas', 'hongos', 'ريزوتو', 'فطر'],
        name: { en: 'Wild Mushroom Risotto', es: 'Risotto de Setas Silvestres', ar: 'ريزوتو الفطر البري' },
        desc: {
          en: 'Creamy risotto with wild mushrooms, parmesan, and truffle oil. Vegetarian.',
          es: 'Risotto cremoso con setas silvestres, parmesano y aceite de trufa. Vegetariano.',
          ar: 'ريزوتو كريمي مع الفطر البري وجبن البارميزان وزيت الكمأة. نباتي.'
        }
      },
      {
        id: 'choctart', category: 'Desserts', price: 10, available: true, featured: false,
        allergens: ['gluten', 'dairy', 'eggs'],
        kw: ['chocolate', 'tart', 'tarta', 'شوكولاتة'],
        name: { en: 'Sea Salt Chocolate Tart', es: 'Tarta de Chocolate con Sal Marina', ar: 'تارت الشوكولاتة بملح البحر' },
        desc: {
          en: 'Dark chocolate tart with flaky sea salt and whipped cream.',
          es: 'Tarta de chocolate oscuro con sal marina y crema batida.',
          ar: 'تارت الشوكولاتة الداكنة مع ملح البحر والكريمة المخفوقة.'
        }
      },
      {
        id: 'lemoncake', category: 'Desserts', price: 9, available: true, featured: false,
        allergens: ['gluten', 'eggs'],
        kw: ['cake', 'bizcocho', 'olive oil', 'كيكة'],
        name: { en: 'Lemon Olive Oil Cake', es: 'Bizcocho de Limón y Aceite de Oliva', ar: 'كيكة الليمون بزيت الزيتون' },
        desc: {
          en: 'Moist lemon cake with olive oil glaze and candied zest.',
          es: 'Bizcocho húmedo de limón con glaseado de aceite de oliva.',
          ar: 'كيكة ليمون طرية مع طبقة من زيت الزيتون وقشر الليمون المسكر.'
        }
      },
      {
        id: 'lemonade', category: 'Drinks', price: 6, available: true, featured: true,
        allergens: [],
        kw: ['lemonade', 'limonada', 'mint', 'menta', 'نعناع', 'عصير'],
        name: { en: 'Mint Lemonade', es: 'Limonada de Menta', ar: 'عصير ليمون بالنعناع' },
        desc: {
          en: 'Fresh pressed lemonade with crushed mint over ice.',
          es: 'Limonada recién exprimida con menta machacada y hielo.',
          ar: 'عصير ليمون طازج مع النعناع المهروس والثلج.'
        }
      },
      {
        id: 'hibiscus', category: 'Drinks', price: 5, available: true, featured: false,
        allergens: [],
        kw: ['hibiscus', 'tea', 'jamaica', 'te helado', 'كركديه', 'شاي'],
        name: { en: 'Hibiscus Iced Tea', es: 'Té Helado de Jamaica', ar: 'شاي الكركديه المثلج' },
        desc: {
          en: 'House brewed hibiscus tea, lightly sweetened, served cold.',
          es: 'Té de jamaica preparado en casa, ligeramente endulzado, servido frío.',
          ar: 'شاي كركديه محضر في المطعم، محلى قليلا ويقدم باردا.'
        }
      }
    ];
  }

  /* 15 seeded orders across one evening, hours are 24h clock.
     Totals are computed from the seed prices when the state is first built. */
  function seedOrders(menu) {
    var priceOf = {};
    var i;
    for (i = 0; i < menu.length; i++) { priceOf[menu[i].id] = menu[i].price; }
    var raw = [
      { table: 4,  hour: 17, covers: 2, items: ['cornribs', 'tagine', 'lemonade', 'lemonade'] },
      { table: 8,  hour: 17, covers: 2, items: ['calamari', 'salmon', 'hibiscus'] },
      { table: 2,  hour: 18, covers: 4, items: ['chowder', 'cornribs', 'shortrib', 'chicken', 'salmon', 'lemonade'] },
      { table: 11, hour: 18, covers: 2, items: ['tagine', 'risotto', 'hibiscus', 'hibiscus'] },
      { table: 6,  hour: 18, covers: 3, items: ['calamari', 'salmon', 'salmon', 'choctart'] },
      { table: 9,  hour: 19, covers: 2, items: ['cornribs', 'shortrib', 'lemonade'] },
      { table: 3,  hour: 19, covers: 5, items: ['chowder', 'calamari', 'tagine', 'chicken', 'salmon', 'shortrib', 'lemoncake'] },
      { table: 12, hour: 19, covers: 2, items: ['tagine', 'cornribs', 'lemonade', 'lemonade'] },
      { table: 7,  hour: 19, covers: 2, items: ['risotto', 'salmon', 'hibiscus'] },
      { table: 5,  hour: 20, covers: 4, items: ['calamari', 'chowder', 'shortrib', 'shortrib', 'chicken', 'choctart'] },
      { table: 10, hour: 20, covers: 2, items: ['tagine', 'salmon', 'lemonade', 'choctart'] },
      { table: 1,  hour: 20, covers: 3, items: ['cornribs', 'risotto', 'chicken', 'lemoncake', 'hibiscus'] },
      { table: 14, hour: 21, covers: 2, items: ['salmon', 'tagine', 'lemonade'] },
      { table: 6,  hour: 21, covers: 2, items: ['choctart', 'lemoncake', 'hibiscus', 'hibiscus'] },
      { table: 2,  hour: 22, covers: 2, items: ['calamari', 'chicken', 'lemonade'] }
    ];
    var orders = [];
    for (i = 0; i < raw.length; i++) {
      var o = raw[i];
      var total = 0;
      for (var j = 0; j < o.items.length; j++) { total += (priceOf[o.items[j]] || 0); }
      orders.push({ id: 'o' + (i + 1), table: o.table, hour: o.hour, covers: o.covers, items: o.items, total: total });
    }
    return orders;
  }

  function seedEvents() {
    var now = Date.now();
    return [
      { id: 'e1', type: 'food',  ts: now - 2 * 60000,  title: 'Table 12 placed an order', sub: 'Spiced Chickpea Tagine + Charred Corn Ribs, sent to kitchen', lang: '' },
      { id: 'e2', type: 'alert', ts: now - 5 * 60000,  title: 'Allergy flag, Table 5', sub: 'Guest noted a shellfish allergy. Short rib is clear, kitchen notified.', lang: 'ES to EN' },
      { id: 'e3', type: 'new',   ts: now - 9 * 60000,  title: 'Table 9 asked a question', sub: '"Is the lemonade sweetened?" Assistant answered from the menu, no staff time needed.', lang: 'AR to EN' },
      { id: 'e4', type: 'ok',    ts: now - 14 * 60000, title: 'Table 3 ready for the check', sub: 'Guest requested the bill through the assistant.', lang: '' }
    ];
  }

  function seedState() {
    var menu = seedMenu();
    return {
      version: VERSION,
      restaurant: 'Harbor & Vine (Sample Restaurant)',
      menu: menu,
      orders: seedOrders(menu),
      events: seedEvents()
    };
  }

  /* ---------- Storage ---------- */

  function valid(s) {
    return s && s.version === VERSION &&
      Array.isArray(s.menu) && s.menu.length > 0 &&
      Array.isArray(s.orders) && Array.isArray(s.events);
  }

  function load() {
    var s = null;
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) { s = JSON.parse(raw); }
    } catch (e) { s = null; }
    if (!valid(s)) { s = reset(false); }
    return s;
  }

  function save(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* storage may be unavailable, demo keeps running in memory */ }
    notify(s);
    return s;
  }

  function reset(reloadPage) {
    var s = seedState();
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* ignore */ }
    if (reloadPage) { window.location.reload(); }
    return s;
  }

  /* Change notifications: same tab via subscribers, other tabs via the storage event. */
  function notify(s) {
    for (var i = 0; i < localSubs.length; i++) {
      try { localSubs[i](s); } catch (e) { /* a bad subscriber never breaks the page */ }
    }
  }

  function onChange(cb) {
    if (typeof cb !== 'function') { return; }
    localSubs.push(cb);
    window.addEventListener('storage', function (ev) {
      if (ev.key === KEY) {
        try { cb(load()); } catch (e) { /* ignore */ }
      }
    });
  }

  /* ---------- Helpers ---------- */

  function fmtPrice(p) {
    var n = Number(p);
    if (isNaN(n)) { n = 0; }
    return (n % 1 === 0) ? ('$' + n) : ('$' + n.toFixed(2));
  }

  function getItem(state, id) {
    for (var i = 0; i < state.menu.length; i++) {
      if (state.menu[i].id === id) { return state.menu[i]; }
    }
    return null;
  }

  function setAvailability(id, available) {
    var s = load();
    var item = getItem(s, id);
    if (!item) { return s; }
    item.available = !!available;
    var name = item.name.en;
    if (available) {
      addEventTo(s, {
        type: 'ok',
        title: name + ' is back on the menu',
        sub: 'Restored in the owner dashboard. The assistant can recommend it again.',
        lang: ''
      });
    } else {
      addEventTo(s, {
        type: 'alert',
        title: '86 alert: ' + name,
        sub: 'Marked unavailable in the owner dashboard. The guest assistant stopped offering it.',
        lang: ''
      });
    }
    return save(s);
  }

  function setPrice(id, price) {
    var s = load();
    var item = getItem(s, id);
    var n = Number(price);
    if (!item || isNaN(n) || n < 0) { return s; }
    n = Math.round(n * 100) / 100;
    if (n === item.price) { return s; }
    item.price = n;
    addEventTo(s, {
      type: 'new',
      title: 'Price update: ' + item.name.en,
      sub: 'Now ' + fmtPrice(n) + '. The guest assistant quotes the new price immediately.',
      lang: ''
    });
    return save(s);
  }

  var evSeq = 0;
  function addEventTo(s, ev) {
    evSeq += 1;
    s.events.push({
      id: 'e' + Date.now() + '_' + evSeq,
      type: ev.type || 'new',
      ts: ev.ts || Date.now(),
      title: ev.title || '',
      sub: ev.sub || '',
      lang: ev.lang || ''
    });
    if (s.events.length > 60) { s.events = s.events.slice(s.events.length - 60); }
    return s;
  }

  function addEvent(ev) {
    var s = load();
    addEventTo(s, ev);
    return save(s);
  }

  function timeAgo(ts) {
    var mins = Math.round((Date.now() - ts) / 60000);
    if (mins <= 0) { return 'just now'; }
    if (mins === 1) { return '1 min ago'; }
    if (mins < 60) { return mins + ' min ago'; }
    var h = Math.round(mins / 60);
    return h + (h === 1 ? ' hr ago' : ' hrs ago');
  }

  /* Wire up the "Reset demo data" link present in every footer. */
  function initResetLink() {
    var links = document.querySelectorAll('[data-reset-demo]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (ev) {
        ev.preventDefault();
        reset(true);
      });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initResetLink);
  } else {
    initResetLink();
  }

  return {
    KEY: KEY,
    load: load,
    save: save,
    reset: reset,
    onChange: onChange,
    fmtPrice: fmtPrice,
    getItem: getItem,
    setAvailability: setAvailability,
    setPrice: setPrice,
    addEvent: addEvent,
    timeAgo: timeAgo
  };
})();
