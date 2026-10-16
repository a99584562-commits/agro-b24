import { useState } from "react";
import { Icon } from "./ui.jsx";

// Демо — несколько воронок продаж в одном портале. Выбираешь воронку и стадию —
// справа видно, что система делает сама: роботы, обязательные поля, задачи и сроки.

const FUNNELS = [
  {
    id: "new",
    name: "Новые клиенты",
    who: "Хантеры · отдел продаж",
    note: "После первой отгрузки клиент сам переходит в воронку «Повторные продажи».",
    stages: [
      {
        t: "Новый запрос", n: 18,
        robots: ["Заявка с сайта, звонка или мессенджера сразу становится сделкой — с источником", "Распределение по региону и очереди менеджеров", "Проверка дубля по ИНН и телефону"],
        fields: ["Источник", "Регион", "Телефон"], task: "Связаться с клиентом", sla: "15 мин",
      },
      {
        t: "Квалификация", n: 12,
        robots: ["Реквизиты подтягиваются по ИНН автоматически", "Нет звонка за сутки — напоминание менеджеру и РОПу"],
        fields: ["ИНН", "Площадь посевов", "Культуры"], task: "Выявить потребность на сезон", sla: "1 день",
      },
      {
        t: "Расчёт и КП", n: 9,
        robots: ["Калькулятор потребности прямо в карточке сделки", "КП по шаблону уходит клиенту в PDF", "КП без ответа 3 дня — задача перезвонить"],
        fields: ["Культура", "Объём, т", "Цена"], task: "Обсудить КП с клиентом", sla: "3 дня",
      },
      {
        t: "Согласование", n: 5,
        robots: ["Скидка больше 5% — бизнес-процесс согласования у РОПа", "Проверка лимита дебиторки клиента из 1С"],
        fields: ["Скидка", "Отсрочка", "Условия оплаты"], task: "Получить согласование условий", sla: "4 ч",
      },
      {
        t: "Договор", n: 4,
        robots: ["Договор и спецификация собираются из полей сделки", "Маршрут: юрист → бухгалтерия → директор", "Подписание с клиентом онлайн"],
        fields: ["Номер договора", "Дата", "Спецификация"], task: "Подписать договор", sla: "2 дня",
      },
      {
        t: "Оплата", n: 6,
        robots: ["Счёт выгружается в 1С", "Оплата пришла в 1С — стадия сменилась сама"],
        fields: ["Счёт", "Сумма оплаты"], task: "Контроль поступления", sla: "по договору",
      },
      {
        t: "Отгрузка", n: 3,
        robots: ["Заявка на рейс логисту", "Клиенту уходит ссылка на трекер отгрузки", "После отгрузки — перевод в «Повторные продажи»"],
        fields: ["Склад", "Дата отгрузки", "Рейс"], task: "Отгрузить партию", sla: "по графику",
      },
    ],
  },
  {
    id: "repeat",
    name: "Повторные продажи",
    who: "Менеджеры по работе с базой",
    note: "Сделки появляются сами — по истории закупок клиента, к началу сезона.",
    stages: [
      {
        t: "План сезона", n: 64,
        robots: ["За 60 дней до посевной сделка создаётся автоматически по прошлым закупкам", "В сделку подставляется прошлогодний заказ"],
        fields: ["Сезон", "Прошлый объём", "Культуры"], task: "Проверить план клиента", sla: "5 дней",
      },
      {
        t: "Напоминание", n: 22,
        robots: ["Клиенту уходит сообщение в мессенджер", "Менеджеру — задача позвонить"],
        fields: ["Канал связи", "Ответ клиента"], task: "Созвониться с клиентом", sla: "2 дня",
      },
      {
        t: "Предложение", n: 15,
        robots: ["«Повторить прошлый заказ» — КП в один клик", "Подбор замены, если позиции нет в наличии"],
        fields: ["Объём", "Цена", "Скидка за объём"], task: "Согласовать заказ", sla: "3 дня",
      },
      {
        t: "Заказ", n: 9,
        robots: ["Резерв на складе через 1С", "Счёт клиенту в мессенджер и на почту"],
        fields: ["Склад", "Резерв"], task: "Подтвердить резерв", sla: "1 день",
      },
      {
        t: "Отгрузка", n: 7,
        robots: ["Заявка на рейс", "Трекер для клиента"],
        fields: ["Дата", "Рейс"], task: "Отгрузить", sla: "по графику",
      },
      {
        t: "Обратная связь", n: 4,
        robots: ["Опрос в мессенджере после отгрузки", "Низкая оценка — задача руководителю"],
        fields: ["Оценка", "Комментарий"], task: "Разобрать отзыв", sla: "1 день",
      },
    ],
  },
  {
    id: "tender",
    name: "Тендеры",
    who: "Тендерный отдел",
    note: "Тендеры с площадок попадают в воронку сами; дедлайны не теряются.",
    stages: [
      {
        t: "Найден тендер", n: 11,
        robots: ["Тендеры с площадок попадают в воронку по ключевым словам", "Дубли по номеру извещения отсекаются"],
        fields: ["Номер извещения", "Площадка", "НМЦ"], task: "Оценить участие", sla: "1 день",
      },
      {
        t: "Анализ", n: 6,
        robots: ["Чек-лист требований к участнику", "Расчёт маржи от НМЦ"],
        fields: ["Маржа", "Риски"], task: "Решение «участвуем / нет»", sla: "2 дня",
      },
      {
        t: "Подготовка заявки", n: 4,
        robots: ["Заявка на оплату обеспечения уходит в финансы", "Напоминания за 3 дня и за 1 день до дедлайна"],
        fields: ["Обеспечение", "Дедлайн"], task: "Собрать документы", sla: "до дедлайна",
      },
      {
        t: "Подана", n: 3,
        robots: ["Контроль даты подведения итогов"],
        fields: ["Дата итогов"], task: "Ждать итогов", sla: "—",
      },
      {
        t: "Контракт", n: 2,
        robots: ["Контракт регистрируется в реестре договоров", "График поставок → план отгрузок"],
        fields: ["Номер контракта", "График"], task: "Подписать контракт", sla: "по 44-ФЗ / 223-ФЗ",
      },
    ],
  },
  {
    id: "service",
    name: "Услуги",
    who: "Сушка · подработка · протравливание · доставка",
    note: "Мощности и техника бронируются из сделки — без пересечений.",
    stages: [
      {
        t: "Заявка", n: 9,
        robots: ["Заявка с сайта или по телефону", "Подбор свободной мощности на нужные даты"],
        fields: ["Услуга", "Объём, т", "Даты"], task: "Подтвердить заявку", sla: "2 ч",
      },
      {
        t: "Бронь мощности", n: 5,
        robots: ["Бронь в календаре техники и сушилок", "Конфликт по датам — предупреждение"],
        fields: ["Мощность", "Смена"], task: "Согласовать график", sla: "1 день",
      },
      {
        t: "Выполнение", n: 4,
        robots: ["Сменный отчёт: сколько тонн принято и выдано", "Весовые данные в карточку"],
        fields: ["Принято, т", "Выдано, т", "Влажность"], task: "Выполнить услугу", sla: "по графику",
      },
      {
        t: "Акт и счёт", n: 3,
        robots: ["Акт по шаблону из фактических объёмов", "Счёт в 1С"],
        fields: ["Акт", "Счёт"], task: "Подписать акт", sla: "2 дня",
      },
      {
        t: "Оплата", n: 2,
        robots: ["Оплата из 1С закрывает сделку", "Нет оплаты в срок — в дебиторку"],
        fields: ["Оплачено"], task: "Контроль оплаты", sla: "по договору",
      },
    ],
  },
];

const ACCENTS = ["#9AA7B0", "#2FC6F6", "#7E57C2", "#F4A52F", "#26A69A", "#4FB36B", "#3D6CB0"];

export default function Funnels() {
  const [fi, setFi] = useState(0);
  const [si, setSi] = useState(0);
  const f = FUNNELS[fi];
  const st = f.stages[Math.min(si, f.stages.length - 1)];
  const total = f.stages.reduce((a, s) => a + s.n, 0);

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-espresso/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/12 text-ember ring-1 ring-ember/20">
            <Icon.funnel className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-espresso">CRM · Воронки сделок</p>
            <p className="text-[10px] text-umber">{FUNNELS.length} воронки в одном портале · у каждой свои стадии и роботы</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FUNNELS.map((x, i) => (
            <button
              key={x.id}
              onClick={() => {
                setFi(i);
                setSi(0);
              }}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ring-1 transition-all duration-300 ease-spring ${
                i === fi ? "bg-espresso text-cream ring-espresso" : "bg-white/50 text-umber ring-espresso/10 hover:bg-white/80"
              }`}
            >
              {x.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        {/* stage rail */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-umber">
            {f.who} · <span className="tabular-nums">{total}</span> сделок в работе
          </p>
          <p className="hidden text-[11px] text-umber/70 md:block">нажмите на стадию</p>
        </div>
        <div className="thin-scroll mt-2.5 flex gap-1.5 overflow-x-auto pb-1" data-noswipe>
          {f.stages.map((s, i) => {
            const on = i === si;
            return (
              <button
                key={s.t}
                onClick={() => setSi(i)}
                className={`group relative min-w-[7.5rem] flex-1 rounded-xl px-3 py-2.5 text-left ring-1 transition-all duration-300 ease-spring ${
                  on ? "bg-white ring-ember/40 shadow-[0_10px_24px_-16px_rgba(21,41,28,0.5)]" : "bg-white/45 ring-espresso/[0.06] hover:bg-white/75"
                }`}
              >
                <span className="block h-1 rounded-full" style={{ background: ACCENTS[i % ACCENTS.length], opacity: on ? 1 : 0.55 }} />
                <span className={`mt-2 block truncate text-[12.5px] font-semibold ${on ? "text-espresso" : "text-espresso/75"}`}>{s.t}</span>
                <span className="text-[11px] tabular-nums text-umber">{s.n} сделок</span>
              </button>
            );
          })}
        </div>

        {/* stage detail */}
        <div key={`${f.id}-${si}`} className="mt-4 grid animate-floatUp grid-cols-1 gap-4 [animation-duration:0.5s] md:grid-cols-[1.25fr_1fr]">
          <div className="rounded-2xl bg-white/50 p-4 ring-1 ring-espresso/[0.06]">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-umber">Что система делает сама на стадии «{st.t}»</p>
            <ul className="mt-3 space-y-2">
              {st.robots.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-[13px] leading-snug text-espresso/90">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-ember/12 text-ember ring-1 ring-ember/20">
                    <Icon.spark className="h-3 w-3 stroke-current fill-none" />
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl bg-white/50 p-4 ring-1 ring-espresso/[0.06]">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-umber">Обязательные поля</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {st.fields.map((x) => (
                  <span key={x} className="rounded-lg bg-espresso/[0.05] px-2.5 py-1 text-[12px] font-medium text-espresso ring-1 ring-espresso/[0.06]">
                    {x}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-umber/80">Без них сделку не перевести дальше</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/50 p-4 ring-1 ring-espresso/[0.06]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/12 text-[#8a6418] ring-1 ring-gold/25">
                <Icon.clock className="h-[18px] w-[18px] stroke-current fill-none" />
              </span>
              <div className="min-w-0 leading-tight">
                <p className="text-[13px] font-semibold text-espresso">{st.task}</p>
                <p className="text-[11px] text-umber">Задача ставится автоматически · срок {st.sla}</p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-3 flex items-center gap-2 text-[12px] text-umber">
          <Icon.repeat className="h-4 w-4 shrink-0 stroke-current fill-none text-ember" /> {f.note}
        </p>
      </div>
    </div>
  );
}
