import { useEffect, useRef, useState } from "react";
import { Icon } from "./ui.jsx";

// Demo — все каналы в одном окне (Открытые линии Б24). Слева каналы со счётчиками
// непрочитанного и очередь менеджеров, в центре диалоги и переписка, справа
// CRM-карточка, которая создаётся сама. «Новое обращение» — приходит сообщение
// из случайного канала; с ИИ-ботом клиент сначала проходит короткую квалификацию.

const CH = {
  tg: { name: "Telegram", code: "TG", tone: "bg-sky-500/10 text-sky-700 ring-sky-500/25" },
  wa: { name: "WhatsApp", code: "WA", tone: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/25" },
  max: { name: "MAX", code: "MX", tone: "bg-violet-500/10 text-violet-700 ring-violet-500/25" },
  vk: { name: "ВКонтакте", code: "VK", tone: "bg-blue-500/10 text-blue-700 ring-blue-500/25" },
  avito: { name: "Авито", code: "AV", tone: "bg-orange-500/10 text-orange-700 ring-orange-500/25" },
  site: { name: "Чат на сайте", code: "WEB", tone: "bg-ember/10 text-ember ring-ember/25" },
  mail: { name: "Почта", code: "@", tone: "bg-gold/10 text-[#8a6418] ring-gold/25" },
};
const CH_ORDER = ["tg", "wa", "max", "vk", "avito", "site", "mail"];
const MANAGERS = ["И. Сафонов", "Е. Белова", "А. Петров"];

const SEED = [
  {
    id: "s1",
    ch: "wa",
    who: "КФХ «Рассвет»",
    time: "09:21",
    unread: 0,
    msgs: [
      { from: "client", text: "Добрый день! Когда отгрузка селитры по счёту?", time: "09:12" },
      { from: "manager", who: "И. Сафонов", text: "Завтра до 12:00, машина назначена — номер пришлю утром.", time: "09:20" },
      { from: "client", text: "Спасибо, ждём!", time: "09:21" },
    ],
    card: {
      type: "Сделка",
      num: "#2296",
      manager: "И. Сафонов",
      how: "закреплённый менеджер",
      culture: "Аммиачная селитра · 40 т",
      region: "Воронежская обл.",
      history: [
        { t: "28.09", text: "Звонок · заказ аммиачной селитры" },
        { t: "02.10", text: "Счёт № 0409 оплачен" },
        { t: "09:12", text: "WhatsApp · вопрос по отгрузке" },
      ],
      lit: [],
    },
  },
  {
    id: "s2",
    ch: "tg",
    who: "СХП «Нива-Юг»",
    time: "09:05",
    unread: 1,
    msgs: [{ from: "client", text: "Можно забрать семена по счёту № 0412 в субботу?", time: "09:05" }],
    card: {
      type: "Сделка",
      num: "#2318",
      manager: "И. Сафонов",
      how: "закреплённый менеджер",
      culture: "Подсолнечник «Ранний-3» · 48 п. е.",
      region: "Ростовская обл.",
      history: [
        { t: "12.09", text: "Звонок · заявка на семена подсолнечника" },
        { t: "14.10", text: "Счёт № 0412 оплачен" },
        { t: "09:05", text: "Telegram · вопрос по самовывозу" },
      ],
      lit: [],
    },
  },
  {
    id: "s3",
    ch: "avito",
    who: "А. Лукин",
    time: "08:48",
    unread: 2,
    msgs: [
      { from: "client", text: "Здравствуйте! Объявление про семена сои ещё актуально?", time: "08:47" },
      { from: "client", text: "Нужно примерно 12 тонн, Курская область.", time: "08:48" },
    ],
    card: {
      type: "Лид",
      num: "L-1047",
      manager: "А. Петров",
      how: "по очереди",
      culture: "Соя · 12 т",
      region: "Курская обл.",
      history: [
        { t: "08:47", text: "Авито · первое обращение" },
        { t: "08:47", text: "Назначен ответственный А. Петров" },
      ],
      lit: [],
    },
  },
  {
    id: "s4",
    ch: "mail",
    who: "Агрофирма «Восход»",
    time: "вчера",
    unread: 1,
    msgs: [{ from: "client", text: "Запрос КП: NPK 16:16:16 — 120 тонн, поставка в марте. Реквизиты во вложении.", time: "вчера" }],
    card: {
      type: "Лид",
      num: "L-1046",
      manager: "Е. Белова",
      how: "по очереди",
      culture: "NPK 16:16:16 · 120 т",
      region: "Саратовская обл.",
      history: [
        { t: "вчера", text: "Почта · запрос КП" },
        { t: "вчера", text: "Назначен ответственный Е. Белова" },
      ],
      lit: [],
    },
  },
  {
    id: "s5",
    ch: "site",
    who: "Гость сайта",
    time: "вчера",
    unread: 0,
    msgs: [
      { from: "client", text: "Вы работаете с НДС?", time: "вчера" },
      { from: "manager", who: "И. Сафонов", text: "Да, все закрывающие документы — УПД через ЭДО.", time: "вчера" },
    ],
    card: {
      type: "Лид",
      num: "L-1045",
      manager: "И. Сафонов",
      how: "по очереди",
      culture: "",
      region: "",
      history: [
        { t: "вчера", text: "Чат на сайте · вопрос по НДС" },
        { t: "вчера", text: "Назначен ответственный И. Сафонов" },
      ],
      lit: [],
    },
  },
];

// заготовки новых обращений; existing — клиент уже есть в CRM
const POOL = [
  { ch: "tg", who: "Агрофирма «Колос»", text: "Есть ли гибрид кукурузы ФАО 200? Нужно на 400 га.", a1: "Кукуруза на зерно, ФАО 200 — примерно 400 посевных единиц.", a2: "Ставропольский край.", culture: "Кукуруза ФАО 200 · ≈400 п. е.", region: "Ставропольский край" },
  { ch: "wa", who: "КФХ «Заря»", text: "Пришлите прайс на гербициды.", a1: "Подсолнечник, 320 га — довсходовый и по вегетации.", a2: "Белгородская область.", culture: "Гербициды · подсолнечник 320 га", region: "Белгородская обл." },
  {
    ch: "max",
    who: "СХП «Нива-Юг»",
    existing: { owner: "И. Сафонов", past: [{ t: "12.09", text: "Сделка #2318 · семена подсолнечника" }, { t: "14.10", text: "Счёт № 0412 оплачен" }] },
    text: "Нужна аммиачная селитра, 60 тонн, с доставкой.",
    a1: "Аммиачная селитра, 60 тонн, в мешках по 50 кг.",
    culture: "Аммиачная селитра · 60 т",
    region: "Ростовская обл.",
  },
  { ch: "vk", who: "КФХ «Ивушка»", text: "Есть фунгицид от септориоза? Пшеница, 600 га.", a1: "Озимая пшеница, 600 га — обработка в мае.", a2: "Краснодарский край.", culture: "Фунгицид · пшеница 600 га", region: "Краснодарский край" },
  { ch: "avito", who: "В. Гусев", text: "Семена подсолнечника «Ранний-3» в наличии? Нужно 30 п. е.", a1: "Подсолнечник «Ранний-3», 30 посевных единиц.", a2: "Воронежская область, самовывоз.", culture: "Подсолнечник «Ранний-3» · 30 п. е.", region: "Воронежская обл." },
  { ch: "site", who: "Гость сайта", text: "Можно купить семена с отсрочкой платежа до осени?", a1: "Кукуруза и подсолнечник, всего примерно на 2 млн ₽.", a2: "Оренбургская область.", culture: "Семена кукурузы и подсолнечника · ≈2 млн ₽", region: "Оренбургская обл." },
  { ch: "mail", who: "Агрофирма «Степная»", text: "Запрос КП: протравитель для семян пшеницы, 18 тонн семян.", a1: "Протравитель на 18 тонн семян озимой пшеницы.", a2: "Саратовская область.", culture: "Протравитель · 18 т семян", region: "Саратовская обл." },
  {
    ch: "tg",
    who: "КФХ «Рассвет»",
    existing: { owner: "И. Сафонов", past: [{ t: "28.09", text: "Сделка #2296 · аммиачная селитра" }, { t: "09:12", text: "WhatsApp · вопрос по отгрузке" }] },
    text: "Пришлите прайс на гербициды для подсолнечника.",
    a1: "Подсолнечник и кукуруза, всего около 500 га.",
    culture: "Гербициды · 500 га",
    region: "Воронежская обл.",
  },
];

const CSS = `@keyframes omIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }`;
const IN = { animation: "omIn .4s cubic-bezier(0.32,0.72,0,1) both" };

function nowHM() {
  return new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}
function initials(name) {
  return name
    .split(/[.\s]+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join("");
}

const BADGE_SIZE = {
  md: "h-6 w-6 rounded-md text-[8.5px]",
  sm: "h-5 w-5 rounded-md text-[7.5px]",
  xs: "h-4 w-4 rounded text-[6.5px]",
};

function ChBadge({ ch, size = "md" }) {
  const c = CH[ch];
  return <span className={`flex shrink-0 items-center justify-center font-bold ring-1 ${BADGE_SIZE[size]} ${c.tone}`}>{c.code}</span>;
}

function BotGlyph({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={`stroke-current fill-none ${className}`} strokeWidth={1.4}>
      <rect x="4.5" y="8" width="15" height="11" rx="3.5" />
      <path d="M12 8V5M9.5 13h0M14.5 13h0M9.5 16.2h5" strokeLinecap="round" />
      <circle cx="12" cy="4" r="1" />
    </svg>
  );
}

export default function Omnichannel() {
  const [dialogs, setDialogs] = useState(SEED);
  const [sel, setSel] = useState("s1");
  const [filter, setFilter] = useState("all");
  const [botOn, setBotOn] = useState(true);
  const [busy, setBusy] = useState(false);
  const [queue, setQueue] = useState(0); // индекс следующего менеджера
  const [ping, setPing] = useState(null);

  const timers = useRef([]);
  const selRef = useRef("s1");
  const used = useRef([]);
  const counters = useRef({ uid: 0, lead: 1048, deal: 2352 });
  const chatRef = useRef(null);

  const cur = dialogs.find((d) => d.id === sel) || dialogs[0];
  const msgCount = cur.msgs.length;

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [sel, msgCount]);

  function later(ms, fn) {
    timers.current.push(setTimeout(fn, ms));
  }
  function patch(id, fn) {
    setDialogs((ds) => ds.map((d) => (d.id === id ? fn(d) : d)));
  }
  function push(id, msg) {
    const isOpen = selRef.current === id;
    patch(id, (d) => ({ ...d, time: msg.time, msgs: [...d.msgs, msg], unread: msg.from === "client" && !isOpen ? d.unread + 1 : d.unread }));
  }
  function setCard(id, part, hist) {
    patch(id, (d) => ({ ...d, card: { ...d.card, ...part, history: hist ? [...d.card.history, ...hist] : d.card.history } }));
  }

  function choose(id) {
    selRef.current = id;
    setSel(id);
    setDialogs((ds) => ds.map((d) => (d.id === id && d.unread ? { ...d, unread: 0 } : d)));
  }

  function pick() {
    let free = POOL.map((_, i) => i).filter((i) => !used.current.includes(i));
    if (!free.length) {
      used.current = [];
      free = POOL.map((_, i) => i);
    }
    const idx = free[Math.floor(Math.random() * free.length)];
    used.current.push(idx);
    return POOL[idx];
  }

  function incoming() {
    if (busy) return;
    const tpl = pick();
    const c = counters.current;
    c.uid += 1;
    const id = `n${c.uid}`;
    const time = nowHM();
    const ex = tpl.existing;
    const num = ex ? `#${c.deal++}` : `L-${c.lead++}`;
    const mgr = ex ? ex.owner : MANAGERS[queue];
    const how = ex ? "закреплённый менеджер" : "по очереди";
    const chName = CH[tpl.ch].name;
    const created = ex ? `Создана сделка ${num}` : `Создан лид ${num}`;
    const bot = botOn;

    const dialog = {
      id,
      ch: tpl.ch,
      who: tpl.who,
      time,
      unread: 0,
      fresh: true,
      msgs: [{ from: "client", text: tpl.text, time }],
      card: {
        type: ex ? "Сделка" : "Лид",
        num,
        manager: null,
        how,
        culture: "",
        region: ex ? tpl.region : "",
        history: [...(ex ? ex.past : []), { t: time, text: `${chName} · ${ex ? "новый запрос" : "первое обращение"}` }],
        lit: ["type"],
      },
    };
    setDialogs((ds) => [dialog, ...ds]);
    selRef.current = id;
    setSel(id);
    setFilter("all");
    setPing(tpl.ch);
    setBusy(true);
    later(1400, () => setPing(null));

    const assign = (at) => {
      later(at, () => {
        push(id, { from: "system", text: `${created} · ответственный ${mgr} (${ex ? "закреплённый" : "по очереди"})`, time: nowHM() });
        setCard(id, { manager: mgr, lit: ["manager"] }, [{ t: nowHM(), text: `Назначен ответственный ${mgr}` }]);
        if (!ex) setQueue((q) => (q + 1) % MANAGERS.length);
        setBusy(false);
      });
      later(at + 1600, () => setCard(id, { lit: [] }));
    };

    if (!bot) {
      assign(700);
      return;
    }

    later(800, () => push(id, { from: "bot", text: "Здравствуйте! Я ИИ-помощник. Уточните, пожалуйста: какая культура и какой объём нужен?", time: nowHM() }));
    later(1900, () => {
      push(id, { from: "client", text: tpl.a1, time: nowHM() });
      setCard(id, { culture: tpl.culture, lit: ["culture"] });
    });
    if (ex) {
      later(2800, () => {
        push(id, { from: "bot", text: `Спасибо! Вижу вас в базе — передаю вашему менеджеру, ${mgr}.`, time: nowHM() });
        setCard(id, { lit: [] }, [{ t: nowHM(), text: "ИИ-бот уточнил культуру и объём" }]);
      });
      assign(3500);
      return;
    }
    later(2800, () => push(id, { from: "bot", text: "Спасибо! А из какого вы региона? Посчитаем доставку.", time: nowHM() }));
    later(3900, () => {
      push(id, { from: "client", text: tpl.a2, time: nowHM() });
      setCard(id, { region: tpl.region, lit: ["region"] });
    });
    later(4800, () => {
      push(id, { from: "bot", text: `Записал. Передаю менеджеру — ${mgr} свяжется в течение 15 минут.`, time: nowHM() });
      setCard(id, { lit: [] }, [{ t: nowHM(), text: "ИИ-бот: культура, объём и регион заполнены" }]);
    });
    assign(5500);
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    timers.current.length = 0;
    used.current = [];
    counters.current = { uid: 0, lead: 1048, deal: 2352 };
    selRef.current = "s1";
    setDialogs(SEED);
    setSel("s1");
    setFilter("all");
    setBusy(false);
    setQueue(0);
    setPing(null);
  }

  const unreadOf = (ch) => dialogs.filter((d) => d.ch === ch).reduce((a, d) => a + d.unread, 0);
  const totalUnread = dialogs.reduce((a, d) => a + d.unread, 0);
  const list = filter === "all" ? dialogs : dialogs.filter((d) => d.ch === filter);
  const card = cur.card;
  const qualifying = !card.manager;
  const fieldCls = (key) =>
    `flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 ring-1 transition-all duration-700 ease-spring ${
      card.lit.includes(key) ? "bg-sage/15 ring-sage/35" : "bg-white/50 ring-espresso/[0.06]"
    }`;

  return (
    <div className="w-full">
      <style>{CSS}</style>

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-espresso/10 px-5 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/10 text-ember ring-1 ring-ember/20">
            <Icon.channels className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-espresso">Все каналы в одном окне</p>
            <p className="text-[10px] text-umber">Открытые линии · 7 каналов → CRM</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            role="switch"
            aria-checked={botOn}
            onClick={() => setBotOn((b) => !b)}
            className="flex items-center gap-2 rounded-full bg-espresso/[0.04] py-1.5 pl-1.5 pr-3 ring-1 ring-espresso/10 transition-all duration-300 ease-spring hover:bg-espresso/[0.07]"
          >
            <span className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${botOn ? "bg-ember" : "bg-espresso/20"}`}>
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white ring-1 ring-espresso/10 transition-all duration-300 ease-spring ${botOn ? "left-[1.125rem]" : "left-0.5"}`} />
            </span>
            <span className="text-[12px] font-semibold text-espresso">ИИ-бот квалифицирует</span>
          </button>
          <button
            onClick={reset}
            title="Сбросить демо"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-espresso/[0.05] text-umber ring-1 ring-espresso/10 transition-all duration-300 ease-spring hover:bg-espresso/10 active:scale-[0.98]"
          >
            <Icon.repeat className="h-4 w-4 stroke-current fill-none" />
          </button>
          <button
            onClick={incoming}
            disabled={busy}
            className="flex items-center gap-2 rounded-full bg-ember px-4 py-2 text-sm font-semibold text-cream transition-all duration-300 ease-spring hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
          >
            {busy ? <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-cream" /> : <Icon.bell className="h-4 w-4 stroke-current fill-none" />}
            {busy ? "Обрабатываю…" : "Новое обращение"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 lg:h-[23.5rem] lg:grid-cols-[11.5rem_1fr_16.5rem] lg:grid-rows-1">
        {/* каналы + очередь */}
        <div className="flex min-h-0 flex-col">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-umber">Каналы</p>
          <div className="flex flex-wrap gap-1 lg:flex-col lg:flex-nowrap lg:gap-0.5">
            <button
              onClick={() => setFilter("all")}
              className={`flex items-center gap-2 rounded-xl px-2 py-[3px] text-left ring-1 transition-all duration-300 ease-spring ${filter === "all" ? "bg-ember/[0.06] ring-ember/40" : "bg-white/50 ring-espresso/[0.06] hover:bg-white/70"}`}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-espresso/[0.05] text-umber ring-1 ring-espresso/10">
                <Icon.grid className="h-3 w-3 stroke-current fill-none" />
              </span>
              <span className="flex-1 text-[12px] font-semibold text-espresso">Все</span>
              {totalUnread > 0 && <span className="rounded-full bg-espresso px-1.5 text-[10px] font-semibold tabular-nums text-cream">{totalUnread}</span>}
            </button>
            {CH_ORDER.map((ch) => {
              const n = unreadOf(ch);
              const on = filter === ch;
              const pinged = ping === ch;
              return (
                <button
                  key={ch}
                  onClick={() => setFilter((f) => (f === ch ? "all" : ch))}
                  className={`flex items-center gap-2 rounded-xl px-2 py-[3px] text-left ring-1 transition-all duration-500 ease-spring ${
                    pinged ? "bg-gold/15 ring-gold/40" : on ? "bg-ember/[0.06] ring-ember/40" : "bg-white/50 ring-espresso/[0.06] hover:bg-white/70"
                  }`}
                >
                  <ChBadge ch={ch} size="sm" />
                  <span className="flex-1 truncate text-[12px] font-medium text-espresso">{CH[ch].name}</span>
                  {pinged ? (
                    <span className="rounded-full bg-gold px-1.5 text-[10px] font-semibold text-white">+1</span>
                  ) : n > 0 ? (
                    <span className="rounded-full bg-ember px-1.5 text-[10px] font-semibold tabular-nums text-cream">{n}</span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-3 rounded-xl bg-espresso/[0.02] p-2 ring-1 ring-espresso/[0.06] lg:mt-auto">
            <p className="text-[9.5px] font-semibold uppercase tracking-wide text-umber">Очередь распределения</p>
            <div className="mt-1.5 flex items-center gap-1.5">
              {MANAGERS.map((m, i) => (
                <span
                  key={m}
                  title={m}
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-semibold ring-1 transition-all duration-500 ease-spring ${
                    i === queue ? "bg-ember text-cream ring-ember" : "bg-white/60 text-umber ring-espresso/10"
                  }`}
                >
                  {initials(m)}
                </span>
              ))}
            </div>
            <p className="mt-1 truncate text-[10.5px] text-umber">
              следующий: <span className="font-semibold text-espresso">{MANAGERS[queue]}</span>
            </p>
          </div>
        </div>

        {/* диалоги + переписка */}
        <div className="grid min-h-0 grid-cols-1 gap-3 sm:grid-cols-[13.5rem_1fr] lg:grid-rows-1">
          <div className="flex min-h-0 flex-col">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-umber">Диалоги · {list.length}</p>
            <ul className="thin-scroll max-h-56 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1 sm:max-h-80 lg:max-h-none">
              {list.map((d) => {
                const last = d.msgs[d.msgs.length - 1];
                const on = d.id === sel;
                return (
                  <li key={d.id} style={d.fresh ? IN : undefined}>
                    <button
                      onClick={() => choose(d.id)}
                      className={`w-full rounded-xl px-2 py-1.5 text-left ring-1 transition-all duration-300 ease-spring ${on ? "bg-ember/[0.06] ring-ember/40" : "bg-white/50 ring-espresso/[0.06] hover:bg-white/70"}`}
                    >
                      <span className="flex items-center gap-2">
                        <ChBadge ch={d.ch} size="sm" />
                        <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-espresso">{d.who}</span>
                        <span className="text-[9.5px] tabular-nums text-umber">{d.time}</span>
                      </span>
                      <span className="mt-0.5 flex items-center gap-2">
                        <span className="min-w-0 flex-1 truncate text-[11px] text-umber">
                          {last.from === "bot" ? "Бот: " : last.from === "manager" ? "Вы: " : ""}
                          {last.text}
                        </span>
                        {d.unread > 0 && <span className="rounded-full bg-ember px-1.5 text-[9.5px] font-semibold tabular-nums text-cream">{d.unread}</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
              {list.length === 0 && <li className="px-2 py-3 text-[11px] text-umber">В этом канале пока тихо</li>}
            </ul>
          </div>

          <div className="flex min-h-0 flex-col">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-umber">Переписка</p>
            <div className="flex h-80 min-h-0 flex-col overflow-hidden rounded-2xl bg-espresso/[0.02] ring-1 ring-espresso/[0.06] lg:h-auto lg:flex-1">
              <div className="flex items-center gap-2 border-b border-espresso/[0.07] px-3 py-2">
                <ChBadge ch={cur.ch} />
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="truncate text-[12.5px] font-semibold text-espresso">{cur.who}</p>
                  <p className="text-[10px] text-umber">{CH[cur.ch].name}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${card.type === "Лид" ? "bg-ember/10 text-ember ring-ember/20" : "bg-sage/15 text-[#3c6b32] ring-sage/25"}`}>
                  {card.type} {card.num}
                </span>
              </div>
              <div ref={chatRef} className="thin-scroll min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-2.5">
                {cur.msgs.map((m, i) => {
                  if (m.from === "system")
                    return (
                      <p key={i} className="mx-auto w-fit max-w-[95%] rounded-full bg-espresso/[0.05] px-2.5 py-1 text-center text-[10px] font-medium text-umber" style={IN}>
                        {m.text}
                      </p>
                    );
                  const ours = m.from !== "client";
                  return (
                    <div key={i} className={`flex flex-col ${ours ? "items-end" : "items-start"}`} style={IN}>
                      {m.from === "bot" && (
                        <span className="mb-0.5 flex items-center gap-1 px-1 text-[9.5px] font-semibold uppercase tracking-wide text-[#8a6418]">
                          <BotGlyph className="h-3 w-3" /> ИИ-бот
                        </span>
                      )}
                      {m.from === "manager" && <span className="mb-0.5 px-1 text-[9.5px] font-semibold uppercase tracking-wide text-umber">{m.who}</span>}
                      <p
                        className={`max-w-[85%] rounded-2xl px-3 py-1.5 text-[12px] leading-snug text-espresso ring-1 ${
                          m.from === "bot" ? "bg-gold/10 ring-gold/25" : m.from === "manager" ? "bg-ember/10 ring-ember/20" : "bg-white/75 ring-espresso/[0.06]"
                        }`}
                      >
                        {m.text}
                      </p>
                      <span className="mt-0.5 px-1 text-[9px] tabular-nums text-umber/70">{m.time}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 border-t border-espresso/[0.07] px-3 py-2">
                <span className="flex-1 truncate rounded-full bg-white/60 px-3 py-1.5 text-[11px] text-umber/60 ring-1 ring-espresso/[0.06]">Ответить в {CH[cur.ch].name}…</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ember/10 text-ember ring-1 ring-ember/20">
                  <Icon.arrow className="h-3.5 w-3.5 stroke-current fill-none" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CRM-карточка */}
        <div className="flex min-h-0 flex-col">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-umber">CRM · создано автоматически</p>
          <div key={cur.id} className="flex min-h-0 flex-1 flex-col rounded-2xl bg-espresso/[0.02] p-3 ring-1 ring-espresso/[0.06]" style={IN}>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 transition-all duration-700 ${
                  card.lit.includes("type") ? "bg-gold/15 text-[#8a6418] ring-gold/30" : card.type === "Лид" ? "bg-ember/10 text-ember ring-ember/20" : "bg-sage/15 text-[#3c6b32] ring-sage/25"
                }`}
              >
                {card.type}
              </span>
              <span className="text-[11px] font-semibold tabular-nums text-umber">{card.num}</span>
              {card.type === "Сделка" && <span className="ml-auto text-[10px] text-umber">клиент в базе</span>}
            </div>
            <p className="mt-1.5 truncate font-display text-[15px] font-semibold text-espresso">{cur.who}</p>

            <div className="mt-2 space-y-1 text-[11px]">
              <div className={fieldCls("source")}>
                <span className="text-umber">Источник</span>
                <span className="flex items-center gap-1.5 font-semibold text-espresso">
                  <ChBadge ch={cur.ch} size="xs" />
                  {CH[cur.ch].name}
                </span>
              </div>
              <div className={fieldCls("manager")}>
                <span className="text-umber">Ответственный</span>
                {qualifying ? (
                  <span className="flex items-center gap-1.5 font-medium text-[#8a6418]">
                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-gold" />
                    {botOn ? "после квалификации" : "назначается…"}
                  </span>
                ) : (
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember text-[8.5px] font-semibold text-cream">{initials(card.manager)}</span>
                    <span className="min-w-0 leading-tight">
                      <span className="block truncate font-semibold text-espresso">{card.manager}</span>
                      <span className="block truncate text-[9px] text-umber">{card.how}</span>
                    </span>
                  </span>
                )}
              </div>
              <div className={fieldCls("culture")}>
                <span className="shrink-0 text-umber">Культура / объём</span>
                <span className={`truncate text-right font-semibold ${card.culture ? "text-espresso" : "font-normal text-umber/60"}`}>{card.culture || "—"}</span>
              </div>
              <div className={fieldCls("region")}>
                <span className="text-umber">Регион</span>
                <span className={`truncate font-semibold ${card.region ? "text-espresso" : "font-normal text-umber/60"}`}>{card.region || "—"}</span>
              </div>
            </div>

            <p className="mb-1 mt-2.5 text-[10px] font-semibold uppercase tracking-wide text-umber">История касаний</p>
            <ol className="thin-scroll min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
              {[...card.history].reverse().map((h, i) => (
                <li key={`${card.history.length - 1 - i}-${h.text}`} className="flex items-start gap-2 text-[11px] leading-snug text-umber" style={i === 0 ? IN : undefined}>
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${i === 0 ? "bg-ember" : "bg-espresso/20"}`} />
                  <span className="w-9 shrink-0 tabular-nums text-espresso/70">{h.t}</span>
                  <span className="min-w-0">{h.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
