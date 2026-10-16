import { useEffect, useState } from "react";
import { Icon } from "./ui.jsx";

// Demo — смарт-процесс «Закупка». Агроном завёл заявку, снабженец собрал три КП.
// Предложения сравниваются не «на глаз» в почте, а в карточке: цена с доставкой, срок,
// отсрочка, надёжность по прошлым поставкам. «Утвердить выбор» двигает стадию и по шагам
// запускает цепочку автодействий: протокол → договор юристу → счёт в реестр → план приёмки.

const STAGES = ["Заявка", "Сбор КП", "Выбор поставщика", "Договор и оплата", "Поставка", "Приёмка"];
const QTY = 120; // т

const OFFERS = [
  { id: "a", name: "ООО «АгроХимСнаб»", price: 31900, delivery: 0, days: 7, defer: 30, rating: 4.7, past: 23 },
  { id: "b", name: "ООО «Поле-Ресурс»", price: 30600, delivery: 1900, days: 12, defer: 0, rating: 4.1, past: 9 },
  { id: "c", name: "ООО «ХимТорг-Юг»", price: 32400, delivery: 0, days: 4, defer: 45, rating: 4.9, past: 31 },
];

const landed = (o) => o.price + o.delivery; // цена за тонну с доставкой до склада
const AVG_T = OFFERS.reduce((s, o) => s + landed(o), 0) / OFFERS.length;
const AVG_SUM = Math.round(AVG_T * QTY);
const BEST_PRICE = OFFERS.reduce((b, o) => (landed(o) < landed(b) ? o : b)).id;
const FASTEST = OFFERS.reduce((b, o) => (o.days < b.days ? o : b)).id;

const fmt = (n) => Math.round(n).toLocaleString("ru-RU");
const signed = (n) => (n > 0 ? "+" : n < 0 ? "−" : "") + fmt(Math.abs(n));
const one = (n) => n.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function actionsFor(o) {
  const sum = landed(o) * QTY;
  return [
    { icon: Icon.doc, t: "Протокол выбора сформирован", d: `3 КП сравнены, выбран ${o.name} — PDF в карточке закупки` },
    { icon: Icon.user, t: "Договор отправлен на согласование юристу", d: "Задача Е. Литвиновой · срок — 1 рабочий день" },
    { icon: Icon.coins, t: "Счёт поставлен в реестр платежей", d: `${fmt(sum)} ₽ · ${o.defer ? `отсрочка ${o.defer} дн.` : "предоплата 100%"}` },
    { icon: Icon.box, t: "Поставка добавлена в план приёмки склада", d: `${QTY} т · склад «Заречный» · ожидается через ${o.days} дн.` },
  ];
}

export default function Procurement() {
  const [chosen, setChosen] = useState(null);
  const [approved, setApproved] = useState(false);
  const [shown, setShown] = useState(0); // сколько автодействий уже выполнено

  const offer = OFFERS.find((o) => o.id === chosen) || null;
  const stage = approved ? 3 : 2;
  const actions = offer ? actionsFor(offer) : [];

  // цепочка автодействий: каждое следующее появляется с задержкой
  useEffect(() => {
    if (!approved || shown >= 4) return;
    const t = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 500 : 850);
    return () => clearTimeout(t);
  }, [approved, shown]);

  function approve() {
    if (!offer) return;
    setApproved(true);
    setShown(0);
  }
  function restart() {
    setApproved(false);
    setShown(0);
    setChosen(null);
  }

  const sum = offer ? landed(offer) * QTY : 0;
  const diff = sum - AVG_SUM;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/10 text-ember ring-1 ring-ember/20">
            <Icon.box className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-espresso">Закупка удобрений</p>
            <p className="text-[10px] text-umber">Смарт-процесс «Закупка» · № З-0147</p>
          </div>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full bg-ember/10 px-2.5 py-1 text-[10px] font-semibold text-ember ring-1 ring-ember/20 sm:inline-flex">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ember" /> {STAGES[stage]}
        </span>
      </div>

      <div className="space-y-2.5 p-5">
        {/* рельса стадий */}
        <ol className="grid grid-cols-6">
          {STAGES.map((s, i) => {
            const isDone = i < stage;
            const isCur = i === stage;
            return (
              <li key={s} className="relative flex flex-col items-center text-center">
                {i < STAGES.length - 1 && (
                  <span className={`absolute left-1/2 top-[11px] h-px w-full transition-colors duration-500 ${isDone ? "bg-sage/60" : "bg-espresso/10"}`} />
                )}
                <span
                  className={`relative z-10 flex h-[22px] w-[22px] items-center justify-center rounded-full text-[10px] font-semibold ring-1 transition-all duration-500 ease-spring ${
                    isDone ? "bg-sage text-white ring-sage" : isCur ? "bg-ember text-white ring-ember" : "bg-white text-umber/60 ring-espresso/10"
                  }`}
                >
                  {isDone ? <Icon.check className="h-3.5 w-3.5 stroke-current fill-none" /> : i + 1}
                </span>
                <span
                  className={`mt-1.5 whitespace-nowrap text-[10px] leading-tight ${isCur ? "font-semibold text-espresso" : isDone ? "hidden font-medium text-espresso/75 sm:block" : "hidden text-umber/60 sm:block"}`}
                >
                  {s}
                </span>
              </li>
            );
          })}
        </ol>

        {/* заявка */}
        <div className="flex items-center gap-3 rounded-xl bg-white/50 px-3 py-2 ring-1 ring-espresso/[0.06]">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-[#8a6418] ring-1 ring-gold/25">
            <Icon.drop className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[12.5px] font-semibold text-espresso">Аммиачная селитра, 120 т, к 15 марта</p>
            <p className="truncate text-[10.5px] text-umber">Инициатор — И. Сафонов, агроном · под весеннюю подкормку озимых</p>
          </div>
        </div>

        {!approved ? (
          <>
            <div>
              <div className="mb-2.5 flex items-baseline justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-umber">Коммерческие предложения · 3</p>
                <p className="text-[10.5px] text-umber">
                  среднее <span className="font-semibold tabular-nums text-espresso">{fmt(AVG_T)} ₽/т</span> с доставкой
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2.5 pt-1 sm:grid-cols-3">
                {OFFERS.map((o) => (
                  <OfferCard key={o.id} o={o} sel={chosen === o.id} onPick={() => setChosen(o.id)} />
                ))}
              </div>
            </div>

            {/* итог */}
            <div className="flex flex-col gap-3 rounded-xl bg-espresso/[0.03] px-3.5 py-2.5 ring-1 ring-espresso/[0.06] sm:flex-row sm:items-center">
              {offer ? (
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-umber">Сумма закупки</p>
                  <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="font-display text-[18px] font-semibold tabular-nums text-espresso">{fmt(sum)} ₽</span>
                    <span className={`text-[11px] font-semibold tabular-nums ${diff < 0 ? "text-[#3c6b32]" : diff > 0 ? "text-red-700" : "text-umber"}`}>
                      {signed(diff)} ₽ к среднему ({diff < 0 ? "−" : "+"}{one(Math.abs((diff / AVG_SUM) * 100))}%)
                    </span>
                    {offer.id === BEST_PRICE && <Badge tone="sage">лучшая цена</Badge>}
                    {offer.id === FASTEST && <Badge tone="ember">быстрее всех</Badge>}
                  </p>
                </div>
              ) : (
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-umber">Среднее по трём КП</p>
                  <p className="mt-0.5 text-[12px] text-umber">
                    <span className="font-display text-[18px] font-semibold tabular-nums text-espresso">{fmt(AVG_SUM)} ₽</span> · выберите поставщика
                  </p>
                </div>
              )}
              <button
                onClick={approve}
                disabled={!offer}
                className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-ember px-4 py-2.5 text-sm font-semibold text-cream transition-all duration-300 ease-spring active:scale-[0.98] enabled:hover:brightness-105 disabled:opacity-40"
              >
                <Icon.check className="h-4 w-4 stroke-current fill-none" /> Утвердить выбор
              </button>
            </div>
          </>
        ) : (
          <>
            {/* утверждённый выбор */}
            <div className="flex flex-col gap-3 rounded-xl bg-sage/10 px-3.5 py-2.5 ring-1 ring-sage/25 sm:flex-row sm:items-center">
              <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage text-white sm:flex">
                <Icon.check className="h-4 w-4 stroke-current fill-none" />
              </span>
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-[12.5px] font-semibold text-espresso">Выбор утверждён: {offer.name}</p>
                <p className="mt-0.5 text-[11px] tabular-nums text-umber">
                  {fmt(sum)} ₽ · {signed(diff)} ₽ к среднему · поставка {offer.days} дн.
                </p>
              </div>
              <button
                onClick={restart}
                className="shrink-0 rounded-full bg-espresso px-4 py-2 text-[13px] font-semibold text-cream transition-all duration-300 ease-spring active:scale-[0.98] hover:bg-bark"
              >
                Пройти заново
              </button>
            </div>

            {/* цепочка автодействий */}
            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-umber">Автодействия Битрикс24</p>
                <p className="text-[10.5px] tabular-nums text-umber">выполнено {shown} из 4</p>
              </div>
              <ul className="space-y-1.5">
                {actions.map((a, i) => {
                  if (i > shown) return null;
                  const isDone = i < shown;
                  const A = a.icon;
                  return (
                    <li
                      key={a.t}
                      className={`animate-floatUp flex items-center gap-2.5 rounded-xl px-3 py-1.5 ring-1 transition-all duration-500 ease-spring ${
                        isDone ? "bg-white/50 ring-espresso/[0.06]" : "bg-espresso/[0.02] ring-espresso/[0.05]"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ring-1 ${
                          isDone ? "bg-sage/10 text-[#3c6b32] ring-sage/25" : "bg-ember/10 text-ember ring-ember/20"
                        }`}
                      >
                        <A className="h-3.5 w-3.5 stroke-current fill-none" />
                      </span>
                      <div className="min-w-0 flex-1 leading-tight">
                        <p className={`truncate text-[12px] font-semibold ${isDone ? "text-espresso" : "text-umber"}`}>{a.t}</p>
                        <p className="truncate text-[10.5px] text-umber">{isDone ? a.d : "выполняется…"}</p>
                      </div>
                      {isDone ? (
                        <Icon.check className="h-4 w-4 shrink-0 stroke-current fill-none text-sage" />
                      ) : (
                        <span className="pulse-dot h-2 w-2 shrink-0 rounded-full bg-ember" />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function OfferCard({ o, sel, onPick }) {
  const best = o.id === BEST_PRICE;
  const fast = o.id === FASTEST;
  return (
    <button
      onClick={onPick}
      className={`relative flex flex-col rounded-xl px-3 pb-2.5 pt-3 text-left ring-1 transition-all duration-300 ease-spring active:scale-[0.99] ${
        sel ? "bg-ember/[0.06] ring-ember/40" : "bg-white/50 ring-espresso/[0.06] hover:bg-white/70"
      }`}
    >
      {(best || fast) && (
        <span className="absolute -top-2 left-3 flex gap-1">
          {best && <Badge tone="sage" solid>лучшая цена</Badge>}
          {fast && <Badge tone="ember" solid>быстрее всех</Badge>}
        </span>
      )}
      <div className="flex items-start justify-between gap-2">
        <p className="text-[12px] font-semibold leading-tight text-espresso">{o.name}</p>
        <span
          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ring-1 transition-all duration-300 ${
            sel ? "bg-ember text-white ring-ember" : "bg-white ring-espresso/15"
          }`}
        >
          {sel && <Icon.check className="h-3 w-3 stroke-current fill-none" />}
        </span>
      </div>

      <p className="mt-2 font-display text-[19px] font-semibold leading-none tabular-nums text-espresso">
        {fmt(o.price)} <span className="text-[11px] font-medium text-umber">₽/т</span>
      </p>
      <p className="mt-1 text-[10.5px] text-umber">
        {o.delivery ? (
          <>
            + доставка {fmt(o.delivery)} → <span className="font-semibold tabular-nums text-espresso/80">{fmt(landed(o))}</span>
          </>
        ) : (
          "доставка включена"
        )}
      </p>

      <dl className="mt-2 space-y-1 text-[11px]">
        <div className="flex justify-between gap-2">
          <dt className="text-umber">Срок поставки</dt>
          <dd className={`font-semibold tabular-nums ${fast ? "text-ember" : "text-espresso"}`}>{o.days} дн.</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-umber">Отсрочка</dt>
          <dd className={`font-semibold tabular-nums ${o.defer ? "text-espresso" : "text-[#8a6418]"}`}>{o.defer ? `${o.defer} дн.` : "предоплата"}</dd>
        </div>
      </dl>

      <div className="mt-2">
        <div className="flex items-baseline justify-between text-[10.5px]">
          <span className="text-umber">Надёжность · {o.past} пост.</span>
          <span className="font-semibold tabular-nums text-espresso">{one(o.rating)}</span>
        </div>
        <div className="mt-1 h-1 overflow-hidden rounded-full bg-espresso/[0.07]">
          <div className={`h-full rounded-full ${o.rating >= 4.5 ? "bg-sage" : "bg-gold"}`} style={{ width: `${(o.rating / 5) * 100}%` }} />
        </div>
      </div>
    </button>
  );
}

function Badge({ tone, solid, children }) {
  const tones = solid
    ? { sage: "bg-sage text-white ring-sage", ember: "bg-ember text-white ring-ember" }
    : { sage: "bg-sage/10 text-[#3c6b32] ring-sage/25", ember: "bg-ember/10 text-ember ring-ember/20" };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide ring-1 ${tones[tone]}`}>
      {children}
    </span>
  );
}
