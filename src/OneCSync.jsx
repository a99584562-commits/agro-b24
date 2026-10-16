import { useEffect, useRef, useState } from "react";
import { Icon } from "./ui.jsx";

// Demo — двусторонний обмен Битрикс24 ⇄ 1С. Слева сделка в Б24, справа журнал
// документов 1С, между ними — что именно синхронизируется и в какую сторону.
// Сценарий из трёх шагов: счёт уходит в 1С, оплата и УПД возвращаются в сделку,
// по рельсам объектов летят «пакеты», внизу — лента обмена со временем.

const OBJECTS = [
  { id: "cp", name: "Контрагенты", dir: "both" },
  { id: "nom", name: "Номенклатура и цены", dir: "in" },
  { id: "stock", name: "Остатки по складам", dir: "in" },
  { id: "inv", name: "Счета", dir: "out" },
  { id: "pay", name: "Оплаты", dir: "in" },
  { id: "upd", name: "Реализации / УПД", dir: "in" },
  { id: "debt", name: "Дебиторка", dir: "in" },
];
const DIR_LABEL = { both: "в обе стороны", in: "из 1С", out: "в 1С" };

const STAGES = ["Согласование", "Счёт выставлен", "Оплачено", "Отгружено"];
const STAGE_SHORT = ["Согл.", "Счёт", "Оплачено", "Отгружено"];

const SUM = "1 248 000 ₽";
const CLIENT = "СХП «Нива-Юг»";

const STEPS = [
  { title: "Менеджер выставил счёт в сделке", hint: "Б24 → 1С" },
  { title: "Оплата поступила в 1С", hint: "1С → Б24" },
  { title: "Проведена реализация (УПД)", hint: "1С → Б24" },
];

const INITIAL_JOURNAL = [
  { id: "j2", kind: "pay", title: "Поступление на р/с № 1186", sub: "КФХ «Рассвет» · 312 000 ₽", status: "проведён", old: true },
  { id: "j1", kind: "inv", title: "Счёт на оплату № 0411", sub: "Агрофирма «Колос» · 864 000 ₽", status: "оплачен", old: true },
];
const INITIAL_FEED = [{ id: "f0", time: "08:00", sys: "Обмен", text: "Плановая синхронизация: номенклатура, цены и остатки загружены из 1С" }];

const SALDO = {
  none: { text: "—", cls: "text-umber/60" },
  due: { text: `к оплате ${SUM}`, cls: "text-[#8a6418]" },
  advance: { text: `аванс получен · ${SUM}`, cls: "text-[#3c6b32]" },
  closed: { text: "0 ₽ · расчёты закрыты", cls: "text-[#3c6b32]" },
};

const SYS_TONE = {
  "Б24": "bg-ember/10 text-ember ring-ember/20",
  "1С": "bg-gold/10 text-[#8a6418] ring-gold/25",
  "Обмен": "bg-espresso/[0.05] text-umber ring-espresso/10",
};

const CSS = `
@keyframes ocFlyR { 0% { left: 0%; transform: translateX(0); opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { left: 100%; transform: translateX(-100%); opacity: 0; } }
@keyframes ocFlyL { 0% { left: 100%; transform: translateX(-100%); opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { left: 0%; transform: translateX(0); opacity: 0; } }
@keyframes ocIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
`;

function today() {
  return new Date().toLocaleDateString("ru-RU");
}

function Chevron({ side, on }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 stroke-current fill-none transition-colors duration-300 ${side === "left" ? "left-0" : "right-0"} ${on ? "text-ember" : "text-espresso/30"}`}
      strokeWidth={1.5}
    >
      <path d={side === "left" ? "M7.5 2.5 4 6l3.5 3.5" : "M4.5 2.5 8 6 4.5 9.5"} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Track({ dir, on, packets, onDone }) {
  return (
    <div className="relative h-full min-w-[4rem] flex-1">
      <span className={`absolute inset-x-1.5 top-1/2 h-px transition-colors duration-300 ${on ? "bg-ember/50" : "bg-espresso/15"}`} />
      {(dir === "in" || dir === "both") && <Chevron side="left" on={on} />}
      {(dir === "out" || dir === "both") && <Chevron side="right" on={on} />}
      {packets.map((p) => (
        <span
          key={p.key}
          onAnimationEnd={() => onDone(p.key)}
          className="pointer-events-none absolute inset-y-0 flex items-center"
          style={{ animation: `${p.dir === "r" ? "ocFlyR" : "ocFlyL"} 1s cubic-bezier(0.45, 0, 0.2, 1) both` }}
        >
          <span className="flex h-[18px] items-center gap-1 whitespace-nowrap rounded-full bg-ember px-2 text-[9.5px] font-semibold text-cream">
            <Icon.doc className="h-3 w-3 stroke-current fill-none" />
            {p.label}
          </span>
        </span>
      ))}
    </div>
  );
}

function SysBadge({ children, tone }) {
  return <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold normal-case tracking-normal ring-1 ${tone}`}>{children}</span>;
}

export default function OneCSync() {
  const [step, setStep] = useState(0); // сколько шагов сценария пройдено
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);
  const [invoice, setInvoice] = useState(null); // null | "pending" | дата счёта
  const [upd, setUpd] = useState(false);
  const [saldo, setSaldo] = useState("none");
  const [task, setTask] = useState("none"); // none | open | done
  const [journal, setJournal] = useState(INITIAL_JOURNAL);
  const [feed, setFeed] = useState(INITIAL_FEED);
  const [packets, setPackets] = useState([]);
  const [active, setActive] = useState([]);
  const [flash, setFlash] = useState(null); // "b24" | "c1"

  const timers = useRef([]);
  const uid = useRef(0);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  function later(ms, fn) {
    timers.current.push(setTimeout(fn, ms));
  }
  function nextId() {
    uid.current += 1;
    return uid.current;
  }
  function log(time, sys, text) {
    const id = `f${nextId()}`;
    setFeed((f) => [{ id, time, sys, text }, ...f]);
  }
  function fly(row, dir, label) {
    const key = nextId();
    setPackets((p) => [...p, { key, row, dir, label }]);
  }
  function landed(key) {
    setPackets((p) => p.filter((x) => x.key !== key));
  }
  function addDoc(doc) {
    const id = `j${nextId()}`;
    setJournal((j) => [{ id, ...doc }, ...j]);
  }
  function glow(side) {
    setFlash(side);
    later(800, () => setFlash((f) => (f === side ? null : f)));
  }

  function runInvoice() {
    const d = today();
    setBusy(true);
    setActive(["inv", "cp"]);
    setStage(1);
    setInvoice("pending");
    log("10:14", "Б24", `И. Сафонов выставил счёт в сделке #2318 на ${SUM}`);
    fly("inv", "r", "Счёт");
    later(450, () => log("10:14", "Обмен", `Контрагент ${CLIENT} найден в 1С по ИНН — дубль не создан`));
    later(1100, () => {
      addDoc({ kind: "inv", title: `Счёт на оплату № 0412 от ${d}`, sub: `${CLIENT} · ${SUM}`, status: "из Б24" });
      glow("c1");
      log("10:14", "1С", `Создан счёт № 0412 от ${d}`);
      setActive(["inv"]);
      fly("inv", "l", "№ 0412");
    });
    later(2200, () => {
      setInvoice(d);
      setSaldo("due");
      glow("b24");
      log("10:15", "Б24", "В сделку записан номер счёта № 0412 и печатная форма");
      setActive([]);
      setBusy(false);
      setStep(1);
    });
  }

  function runPayment() {
    setBusy(true);
    setActive(["pay"]);
    addDoc({ kind: "pay", title: "Поступление на р/с № 1187", sub: `${CLIENT} · ${SUM}`, status: "проведён" });
    glow("c1");
    log("13:52", "1С", `Поступление на р/с № 1187 по счёту № 0412 — ${SUM}`);
    later(150, () => fly("pay", "l", "Оплата"));
    later(1250, () => {
      setStage(2);
      setSaldo("advance");
      glow("b24");
      log("13:52", "Б24", "Сделка #2318 перешла на стадию «Оплачено»");
    });
    later(1900, () => {
      setTask("open");
      log("13:53", "Б24", "Логисту Д. Ковалёву поставлена задача «Отгрузить по счёту № 0412»");
      setActive([]);
      setBusy(false);
      setStep(2);
    });
  }

  function runShipment() {
    const d = today();
    setBusy(true);
    setActive(["upd"]);
    addDoc({ kind: "upd", title: `Реализация (УПД) № 0398 от ${d}`, sub: `${CLIENT} · ${SUM}`, status: "проведён" });
    glow("c1");
    log("16:20", "1С", "Проведена реализация (УПД) № 0398 — «Ранний-3», 48 п. е.");
    later(150, () => fly("upd", "l", "УПД"));
    later(1250, () => {
      setStage(3);
      setUpd(true);
      setTask("done");
      glow("b24");
      log("16:20", "Б24", "Сделка → «Отгружено», к сделке прикреплён УПД № 0398 (PDF)");
      setActive(["stock", "debt"]);
      fly("stock", "l", "−48 п. е.");
      fly("debt", "l", "Сальдо");
    });
    later(2400, () => {
      setSaldo("closed");
      glow("b24");
      log("16:21", "Обмен", "Остаток «Ранний-3» на складе «Центральный»: 212 → 164 п. е.");
      log("16:21", "Б24", `Дебиторка по ${CLIENT} обновлена: 0 ₽, расчёты закрыты`);
      setActive([]);
      setBusy(false);
      setStep(3);
    });
  }

  const RUNS = [runInvoice, runPayment, runShipment];

  function run(idx) {
    if (busy || idx !== step) return;
    RUNS[idx]();
  }

  function restart() {
    timers.current.forEach(clearTimeout);
    timers.current.length = 0;
    setStep(0);
    setBusy(false);
    setStage(0);
    setInvoice(null);
    setUpd(false);
    setSaldo("none");
    setTask("none");
    setJournal(INITIAL_JOURNAL);
    setFeed(INITIAL_FEED);
    setPackets([]);
    setActive([]);
    setFlash(null);
  }

  const done = step >= STEPS.length;
  const fieldRow = "flex items-center justify-between gap-3 rounded-lg bg-white/50 px-2.5 py-1 ring-1 ring-espresso/[0.06]";

  return (
    <div className="w-full">
      <style>{CSS}</style>

      <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/10 text-ember ring-1 ring-ember/20">
            <Icon.repeat className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-espresso">Обмен Битрикс24 ⇄ 1С</p>
            <p className="text-[10px] text-umber">Двусторонняя синхронизация · документы по событию</p>
          </div>
        </div>
        {busy ? (
          <span className="flex items-center gap-1.5 rounded-full bg-gold/10 px-2.5 py-1 text-[10px] font-semibold text-[#8a6418] ring-1 ring-gold/25">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-gold" /> идёт обмен
          </span>
        ) : (
          <span className="hidden items-center gap-1.5 rounded-full bg-sage/15 px-2.5 py-1 text-[10px] font-semibold text-[#3c6b32] ring-1 ring-sage/25 sm:flex">
            {done ? <Icon.check className="h-3 w-3 stroke-current fill-none" /> : <span className="h-1.5 w-1.5 rounded-full bg-sage" />}
            {done ? "цикл закрыт без ручного ввода" : "данные совпадают"}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 px-5 pb-3 pt-4 lg:grid-cols-[1fr_1.15fr_1fr]">
        {/* Битрикс24 — сделка */}
        <div className="min-w-0">
          <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-umber">
            <SysBadge tone={SYS_TONE["Б24"]}>Б24</SysBadge> Битрикс24 · сделка
          </p>
          <div className={`rounded-2xl p-3 ring-1 transition-all duration-500 ease-spring ${flash === "b24" ? "bg-ember/[0.06] ring-ember/45" : "bg-espresso/[0.02] ring-espresso/[0.06]"}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[13px] font-semibold text-espresso">{CLIENT}</p>
                <p className="text-[11px] text-umber">Сделка #2318 · «Ранний-3», 48 п. е.</p>
              </div>
              <span
                key={stage}
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${stage === 3 ? "bg-sage/15 text-[#3c6b32] ring-sage/25" : "bg-ember/10 text-ember ring-ember/20"}`}
                style={{ animation: "ocIn .45s cubic-bezier(0.32,0.72,0,1) both" }}
              >
                {STAGES[stage]}
              </span>
            </div>
            <p className="mt-1.5 font-display text-lg font-semibold tabular-nums text-espresso">{SUM}</p>
            <div className="mt-1.5 grid grid-cols-4 gap-1">
              {STAGE_SHORT.map((s, i) => (
                <div key={s}>
                  <span className={`block h-1 rounded-full transition-colors duration-500 ${i <= stage ? (stage === 3 ? "bg-sage" : "bg-ember") : "bg-espresso/10"}`} />
                  <span className={`mt-0.5 block text-[9px] ${i <= stage ? "font-semibold text-espresso/80" : "text-umber/60"}`}>{s}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 space-y-1 text-[11px]">
              <div className={fieldRow}>
                <span className="text-umber">Счёт 1С</span>
                <span className="truncate font-semibold text-espresso">
                  {invoice === null ? <span className="font-normal text-umber/60">—</span> : invoice === "pending" ? <span className="font-normal text-umber">формируется…</span> : `№ 0412 от ${invoice}`}
                </span>
              </div>
              <div className={fieldRow}>
                <span className="text-umber">Документы</span>
                {upd ? (
                  <span className="flex items-center gap-1 rounded-md bg-red-500/10 px-1.5 py-px text-[10px] font-semibold text-red-700 ring-1 ring-red-500/20">
                    PDF <span className="font-medium text-espresso/80">УПД № 0398</span>
                  </span>
                ) : (
                  <span className="text-umber/60">—</span>
                )}
              </div>
              <div className={fieldRow}>
                <span className="text-umber">Дебиторка (1С)</span>
                <span className={`truncate font-semibold tabular-nums ${SALDO[saldo].cls}`}>{SALDO[saldo].text}</span>
              </div>
              <div className={fieldRow}>
                <span className="text-umber">Задача логисту</span>
                {task === "none" ? (
                  <span className="text-umber/60">—</span>
                ) : (
                  <span className={`flex items-center gap-1 font-semibold ${task === "done" ? "text-[#3c6b32]" : "text-[#8a6418]"}`}>
                    {task === "done" ? <Icon.check className="h-3.5 w-3.5 stroke-current fill-none" /> : <Icon.truck className="h-3.5 w-3.5 stroke-current fill-none" />}
                    Д. Ковалёв · {task === "done" ? "отгружено" : "в работе"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* что синхронизируется */}
        <div className="min-w-0">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-umber">Что синхронизируется</p>
          <ul className="space-y-[3px]">
            {OBJECTS.map((o) => {
              const on = active.includes(o.id);
              return (
                <li
                  key={o.id}
                  className={`flex h-7 items-center gap-2 rounded-lg px-2.5 ring-1 transition-all duration-300 ease-spring ${on ? "bg-ember/[0.06] ring-ember/40" : "bg-white/50 ring-espresso/[0.06]"}`}
                >
                  <span className={`w-[8.6rem] shrink-0 truncate text-[12px] ${on ? "font-semibold text-espresso" : "font-medium text-espresso/85"}`}>{o.name}</span>
                  <Track dir={o.dir} on={on} packets={packets.filter((p) => p.row === o.id)} onDone={landed} />
                  <span className={`w-[5.4rem] shrink-0 text-right text-[10px] ${on ? "font-semibold text-ember" : "text-umber"}`}>{DIR_LABEL[o.dir]}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 1С — журнал документов */}
        <div className="min-w-0">
          <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-umber">
            <SysBadge tone={SYS_TONE["1С"]}>1С</SysBadge> 1С · журнал документов
          </p>
          <ul className={`thin-scroll max-h-[13.4rem] space-y-1.5 overflow-y-auto rounded-2xl p-1.5 pr-1 ring-1 transition-all duration-500 ease-spring ${flash === "c1" ? "bg-gold/10 ring-gold/40" : "bg-espresso/[0.02] ring-espresso/[0.06]"}`}>
            {journal.map((j) => (
              <li
                key={j.id}
                className={`flex items-start gap-2 rounded-xl px-2.5 py-1.5 ring-1 ${j.old ? "bg-white/30 ring-espresso/[0.05]" : "bg-white/70 ring-gold/25"}`}
                style={j.old ? undefined : { animation: "ocIn .5s cubic-bezier(0.32,0.72,0,1) both" }}
              >
                <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ring-1 ${j.old ? "bg-espresso/[0.04] text-umber/70 ring-espresso/10" : "bg-gold/10 text-[#8a6418] ring-gold/25"}`}>
                  {j.kind === "pay" ? <Icon.coins className="h-3.5 w-3.5 stroke-current fill-none" /> : j.kind === "upd" ? <Icon.box className="h-3.5 w-3.5 stroke-current fill-none" /> : <Icon.doc className="h-3.5 w-3.5 stroke-current fill-none" />}
                </span>
                <div className="min-w-0 flex-1 leading-tight">
                  <p className={`truncate text-[12px] font-semibold ${j.old ? "text-espresso/60" : "text-espresso"}`}>{j.title}</p>
                  <p className="truncate text-[10.5px] tabular-nums text-umber">{j.sub}</p>
                </div>
                <span className={`mt-0.5 shrink-0 rounded-full px-1.5 py-px text-[9px] font-semibold ring-1 ${j.old ? "bg-espresso/[0.04] text-umber/70 ring-espresso/10" : "bg-sage/15 text-[#3c6b32] ring-sage/25"}`}>{j.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* сценарий + лента */}
      <div className="grid grid-cols-1 gap-4 border-t border-espresso/10 px-5 pb-4 pt-3 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-umber">Сценарий · жмите по шагам</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            {STEPS.map((s, i) => {
              const isDone = i < step;
              const isNext = i === step;
              return (
                <button
                  key={s.title}
                  onClick={() => run(i)}
                  disabled={!isNext || busy}
                  className={`flex flex-1 items-center gap-2 rounded-2xl px-3 py-2 text-left ring-1 transition-all duration-300 ease-spring ${
                    isDone
                      ? "bg-sage/10 text-espresso ring-sage/25"
                      : isNext
                        ? `bg-ember text-cream ring-ember active:scale-[0.98] ${busy ? "opacity-70" : "hover:brightness-105"}`
                        : "bg-espresso/[0.03] text-umber/60 ring-espresso/10"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                      isDone ? "bg-sage text-white" : isNext ? "bg-white/20 text-cream" : "bg-espresso/[0.05] text-umber/60"
                    }`}
                  >
                    {isDone ? <Icon.check className="h-3.5 w-3.5 stroke-current fill-none" /> : i + 1}
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[12px] font-semibold">{s.title}</span>
                    <span className={`block text-[10px] ${isNext ? "text-cream/75" : "text-umber/70"}`}>{s.hint}</span>
                  </span>
                </button>
              );
            })}
            <button
              onClick={restart}
              disabled={step === 0 && !busy}
              className="flex items-center justify-center gap-1.5 rounded-full bg-espresso/[0.05] px-3.5 py-2 text-[12px] font-medium text-umber ring-1 ring-espresso/10 transition-all duration-300 ease-spring enabled:hover:bg-espresso/10 disabled:opacity-40 sm:self-center"
            >
              <Icon.repeat className="h-3.5 w-3.5 stroke-current fill-none" /> Сначала
            </button>
          </div>
        </div>

        <div className="min-w-0">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-umber">Лента обмена</p>
          <ul className="thin-scroll max-h-[4.6rem] space-y-1 overflow-y-auto pr-1">
            {feed.map((e) => (
              <li key={e.id} className="flex items-start gap-2 text-[11.5px] leading-snug text-umber" style={{ animation: "ocIn .4s cubic-bezier(0.32,0.72,0,1) both" }}>
                <span className="w-9 shrink-0 pt-px font-semibold tabular-nums text-espresso/70">{e.time}</span>
                <span className={`shrink-0 rounded px-1 text-[9.5px] font-bold ring-1 ${SYS_TONE[e.sys]}`}>{e.sys}</span>
                <span className="min-w-0">{e.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
