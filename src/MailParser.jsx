import { useEffect, useRef, useState } from "react";
import { Icon } from "./ui.jsx";

// Demo — разбор общего почтового ящика в лиды. Словарь ключевых слов (клик —
// вкл/выкл), входящие письма, кнопка «Разобрать почту»: письмо от клиента
// прикрепляется к его сделке, рассылки и поставщики отсеиваются, запросы с
// ключевыми словами становятся лидами. Выключили слово — разобрали заново — итог другой.

const KEYWORDS = [
  { id: "seed", label: "семена", stem: "семен|семян" },
  { id: "hybrid", label: "гибрид", stem: "гибрид" },
  { id: "szr", label: "СЗР", stem: "сзр" },
  { id: "herb", label: "гербицид", stem: "гербицид" },
  { id: "fung", label: "фунгицид", stem: "фунгицид" },
  { id: "fert", label: "удобрения", stem: "удобрен" },
  { id: "price", label: "прайс", stem: "прайс" },
  { id: "kp", label: "коммерческое предложение", stem: "коммерческ[а-яё]*\\s+предложени" },
  { id: "req", label: "заявка", stem: "заявк" },
  { id: "ton", label: "тонн", stem: "тонн" },
];
const ALL_IDS = KEYWORDS.map((k) => k.id);

const CLIENTS = { "niva-yug.demo": { name: "СХП «Нива-Юг»", deal: "#2318" } };
const SUPPLIERS = ["tara-pack.demo"];

const MAILS = [
  { id: 1, from: "Агрофирма «Колос»", addr: "zakupki@kolos-agro.demo", time: "09:41", subj: "Запрос коммерческого предложения", body: "Добрый день! Интересуют семена кукурузы, гибрид ФАО 200–250 на 400 га. Просим КП с доставкой." },
  { id: 2, from: "СХП «Нива-Юг»", addr: "info@niva-yug.demo", time: "09:30", subj: "Re: Счёт № 0412 — оплата", body: "Оплату по счёту провели, платёжку прикладываем. Когда можно забрать семена со склада?" },
  { id: 3, from: "КФХ «Заря»", addr: "zarya.kfh@mail.demo", time: "09:12", subj: "Гербицид на подсолнечник", body: "Здравствуйте! Сколько стоит гербицид по подсолнечнику на 320 га? Пришлите, пожалуйста, прайс." },
  { id: 4, from: "Агро-дайджест", addr: "news@agro-digest.demo", time: "08:55", list: true, subj: "Дайджест недели: рынок зерна и удобрений", body: "Пшеница дорожает, спрос на удобрения растёт перед сезоном. Чтобы отписаться от рассылки, нажмите здесь." },
  { id: 5, from: "ООО «Тара-Пак»", addr: "buh@tara-pack.demo", time: "08:40", subj: "Счёт на оплату № 7731 — мешкотара", body: "Направляем счёт за полипропиленовые мешки, 2 000 шт. Оплата в течение 5 банковских дней." },
  { id: 6, from: "КФХ «Ивушка»", addr: "ivushka@mail.demo", time: "08:22", subj: "Удобрения на весну", body: "Добрый день! Нужна аммиачная селитра — 60 тонн и NPK 16:16:16 — 20 тонн, поставка в марте." },
  { id: 7, from: "Продвижение бизнеса", addr: "promo@seo-boost.demo", time: "07:58", subj: "Выведем ваш сайт в ТОП за 7 дней", body: "Гарантия результата, первый месяц бесплатно. Ответьте на это письмо — расскажем подробнее." },
  { id: 8, from: "Агрофирма «Восход»", addr: "agro@voshod.demo", time: "вчера", subj: "Обработка пшеницы в мае", body: "Подскажите по фунгициду от септориоза — площадь 600 га, обработка в мае." },
  { id: 9, from: "В. Гусев", addr: "v.gusev@mail.demo", time: "вчера", subj: "Заявка с сайта", body: "Перезвоните, пожалуйста, по СЗР для подсолнечника. Телефон в подписи." },
];

const L = "[А-Яа-яЁё]";
function wordRe(stems, flags) {
  return new RegExp(`(${L}*(?:${stems.join("|")})${L}*)`, flags);
}

function decide(mail, enabled) {
  const domain = mail.addr.split("@")[1];
  if (CLIENTS[domain]) return { kind: "deal", note: `к сделке ${CLIENTS[domain].deal}` };
  if (mail.list) return { kind: "skip", note: "рассылка" };
  if (SUPPLIERS.includes(domain)) return { kind: "skip", note: "поставщик" };
  const text = `${mail.subj} ${mail.body}`;
  const hits = KEYWORDS.filter((k) => enabled.includes(k.id) && wordRe([k.stem], "i").test(text));
  if (!hits.length) return { kind: "skip", note: "нет ключевых слов" };
  return { kind: "lead", hits: hits.map((h) => h.id) };
}

function same(a, b) {
  return a && b && a.kind === b.kind && a.note === b.note;
}
function shortLabel(d) {
  return d.kind === "lead" ? "Лид" : d.kind === "deal" ? "К сделке" : "Отсеяно";
}

// подсветка найденных слов (только для писем, ушедших в лиды)
function Marked({ text, hits }) {
  if (!hits || !hits.length) return text;
  const stems = KEYWORDS.filter((k) => hits.includes(k.id)).map((k) => k.stem);
  const parts = text.split(wordRe(stems, "gi"));
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded bg-gold/25 px-0.5 font-semibold text-espresso">
        {p}
      </mark>
    ) : (
      p
    ),
  );
}

const STEP_MS = 420;
const CSS = `@keyframes mpIn { from { opacity: 0; transform: translateX(6px); } to { opacity: 1; transform: none; } }`;

function MailGlyph({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={`stroke-current fill-none ${className}`} strokeWidth={1.4}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MailParser() {
  const [enabled, setEnabled] = useState(ALL_IDS);
  const [results, setResults] = useState({});
  const [prev, setPrev] = useState({});
  const [phase, setPhase] = useState("idle"); // idle | run | done
  const [cur, setCur] = useState(null);
  const [stale, setStale] = useState(false);

  const timers = useRef([]);
  const listRef = useRef(null);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  function clearAll() {
    timers.current.forEach(clearTimeout);
    timers.current.length = 0;
  }
  function later(ms, fn) {
    timers.current.push(setTimeout(fn, ms));
  }
  function scrollToRow(i) {
    const box = listRef.current;
    const row = box && box.querySelector(`[data-i="${i}"]`);
    if (row) box.scrollTo({ top: Math.max(0, row.offsetTop - (box.clientHeight - row.offsetHeight) / 2), behavior: "smooth" });
  }

  function toggle(id) {
    setEnabled((en) => (en.includes(id) ? en.filter((x) => x !== id) : [...en, id]));
    if (phase !== "idle") setStale(true);
  }

  function parse() {
    clearAll();
    const en = enabled;
    setPrev(Object.keys(results).length ? results : {});
    setResults({});
    setStale(false);
    setPhase("run");
    MAILS.forEach((m, i) => {
      later(i * STEP_MS, () => {
        setCur(i);
        scrollToRow(i);
      });
      later(i * STEP_MS + STEP_MS - 120, () => setResults((r) => ({ ...r, [m.id]: decide(m, en) })));
    });
    later(MAILS.length * STEP_MS + 80, () => {
      setCur(null);
      setPhase("done");
    });
  }

  function reset() {
    clearAll();
    setEnabled(ALL_IDS);
    setResults({});
    setPrev({});
    setPhase("idle");
    setCur(null);
    setStale(false);
    if (listRef.current) listRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }

  const vals = Object.values(results);
  const stats = [
    { k: "Обработано", v: `${vals.length}/${MAILS.length}`, cls: "text-espresso" },
    { k: "В лиды", v: vals.filter((d) => d.kind === "lead").length, cls: "text-ember" },
    { k: "К сделкам", v: vals.filter((d) => d.kind === "deal").length, cls: "text-[#3c6b32]" },
    { k: "Отсеяно", v: vals.filter((d) => d.kind === "skip").length, cls: "text-umber" },
  ];
  const running = phase === "run";

  return (
    <div className="w-full">
      <style>{CSS}</style>

      <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/10 text-ember ring-1 ring-ember/20">
            <MailGlyph className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-espresso">Почта → лиды</p>
            <p className="text-[10px] text-umber">Разбор общего ящика по словарю</p>
          </div>
        </div>
        <span className="hidden rounded-full bg-espresso/[0.05] px-2.5 py-1 text-[10px] font-semibold text-umber ring-1 ring-espresso/10 sm:inline">info@agrosnab.demo</span>
      </div>

      <div className="space-y-3 p-4">
        {/* счётчики + кнопки */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="grid flex-1 grid-cols-4 gap-1.5">
            {stats.map((s) => (
              <div key={s.k} className="rounded-xl bg-white/50 px-2.5 py-1.5 ring-1 ring-espresso/[0.06]">
                <p className={`font-display text-[17px] font-semibold leading-none tabular-nums ${s.cls}`}>{s.v}</p>
                <p className="mt-1 truncate text-[10px] text-umber">{s.k}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={parse}
              disabled={running}
              className="flex items-center gap-2 rounded-full bg-ember px-4 py-2.5 text-sm font-semibold text-cream transition-all duration-300 ease-spring hover:brightness-105 active:scale-[0.98] disabled:opacity-70"
            >
              {running ? <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-cream" /> : <Icon.funnel className="h-4 w-4 stroke-current fill-none" />}
              {running ? "Разбираю…" : phase === "idle" ? "Разобрать почту" : "Разобрать заново"}
            </button>
            <button
              onClick={reset}
              title="Сбросить"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-espresso/[0.05] text-umber ring-1 ring-espresso/10 transition-all duration-300 ease-spring hover:bg-espresso/10 active:scale-[0.98]"
            >
              <Icon.repeat className="h-4 w-4 stroke-current fill-none" />
            </button>
          </div>
        </div>

        {/* словарь */}
        <div>
          <p className="mb-1.5 flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-wide text-umber">
            <span>Словарь · клик включает / выключает</span>
            {stale && !running && <span className="normal-case tracking-normal text-[#8a6418]">словарь изменён — разберите заново</span>}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {KEYWORDS.map((k) => {
              const on = enabled.includes(k.id);
              return (
                <button
                  key={k.id}
                  onClick={() => toggle(k.id)}
                  aria-pressed={on}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-medium ring-1 transition-all duration-300 ease-spring active:scale-[0.97] ${
                    on ? "bg-ember/10 text-ember ring-ember/30" : "bg-espresso/[0.03] text-umber/60 line-through ring-espresso/10"
                  }`}
                >
                  {on && <Icon.check className="h-3 w-3 stroke-current fill-none" />}
                  {k.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* входящие */}
        <ul ref={listRef} className="thin-scroll relative max-h-[14.5rem] space-y-1.5 overflow-y-auto pr-1">
          {MAILS.map((m, i) => {
            const d = results[m.id];
            const p = prev[m.id];
            const changed = d && p && !same(d, p);
            const processing = cur === i && !d;
            return (
              <li
                key={m.id}
                data-i={i}
                className={`flex flex-col gap-2 rounded-xl px-3 py-2 ring-1 transition-all duration-500 ease-spring sm:flex-row sm:items-center ${
                  processing
                    ? "bg-gold/10 ring-gold/35"
                    : !d
                      ? "bg-white/50 ring-espresso/[0.06]"
                      : d.kind === "lead"
                        ? "bg-ember/[0.05] ring-ember/30"
                        : d.kind === "deal"
                          ? "bg-sage/10 ring-sage/25"
                          : "bg-white/30 ring-espresso/[0.05]"
                } ${stale && d ? "opacity-60" : ""}`}
              >
                <div className={`min-w-0 flex-1 ${d && d.kind === "skip" ? "opacity-60" : ""}`}>
                  <p className="flex items-center gap-1.5 text-[10.5px] text-umber">
                    <span className="truncate font-semibold text-espresso/80">{m.from}</span>
                    <span className="hidden truncate sm:inline">· {m.addr}</span>
                    <span className="ml-auto shrink-0 tabular-nums">{m.time}</span>
                  </p>
                  <p className="truncate text-[12.5px] font-semibold text-espresso">{d && d.kind === "lead" ? <Marked text={m.subj} hits={d.hits} /> : m.subj}</p>
                  <p className="truncate text-[11px] text-umber">{d && d.kind === "lead" ? <Marked text={m.body} hits={d.hits} /> : m.body}</p>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-0.5 sm:w-[8.5rem] sm:items-end">
                  {processing ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-gold/15 px-2 py-0.5 text-[10.5px] font-semibold text-[#8a6418] ring-1 ring-gold/30">
                      <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-gold" /> анализ…
                    </span>
                  ) : d ? (
                    <div className="flex flex-col items-start gap-0.5 sm:items-end" style={{ animation: "mpIn .35s cubic-bezier(0.32,0.72,0,1) both" }}>
                      {d.kind === "lead" && (
                        <span className="flex items-center gap-1 rounded-full bg-ember px-2 py-0.5 text-[10.5px] font-semibold text-cream">
                          <Icon.arrow className="h-3 w-3 stroke-current fill-none" /> Лид
                        </span>
                      )}
                      {d.kind === "deal" && (
                        <span className="flex items-center gap-1 rounded-full bg-sage/15 px-2 py-0.5 text-[10.5px] font-semibold text-[#3c6b32] ring-1 ring-sage/30">
                          <Icon.handshake className="h-3 w-3 stroke-current fill-none" /> {d.note}
                        </span>
                      )}
                      {d.kind === "skip" && (
                        <span className="rounded-full bg-espresso/[0.05] px-2 py-0.5 text-[10.5px] font-semibold text-umber ring-1 ring-espresso/10">Отсеяно</span>
                      )}
                      <span className="max-w-full truncate text-[9.5px] text-umber">
                        {d.kind === "lead"
                          ? KEYWORDS.filter((k) => d.hits.includes(k.id))
                              .map((k) => k.label)
                              .join(" · ")
                          : d.kind === "deal"
                            ? "письмо прикреплено"
                            : d.note}
                      </span>
                      {changed && <span className="rounded bg-gold/15 px-1 text-[9px] font-semibold text-[#8a6418]">было: {shortLabel(p)}</span>}
                    </div>
                  ) : (
                    <span className="text-[10.5px] text-umber/50">ждёт разбора</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
