import { useState } from "react";
import { Icon } from "./ui.jsx";

// Demo — бизнес-процесс с человеческим визуалом. Клиент активно гоняет БП в Б24,
// но штатные серые формы неудобны: непонятно, на ком застряло и что делать.
// Здесь тот же процесс — но наглядно: рельса этапов, активная задача с кнопками,
// ответственный, SLA и живая лента. Кликаешь «Согласовать» — процесс идёт дальше.

const STAGES = [
  { role: "Менеджер", who: "А. Петров", title: "Заявка на отгрузку", desc: "Пшеница «Дарья», 24 т · КФХ «Восход»", sla: "—", act: "Создано" },
  { role: "Склад", who: "И. Сидоров", title: "Проверка остатка партии", desc: "Подтвердить наличие лота и зарезервировать тоннаж", sla: "2 ч", act: "Согласовать" },
  { role: "РОП", who: "М. Орлова", title: "Согласование цены", desc: "Цена 28 000 ₽/т, скидка 3% — подтвердить условия", sla: "4 ч", act: "Согласовать" },
  { role: "Бухгалтерия", who: "Н. Котова", title: "Счёт и спецификация", desc: "Сформировать счёт и закрывающие документы", sla: "1 д", act: "Выставить счёт" },
  { role: "Логистика", who: "Готово", title: "Готово к отгрузке", desc: "Назначить машину и дату — партия согласована", sla: "—", act: "" },
];

export default function BizProcess() {
  const [step, setStep] = useState(1); // индекс активного этапа; раньше — выполнено
  const [feed, setFeed] = useState([{ who: "А. Петров", t: "создал заявку на отгрузку" }]);
  const done = step >= STAGES.length - 1;
  const cur = STAGES[step];

  function approve() {
    if (done) return;
    setFeed((f) => [{ who: cur.who, t: `согласовал «${cur.title}»` }, ...f]);
    setStep((s) => Math.min(STAGES.length - 1, s + 1));
  }
  function back() {
    if (step <= 1) return;
    setStep((s) => s - 1);
    setFeed((f) => [{ who: STAGES[step].who, t: `вернул на доработку` }, ...f]);
  }
  function restart() {
    setStep(1);
    setFeed([{ who: "А. Петров", t: "создал заявку на отгрузку" }]);
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/12 text-ember ring-1 ring-ember/20">
            <Icon.flow className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-espresso">Согласование отгрузки</p>
            <p className="text-[10px] text-umber">Бизнес-процесс · наглядный режим</p>
          </div>
        </div>
        <span className="hidden rounded-full bg-sage/12 px-2.5 py-1 text-[10px] font-semibold text-[#3c6b32] ring-1 ring-sage/25 sm:inline">встройка вместо штатной формы</span>
      </div>

      <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-[1fr_1fr]">
        {/* rail */}
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-umber">Этапы процесса</p>
          <ol className="space-y-0">
            {STAGES.map((s, idx) => {
              const isDone = idx < step;
              const isCur = idx === step;
              return (
                <li key={s.title} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ring-1 transition-all duration-300 ${
                        isDone ? "bg-sage text-white ring-sage" : isCur ? "bg-ember text-white ring-ember" : "bg-espresso/[0.04] text-umber/50 ring-espresso/10"
                      }`}
                    >
                      {isDone ? <Icon.check className="h-4 w-4 stroke-current fill-none" /> : idx + 1}
                    </span>
                    {idx < STAGES.length - 1 && <span className={`my-0.5 h-6 w-px ${isDone ? "bg-sage/50" : "bg-espresso/10"}`} />}
                  </div>
                  <div className="-mt-0.5 pb-1.5">
                    <p className={`text-[13px] ${isDone || isCur ? "font-semibold text-espresso" : "font-medium text-umber/70"}`}>
                      {s.title}
                      {isCur && !done && <span className="ml-2 rounded-full bg-ember/12 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-ember">сейчас</span>}
                    </p>
                    <p className="text-[11px] text-umber/80">{s.role} · {s.who}{s.sla !== "—" && ` · SLA ${s.sla}`}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* active task / action */}
        <div className="flex flex-col">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-umber">{done ? "Результат" : "Текущая задача"}</p>

          {!done ? (
            <div className="rounded-2xl bg-espresso/[0.02] p-4 ring-1 ring-espresso/[0.06]">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ember/12 text-ember ring-1 ring-ember/20">
                  <Icon.user className="h-[18px] w-[18px] stroke-current fill-none" />
                </span>
                <div className="leading-tight">
                  <p className="text-[13px] font-semibold text-espresso">{cur.who}</p>
                  <p className="text-[11px] text-umber">{cur.role}</p>
                </div>
                <span className="ml-auto flex items-center gap-1 rounded-full bg-gold/12 px-2 py-1 text-[10px] font-semibold text-gold ring-1 ring-gold/25">
                  <Icon.clock className="h-3.5 w-3.5 stroke-current fill-none" /> SLA {cur.sla}
                </span>
              </div>
              <h4 className="mt-3 font-display text-base font-semibold text-espresso">{cur.title}</h4>
              <p className="mt-1 text-[13px] leading-snug text-umber">{cur.desc}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={approve} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ember px-4 py-2.5 text-sm font-semibold text-cream transition-all duration-300 ease-spring active:scale-[0.98] hover:brightness-105">
                  <Icon.check className="h-4 w-4 stroke-current fill-none" /> {cur.act}
                </button>
                <button onClick={back} disabled={step <= 1} className="rounded-full bg-espresso/[0.05] px-4 py-2.5 text-sm font-medium text-umber ring-1 ring-espresso/10 transition-all duration-300 ease-spring enabled:hover:bg-espresso/10 disabled:opacity-40">
                  Вернуть
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-sage/10 p-5 text-center ring-1 ring-sage/25">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage text-white">
                <Icon.check className="h-6 w-6 stroke-current fill-none" />
              </span>
              <h4 className="mt-3 font-display text-lg font-semibold text-espresso">Партия согласована</h4>
              <p className="mt-1 text-[13px] text-umber">Все этапы пройдены — заявка ушла в отгрузку.</p>
              <button onClick={restart} className="mt-4 rounded-full bg-espresso px-5 py-2 text-sm font-semibold text-cream transition-all active:scale-[0.98] hover:bg-bark">Пройти заново</button>
            </div>
          )}

          {/* live feed */}
          <div className="mt-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-umber">Лента</p>
            <ul className="thin-scroll max-h-[7.5rem] space-y-1.5 overflow-y-auto pr-1">
              {feed.map((e, i) => (
                <li key={i} className="flex items-center gap-2 text-[12px] text-umber">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember/60" />
                  <span className="font-semibold text-espresso/80">{e.who}</span> {e.t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
