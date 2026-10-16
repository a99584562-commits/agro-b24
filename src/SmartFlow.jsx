import { useState } from "react";
import { Icon } from "./ui.jsx";

// Демо — смарт-процесс в связке с бизнес-процессами. Элемент идёт по стадиям,
// на каждой срабатывают роботы и БП: задачи, согласования, документы, 1С
// и связанные элементы других смарт-процессов. Всё пишется в журнал.

const KIND = {
  robot: { l: "Робот", c: "bg-ember/12 text-ember ring-ember/20" },
  bp: { l: "БП", c: "bg-[#7E57C2]/12 text-[#5b3a9c] ring-[#7E57C2]/25" },
  link: { l: "Связь", c: "bg-[#2FC6F6]/15 text-[#14799b] ring-[#2FC6F6]/30" },
  doc: { l: "Документ", c: "bg-gold/12 text-[#8a6418] ring-gold/25" },
  onec: { l: "1С", c: "bg-[#E8A33D]/15 text-[#94600f] ring-[#E8A33D]/30" },
};

const PROCESSES = [
  {
    id: "repair",
    name: "Ремонт техники",
    item: "Комбайн № 7 · течь гидравлики",
    icon: Icon.crane,
    stages: [
      { t: "Заявка", who: "Механик", sla: "—", ev: [["robot", "Механик создал заявку с фото из мобильного приложения"]] },
      {
        t: "Диагностика", who: "Главный инженер", sla: "1 день",
        ev: [["robot", "Задача главному инженеру: провести диагностику"], ["robot", "Комбайн помечен «в ремонте» и снят с календаря техники"]],
      },
      {
        t: "Согласование затрат", who: "Финансовый директор", sla: "4 ч",
        ev: [["bp", "БП «Согласование затрат»: 184 000 ₽ — больше лимита, маршрут: инженер → финдиректор"], ["link", "Создан связанный элемент «Закупка» № 312 — запчасти"]],
        link: "Закупка № 312",
      },
      {
        t: "Ремонт", who: "Механик", sla: "3 дня",
        ev: [["robot", "Запчасти приняты на склад — механику задача начать ремонт"], ["robot", "Запущен счётчик простоя техники"]],
      },
      {
        t: "Готово", who: "—", sla: "—",
        ev: [["doc", "Акт выполненных работ сформирован по шаблону"], ["robot", "Комбайн снова доступен в календаре техники"], ["onec", "Затраты на ремонт выгружены в 1С на карточку ОС"]],
        link: "Акт № 88",
      },
    ],
  },
  {
    id: "intake",
    name: "Приёмка зерна",
    item: "Пшеница 3 кл. · 24,6 т · КФХ «Луговое»",
    icon: Icon.box,
    stages: [
      { t: "Заявка на поставку", who: "Менеджер", sla: "—", ev: [["link", "Элемент создан из сделки закупки зерна у хозяйства"]] },
      {
        t: "Пропуск и весовая", who: "Весовщик", sla: "30 мин",
        ev: [["robot", "Водителю ушёл пропуск в мессенджер"], ["robot", "Брутто 38,9 т, тара 14,3 т — нетто 24,6 т записано в карточку"]],
      },
      {
        t: "Лаборатория", who: "Лаборант", sla: "1 ч",
        ev: [["robot", "Влажность 15,8 %, сорность 1,1 % — выше нормы по влажности"], ["bp", "БП «Отклонение по качеству»: скидка за сушку — согласует коммерческий директор"]],
      },
      {
        t: "Размещение", who: "Кладовщик", sla: "2 ч",
        ev: [["link", "Создан элемент «Сушка» — партия ушла в очередь сушилки"], ["robot", "Силос № 4: остаток пересчитан"]],
        link: "Сушка № 57",
      },
      {
        t: "Документы", who: "Бухгалтерия", sla: "1 день",
        ev: [["doc", "Акт приёмки и реестр взвешиваний сформированы"], ["onec", "Поступление проведено в 1С, хозяйству выставлен расчёт"]],
        link: "Акт приёмки № 1204",
      },
    ],
  },
  {
    id: "trip",
    name: "Командировка",
    item: "Агроном · объезд хозяйств, 3 дня",
    icon: Icon.route,
    stages: [
      { t: "Заявка", who: "Агроном", sla: "—", ev: [["robot", "Маршрут собран из встреч с хозяйствами в CRM"]] },
      {
        t: "Согласование", who: "Руководитель", sla: "1 день",
        ev: [["bp", "БП «Командировка»: руководитель → бухгалтерия"], ["robot", "Согласовано — приказ на командировку сформирован"]],
        link: "Приказ № 46-к",
      },
      {
        t: "Аванс", who: "Бухгалтерия", sla: "1 день",
        ev: [["onec", "Аванс 18 000 ₽ выдан — проведено в 1С"]],
      },
      {
        t: "В поездке", who: "Агроном", sla: "3 дня",
        ev: [["robot", "Итоги визитов из мобильного попали в карточки клиентов"], ["link", "Из визита создана сделка: КФХ «Ковыль», семена рапса"]],
        link: "Сделка: КФХ «Ковыль»",
      },
      {
        t: "Авансовый отчёт", who: "Бухгалтерия", sla: "3 дня",
        ev: [["doc", "Авансовый отчёт с фото чеков приложен"], ["bp", "Бухгалтер проверил — процесс закрыт"]],
      },
    ],
  },
];

function initLog(p) {
  return p.stages[0].ev.map(([k, t], i) => ({ id: `0-${i}`, k, t, st: p.stages[0].t }));
}

export default function SmartFlow() {
  const [pi, setPi] = useState(0);
  const [step, setStep] = useState(0);
  const p = PROCESSES[pi];
  const [log, setLog] = useState(() => initLog(PROCESSES[0]));
  const done = step >= p.stages.length - 1;
  const cur = p.stages[step];
  const links = p.stages.slice(0, step + 1).filter((s) => s.link).map((s) => s.link);

  function pick(i) {
    setPi(i);
    setStep(0);
    setLog(initLog(PROCESSES[i]));
  }
  function next() {
    if (done) return;
    const n = step + 1;
    const s = p.stages[n];
    setStep(n);
    setLog((l) => [...s.ev.map(([k, t], i) => ({ id: `${n}-${i}`, k, t, st: s.t })).reverse(), ...l]);
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-espresso/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/12 text-ember ring-1 ring-ember/20">
            <Icon.layers className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-espresso">Смарт-процесс + бизнес-процессы</p>
            <p className="text-[10px] text-umber">Стадии, роботы, согласования и связи — в одном элементе</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PROCESSES.map((x, i) => (
            <button
              key={x.id}
              onClick={() => pick(i)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ring-1 transition-all duration-300 ease-spring ${
                i === pi ? "bg-espresso text-cream ring-espresso" : "bg-white/50 text-umber ring-espresso/10 hover:bg-white/80"
              }`}
            >
              {x.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-[1.3fr_1fr]">
        <div className="min-w-0">
          {/* stage rail */}
          <div className="flex items-center">
            {p.stages.map((s, i) => {
              const isDone = i < step;
              const isCur = i === step;
              return (
                <div key={s.t} className="flex min-w-0 flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold ring-1 transition-all duration-500 ease-spring ${
                        isDone ? "bg-sage text-white ring-sage" : isCur ? "bg-ember text-white ring-ember scale-110" : "bg-white/60 text-umber/60 ring-espresso/10"
                      }`}
                    >
                      {isDone ? <Icon.check className="h-4 w-4 stroke-current fill-none" /> : i + 1}
                    </span>
                  </div>
                  {i < p.stages.length - 1 && (
                    <span className="mx-1 h-[2px] flex-1 rounded-full bg-espresso/10">
                      <span className={`block h-full rounded-full bg-sage transition-all duration-700 ease-spring ${isDone ? "w-full" : "w-0"}`} />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex">
            {p.stages.map((s, i) => (
              <span key={s.t} className={`flex-1 pr-1 text-[10.5px] leading-tight last:flex-none last:text-right ${i === step ? "font-semibold text-espresso" : "text-umber/75"}`}>
                {s.t}
              </span>
            ))}
          </div>

          {/* item card */}
          <div className="mt-4 rounded-2xl bg-white/55 p-4 ring-1 ring-espresso/[0.06]">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ember/12 text-ember ring-1 ring-ember/20">
                <p.icon className="h-5 w-5 stroke-current fill-none" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-umber">{p.name}</p>
                <p className="truncate font-display text-[15px] font-semibold text-espresso">{p.item}</p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                  <span className="rounded-full bg-ember/10 px-2 py-0.5 font-semibold text-ember ring-1 ring-ember/20">Стадия: {cur.t}</span>
                  <span className="rounded-full bg-espresso/[0.05] px-2 py-0.5 text-umber ring-1 ring-espresso/10">Ответственный: {cur.who}</span>
                  {cur.sla !== "—" && <span className="rounded-full bg-gold/12 px-2 py-0.5 text-[#8a6418] ring-1 ring-gold/25">Срок {cur.sla}</span>}
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              {!done ? (
                <button
                  onClick={next}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ember px-4 py-2.5 text-sm font-semibold text-cream transition-all duration-300 ease-spring active:scale-[0.98] hover:brightness-105"
                >
                  Перевести на «{p.stages[step + 1].t}»
                  <Icon.arrow className="h-4 w-4 stroke-current fill-none" />
                </button>
              ) : (
                <div className="flex flex-1 items-center justify-center gap-2 rounded-full bg-sage/15 px-4 py-2.5 text-sm font-semibold text-[#3c6b32] ring-1 ring-sage/30">
                  <Icon.check className="h-4 w-4 stroke-current fill-none" /> Процесс завершён
                </div>
              )}
              <button
                onClick={() => pick(pi)}
                className="rounded-full bg-espresso/[0.05] px-4 py-2.5 text-sm font-medium text-umber ring-1 ring-espresso/10 transition-all duration-300 ease-spring hover:bg-espresso/10"
              >
                Сначала
              </button>
            </div>
          </div>

          {/* links */}
          <div className="mt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-umber">Связанные элементы</p>
            <div className="mt-1.5 flex min-h-[1.75rem] flex-wrap gap-1.5">
              {links.length === 0 && <span className="text-[12px] text-umber/60">появятся по ходу процесса</span>}
              {links.map((l) => (
                <span key={l} className="inline-flex animate-floatUp items-center gap-1.5 rounded-lg bg-[#2FC6F6]/12 px-2.5 py-1 text-[12px] font-medium text-[#14799b] ring-1 ring-[#2FC6F6]/30 [animation-duration:0.5s]">
                  <Icon.flow className="h-3.5 w-3.5 stroke-current fill-none" /> {l}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* automation log */}
        <div className="flex min-w-0 flex-col">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-umber">Журнал автоматизаций</p>
          <ul className="thin-scroll max-h-[17rem] space-y-2 overflow-y-auto pr-1">
            {log.map((e) => (
              <li key={`${p.id}-${e.id}`} className="animate-floatUp rounded-xl bg-white/50 px-3 py-2 ring-1 ring-espresso/[0.05] [animation-duration:0.5s]">
                <div className="flex items-center gap-2">
                  <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${KIND[e.k].c}`}>{KIND[e.k].l}</span>
                  <span className="truncate text-[10.5px] text-umber/80">стадия «{e.st}»</span>
                </div>
                <p className="mt-1 text-[12.5px] leading-snug text-espresso/90">{e.t}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
