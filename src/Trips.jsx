import { useState } from "react";
import { Icon } from "./ui.jsx";

// Demo — логистика: заявки на перевозку и рейсы, привязанные к сделкам. Слева реестр рейсов
// со статусами, справа карточка: таймлайн с отметками времени, водитель и авто, ставка,
// чек-лист возврата документов. Для рейса «Ищем машину» — ставки перевозчиков: выбрал —
// рейс назначен. Закрыть рейс можно только когда вернулись все документы.

const STATUSES = [
  { name: "Ищем машину", chip: "bg-gold/10 text-[#8a6418] ring-gold/25" },
  { name: "Назначен", chip: "bg-espresso/[0.05] text-espresso/80 ring-espresso/10" },
  { name: "Погрузка", chip: "bg-ember/10 text-ember ring-ember/20" },
  { name: "В пути", chip: "bg-ember/15 text-[#1f6b39] ring-ember/30", live: true },
  { name: "Выгрузка", chip: "bg-ember/10 text-ember ring-ember/20" },
  { name: "Документы вернулись", chip: "bg-sage/10 text-[#3c6b32] ring-sage/25" },
];
const DOCS = ["ТТН", "УПД", "Доверенность", "Весовой акт"];
const DONE = STATUSES.length - 1;
const UNLOAD = 4;

// что Б24 делает сам на каждом статусе
const AUTO = [
  (t) => `Заявка разослана перевозчикам из базы · откликов: ${t.bids.length}`,
  (t) => `Водителю ушла заявка, данные авто — в сделке №${t.deal}`,
  (t) => `Склад получил задание на отгрузку ${tons(t.t)} т`,
  () => "Клиенту ушло уведомление: груз в пути",
  () => "Ждём оригиналы документов от водителя",
  (t) => `Рейс закрыт, документы приложены к сделке №${t.deal}`,
];

const TRIPS = [
  {
    id: "Р-1041", from: "Склад Заречный", to: "Элеватор Южный", cargo: "Пшеница 3 кл.", t: 25, deal: 2318, st: 3,
    carrier: "ТК «Магистраль-Агро»", driver: "В. Голубев", car: "Зерновоз · А***ВС 18", rate: 38500,
    times: ["14.10 09:20", "14.10 11:05", "15.10 07:40", "15.10 10:15"], docs: [false, false, false, false],
  },
  {
    id: "Р-1042", from: "Элеватор Южный", to: "КХП «Северный»", cargo: "Ячмень", t: 30, deal: 2321, st: 2,
    carrier: "ООО «ТрансЗерно»", driver: "Д. Никитин", car: "Зерновоз · К***ОР 18", rate: 42000,
    times: ["15.10 13:30", "15.10 16:10", "16.10 08:05"], docs: [false, false, false, false],
  },
  {
    id: "Р-1043", from: "Склад Заречный", to: "КФХ «Рассвет»", cargo: "Семена подсолнечника", t: 6, deal: 2330, st: 0,
    carrier: null, driver: null, car: null, rate: null,
    times: ["16.10 08:50"], docs: [false, false, false, false],
    bids: [
      { carrier: "ИП Ветров", price: 14800, rating: 4.8, when: "завтра 08:00", driver: "С. Ветров", car: "Тент 10 т · М***АН 18" },
      { carrier: "ТК «Магистраль-Агро»", price: 13200, rating: 4.3, when: "завтра 14:00", driver: "Р. Сабиров", car: "Тент 20 т · Е***КХ 18" },
      { carrier: "ООО «ТрансЗерно»", price: 16500, rating: 4.9, when: "сегодня 17:30", driver: "А. Ложкин", car: "Тент 10 т · В***ТР 18" },
    ],
  },
  {
    id: "Р-1044", from: "Склад СЗР «Центральный»", to: "Агрофирма «Колос»", cargo: "СЗР, гербициды", t: 4.5, deal: 2327, st: 1,
    carrier: "ИП Шумилов", driver: "Е. Шумилов", car: "Тент 10 т · Т***МУ 18", rate: 16200,
    times: ["15.10 15:45", "16.10 09:10"], docs: [false, false, false, false],
  },
  {
    id: "Р-1045", from: "Элеватор Южный", to: "Мелькомбинат «Заволжский»", cargo: "Пшеница 4 кл.", t: 28, deal: 2309, st: 4,
    carrier: "ТК «Магистраль-Агро»", driver: "И. Корепанов", car: "Зерновоз · Н***ЕС 18", rate: 46800,
    times: ["13.10 10:00", "13.10 12:20", "14.10 06:50", "14.10 09:30", "15.10 14:40"], docs: [true, false, true, false],
  },
  {
    id: "Р-1046", from: "Склад Заречный", to: "СХП «Нива-Юг»", cargo: "Аммиачная селитра", t: 20, deal: 2325, st: 3,
    carrier: "ООО «ТрансЗерно»", driver: "П. Баранов", car: "Самосвал · О***РА 18", rate: 31000,
    times: ["15.10 08:15", "15.10 09:40", "16.10 06:30", "16.10 08:55"], docs: [false, false, false, false],
  },
  {
    id: "Р-1047", from: "Элеватор Северный", to: "Склад Заречный", cargo: "Кукуруза", t: 32, deal: 2297, st: 5,
    carrier: "ИП Ветров", driver: "С. Ветров", car: "Зерновоз · М***АН 18", rate: 44500,
    times: ["10.10 09:00", "10.10 10:30", "11.10 07:15", "11.10 08:40", "11.10 15:05", "14.10 11:20"], docs: [true, true, true, true],
  },
];

const initTrips = () => TRIPS.map((t) => ({ ...t, times: [...t.times], docs: [...t.docs] }));

const fmt = (n) => Math.round(n).toLocaleString("ru-RU");
const tons = (n) => n.toLocaleString("ru-RU");
const one = (n) => n.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function plural(n, forms) {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
}

// «текущее время» демо: каждое действие сдвигает часы вперёд
function stamp(n) {
  const m = 10 * 60 + 40 + n * 17;
  return `16.10 ${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

export default function Trips() {
  const [trips, setTrips] = useState(initTrips);
  const [sel, setSel] = useState("Р-1041");
  const [tick, setTick] = useState(0);

  const trip = trips.find((t) => t.id === sel);
  const moving = trips.filter((t) => t.st === 3);
  const movingT = moving.reduce((s, t) => s + t.t, 0);
  const missing = trips.filter((t) => t.st === UNLOAD).reduce((s, t) => s + t.docs.filter((d) => !d).length, 0);

  function update(id, fn) {
    setTrips((ts) => ts.map((t) => (t.id === id ? fn(t) : t)));
  }
  function pickBid(b) {
    const now = stamp(tick);
    update(trip.id, (t) => ({ ...t, st: 1, carrier: b.carrier, driver: b.driver, car: b.car, rate: b.price, times: [...t.times, now] }));
    setTick((k) => k + 1);
  }
  function nextStatus() {
    if (trip.st === 0 || trip.st >= DONE) return;
    if (trip.st === UNLOAD && trip.docs.some((d) => !d)) return;
    const now = stamp(tick);
    update(trip.id, (t) => ({ ...t, st: t.st + 1, times: [...t.times, now] }));
    setTick((k) => k + 1);
  }
  function toggleDoc(i) {
    if (trip.st !== UNLOAD) return;
    update(trip.id, (t) => ({ ...t, docs: t.docs.map((d, j) => (j === i ? !d : d)) }));
  }
  function reset() {
    setTrips(initTrips());
    setSel("Р-1041");
    setTick(0);
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 border-b border-espresso/10 px-5 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ember/10 text-ember ring-1 ring-ember/20">
            <Icon.truck className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="text-[13px] font-semibold text-espresso">Рейсы и перевозки</p>
            <p className="truncate text-[10px] text-umber">Заявки на перевозку · статусы · привязка к сделкам</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Stat className="hidden md:inline-flex" value={`${moving.length} ${plural(moving.length, ["рейс", "рейса", "рейсов"])} · ${tons(movingT)} т`} label="в пути" live />
          <Stat className="hidden md:inline-flex" value={missing} label={`${plural(missing, ["документ", "документа", "документов"])} не вернулись`} warn={missing > 0} />
          <button
            onClick={reset}
            title="Сбросить демо"
            aria-label="Сбросить демо"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-espresso/[0.05] text-umber ring-1 ring-espresso/10 transition-all duration-300 ease-spring hover:bg-espresso/10 active:scale-95"
          >
            <Icon.repeat className="h-3.5 w-3.5 stroke-current fill-none" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-[0.8fr_1.2fr]">
        {/* сводка на мобиле */}
        <p className="text-[11px] text-umber md:hidden">
          В пути: <b className="text-espresso">{moving.length}</b> · {tons(movingT)} т · не вернулось документов: <b className="text-espresso">{missing}</b>
        </p>

        {/* реестр рейсов */}
        <div className="min-w-0">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-umber">Рейсы · {trips.length}</p>
          <ul className="thin-scroll max-h-[18.5rem] space-y-1.5 overflow-y-auto pr-1">
            {trips.map((t) => {
              const active = t.id === sel;
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setSel(t.id)}
                    className={`w-full rounded-xl px-3 py-2 text-left ring-1 transition-all duration-300 ease-spring ${
                      active ? "bg-ember/[0.06] ring-ember/40" : "bg-white/50 ring-espresso/[0.06] hover:bg-white/70"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10.5px] text-umber">№ {t.id}</span>
                      <StatusChip st={t.st} />
                    </span>
                    <span className="mt-0.5 block truncate text-[12.5px] font-semibold text-espresso">
                      {t.from} → {t.to}
                    </span>
                    <span className="flex items-center justify-between gap-2 text-[10.5px] text-umber">
                      <span className="truncate">
                        {t.cargo}, {tons(t.t)} т · {t.carrier || "перевозчик не выбран"}
                      </span>
                      <span className="shrink-0 tabular-nums text-ember">сделка №{t.deal}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* карточка рейса */}
        <div className="min-w-0 rounded-2xl bg-espresso/[0.02] px-4 py-3.5 ring-1 ring-espresso/[0.06]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-umber">№ {trip.id}</span>
                <StatusChip st={trip.st} />
              </p>
              <h4 className="mt-1 font-display text-[15px] font-semibold leading-snug text-espresso">
                {trip.from} → {trip.to}
              </h4>
              <p className="text-[11.5px] text-umber">
                {trip.cargo} · {tons(trip.t)} т
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ember/10 px-2.5 py-1 text-[10.5px] font-semibold text-ember ring-1 ring-ember/20">
              <Icon.handshake className="h-3.5 w-3.5 stroke-current fill-none" /> сделка №{trip.deal}
            </span>
          </div>

          {trip.st === 0 ? (
            <Bids trip={trip} onPick={pickBid} />
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-[0.9fr_1.1fr]">
              {/* таймлайн */}
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-umber">Статусы</p>
                <ol>
                  {STATUSES.map((s, i) => {
                    const isDone = i < trip.st || (i === DONE && trip.st === DONE);
                    const isCur = i === trip.st && trip.st !== DONE;
                    return (
                      <li key={s.name} className="flex items-start gap-2.5">
                        <div className="flex flex-col items-center">
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full ring-1 transition-all duration-500 ease-spring ${
                              isDone ? "bg-sage text-white ring-sage" : isCur ? "bg-ember text-white ring-ember" : "bg-white text-umber/50 ring-espresso/10"
                            }`}
                          >
                            {isDone ? (
                              <Icon.check className="h-3 w-3 stroke-current fill-none" />
                            ) : isCur ? (
                              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-white" />
                            ) : null}
                          </span>
                          {i < DONE && <span className={`h-2 w-px ${i < trip.st ? "bg-sage/50" : "bg-espresso/10"}`} />}
                        </div>
                        <div className="-mt-px flex min-w-0 flex-1 items-baseline justify-between gap-2">
                          <span className={`truncate text-[12px] ${isDone || isCur ? "font-semibold text-espresso" : "text-umber/60"}`}>{s.name}</span>
                          <span className="shrink-0 font-mono text-[10px] tabular-nums text-umber">{trip.times[i] || "—"}</span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
                <p className="mt-2 flex items-start gap-1.5 text-[10.5px] leading-snug text-umber">
                  <Icon.bell className="mt-px h-3.5 w-3.5 shrink-0 stroke-current fill-none text-ember" /> {AUTO[trip.st](trip)}
                </p>
              </div>

              {/* водитель, ставка, документы */}
              <div className="flex min-w-0 flex-col">
                <dl className="space-y-1 text-[11.5px]">
                  <Kv k="Перевозчик" v={trip.carrier} />
                  <Kv k="Водитель" v={trip.driver} />
                  <Kv k="Авто" v={trip.car} />
                  <Kv k="Ставка" v={`${fmt(trip.rate)} ₽ · ${fmt(trip.rate / trip.t)} ₽/т`} />
                </dl>

                <p className="mb-1.5 mt-3 flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-wide text-umber">
                  Документы
                  <span className="text-[10px] font-medium normal-case tracking-normal text-umber/80">
                    {trip.st < UNLOAD ? "отмечаются после выгрузки" : `вернулись ${trip.docs.filter(Boolean).length} из ${DOCS.length}`}
                  </span>
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {DOCS.map((d, i) => {
                    const on = trip.docs[i];
                    const can = trip.st === UNLOAD;
                    return (
                      <button
                        key={d}
                        onClick={() => toggleDoc(i)}
                        disabled={!can}
                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11.5px] ring-1 transition-all duration-300 ease-spring ${
                          on ? "bg-sage/10 text-espresso ring-sage/30" : "bg-white/50 text-umber ring-espresso/[0.08]"
                        } ${can ? "hover:bg-white/80 active:scale-[0.98]" : "cursor-default opacity-60"}`}
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ring-1 transition-all duration-300 ${
                            on ? "bg-sage text-white ring-sage" : "bg-white ring-espresso/20"
                          }`}
                        >
                          {on && <Icon.check className="h-3 w-3 stroke-current fill-none" />}
                        </span>
                        <span className="truncate">{d}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-auto pt-3">
                  <NextButton trip={trip} onNext={nextStatus} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Bids({ trip, onPick }) {
  const cheapest = Math.min(...trip.bids.map((b) => b.price));
  const bestRating = Math.max(...trip.bids.map((b) => b.rating));
  return (
    <div className="mt-3">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-umber">Ставки перевозчиков · {trip.bids.length}</p>
        <p className="text-[10.5px] text-umber">заявка создана {trip.times[0]}</p>
      </div>
      <ul className="space-y-1.5">
        {trip.bids.map((b, i) => (
          <li
            key={b.carrier}
            className="animate-floatUp flex items-center gap-3 rounded-xl bg-white/50 px-3 py-2 ring-1 ring-espresso/[0.06]"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="min-w-0 flex-1 leading-tight">
              <p className="flex flex-wrap items-center gap-1.5 text-[12.5px] font-semibold text-espresso">
                {b.carrier}
                {b.price === cheapest && <Tag>дешевле всех</Tag>}
                {b.rating === bestRating && <Tag>надёжнее</Tag>}
                {b.when.startsWith("сегодня") && <Tag>подача сегодня</Tag>}
              </p>
              <p className="mt-0.5 truncate text-[10.5px] text-umber">
                ★ {one(b.rating)} · подача {b.when} · {b.car}
              </p>
            </div>
            <div className="shrink-0 text-right leading-tight">
              <p className="font-display text-[15px] font-semibold tabular-nums text-espresso">{fmt(b.price)} ₽</p>
              <p className="text-[10px] tabular-nums text-umber">{fmt(b.price / trip.t)} ₽/т</p>
            </div>
            <button
              onClick={() => onPick(b)}
              className="shrink-0 rounded-full bg-ember px-3 py-1.5 text-[11.5px] font-semibold text-cream transition-all duration-300 ease-spring hover:brightness-105 active:scale-95"
            >
              Выбрать
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-2.5 flex items-start gap-1.5 text-[10.5px] leading-snug text-umber">
        <Icon.bell className="mt-px h-3.5 w-3.5 shrink-0 stroke-current fill-none text-ember" /> {AUTO[0](trip)}. Выбор назначает рейс и пишет водителя в сделку.
      </p>
    </div>
  );
}

function NextButton({ trip, onNext }) {
  if (trip.st === DONE) {
    return (
      <p className="flex items-center justify-center gap-2 rounded-full bg-sage/10 px-4 py-2 text-[12.5px] font-semibold text-[#3c6b32] ring-1 ring-sage/25">
        <Icon.check className="h-4 w-4 stroke-current fill-none" /> Рейс закрыт
      </p>
    );
  }
  const waitDocs = trip.st === UNLOAD && trip.docs.some((d) => !d);
  const label =
    trip.st === UNLOAD
      ? waitDocs
        ? `Ждём документы · ${trip.docs.filter(Boolean).length} из ${DOCS.length}`
        : "Документы вернулись — закрыть рейс"
      : `Следующий статус: ${STATUSES[trip.st + 1].name}`;
  return (
    <button
      onClick={onNext}
      disabled={waitDocs}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-ember px-4 py-2.5 text-[13px] font-semibold text-cream transition-all duration-300 ease-spring active:scale-[0.98] enabled:hover:brightness-105 disabled:bg-espresso/10 disabled:text-umber"
    >
      {waitDocs ? <Icon.clock className="h-4 w-4 stroke-current fill-none" /> : <Icon.arrow className="h-4 w-4 stroke-current fill-none" />}
      <span className="truncate">{label}</span>
    </button>
  );
}

function StatusChip({ st }) {
  const s = STATUSES[st];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 transition-colors duration-300 ${s.chip}`}>
      {s.live && <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ember" />}
      {s.name}
    </span>
  );
}

function Stat({ value, label, live, warn, className = "" }) {
  return (
    <span
      className={`items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] ring-1 ${
        warn ? "bg-gold/10 text-[#8a6418] ring-gold/25" : "bg-espresso/[0.04] text-umber ring-espresso/10"
      } ${className}`}
    >
      {live && <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ember" />}
      <b className="font-semibold tabular-nums text-espresso">{value}</b> {label}
    </span>
  );
}

function Kv({ k, v }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="shrink-0 text-umber">{k}</dt>
      <dd className="truncate text-right font-semibold tabular-nums text-espresso">{v}</dd>
    </div>
  );
}

function Tag({ children }) {
  return <span className="rounded-full bg-sage/10 px-1.5 py-px text-[9px] font-semibold uppercase tracking-wide text-[#3c6b32] ring-1 ring-sage/25">{children}</span>;
}
