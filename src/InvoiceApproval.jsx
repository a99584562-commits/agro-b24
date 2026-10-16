import { useMemo, useState } from "react";
import { Icon } from "./ui.jsx";

// Демо — согласование счёта на оплату. Маршрут строится сам: от суммы
// и остатка бюджета по статье. Двигайте сумму, меняйте статью — цепочка
// согласующих перестраивается. Потом проходите её кнопками.

const ARTICLES = [
  { id: "parts", name: "Запчасти и ремонт", limit: 1200000, spent: 760000 },
  { id: "chem", name: "Удобрения и СЗР", limit: 9000000, spent: 5400000 },
  { id: "log", name: "Логистика", limit: 800000, spent: 690000 },
];

const rub = (n) => n.toLocaleString("ru-RU") + " ₽";

function buildRoute(sum, art) {
  const left = art.limit - art.spent;
  const over = sum > left;
  const r = [{ role: "Руководитель подразделения", who: "С. Михайлов", why: "всегда" }];
  if (sum > 100000 || over) r.push({ role: "Финансовый директор", who: "Е. Белова", why: over ? "превышение лимита статьи" : "сумма больше 100 000 ₽" });
  if (sum > 1000000) r.push({ role: "Генеральный директор", who: "В. Корнеев", why: "сумма больше 1 млн ₽" });
  r.push({ role: "Бухгалтерия", who: "Н. Котова", why: "оплата и выгрузка в 1С", pay: true });
  return { r, over, left };
}

export default function InvoiceApproval() {
  const [sum, setSum] = useState(184000);
  const [ai, setAi] = useState(0);
  const [step, setStep] = useState(0);
  const [rejected, setRejected] = useState(false);
  const art = ARTICLES[ai];
  const { r: route, over, left } = useMemo(() => buildRoute(sum, art), [sum, art]);
  const done = step >= route.length;

  function reset() {
    setStep(0);
    setRejected(false);
  }
  const usedPct = Math.min(100, (art.spent / art.limit) * 100);
  const addPct = Math.min(100 - usedPct, (sum / art.limit) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/12 text-ember ring-1 ring-ember/20">
            <Icon.coins className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-espresso">Счёт № 2291 · ООО «ТехАгроСервис»</p>
            <p className="text-[10px] text-umber">Бизнес-процесс согласования · маршрут по сумме и бюджету</p>
          </div>
        </div>
        <span className="hidden rounded-full bg-sage/12 px-2.5 py-1 text-[10px] font-semibold text-[#3c6b32] ring-1 ring-sage/25 sm:inline">PDF счёта во вложении</span>
      </div>

      <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-[1fr_1.05fr]">
        {/* params */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-umber">Статья бюджета</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ARTICLES.map((a, i) => (
              <button
                key={a.id}
                onClick={() => {
                  setAi(i);
                  reset();
                }}
                className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ring-1 transition-all duration-300 ease-spring ${
                  i === ai ? "bg-espresso text-cream ring-espresso" : "bg-white/50 text-umber ring-espresso/10 hover:bg-white/80"
                }`}
              >
                {a.name}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-umber">Сумма счёта</p>
            <p className="font-display text-xl font-semibold tabular-nums text-espresso">{rub(sum)}</p>
          </div>
          <input
            data-noswipe
            type="range"
            min={20000}
            max={2500000}
            step={1000}
            value={sum}
            onChange={(e) => {
              setSum(Number(e.target.value));
              reset();
            }}
            className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-espresso/10 accent-[#2F8F4E]"
          />
          <div className="mt-1 flex justify-between text-[10px] text-umber/70">
            <span>20 тыс</span>
            <span>100 тыс</span>
            <span>1 млн</span>
            <span>2,5 млн</span>
          </div>

          <div className="mt-4 rounded-2xl bg-white/50 p-3.5 ring-1 ring-espresso/[0.06]">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-semibold text-espresso">Лимит статьи на месяц</span>
              <span className="tabular-nums text-umber">{rub(art.limit)}</span>
            </div>
            <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-espresso/[0.06]">
              <div className="h-full bg-umber/40" style={{ width: `${usedPct}%` }} />
              <div className={`h-full transition-all duration-500 ease-spring ${over ? "bg-red-500/70" : "bg-ember"}`} style={{ width: `${Math.max(addPct, 1.5)}%` }} />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] text-umber">
              <span>Потрачено {rub(art.spent)}</span>
              <span className={over ? "font-semibold text-red-700" : "text-[#3c6b32]"}>{over ? `Не хватает ${rub(sum - left)}` : `Остаток ${rub(left - sum)}`}</span>
            </div>
          </div>
        </div>

        {/* route */}
        <div className="flex flex-col">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-umber">Маршрут — собран автоматически</p>
          <ol className="space-y-1.5">
            {route.map((s, i) => {
              const isDone = i < step;
              const isCur = i === step && !rejected;
              return (
                <li
                  key={s.role}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 ring-1 transition-all duration-300 ease-spring ${
                    isCur ? "bg-ember/[0.07] ring-ember/35" : isDone ? "bg-sage/[0.08] ring-sage/25" : "bg-white/45 ring-espresso/[0.06]"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                      isDone ? "bg-sage text-white" : isCur ? "bg-ember text-white" : "bg-espresso/[0.06] text-umber/60"
                    }`}
                  >
                    {isDone ? <Icon.check className="h-4 w-4 stroke-current fill-none" /> : i + 1}
                  </span>
                  <div className="min-w-0 leading-tight">
                    <p className="truncate text-[13px] font-semibold text-espresso">{s.role}</p>
                    <p className="truncate text-[11px] text-umber">
                      {s.who} · {s.why}
                    </p>
                  </div>
                  {isCur && <span className="ml-auto shrink-0 rounded-full bg-ember/12 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-ember">ждёт</span>}
                </li>
              );
            })}
          </ol>

          <div className="mt-3">
            {rejected ? (
              <div className="rounded-2xl bg-gold/10 p-3.5 ring-1 ring-gold/25">
                <p className="text-[13px] font-semibold text-espresso">Возвращено инициатору</p>
                <p className="mt-0.5 text-[12px] text-umber">«Нужно сравнение с ещё одним поставщиком» — задача инициатору, срок 1 день.</p>
                <button onClick={reset} className="mt-2.5 rounded-full bg-espresso px-4 py-1.5 text-[12px] font-semibold text-cream transition-all active:scale-[0.98] hover:bg-bark">
                  Отправить повторно
                </button>
              </div>
            ) : done ? (
              <div className="rounded-2xl bg-sage/10 p-3.5 ring-1 ring-sage/25">
                <p className="flex items-center gap-2 text-[13px] font-semibold text-espresso">
                  <Icon.check className="h-4 w-4 stroke-current fill-none text-sage" /> Счёт оплачен
                </p>
                <p className="mt-0.5 text-[12px] text-umber">Платёж в реестре, выгружен в 1С. Остаток по статье обновлён.</p>
                <button onClick={reset} className="mt-2.5 rounded-full bg-espresso px-4 py-1.5 text-[12px] font-semibold text-cream transition-all active:scale-[0.98] hover:bg-bark">
                  Пройти заново
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ember px-4 py-2.5 text-sm font-semibold text-cream transition-all duration-300 ease-spring active:scale-[0.98] hover:brightness-105"
                >
                  <Icon.check className="h-4 w-4 stroke-current fill-none" /> {route[step].pay ? "Оплатить" : "Согласовать"}
                </button>
                <button
                  onClick={() => setRejected(true)}
                  className="rounded-full bg-espresso/[0.05] px-4 py-2.5 text-sm font-medium text-umber ring-1 ring-espresso/10 transition-all duration-300 ease-spring hover:bg-espresso/10"
                >
                  Вернуть
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
