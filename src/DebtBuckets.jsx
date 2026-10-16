import { useState } from "react";
import { Icon } from "./ui.jsx";

// Demo — дебиторка хозяйств и взыскание. Остатки долгов и оплаты приходят из 1С,
// в Битрикс24 — корзины просрочки, этапы взыскания и задачи. «Следующий шаг» двигает
// этап и запускает действие (письмо, задача, претензия по шаблону), «Оплачено» —
// убирает хозяйство из долгов, KPI и корзины пересчитываются из данных.

const STAGES = ["Напоминание", "Звонок менеджера", "Претензия", "Передано юристу", "Иск", "Исполнительное производство"];
const STAGE_SHORT = ["Напоминание", "Звонок менеджера", "Претензия", "Передано юристу", "Иск", "Исп. производство"];

const STEP_MSG = [
  () => "Напоминание об оплате отправлено контакту хозяйства",
  (f) => `Создана задача ${f.mgr}: позвонить и согласовать дату оплаты`,
  () => "Претензия сформирована по шаблону и отправлена",
  () => "Создана задача юристу, документы по долгу приложены",
  () => "Исковое заявление подготовлено и подано в арбитражный суд",
  () => "Исполнительный лист передан приставам, контроль — у юриста",
];

// days > 0 — дней просрочки; days <= 0 — срок ещё не наступил (через |days| дн.)
// stage -1 — взыскание не начато (в графике оплаты)
const FARMS = [
  { id: 1, name: "СПК «Луч»", mgr: "И. Сафонов", debt: 5400000, days: 128, stage: 4 },
  { id: 2, name: "Агрофирма «Колос»", mgr: "И. Сафонов", debt: 3860000, days: 74, stage: 3 },
  { id: 3, name: "КФХ «Берёзовское»", mgr: "Е. Тарасова", debt: 678000, days: 47, stage: 2 },
  { id: 4, name: "СХП «Нива-Юг»", mgr: "Д. Кравец", debt: 2150000, days: 38, stage: 2 },
  { id: 5, name: "ООО «Агро-Заречье»", mgr: "Е. Тарасова", debt: 1720000, days: 22, stage: 1 },
  { id: 6, name: "СХП «Октябрьское»", mgr: "П. Зуев", debt: 2090000, days: 16, stage: 1 },
  { id: 7, name: "КФХ «Зелёный клин»", mgr: "М. Орлова", debt: 486000, days: 9, stage: 0 },
  { id: 8, name: "КФХ «Ясная поляна»", mgr: "П. Зуев", debt: 312000, days: 4, stage: 0 },
  { id: 9, name: "Агрофирма «Степная»", mgr: "Д. Кравец", debt: 3140000, days: -5, stage: -1 },
  { id: 10, name: "КФХ «Рассвет»", mgr: "М. Орлова", debt: 1240000, days: -12, stage: -1 },
  { id: 11, name: "СХП «Заветы»", mgr: "И. Сафонов", debt: 4380000, days: -21, stage: -1 },
];

// оплаты, уже пришедшие из 1С за последние 7 дней (до начала демо)
const WEEK_PAID = [
  { name: "КФХ «Восход»", sum: 860000 },
  { name: "Агрофирма «Заря»", sum: 1420000 },
];

const BUCKETS = [
  { id: "all", label: "Все", dot: null, test: () => true },
  { id: "ok", label: "В срок", dot: "#6FA85C", test: (d) => d <= 0 },
  { id: "b15", label: "1–15 дн", dot: "#C2922E", test: (d) => d >= 1 && d <= 15 },
  { id: "b30", label: "16–30", dot: "#A9761A", test: (d) => d >= 16 && d <= 30 },
  { id: "b60", label: "31–60", dot: "#C0563B", test: (d) => d >= 31 && d <= 60 },
  { id: "b60p", label: "60+", dot: "#B91C1C", test: (d) => d > 60 },
];

const fmt = (n) => Math.round(n).toLocaleString("ru-RU");
const mln = (n) => `${(n / 1e6).toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} млн`;
const sumBy = (arr, f) => arr.reduce((s, x) => s + f(x), 0);

function plural(n, forms) {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
}

function clock(n) {
  const m = 9 * 60 + 30 + n * 4;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

function overdueTone(d) {
  if (d <= 0) return "bg-sage/10 text-[#3c6b32] ring-sage/25";
  if (d <= 15) return "bg-gold/10 text-[#8a6418] ring-gold/25";
  if (d <= 30) return "bg-gold/20 text-[#7a5510] ring-gold/40";
  if (d <= 60) return "bg-[#C0563B]/10 text-[#C0563B] ring-[#C0563B]/25";
  return "bg-red-500/10 text-red-700 ring-red-500/20";
}

const initFeed = () => [
  {
    id: 2,
    time: clock(0),
    who: "1С",
    kind: "sync",
    t: `Синхронизация: ${FARMS.length} хозяйств с долгом, ${fmt(sumBy(FARMS, (f) => f.debt))} ₽`,
  },
  { id: 1, time: "вт 15:10", who: WEEK_PAID[1].name, kind: "paid", t: `Оплата ${fmt(WEEK_PAID[1].sum)} ₽ пришла из 1С — долг закрыт` },
  { id: 0, time: "пн 11:25", who: WEEK_PAID[0].name, kind: "paid", t: `Оплата ${fmt(WEEK_PAID[0].sum)} ₽ пришла из 1С — долг закрыт` },
];

export default function DebtBuckets() {
  const [rows, setRows] = useState(FARMS);
  const [paid, setPaid] = useState([]);
  const [filter, setFilter] = useState("all");
  const [feed, setFeed] = useState(initFeed);

  const total = sumBy(rows, (f) => f.debt);
  const overdueRows = rows.filter((f) => f.days > 0);
  const overdue = sumBy(overdueRows, (f) => f.debt);
  const collected = sumBy(WEEK_PAID, (p) => p.sum) + sumBy(paid, (p) => p.sum);
  const payCount = WEEK_PAID.length + paid.length;

  const bucket = BUCKETS.find((b) => b.id === filter);
  const visible = rows.filter((f) => bucket.test(f.days));

  function push(who, t, kind) {
    setFeed((f) => [{ id: f.length, time: clock(f.length), who, t, kind }, ...f]);
  }
  function nextStep(id) {
    const f = rows.find((x) => x.id === id);
    if (!f || f.stage >= STAGES.length - 1) return;
    const ns = f.stage + 1;
    setRows((rs) => rs.map((x) => (x.id === id ? { ...x, stage: ns } : x)));
    push(f.name, STEP_MSG[ns](f), "step");
  }
  function markPaid(id) {
    const f = rows.find((x) => x.id === id);
    if (!f) return;
    setRows((rs) => rs.filter((x) => x.id !== id));
    setPaid((p) => [...p, { name: f.name, sum: f.debt }]);
    push(f.name, `Оплата ${fmt(f.debt)} ₽ пришла из 1С — долг закрыт, взыскание остановлено`, "paid");
  }
  function reset() {
    setRows(FARMS);
    setPaid([]);
    setFilter("all");
    setFeed(initFeed());
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/10 text-ember ring-1 ring-ember/20">
            <Icon.coins className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-espresso">Дебиторка хозяйств</p>
            <p className="text-[10px] text-umber">Корзины просрочки · этапы взыскания · остатки и оплаты из 1С</p>
          </div>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full bg-sage/10 px-2.5 py-1 text-[10px] font-semibold text-[#3c6b32] ring-1 ring-sage/25 sm:inline-flex">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-sage" /> данные из 1С · обмен каждые 30 мин
        </span>
      </div>

      <div className="space-y-2.5 p-5">
        {/* KPI */}
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
          <Kpi label="Всего долг" sub={`${rows.length} ${plural(rows.length, ["хозяйство", "хозяйства", "хозяйств"])}`} value={`${fmt(total)} ₽`} />
          <Kpi label="Просрочено" sub={total ? `${Math.round((overdue / total) * 100)}% долга` : "—"} value={`${fmt(overdue)} ₽`} tone="bad" />
          <Kpi label="Хозяйств-должников" sub={`из ${rows.length} с долгом`} value={overdueRows.length} tone="gold" />
          <Kpi label="Собрано за неделю" sub={`${payCount} ${plural(payCount, ["оплата", "оплаты", "оплат"])}`} value={`${fmt(collected)} ₽`} tone="ok" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_16.5rem]">
          <div className="min-w-0">
            {/* корзины */}
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              {BUCKETS.map((b) => {
                const inB = rows.filter((f) => b.test(f.days));
                const active = filter === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => setFilter(b.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all duration-300 ease-spring ${
                      active ? "bg-espresso text-cream" : "bg-espresso/[0.05] text-umber ring-1 ring-espresso/10 hover:bg-espresso/10"
                    }`}
                  >
                    {b.dot && <span className="h-1.5 w-1.5 rounded-full" style={{ background: b.dot }} />}
                    {b.label}
                    <span className={`tabular-nums ${active ? "text-cream/70" : "text-umber/70"}`}>· {mln(sumBy(inB, (f) => f.debt))}</span>
                  </button>
                );
              })}
            </div>

            {/* таблица */}
            <div className="overflow-hidden rounded-2xl ring-1 ring-espresso/[0.08]">
              <div className="grid grid-cols-[1fr_auto] gap-2.5 bg-espresso/[0.03] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-umber md:grid-cols-[minmax(0,1.45fr)_minmax(0,0.85fr)_6.75rem_5.25rem_minmax(0,1.25fr)_auto]">
                <span>Хозяйство</span>
                <span className="hidden md:block">Менеджер</span>
                <span className="hidden text-right md:block">Долг, ₽</span>
                <span className="hidden md:block">Просрочка</span>
                <span className="hidden md:block">Этап взыскания</span>
                <span className="text-right md:w-[11.75rem]">Действия</span>
              </div>
              <div className="thin-scroll max-h-[12.5rem] overflow-y-auto">
                {visible.length === 0 && <p className="border-t border-espresso/[0.06] px-3 py-6 text-center text-[12px] text-umber">В этой корзине долгов нет</p>}
                {visible.map((f) => (
                  <div
                    key={f.id}
                    className="grid grid-cols-[1fr_auto] items-center gap-2.5 border-t border-espresso/[0.06] px-3 py-[7px] text-[12.5px] md:grid-cols-[minmax(0,1.45fr)_minmax(0,0.85fr)_6.75rem_5.25rem_minmax(0,1.25fr)_auto]"
                  >
                    <div className="min-w-0 leading-tight">
                      <p className="truncate font-semibold text-espresso">{f.name}</p>
                      <p className="truncate text-[10.5px] tabular-nums text-umber md:hidden">
                        {fmt(f.debt)} ₽ · {f.days > 0 ? `просрочка ${f.days} дн.` : "в срок"} · {f.stage >= 0 ? STAGE_SHORT[f.stage] : "в графике"}
                      </p>
                    </div>
                    <span className="hidden truncate text-umber md:block">{f.mgr}</span>
                    <span className="hidden text-right font-semibold tabular-nums text-espresso md:block">{fmt(f.debt)}</span>
                    <span className="hidden md:block">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-semibold tabular-nums ring-1 ${overdueTone(f.days)}`}>
                        {f.days > 0 ? `${f.days} дн.` : `через ${-f.days} дн.`}
                      </span>
                    </span>
                    <div className="hidden min-w-0 md:block">
                      <p className={`truncate text-[11.5px] ${f.stage >= 0 ? "font-medium text-espresso/85" : "text-umber/70"}`}>
                        {f.stage >= 0 ? STAGE_SHORT[f.stage] : "в графике оплаты"}
                      </p>
                      <div className="mt-1 flex gap-0.5">
                        {STAGES.map((s, i) => (
                          <span
                            key={s}
                            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                              i <= f.stage ? (f.stage >= 3 ? "bg-[#C0563B]" : "bg-ember") : "bg-espresso/[0.08]"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 md:w-[11.75rem]">
                      <button
                        onClick={() => nextStep(f.id)}
                        disabled={f.stage >= STAGES.length - 1}
                        title={f.stage >= STAGES.length - 1 ? "Последний этап взыскания" : `Дальше: ${STAGES[f.stage + 1]}`}
                        className="whitespace-nowrap rounded-full bg-espresso px-2.5 py-1 text-[10.5px] font-semibold text-cream transition-all duration-300 ease-spring enabled:hover:bg-bark enabled:active:scale-95 disabled:opacity-30"
                      >
                        <span className="md:hidden">Шаг →</span>
                        <span className="hidden md:inline">Следующий шаг</span>
                      </button>
                      <button
                        onClick={() => markPaid(f.id)}
                        className="whitespace-nowrap rounded-full bg-sage/10 px-2.5 py-1 text-[10.5px] font-semibold text-[#3c6b32] ring-1 ring-sage/25 transition-all duration-300 ease-spring hover:bg-sage/20 active:scale-95"
                      >
                        Оплачено
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* лента */}
          <div className="flex min-w-0 flex-col">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-umber">Лента взыскания</p>
              <button
                onClick={reset}
                className="flex items-center gap-1 rounded-full bg-espresso/[0.05] px-2.5 py-1 text-[10.5px] font-medium text-umber ring-1 ring-espresso/10 transition-all duration-300 ease-spring hover:bg-espresso/10"
              >
                <Icon.repeat className="h-3 w-3 stroke-current fill-none" /> Сбросить
              </button>
            </div>
            <ul className="thin-scroll max-h-[15rem] space-y-1.5 overflow-y-auto pr-1">
              {feed.map((e) => (
                <li key={e.id} className="animate-floatUp rounded-xl bg-white/50 px-2.5 py-1.5 ring-1 ring-espresso/[0.06]">
                  <p className="flex items-center gap-1.5 text-[10px] text-umber">
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${e.kind === "paid" ? "bg-sage" : e.kind === "sync" ? "bg-gold" : "bg-ember"}`} />
                    <span className="truncate font-semibold text-espresso/80">{e.who}</span>
                    <span className="ml-auto font-mono tabular-nums">{e.time}</span>
                  </p>
                  <p className="mt-0.5 text-[11.5px] leading-snug text-espresso/85">{e.t}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, sub, value, tone }) {
  const tones = { bad: "text-[#C0563B]", gold: "text-[#8a6418]", ok: "text-[#3c6b32]" };
  return (
    <div className="rounded-xl bg-white/50 px-3.5 py-1.5 ring-1 ring-espresso/[0.06]">
      <p className="flex items-baseline justify-between gap-2 text-[10px] leading-tight">
        <span className="truncate font-semibold uppercase tracking-wide text-umber">{label}</span>
        <span className="hidden shrink-0 text-umber/80 sm:inline">{sub}</span>
      </p>
      <p className={`font-display text-[18px] font-semibold tabular-nums transition-colors duration-300 ${tones[tone] || "text-espresso"}`}>{value}</p>
    </div>
  );
}
