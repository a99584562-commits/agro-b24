/* eslint-disable react-refresh/only-export-components */
import { Bezel, Eyebrow, Icon, IconCircle, PillButton, Reveal, Tilt } from "./ui.jsx";
import { useDeck } from "./deck.js";
import { CrmKanban } from "./B24.jsx";
import Funnels from "./Funnels.jsx";
import SmartFlow from "./SmartFlow.jsx";
import B24Launch from "./B24Launch.jsx";
import B24Smart from "./B24Smart.jsx";
import InvoiceApproval from "./InvoiceApproval.jsx";
import ContractRoute from "./ContractRoute.jsx";
import Procurement from "./Procurement.jsx";
import PlanCascade from "./PlanCascade.jsx";
import DebtBuckets from "./DebtBuckets.jsx";
import Trips from "./Trips.jsx";
import OneCSync from "./OneCSync.jsx";
import CallQuality from "./CallQuality.jsx";
import Omnichannel from "./Omnichannel.jsx";
import MailParser from "./MailParser.jsx";
import Shahmatka from "./Shahmatka.jsx";
import SeedCalc from "./SeedCalc.jsx";
import OrderTracker from "./OrderTracker.jsx";
import Dashboard from "./Dashboard.jsx";
import BizProcess from "./BizProcess.jsx";
import ClientMap from "./ClientMap.jsx";
import ServiceCalendar from "./ServiceCalendar.jsx";
import ShipmentPlan from "./ShipmentPlan.jsx";
import ClientPortal from "./ClientPortal.jsx";
import SeasonReminders from "./SeasonReminders.jsx";
import ContractsRegistry from "./ContractsRegistry.jsx";

/* ═══════════════════════════ LAYOUT PRIMITIVES ═══════════════════════════ */

// Каждый слайд занимает экран целиком; если контент выше экрана — слайд прокручивается.
function Frame({ children, className = "" }) {
  return (
    <div className={`mx-auto flex min-h-full w-full max-w-[80rem] flex-1 flex-col justify-center px-5 pb-20 pt-16 md:px-12 ${className}`}>
      {children}
    </div>
  );
}

function Title({ eyebrow, children, lead, className = "" }) {
  return (
    <div className={`max-w-4xl ${className}`}>
      <Reveal i={0}>{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}</Reveal>
      <Reveal i={1}>
        <h2 className="mt-4 font-display text-[2rem] font-semibold leading-[1.06] tracking-tight text-espresso md:text-[2.8rem]">{children}</h2>
      </Reveal>
      {lead && (
        <Reveal i={2}>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-umber md:text-lg">{lead}</p>
        </Reveal>
      )}
    </div>
  );
}

function LiveBadge({ n }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-ember/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ember ring-1 ring-ember/20">
      <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ember" /> Живое демо{n ? ` · ${n}` : ""}
    </span>
  );
}

function CaseLine({ children }) {
  return (
    <div className="mt-5 flex items-start gap-3 rounded-2xl bg-white/45 px-4 py-3 ring-1 ring-white/70 backdrop-blur-md">
      <span className="mt-0.5 shrink-0 rounded-md bg-gold/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#8a6418] ring-1 ring-gold/25">Кейс</span>
      <p className="text-[13px] leading-snug text-espresso/85">{children}</p>
    </div>
  );
}

/* ─────────────── section divider with contents ─────────────── */
function SectionMark({ no, label, lead, items }) {
  return (
    <div className="relative flex min-h-full w-full flex-col overflow-hidden">
      <div className="drift-a pointer-events-none absolute -right-32 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-ember/[0.08] blur-3xl" />
      <Frame>
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Reveal i={0}>
              <span className="text-aurora block font-display text-[8rem] font-bold leading-[0.85] tracking-tight md:text-[13rem]">{no}</span>
            </Reveal>
            <Reveal i={1}>
              <h2 className="mt-3 font-display text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-espresso md:text-[4.2rem]">{label}</h2>
            </Reveal>
            {lead && (
              <Reveal i={2}>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-umber md:text-lg">{lead}</p>
              </Reveal>
            )}
          </div>
          {items && (
            <Reveal i={3}>
              <div className="glass-soft rounded-[1.75rem] p-5 md:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-umber">В этом разделе</p>
                <ul className="mt-3 space-y-2">
                  {items.map((t, k) => (
                    <li key={t} className="flex items-center gap-3 text-[15px] text-espresso">
                      <span className="w-6 shrink-0 font-display text-sm font-semibold tabular-nums text-ember">{String(k + 1).padStart(2, "0")}</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </div>
      </Frame>
    </div>
  );
}

/* ─────────────── live demo slide (narrow / wide) ─────────────── */
function DemoSlide({ eyebrow, title, lead, points, format, wide, caseText, children }) {
  if (wide) {
    return (
      <Frame className="md:pt-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-4xl">
            <Reveal i={0}>
              <div className="flex flex-wrap items-center gap-2">
                <LiveBadge />
                {eyebrow && <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-umber">{eyebrow}</span>}
              </div>
            </Reveal>
            <Reveal i={1}>
              <h2 className="mt-3 font-display text-[1.7rem] font-semibold leading-[1.05] tracking-tight text-espresso md:text-[2.3rem]">{title}</h2>
            </Reveal>
            <Reveal i={2}>
              <p className="mt-2 text-[14.5px] leading-relaxed text-umber">{lead}</p>
            </Reveal>
          </div>
          {format && (
            <Reveal i={2}>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/50 px-3 py-1.5 text-xs font-medium text-umber ring-1 ring-espresso/10 backdrop-blur-md">
                <Icon.spark className="h-3.5 w-3.5 stroke-current fill-none text-ember" /> {format}
              </span>
            </Reveal>
          )}
        </div>
        <Reveal i={3} className="mt-5">
          <Bezel inner="overflow-hidden">{children}</Bezel>
        </Reveal>
        {caseText && (
          <Reveal i={4}>
            <CaseLine>{caseText}</CaseLine>
          </Reveal>
        )}
      </Frame>
    );
  }
  return (
    <Frame>
      <div className="grid grid-cols-1 items-center gap-7 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div>
          <Reveal i={0}>
            <div className="flex flex-wrap items-center gap-2">
              <LiveBadge />
              {eyebrow && <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-umber">{eyebrow}</span>}
            </div>
          </Reveal>
          <Reveal i={1}>
            <h2 className="mt-4 font-display text-[1.9rem] font-semibold leading-[1.06] tracking-tight text-espresso md:text-[2.5rem]">{title}</h2>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-3 text-[15px] leading-relaxed text-umber">{lead}</p>
          </Reveal>
          {points && (
            <Reveal i={3}>
              <ul className="mt-5 space-y-2.5">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-espresso/90">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage/15 text-[#3c6b32]">
                      <Icon.check className="h-3.5 w-3.5 stroke-current fill-none" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
          {caseText && (
            <Reveal i={4}>
              <CaseLine>{caseText}</CaseLine>
            </Reveal>
          )}
          {format && !caseText && (
            <Reveal i={4}>
              <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/50 px-3 py-1.5 text-xs font-medium text-umber ring-1 ring-espresso/10">
                <Icon.spark className="h-3.5 w-3.5 stroke-current fill-none text-ember" /> {format}
              </p>
            </Reveal>
          )}
        </div>
        <Reveal i={2}>
          <Bezel inner="overflow-hidden">{children}</Bezel>
        </Reveal>
      </div>
    </Frame>
  );
}

/* ─────────────── case cards ─────────────── */
function CaseCard({ c, i }) {
  return (
    <Reveal i={3 + i} className="h-full">
      <Bezel className="h-full">
        <div className="flex h-full flex-col p-5 md:p-6">
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-gold/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#8a6418] ring-1 ring-gold/25">Кейс</span>
            <span className="truncate text-[11px] font-medium text-umber">{c.tag}</span>
          </div>
          <h3 className="mt-3 font-display text-[1.15rem] font-semibold leading-snug text-espresso">{c.t}</h3>
          <dl className="mt-3 space-y-2.5 text-[13px] leading-snug">
            {[
              ["Задача", c.task, "text-umber"],
              ["Что сделали", c.did, "text-espresso/90"],
              ["Что это даёт", c.res, "text-[#2c5a26]"],
            ].map(([k, v, cl]) => (
              <div key={k}>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-umber/70">{k}</dt>
                <dd className={`mt-0.5 ${cl}`}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Bezel>
    </Reveal>
  );
}

function CaseSlide({ eyebrow, title, lead, cases }) {
  return (
    <Frame>
      <Title eyebrow={eyebrow} lead={lead}>
        {title}
      </Title>
      <div className={`mt-8 grid grid-cols-1 gap-4 ${cases.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        {cases.map((c, i) => (
          <CaseCard key={c.t} c={c} i={i} />
        ))}
      </div>
    </Frame>
  );
}

function FeatureCase({ eyebrow, title, lead, features, cases }) {
  return (
    <Frame>
      <Title eyebrow={eyebrow} lead={lead}>
        {title}
      </Title>
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[1.15fr_1fr]">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {features.map((f, i) => (
            <Reveal key={f.t} i={3 + i}>
              <div className="flex h-full items-start gap-3 rounded-2xl bg-white/45 p-4 ring-1 ring-white/70 backdrop-blur-md">
                <IconCircle glyph={f.g} className="!h-10 !w-10 !rounded-xl" />
                <div>
                  <h3 className="text-[14.5px] font-semibold leading-snug text-espresso">{f.t}</h3>
                  <p className="mt-0.5 text-[12.5px] leading-snug text-umber">{f.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {cases.map((c, i) => (
            <CaseCard key={c.t} c={c} i={i + 2} />
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ═══════════════════════════ 01 · COVER ═══════════════════════════ */
function Cover() {
  return (
    <div className="relative flex min-h-full w-full flex-col overflow-hidden">
      <div className="drift-a pointer-events-none absolute -right-40 -top-40 h-[40rem] w-[40rem] rounded-full bg-ember/10 blur-3xl" />
      <div className="drift-b pointer-events-none absolute -bottom-52 -left-40 h-[36rem] w-[36rem] rounded-full bg-gold/10 blur-3xl" />
      <Frame>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal i={0}>
              <Eyebrow>Битрикс24 · агробизнес</Eyebrow>
            </Reveal>
            <Reveal i={1}>
              <h1 className="mt-6 font-display text-[2.9rem] font-semibold leading-[0.98] tracking-tight text-espresso md:text-[4.6rem]">
                Вся компания <br />
                <span className="text-aurora">в одной системе</span>
              </h1>
            </Reveal>
            <Reveal i={2}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-umber md:text-xl">
                Продажи, согласования, закупки, планирование, логистика и отчёты — в одном портале Битрикс24, связанном с 1С,
                телефонией, мессенджерами и сайтом.
              </p>
            </Reveal>
            <Reveal i={3}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <PillButton tone="ember">Кейсы и живые демо</PillButton>
                <span className="text-sm text-umber/80">Всё на слайдах можно нажимать · листайте&nbsp;→</span>
              </div>
            </Reveal>
          </div>
          <Reveal i={3} className="hidden lg:block">
            <CoverVisual />
          </Reveal>
        </div>
      </Frame>
    </div>
  );
}

function CoverVisual() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-4">
        {/* deal card */}
        <div className="floaty" style={{ animationDelay: "0s" }}>
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-[#2FC6F6] px-1.5 py-0.5 text-[10px] font-bold text-white">CRM</span>
              <span className="rounded-full bg-[#F4A52F]/15 px-2 py-0.5 text-[10px] font-semibold text-[#94600f]">Договор</span>
            </div>
            <p className="mt-2.5 text-[14px] font-semibold text-espresso">Агрофирма «Колос»</p>
            <p className="text-[12px] text-umber">Кукуруза ФАО 250 · 140 п.е.</p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="font-display text-lg font-semibold tabular-nums text-espresso">6,2 млн ₽</span>
              <div className="flex gap-1">
                {[1, 1, 1, 1, 0, 0].map((d, k) => (
                  <span key={k} className={`h-1.5 w-3.5 rounded-full ${d ? "bg-ember" : "bg-espresso/10"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* truck */}
        <div className="floaty" style={{ animationDelay: "-4s" }}>
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ember/12 text-ember ring-1 ring-ember/20">
                <Icon.truck className="h-5 w-5 stroke-current fill-none" />
              </span>
              <div className="leading-tight">
                <p className="text-[13px] font-semibold text-espresso">Рейс 0417</p>
                <p className="text-[11px] text-umber">в пути · 24,6 т</p>
              </div>
            </div>
            <div className="relative mt-3 h-1.5 rounded-full bg-espresso/10">
              <div className="h-full w-[64%] rounded-full bg-ember" />
            </div>
            <p className="mt-1.5 text-[11px] text-umber">Прибытие 15:40 · клиент видит трекер</p>
          </div>
        </div>
        {/* 1C */}
        <div className="floaty" style={{ animationDelay: "-1.2s" }}>
          <div className="glass-card flex items-center gap-2.5 rounded-2xl px-4 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8A33D]/15 text-[12px] font-bold text-[#94600f]">1С</span>
            <div className="leading-tight">
              <p className="text-[12.5px] font-semibold text-espresso">Оплата получена</p>
              <p className="text-[11px] text-umber">сделка → «Отгрузка»</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 flex flex-col gap-4">
        {/* approval */}
        <div className="floaty" style={{ animationDelay: "-2.2s" }}>
          <div className="glass-card rounded-2xl p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-umber">Согласование счёта</p>
            <p className="mt-1 text-[13px] font-semibold text-espresso">№ 2291 · 184 000 ₽</p>
            <div className="mt-2.5 space-y-1.5">
              {[["Руководитель", "ok"], ["Финдиректор", "now"], ["Бухгалтерия", ""]].map(([r, st]) => (
                <div key={r} className="flex items-center gap-2 text-[12px]">
                  <span className={`flex h-4 w-4 items-center justify-center rounded-full ${st === "ok" ? "bg-sage text-white" : st === "now" ? "bg-ember" : "bg-espresso/10"}`}>
                    {st === "ok" && <Icon.check className="h-3 w-3 stroke-current fill-none" />}
                  </span>
                  <span className={st ? "text-espresso" : "text-umber/60"}>{r}</span>
                  {st === "now" && <span className="ml-auto text-[10px] font-semibold text-ember">ждёт</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* plan-fact */}
        <div className="floaty" style={{ animationDelay: "-5.5s" }}>
          <div className="glass-card rounded-2xl p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-umber">План-факт сезона</p>
            <div className="mt-2 flex h-16 items-end gap-1.5">
              {[62, 80, 54, 92, 71, 86].map((h, k) => (
                <span key={k} className="flex-1 rounded-t-md bg-gradient-to-t from-ember to-sage" style={{ height: `${h}%` }} />
              ))}
            </div>
            <p className="mt-1.5 text-[12px] font-semibold text-espresso">104 % плана</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ PAINS ═══════════════════════════ */
const PAINS = [
  { g: Icon.calendar, t: "Сезонный пик", d: "Основные продажи — за несколько месяцев. Заявки идут потоком из звонков, почты и мессенджеров и теряются." },
  { g: Icon.doc, t: "Согласования в чатах", d: "Счета, договоры, скидки и отгрузки согласуются в переписке и на бумаге — непонятно, на ком застряло." },
  { g: Icon.coins, t: "Дебиторка хозяйств", d: "Отсрочки до урожая, долги в Excel, взыскание — по памяти менеджера." },
  { g: Icon.truck, t: "Логистика отдельно", d: "Менеджер не видит, где партия, логист — что обещали клиенту. Документы возвращаются неделями." },
  { g: Icon.repeat, t: "1С и CRM врозь", d: "Двойной ввод счетов и контрагентов, расхождения по оплатам и остаткам." },
  { g: Icon.chart, t: "План-факт вручную", d: "Руководитель собирает отчёты из таблиц и узнаёт о проблемах, когда сезон уже упущен." },
];
function Pains() {
  return (
    <Frame>
      <Title eyebrow="С чего начинается разговор" lead="Чем больше компания, тем больше процессов живёт в почте, чатах и таблицах. Это шесть мест, где в агробизнесе теряются деньги и время.">
        Компания растёт — <br className="hidden md:block" />
        <span className="text-aurora">процессы не успевают</span>
      </Title>
      <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {PAINS.map((p, i) => (
          <Reveal key={p.t} i={3 + i}>
            <Bezel className="h-full">
              <div className="flex h-full items-start gap-4 p-5">
                <IconCircle glyph={p.g} />
                <div>
                  <h3 className="font-display text-lg font-semibold text-espresso">{p.t}</h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-umber">{p.d}</p>
                </div>
              </div>
            </Bezel>
          </Reveal>
        ))}
      </div>
    </Frame>
  );
}

/* ═══════════════════════════ SOLUTION MAP ═══════════════════════════ */
const MAP = [
  { no: "01", id: "s-sales", g: Icon.funnel, t: "Продажи", d: "Воронки, канбан, распределение, повторные продажи" },
  { no: "02", id: "s-process", g: Icon.layers, t: "Смарт-процессы и БП", d: "Внутренние процессы со стадиями, роботами и маршрутами" },
  { no: "03", id: "s-approvals", g: Icon.shield, t: "Согласования", d: "Счета, договоры, скидки, отгрузки" },
  { no: "04", id: "s-purchase", g: Icon.box, t: "Закупки", d: "Заявки, сравнение поставщиков, приёмка" },
  { no: "05", id: "s-plan", g: Icon.calendar, t: "Планирование", d: "План продаж каскадом, техника и мощности" },
  { no: "06", id: "s-logistics", g: Icon.truck, t: "Логистика и поставки", d: "Рейсы, план отгрузок, трекер для клиента" },
  { no: "07", id: "s-integr", g: Icon.channels, t: "Интеграции", d: "1С, телефония, мессенджеры, сайт и почта" },
  { no: "08", id: "s-reports", g: Icon.chart, t: "Отчёты и аналитика", d: "Дашборды, дебиторка, план-факт, BI" },
  { no: "09", id: "s-apps", g: Icon.grid, t: "Разработка приложений", d: "Когда штатных возможностей мало" },
];
function SolutionMap() {
  const { goTo } = useDeck();
  return (
    <Frame>
      <Title eyebrow="Карта презентации" lead="Девять блоков — от первой заявки до отчёта руководителю. Нажмите на любой, чтобы перейти к нему сразу.">
        Что покажем: <span className="text-aurora">от заявки до отгрузки</span>
      </Title>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MAP.map((m, i) => (
          <Reveal key={m.id} i={3 + i}>
            <button
              onClick={() => goTo(m.id)}
              className="group flex h-full w-full items-center gap-4 rounded-2xl bg-white/45 p-4 text-left ring-1 ring-white/70 backdrop-blur-md transition-all duration-500 ease-spring hover:-translate-y-0.5 hover:bg-white/70 hover:ring-ember/30"
            >
              <span className="font-display text-2xl font-semibold tabular-nums text-ember/70">{m.no}</span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[16px] font-semibold text-espresso">{m.t}</p>
                <p className="mt-0.5 text-[12.5px] leading-snug text-umber">{m.d}</p>
              </div>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-espresso/[0.05] text-espresso transition-all duration-500 ease-spring group-hover:bg-ember group-hover:text-cream">
                <Icon.arrowUpRight className="h-4 w-4 stroke-current fill-none" />
              </span>
            </button>
          </Reveal>
        ))}
      </div>
    </Frame>
  );
}

/* ═══════════════════════════ 01 · SALES ═══════════════════════════ */
function KanbanSlide() {
  return (
    <Frame className="md:pt-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Reveal i={0}>
            <div className="flex items-center gap-2">
              <LiveBadge />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-umber">Так это выглядит в Битрикс24</span>
            </div>
          </Reveal>
          <Reveal i={1}>
            <h2 className="mt-3 font-display text-[1.7rem] font-semibold tracking-tight text-espresso md:text-[2.3rem]">
              Канбан сделок: <span className="text-aurora">перетащите карточку</span>
            </h2>
          </Reveal>
        </div>
        <Reveal i={2}>
          <p className="max-w-md text-[14.5px] leading-relaxed text-umber">
            Все сделки по стадиям на одном экране. Перенесли карточку — сумма колонки пересчиталась, а на новой стадии сработал робот.
          </p>
        </Reveal>
      </div>
      <Reveal i={3} className="mt-5">
        <Bezel>
          <div className="h-[min(30rem,calc(100dvh-15rem))] min-h-[22rem] overflow-x-auto p-2" data-noswipe>
            <div className="h-full min-w-[56rem]">
              <CrmKanban />
            </div>
          </div>
        </Bezel>
      </Reveal>
    </Frame>
  );
}

const SALES_AUTO = [
  { g: Icon.route, t: "Автораспределение", d: "По региону, направлению и очереди; учёт отпусков и нагрузки." },
  { g: Icon.shield, t: "Контроль дублей", d: "Компания с тем же ИНН или телефоном не создаётся второй раз." },
  { g: Icon.doc, t: "Реквизиты по ИНН", d: "Название, адрес, руководитель подтягиваются автоматически." },
  { g: Icon.warn, t: "«Горящие» сделки", d: "Карточка без движения подсвечивается, руководителю — уведомление." },
  { g: Icon.repeat, t: "Повторные продажи", d: "Сделки к сезону создаются сами — по истории закупок клиента." },
  { g: Icon.spark, t: "Подсказки в карточке", d: "Скрипт, калькулятор потребности, прошлые заказы — под рукой." },
];
const SALES_CASES = [
  {
    tag: "Производство и опт · 40+ менеджеров",
    t: "Распределение сделок по регионам и ролям",
    task: "Сделки раздавал громоздкий бизнес-процесс: путались регионы, новые и повторные клиенты попадали не тем менеджерам.",
    did: "Приложение распределения: таблица регионов и опорных менеджеров, новые клиенты — «охотникам», повторные — «фермерам», журнал каждого назначения.",
    res: "Руководитель видит, кому и почему ушла сделка; правила меняются в настройках, без переделки процессов.",
  },
  {
    tag: "Металлоторговля · B2B",
    t: "Чистая база и ни одной потерянной заявки",
    task: "Дубли компаний, заявки из общей почты вперемешку со спамом, сделки неделями без движения.",
    did: "Запрет дублей по ИНН и телефону, разбор почты по ключевым словам, распределение с учётом нагрузки, «горящие» карточки на канбане.",
    res: "В CRM попадают только целевые обращения, у каждого есть ответственный, простои видны сразу.",
  },
  {
    tag: "Опт · повторные обращения",
    t: "ИНН, реквизиты и повторные лиды",
    task: "ИНН хранился в произвольном поле, реквизиты пустые, повторные лиды не связывались с уже известной компанией.",
    did: "Сервис сверяет ИНН с реквизитами, переносит и дополняет их данными из открытых реестров, каждую минуту связывает повторные лиды с компанией.",
    res: "Реквизиты заполнены без ручной работы, повторное обращение сразу видно в карточке клиента.",
  },
];
function SalesAuto() {
  return (
    <Frame>
      <Title eyebrow="Продажи · Автоматика" lead="То, что обычно держится на дисциплине менеджеров, делает система: раздаёт, проверяет, напоминает и подсвечивает.">
        Автоматика, которая <span className="text-aurora">держит темп продаж</span>
      </Title>
      <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {SALES_AUTO.map((x, i) => (
          <Reveal key={x.t} i={3 + i}>
            <Tilt className="h-full" max={5}>
              <Bezel className="h-full">
                <div className="flex h-full items-start gap-4 p-5">
                  <IconCircle glyph={x.g} />
                  <div>
                    <h3 className="font-display text-[17px] font-semibold text-espresso">{x.t}</h3>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-umber">{x.d}</p>
                  </div>
                </div>
              </Bezel>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </Frame>
  );
}

/* ═══════════════════════════ 02 · SMART PROCESSES ═══════════════════════════ */
const SMART_COLS = [
  {
    g: Icon.layers,
    t: "Смарт-процесс",
    d: "Свой тип карточки под любой процесс: стадии, поля, права доступа, связи со сделками, компаниями и другими процессами.",
  },
  {
    g: Icon.spark,
    t: "Роботы и триггеры",
    d: "Простые реакции на стадию: поставить задачу, отправить уведомление или документ, сменить ответственного, создать связанный элемент.",
  },
  {
    g: Icon.flow,
    t: "Бизнес-процессы",
    d: "Маршруты с условиями: кто согласует, параллельные ветки, сроки, эскалация, возврат на доработку — с историей решений.",
  },
];
const SMART_EXAMPLES = ["Заявка на закупку", "Ремонт техники", "Приёмка зерна", "Командировка", "Заявка в АХЧ", "Взыскание долга", "Тендер", "Рекламация", "Договор", "Найм сотрудника", "Сушка и подработка", "Партия семян"];
function SmartExplain() {
  return (
    <Frame>
      <Title
        eyebrow="Внутренние процессы · Как устроено"
        lead="Всё, что не продажа, но тоже процесс со стадиями и ответственными, собирается из трёх кубиков. Настраивается в портале — без разработки, а нестандартное дописываем."
      >
        Три кубика — <span className="text-aurora">любой процесс</span>
      </Title>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {SMART_COLS.map((c, i) => (
          <Reveal key={c.t} i={3 + i}>
            <Bezel className="h-full">
              <div className="flex h-full flex-col p-6">
                <div className="flex items-center gap-3">
                  <IconCircle glyph={c.g} />
                  <span className="font-display text-3xl font-semibold text-ember/30">{i + 1}</span>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-espresso">{c.t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-umber">{c.d}</p>
              </div>
            </Bezel>
          </Reveal>
        ))}
      </div>
      <Reveal i={7}>
        <div className="mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-umber">Что обычно выносим в смарт-процессы в агробизнесе</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {SMART_EXAMPLES.map((e) => (
              <span key={e} className="rounded-full bg-white/50 px-3 py-1.5 text-[13px] font-medium text-espresso ring-1 ring-white/70 backdrop-blur-md">
                {e}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </Frame>
  );
}

const PROCESS_CASES = [
  {
    tag: "Производство и торговый дом",
    t: "Закупки по внутреннему регламенту",
    task: "Регламент закупок существовал на бумаге: непонятно, на каком шаге заявка и кто её держит.",
    did: "Смарт-процесс «Закупка» и задания бизнес-процесса на каждом шаге регламента: инициатор, снабжение, финансы, руководитель.",
    res: "Каждая закупка — карточка со стадией, сроком и ответственным; документы и переписка в одном месте.",
  },
  {
    tag: "Сеть клиник · хозяйственная служба",
    t: "Единое окно хозяйственных заявок",
    task: "Восемь подразделений присылали заявки в чаты: снабжение, ремонты и поручения смешивались.",
    did: "Смарт «Заявка в АХЧ» с тремя воронками под разный ритм работы и смарт «Договоры» с подрядчиками и сроками, два бизнес-процесса.",
    res: "Все заявки в одном месте, месячный заказ собирается сам, договоры не истекают внезапно.",
  },
  {
    tag: "Агрохимия · дистрибуция",
    t: "Взыскание дебиторки по регламенту",
    task: "Долги хозяйств вели в книге Excel из пяти листов; регламент взыскания из 12 этапов жил только в приказе.",
    did: "Единый реестр долгов с корзинами просрочки и отчётом недели; регламент взыскания разложен в смарт-процесс со стадиями и роботами.",
    res: "Видно, кто и сколько должен, на каком этапе взыскание и кто отвечает за следующий шаг.",
  },
];

/* ═══════════════════════════ 04 · PURCHASE ═══════════════════════════ */
const PURCHASE_FEATURES = [
  { g: Icon.doc, t: "Заявки от подразделений", d: "Агроном, механик, склад — по единой форме, с обоснованием." },
  { g: Icon.handshake, t: "Сравнение поставщиков", d: "Предложения в одной таблице: цена, срок, отсрочка, надёжность." },
  { g: Icon.coins, t: "Бюджет и лимиты", d: "Согласование по статье бюджета, превышение — на финдиректора." },
  { g: Icon.shield, t: "Договор и оплата", d: "Маршрут юрист → финансы → директор, счёт в реестр платежей." },
  { g: Icon.truck, t: "Контроль поставки", d: "Сроки поставщика, задержки подсвечиваются, приёмка на складе." },
  { g: Icon.box, t: "Учёт ТМЦ и техники", d: "Что, где и у кого — по актам приёма-передачи." },
];
const PURCHASE_CASES = [
  {
    tag: "Поставка инженерного оборудования",
    t: "KPI снабжения из 1С",
    task: "Руководитель не видел, вовремя ли снабженцы размещают заказы у поставщиков.",
    did: "Заказы из 1С автоматически попадают в смарт-процесс, отчёт «Своевременное размещение» обновляется по расписанию.",
    res: "Просрочки размещения видны по каждому снабженцу без ручных выгрузок.",
  },
];

/* ═══════════════════════════ 05 · PLANNING ═══════════════════════════ */
const PLAN_FEATURES = [
  { g: Icon.chart, t: "План продаж каскадом", d: "Компания → регионы → менеджеры → хозяйства и культуры." },
  { g: Icon.gauge, t: "План-факт онлайн", d: "Факт считается из сделок и оплат 1С, без ручных отчётов." },
  { g: Icon.calendar, t: "Техника и мощности", d: "Календарь опрыскивателей, сушилок, транспорта без пересечений." },
  { g: Icon.truck, t: "График отгрузок", d: "Что, куда и каким тоннажем — по дням и складам." },
  { g: Icon.grid, t: "Проекты и Ганта", d: "Стройка склада, запуск линии, подготовка к сезону — по этапам." },
  { g: Icon.clock, t: "Смены и рабочее время", d: "Графики 5/2 и 2/2, табель, заявки на отгул." },
];
const PLAN_CASES = [
  {
    tag: "Семенная компания · сеть дистрибьюторов",
    t: "Каскадное планирование вместо сотен карточек",
    task: "План на сезон раскладывали вручную: сотни карточек «план / регион / гибрид / менеджер», суммы сверяли в соседней вкладке.",
    did: "Матрица планирования: коммерческий директор → регионы → руководители → торговые представители → хозяйства, с проверкой сумм на каждом уровне.",
    res: "После утверждения плановые сделки создаются сами, план-факт по дистрибьюторам виден в отчёте.",
  },
];

/* ═══════════════════════════ 06 · LOGISTICS ═══════════════════════════ */
const FLOW = [
  { g: Icon.handshake, t: "Сделка оплачена", w: "Менеджер", d: "оплата пришла из 1С" },
  { g: Icon.box, t: "Резерв на складе", w: "Склад", d: "остатки из 1С" },
  { g: Icon.doc, t: "Заявка на рейс", w: "Логист", d: "создаётся роботом" },
  { g: Icon.handshake, t: "Перевозчик", w: "Логист", d: "сравнение ставок" },
  { g: Icon.gauge, t: "Погрузка и весовая", w: "Склад", d: "вес в карточку" },
  { g: Icon.truck, t: "В пути", w: "Клиент", d: "ссылка на трекер" },
  { g: Icon.check, t: "Документы вернулись", w: "Бухгалтерия", d: "ТТН, УПД, акт" },
];
function LogisticsFlow() {
  return (
    <Frame>
      <Title
        eyebrow="Логистика · Сквозная цепочка"
        lead="Логистика не живёт отдельно: рейс рождается из сделки, статусы видят менеджер и клиент, а сделка закрывается, только когда вернулись документы."
      >
        От оплаты до <span className="text-aurora">вернувшихся документов</span>
      </Title>
      <Reveal i={3}>
        <Bezel className="mt-8">
          <div className="p-5 md:p-7">
            <div className="relative hidden md:block">
              <div className="absolute left-[5%] right-[5%] top-6 h-[2px] rounded-full bg-espresso/10" />
              <div className="absolute left-[5%] right-[5%] top-6 h-[2px]">
                <div className="ride-x absolute -top-[13px] -translate-x-1/2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ember text-cream shadow-[0_6px_16px_-6px_rgba(47,143,78,0.8)]">
                    <Icon.truck className="h-4 w-4 stroke-current fill-none" />
                  </span>
                </div>
              </div>
            </div>
            <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-7 md:gap-2">
              {FLOW.map((f, i) => (
                <div key={f.t} className="flex items-start gap-3 md:flex-col md:items-center md:text-center">
                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-ember ring-1 ring-ember/20 md:mt-0">
                    <f.g className="h-6 w-6 stroke-current fill-none" />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-ember md:mt-3">Шаг {i + 1}</p>
                    <p className="text-[14px] font-semibold leading-tight text-espresso">{f.t}</p>
                    <p className="mt-0.5 text-[12px] text-umber">{f.w}</p>
                    <p className="text-[11.5px] text-umber/75">{f.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Bezel>
      </Reveal>
      <Reveal i={4}>
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            ["Менеджер", "видит статус отгрузки прямо в сделке — не звонит логисту"],
            ["Клиент", "получает ссылку на трекер и уведомления в мессенджер"],
            ["Руководитель", "видит рейсы в пути, тоннаж и невернувшиеся документы"],
          ].map(([w, d]) => (
            <div key={w} className="rounded-2xl bg-white/45 px-4 py-3 ring-1 ring-white/70 backdrop-blur-md">
              <p className="text-[13px] font-semibold text-espresso">{w}</p>
              <p className="text-[12.5px] leading-snug text-umber">{d}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </Frame>
  );
}

const LOGISTICS_CASES = [
  {
    tag: "Логистика · грузы и декларирование",
    t: "Единое окно по грузам",
    task: "Менеджеры, декларанты, логисты и отдел проверки работали по одной заявке в разных таблицах.",
    did: "Рабочее пространство поверх Битрикс24: у каждой роли свой экран и очередь, вся история груза — в одной карточке.",
    res: "Заявка не теряется между отделами, руководитель видит узкие места.",
  },
  {
    tag: "Опт · клиентский сервис",
    t: "Трекер заказа для клиента",
    task: "Клиенты звонили менеджерам, чтобы узнать, где их заказ.",
    did: "Публичная страница заказа в стиле служб доставки: статусы подтягиваются из сделки, ссылка уходит клиенту автоматически.",
    res: "Клиент видит статус сам, менеджеры не отвлекаются на вопрос «где мой заказ».",
  },
  {
    tag: "Производство на заказ",
    t: "Где застревает заказ",
    task: "Заказы задерживались, но было непонятно, на каком этапе и у кого.",
    did: "Отчёт план/факт по этапам: средний, минимальный и максимальный срок, переносы дат, задержки по людям.",
    res: "Заторы видны по этапам и сотрудникам, разговор о сроках идёт по фактам.",
  },
];

/* ═══════════════════════════ 07 · INTEGRATIONS ═══════════════════════════ */
const HUB = [
  { t: "1С", d: "УТ, ERP, Бухгалтерия, УПП", c: "#E8A33D" },
  { t: "Телефония", d: "IP-АТС, запись, ИИ-разбор", c: "#2F8F4E" },
  { t: "Мессенджеры", d: "Telegram, WhatsApp, MAX, ВК", c: "#2FC6F6" },
  { t: "Сайт и формы", d: "заявки, квизы, калькуляторы", c: "#7E57C2" },
  { t: "Почта", d: "разбор писем в лиды", c: "#C2922E" },
  { t: "Авито и площадки", d: "объявления и отклики", c: "#3D6CB0" },
  { t: "ЭДО и подпись", d: "договоры и акты онлайн", c: "#26A69A" },
  { t: "ФНС и DaData", d: "реквизиты по ИНН", c: "#9D5BA8" },
  { t: "Банк", d: "выписки и оплаты", c: "#B07B3C" },
  { t: "BI и Excel", d: "отчёты и выгрузки", c: "#566B53" },
];
function IntegrationHub() {
  const R = 39; // % radius
  return (
    <Frame>
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <Title
          eyebrow="Интеграции · Общая схема"
          lead="Битрикс24 становится центром: данные из 1С, звонки, переписки, заявки с сайта и почты сходятся в карточке клиента. Ничего не нужно переносить руками."
        >
          Все системы <span className="text-aurora">сходятся в одной карточке</span>
        </Title>
        <Reveal i={3}>
          {/* desktop hub */}
          <div className="relative mx-auto hidden aspect-square w-full max-w-[34rem] md:block">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              {HUB.map((h, k) => {
                const a = (k / HUB.length) * Math.PI * 2 - Math.PI / 2;
                return (
                  <line
                    key={h.t}
                    x1="50"
                    y1="50"
                    x2={50 + Math.cos(a) * R}
                    y2={50 + Math.sin(a) * R}
                    stroke={h.c}
                    strokeOpacity="0.55"
                    strokeWidth="0.35"
                    className="flow-line"
                    style={{ animationDelay: `${-k * 0.3}s` }}
                  />
                );
              })}
            </svg>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="ring-pulse absolute inset-0 rounded-full bg-ember/25" />
              <div className="relative flex h-32 w-32 flex-col items-center justify-center rounded-full bg-espresso text-cream shadow-[0_24px_50px_-20px_rgba(21,41,28,0.7)]">
                <span className="rounded-md bg-[#2FC6F6] px-2 py-0.5 text-[11px] font-bold text-white">B24</span>
                <span className="mt-1.5 text-[13px] font-semibold">Битрикс24</span>
                <span className="text-[10px] text-cream/60">карточка клиента</span>
              </div>
            </div>
            {HUB.map((h, k) => {
              const a = (k / HUB.length) * Math.PI * 2 - Math.PI / 2;
              return (
                <div
                  key={h.t}
                  className="glass-card absolute w-[8.6rem] -translate-x-1/2 -translate-y-1/2 rounded-xl px-2.5 py-2 text-center"
                  style={{ left: `${50 + Math.cos(a) * R}%`, top: `${50 + Math.sin(a) * R}%` }}
                >
                  <p className="flex items-center justify-center gap-1.5 text-[12.5px] font-semibold text-espresso">
                    <span className="h-2 w-2 rounded-full" style={{ background: h.c }} />
                    {h.t}
                  </p>
                  <p className="text-[10.5px] leading-tight text-umber">{h.d}</p>
                </div>
              );
            })}
          </div>
          {/* mobile list */}
          <div className="grid grid-cols-2 gap-2 md:hidden">
            {HUB.map((h) => (
              <div key={h.t} className="glass-card rounded-xl px-3 py-2">
                <p className="flex items-center gap-1.5 text-[13px] font-semibold text-espresso">
                  <span className="h-2 w-2 rounded-full" style={{ background: h.c }} />
                  {h.t}
                </p>
                <p className="text-[11px] text-umber">{h.d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Frame>
  );
}

const INTEGR_CASES = [
  {
    tag: "Производство станков · контроль качества",
    t: "ИИ слушает звонки",
    task: "Отдел контроля прослушивал звонки выборочно и вручную — оценки зависели от проверяющего.",
    did: "Запись звонка → расшифровка → разбор по скрипту продаж: % соблюдения, замечания, поля для сделки, диалог по ролям.",
    res: "Каждый звонок оценён по одним правилам, у руководителя — отчёт по менеджерам.",
  },
  {
    tag: "Транспорт · подбор персонала",
    t: "ИИ-бот в открытых линиях",
    task: "Рекрутеры тонули в откликах с Авито и Telegram, большая часть кандидатов не подходила.",
    did: "Бот в Открытых линиях задаёт кандидату вопросы по требованиям вакансии, собирает телефон и удобное время звонка.",
    res: "Рекрутер получает только подходящих кандидатов с заполненной анкетой.",
  },
  {
    tag: "Переезд в Битрикс24",
    t: "Переезд без потери истории",
    task: "Сделки, контакты и история клиентов жили в другой CRM или в смарт-процессе, который пришлось менять при смене тарифа.",
    did: "Перенос из Saby и amoCRM с разбором по воронкам и стадиям, перенос смарт-процесса в сделки, коннектор Битрикс24 ↔ amoCRM на переходный период.",
    res: "Команда работает в новой системе с полной историей клиентов.",
  },
];

/* ═══════════════════════════ 08 · REPORTS ═══════════════════════════ */
function MiniViz({ kind }) {
  if (kind === "bars")
    return (
      <div className="flex h-10 items-end gap-1">
        {[40, 72, 55, 88, 64, 95].map((h, k) => (
          <span key={k} className="flex-1 rounded-t bg-gradient-to-t from-ember/80 to-sage/70" style={{ height: `${h}%` }} />
        ))}
      </div>
    );
  if (kind === "line")
    return (
      <svg viewBox="0 0 100 32" className="h-10 w-full">
        <path d="M0 26 L16 20 L32 23 L48 12 L64 15 L80 6 L100 9" fill="none" stroke="#2F8F4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0 26 L16 20 L32 23 L48 12 L64 15 L80 6 L100 9 L100 32 L0 32Z" fill="#2F8F4E" opacity="0.1" />
      </svg>
    );
  if (kind === "funnel")
    return (
      <div className="flex h-10 flex-col justify-between">
        {[100, 72, 46, 28].map((w, k) => (
          <span key={k} className="mx-auto h-1.5 rounded-full bg-ember/70" style={{ width: `${w}%`, opacity: 1 - k * 0.15 }} />
        ))}
      </div>
    );
  if (kind === "heat")
    return (
      <div className="grid h-10 grid-cols-8 gap-0.5">
        {[1, 2, 0, 3, 1, 2, 3, 1, 0, 1, 3, 2, 1, 0, 2, 3].map((v, k) => (
          <span key={k} className="rounded-[3px]" style={{ background: ["#e4ecda", "#b9d3a8", "#C2922E", "#c0563b"][v] }} />
        ))}
      </div>
    );
  if (kind === "ring")
    return (
      <div className="flex h-10 items-center gap-2">
        <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90">
          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(21,41,28,0.08)" strokeWidth="5" />
          <circle cx="18" cy="18" r="14" fill="none" stroke="#2F8F4E" strokeWidth="5" strokeDasharray="88" strokeDashoffset="20" strokeLinecap="round" />
        </svg>
        <span className="font-display text-lg font-semibold text-espresso">78%</span>
      </div>
    );
  return (
    <div className="flex h-10 flex-col justify-center gap-1">
      {[90, 60, 75].map((w, k) => (
        <span key={k} className="h-2 rounded-full bg-espresso/10">
          <span className="block h-full rounded-full bg-gold/70" style={{ width: `${w}%` }} />
        </span>
      ))}
    </div>
  );
}

const REPORTS = [
  { t: "План-факт по воронке", tag: "Кадровое агентство", d: "Лиды → сделки → выручка по менеджерам и периодам с учётом истории стадий.", v: "bars" },
  { t: "Сроки по этапам", tag: "Мебельное производство", d: "Где затор: средний, мин. и макс. срок этапа, в срок или с задержкой — по людям.", v: "heat" },
  { t: "Активность менеджеров", tag: "Отдел продаж", d: "Простои в CRM: кто и сколько не работал со сделками, без ложных срабатываний роботов.", v: "line" },
  { t: "Лиды по источникам", tag: "Сервисная компания", d: "Реестр лидов за сегодня и сколько дней прошло с последнего лида по каждому источнику.", v: "progress" },
  { t: "BI с переходом в сделку", tag: "Металлоторговля", d: "Клик по любой цифре → список сделок → карточка в Битрикс24.", v: "funnel" },
  { t: "KPI снабжения", tag: "Поставка оборудования", d: "Своевременное размещение заказов поставщикам — по данным 1С.", v: "ring" },
  { t: "Качество звонков", tag: "Холдинг стройматериалов", d: "Оценки звонков по менеджерам и пунктам скрипта, динамика по неделям.", v: "line" },
  { t: "Воронка подбора", tag: "Аутстаффинг", d: "От отклика до выхода на смену: конверсия по когортам и источникам.", v: "funnel" },
];
function ReportsGallery() {
  return (
    <Frame>
      <Title
        eyebrow="Отчёты · Что мы уже строили"
        lead="Штатных отчётов Битрикс24 хватает на старте. Когда нужен свой разрез — строим отчёт под вопрос руководителя: с правами доступа, фильтрами и переходом в карточку."
      >
        Отчёты под вопрос, <span className="text-aurora">а не под шаблон</span>
      </Title>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {REPORTS.map((r, i) => (
          <Reveal key={r.t} i={3 + i}>
            <div className="flex h-full flex-col rounded-2xl bg-white/45 p-4 ring-1 ring-white/70 backdrop-blur-md transition-all duration-500 ease-spring hover:-translate-y-0.5 hover:bg-white/65">
              <MiniViz kind={r.v} />
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-[#8a6418]">{r.tag}</p>
              <h3 className="mt-0.5 font-display text-[15px] font-semibold leading-snug text-espresso">{r.t}</h3>
              <p className="mt-1 text-[12.5px] leading-snug text-umber">{r.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Frame>
  );
}

/* ═══════════════════════════ 09 · APPS ═══════════════════════════ */
const FORMATS = [
  { g: Icon.doc, t: "Встройка в карточку", d: "Калькуляторы, подсказки, связанные данные — прямо в сделке или компании." },
  { g: Icon.grid, t: "Раздел в меню портала", d: "Дашборды, реестры, календари, рабочие места отделов." },
  { g: Icon.arrowUpRight, t: "Ссылка для клиента", d: "Трекер заказа, личный кабинет, анкеты — без входа в портал." },
  { g: Icon.repeat, t: "Фоновый сервис", d: "Обмен с 1С, разбор почты, распределение, проверки по расписанию." },
];
function AppsHow() {
  return (
    <Frame>
      <Title
        eyebrow="Приложения · Когда коробки мало"
        lead="Если штатных настроек не хватает, пишем своё приложение поверх Битрикс24. Оно работает с вашими сделками и правами сотрудников, а данные остаются в портале."
      >
        Дописываем то, <span className="text-aurora">чего нет в коробке</span>
      </Title>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FORMATS.map((f, i) => (
          <Reveal key={f.t} i={3 + i}>
            <Bezel className="h-full">
              <div className="flex h-full flex-col p-5">
                <IconCircle glyph={f.g} />
                <h3 className="mt-4 font-display text-[17px] font-semibold text-espresso">{f.t}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-umber">{f.d}</p>
              </div>
            </Bezel>
          </Reveal>
        ))}
      </div>
      <Reveal i={8}>
        <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-2 rounded-2xl bg-white/40 px-6 py-4 ring-1 ring-white/70 backdrop-blur-md">
          {[
            ["дни", "от идеи до прототипа"],
            ["100%", "данные остаются в вашем Битрикс24"],
            ["1", "портал — приложения открываются внутри Битрикс24"],
          ].map(([num, l]) => (
            <div key={l} className="flex items-baseline gap-2.5">
              <span className="font-display text-2xl font-semibold text-ember">{num}</span>
              <span className="max-w-[14rem] text-xs leading-tight text-umber">{l}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </Frame>
  );
}

const APPS = [
  { g: Icon.grid, t: "Шахматка объектов с бронью в CRM", tag: "Девелопмент", live: true },
  { g: Icon.track, t: "Трекер заказа для клиента", tag: "Опт", live: true },
  { g: Icon.calc, t: "Калькулятор потребности в сделке", tag: "Агро", live: true },
  { g: Icon.map, t: "Карта клиентов и полей", tag: "Агро", live: true },
  { g: Icon.user, t: "Личный кабинет клиента", tag: "Дистрибуция", live: true },
  { g: Icon.phone, t: "ИИ-контроль качества звонков", tag: "Производство" },
  { g: Icon.channels, t: "ИИ-бот подбора в открытых линиях", tag: "Транспорт" },
  { g: Icon.box, t: "Склад ТМЦ по актам приёма-передачи", tag: "Сервис" },
  { g: Icon.clock, t: "Учёт рабочего времени и смен", tag: "Производство" },
  { g: Icon.shield, t: "Проверка ИНН и обогащение реквизитов", tag: "Опт" },
  { g: Icon.layers, t: "Импорт из Excel в смарт-процессы", tag: "Тендеры" },
  { g: Icon.calendar, t: "Календарь бронирования объектов", tag: "Загородный отдых" },
  { g: Icon.coins, t: "Конструктор смет и КП", tag: "Подрядные работы" },
  { g: Icon.doc, t: "Генератор документов с нумерацией", tag: "Любая отрасль" },
  { g: Icon.people, t: "Взаимная оценка сотрудников 360°", tag: "HR" },
  { g: Icon.sprout, t: "База знаний и обучение с тестами", tag: "HR" },
];
function AppsGallery() {
  return (
    <Frame>
      <Title eyebrow="Приложения · Витрина" lead="Приложения и прототипы, которые мы разрабатывали для клиентов из разных отраслей. Отмеченные «демо» можно попробовать на следующих слайдах.">
        Что мы уже <span className="text-aurora">разрабатывали</span>
      </Title>
      <div className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {APPS.map((a, i) => (
          <Reveal key={a.t} i={3 + Math.min(i, 8)}>
            <div className="flex h-full items-center gap-3 rounded-2xl bg-white/45 p-3.5 ring-1 ring-white/70 backdrop-blur-md transition-all duration-500 ease-spring hover:bg-white/70">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ember/10 text-ember ring-1 ring-ember/15">
                <a.g className="h-5 w-5 stroke-current fill-none" />
              </span>
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold leading-snug text-espresso">{a.t}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-umber">
                  {a.tag}
                  {a.live && <span className="rounded-full bg-sage/15 px-1.5 py-px text-[9.5px] font-semibold uppercase tracking-wide text-[#3c6b32]">демо</span>}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Frame>
  );
}

function ShahmatkaSlide() {
  return (
    <Frame className="md:pt-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Reveal i={0}>
            <div className="flex items-center gap-2">
              <LiveBadge />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-umber">Пример из другой отрасли · девелопмент</span>
            </div>
          </Reveal>
          <Reveal i={1}>
            <h2 className="mt-3 font-display text-[1.7rem] font-semibold tracking-tight text-espresso md:text-[2.3rem]">
              Шахматка объектов <span className="text-aurora">→ бронь в CRM</span>
            </h2>
          </Reveal>
        </div>
        <Reveal i={2}>
          <p className="max-w-md text-[14.5px] leading-relaxed text-umber">
            Приложение для застройщика: выбираете квартиру на плане — создаётся бронь и сделка. Тот же подход работает для складов, силосов,
            участков и любых «ячеек» с остатком.
          </p>
        </Reveal>
      </div>
      <Reveal i={3} className="mt-5">
        <Bezel>
          <div className="h-[min(34rem,calc(100dvh-14rem))] min-h-[30rem] overflow-y-auto p-3 lg:overflow-hidden">
            <Shahmatka />
          </div>
        </Bezel>
      </Reveal>
    </Frame>
  );
}

/* ═══════════════════════════ CLOSE ═══════════════════════════ */
const STEPS = [
  { n: "01", t: "Разбор процессов", d: "Интервью с отделами, карта процессов: что настраиваем штатно, что дописываем." },
  { n: "02", t: "Прототип", d: "Кликабельное демо ключевых экранов на ваших примерах — как в этой презентации." },
  { n: "03", t: "Настройка и разработка", d: "Воронки, смарт-процессы, бизнес-процессы, интеграции и приложения, проверка на реальных данных." },
  { n: "04", t: "Обучение и сопровождение", d: "Инструкции и обучение по ролям, поддержка и развитие системы." },
];
function HowWeWork() {
  return (
    <Frame>
      <Title eyebrow="Как мы работаем" lead="Начинаем с процессов, а не с настроек. Запускаем по блокам — так первый результат появляется быстро, а система растёт вместе с компанией.">
        От разбора процессов <span className="text-aurora">до работающей системы</span>
      </Title>
      <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} i={3 + i}>
            <Bezel className="h-full">
              <div className="flex h-full flex-col p-5">
                <span className="font-display text-3xl font-semibold text-ember">{s.n}</span>
                <h3 className="mt-3 font-display text-lg font-semibold text-espresso">{s.t}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-umber">{s.d}</p>
              </div>
            </Bezel>
          </Reveal>
        ))}
      </div>
    </Frame>
  );
}

function Thanks() {
  return (
    <div className="relative flex min-h-full w-full flex-col overflow-hidden">
      <div className="drift-a pointer-events-none absolute -left-40 -top-32 h-[36rem] w-[36rem] rounded-full bg-ember/12 blur-3xl" />
      <div className="drift-b pointer-events-none absolute -bottom-40 -right-32 h-[34rem] w-[34rem] rounded-full bg-gold/14 blur-3xl" />
      <Frame className="items-center text-center">
        <Reveal i={0}>
          <Eyebrow>Битрикс24 · агробизнес</Eyebrow>
        </Reveal>
        <Reveal i={1}>
          <h2 className="mt-7 font-display text-[3.2rem] font-semibold leading-[0.98] tracking-tight text-espresso md:text-[6rem]">
            Спасибо <br />
            <span className="text-aurora">за внимание</span>
          </h2>
        </Reveal>
        <Reveal i={3}>
          <div className="mt-10 inline-flex items-center gap-4 rounded-full bg-white/55 py-2.5 pl-2.5 pr-7 ring-1 ring-white/80 backdrop-blur-xl shadow-[0_24px_50px_-30px_rgba(21,41,28,0.55)]">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-ember to-sage font-display text-lg font-semibold text-cream">КМ</span>
            <span className="text-left">
              <span className="block font-display text-2xl font-semibold tracking-tight text-espresso">Ксения Мингазова</span>
            </span>
          </div>
        </Reveal>
      </Frame>
    </div>
  );
}

/* ═══════════════════════════ DECK ═══════════════════════════ */
export const SLIDES = [
  { id: "cover", section: "Старт", title: "Обложка", el: <Cover /> },
  { id: "pains", section: "Старт", title: "Где теряются деньги и время", el: <Pains /> },
  { id: "map", section: "Старт", title: "Карта презентации", el: <SolutionMap /> },

  /* 01 · Продажи */
  {
    id: "s-sales", section: "Продажи", title: "Раздел: продажи",
    el: <SectionMark no="01" label="Продажи" lead="Воронки под разные типы продаж, автоматика на каждой стадии и повторные продажи по истории клиента." items={["Несколько воронок в одном портале", "Живой канбан с роботами", "Автоматика отдела продаж", "Кейсы", "Сезонные напоминания", "Калькулятор потребности"]} />,
  },
  {
    id: "funnels", section: "Продажи", title: "Воронки продаж",
    el: (
      <DemoSlide wide eyebrow="Продажи · Воронки" title={<>Своя воронка <span className="text-aurora">под каждый тип продаж</span></>} lead="Новые клиенты, повторные продажи, тендеры и услуги идут по разным стадиям. Выберите воронку и стадию — увидите, что система делает сама." format="настройка CRM · без разработки">
        <Funnels />
      </DemoSlide>
    ),
  },
  { id: "kanban", section: "Продажи", title: "Канбан сделок с роботами", el: <KanbanSlide /> },
  { id: "sales-auto", section: "Продажи", title: "Автоматика отдела продаж", el: <SalesAuto /> },
  {
    id: "sales-cases", section: "Продажи", title: "Кейсы: продажи",
    el: <CaseSlide eyebrow="Продажи · Кейсы" title={<>Как это работает <span className="text-aurora">у клиентов</span></>} lead="Три внедрения из разных отраслей — с той же логикой, что нужна компании с большим отделом продаж." cases={SALES_CASES} />,
  },
  {
    id: "seasons", section: "Продажи", title: "Сезонные напоминания",
    el: (
      <DemoSlide wide eyebrow="Продажи · Повторные" title={<>Сезонные <span className="text-aurora">напоминания</span></>} lead="По истории закупок система подсказывает, кому и когда предлагать семена, СЗР и удобрения к следующему сезону. Фильтруйте по срочности и ставьте задачи." format="помощник менеджера">
        <SeasonReminders />
      </DemoSlide>
    ),
  },
  {
    id: "seedcalc", section: "Продажи", title: "Калькулятор потребности",
    el: (
      <DemoSlide title={<>Калькулятор <span className="text-aurora">потребности</span></>} eyebrow="Продажи · В карточке сделки" lead="Менеджер выбирает культуру, площадь и норму высева — приложение сразу считает тоннаж семян, объём СЗР и сумму сделки." points={["Двигайте площадь и норму — расчёт мгновенный", "Свои нормы и цены по каждой культуре", "Результат записывается в поля сделки и КП"]} format="встройка в карточку сделки">
        <SeedCalc />
      </DemoSlide>
    ),
  },

  /* 02 · Смарт-процессы */
  {
    id: "s-process", section: "Процессы", title: "Раздел: смарт-процессы и БП",
    el: <SectionMark no="02" label="Смарт-процессы и бизнес-процессы" lead="Внутренние процессы компании — со стадиями, ответственными, сроками и маршрутами согласований." items={["Как это устроено", "Запуск заявки из ленты", "Смарт-процесс в Битрикс24", "Что срабатывает на каждой стадии", "Кейсы"]} />,
  },
  { id: "smart", section: "Процессы", title: "Смарт-процессы, роботы, БП", el: <SmartExplain /> },
  {
    id: "launch", section: "Процессы", title: "Демо: запуск заявки из ленты",
    el: (
      <DemoSlide wide eyebrow="Процессы · Так это выглядит в Битрикс24" title={<>Запуск заявки <span className="text-aurora">из ленты</span></>} lead="Сотрудник открывает «Процессы», выбирает заявку, заполняет поля и запускает. Согласующий видит пост с маршрутом и кнопками «Утвердить / Отклонить». Выберите процесс и пройдите его." format="бизнес-процессы в ленте">
        <B24Launch />
      </DemoSlide>
    ),
  },
  {
    id: "b24smart", section: "Процессы", title: "Демо: смарт-процесс в Битрикс24",
    el: (
      <DemoSlide wide eyebrow="Процессы · Так это выглядит в Битрикс24" title={<>Смарт-процесс: <span className="text-aurora">канбан и карточка</span></>} lead="«Ремонт техники» как отдельный раздел CRM. Откройте карточку комбайна: стадии, поля, таймлайн и задание бизнес-процесса. Утвердите затраты — стадия сменится, а закупка запчастей создастся сама." format="смарт-процесс + бизнес-процесс">
        <B24Smart />
      </DemoSlide>
    ),
  },
  {
    id: "smartflow", section: "Процессы", title: "Демо: что срабатывает на стадиях",
    el: (
      <DemoSlide wide eyebrow="Процессы · Под капотом" title={<>Что срабатывает <span className="text-aurora">на каждой стадии</span></>} lead="Три процесса — ремонт техники, приёмка зерна, командировка. Переводите элемент по стадиям и смотрите журнал: роботы, согласования, документы, обмен с 1С и связанные элементы." format="настройка портала">
        <SmartFlow />
      </DemoSlide>
    ),
  },
  {
    id: "process-cases", section: "Процессы", title: "Кейсы: внутренние процессы",
    el: <CaseSlide eyebrow="Процессы · Кейсы" title={<>Процессы, которые <span className="text-aurora">перестали теряться</span></>} lead="Закупки, хозяйственные заявки и взыскание долгов — из бумаги, чатов и Excel в управляемые процессы." cases={PROCESS_CASES} />,
  },

  /* 03 · Согласования */
  {
    id: "s-approvals", section: "Согласования", title: "Раздел: согласования",
    el: <SectionMark no="03" label="Согласования" lead="Счета, договоры, скидки и отгрузки идут по маршруту — с условиями, сроками и историей решений." items={["Счета на оплату", "Договоры", "Реестр договоров со сроками", "Отгрузки"]} />,
  },
  {
    id: "invoice", section: "Согласования", title: "Согласование счетов",
    el: (
      <DemoSlide title={<>Согласование <span className="text-aurora">счетов</span></>} eyebrow="Согласования · Счета" lead="Маршрут собирается сам: от суммы и остатка бюджета по статье. Двигайте сумму и меняйте статью — цепочка согласующих перестроится." points={["До 100 тыс — руководитель, дальше — финдиректор, от 1 млн — генеральный", "Превышение лимита статьи — сразу на финдиректора", "После оплаты — реестр платежей и выгрузка в 1С"]} format="бизнес-процесс · настройка портала">
        <InvoiceApproval />
      </DemoSlide>
    ),
  },
  {
    id: "contract", section: "Согласования", title: "Согласование договоров",
    el: (
      <DemoSlide title={<>Согласование <span className="text-aurora">договоров</span></>} eyebrow="Согласования · Договоры" lead="Договор собирается из сделки по шаблону. Юрист и бухгалтерия согласуют параллельно, замечания превращаются в новую версию, затем — подпись клиента онлайн." points={["Шаблоны договоров и спецификаций с полями сделки", "Параллельное согласование, версии и замечания", "Подписание онлайн и контроль срока действия"]} format="бизнес-процесс + генератор документов">
        <ContractRoute />
      </DemoSlide>
    ),
  },
  {
    id: "registry", section: "Согласования", title: "Реестр договоров",
    el: (
      <DemoSlide wide eyebrow="Согласования · Сроки" title={<>Реестр договоров <span className="text-aurora">со сроками</span></>} lead="Все договоры с суммами и датами окончания. Истекающие подсвечиваются, на пролонгацию — задача менеджеру заранее." format="раздел в меню портала">
        <ContractsRegistry />
      </DemoSlide>
    ),
  },
  {
    id: "bp-ship", section: "Согласования", title: "Согласование отгрузки",
    el: (
      <DemoSlide title={<>Согласование отгрузки <span className="text-aurora">в понятном виде</span></>} eyebrow="Согласования · Отгрузки" lead="Тот же бизнес-процесс, но в наглядном виде: этапы, кто согласует, сроки и кнопки действия. Нажимайте «Согласовать» — процесс идёт дальше." points={["Видно, на ком застрял процесс и сколько он ждёт", "Кнопки действия прямо в задаче", "Лента: кто и что согласовал"]} format="приложение вместо штатной формы">
        <BizProcess />
      </DemoSlide>
    ),
  },

  /* 04 · Закупки */
  {
    id: "s-purchase", section: "Закупки", title: "Раздел: закупки",
    el: <SectionMark no="04" label="Закупки и снабжение" lead="От заявки агронома или механика до приёмки на складе — с бюджетом, сравнением поставщиков и контролем сроков." items={["Закупка: от заявки до приёмки", "Что автоматизируем в снабжении"]} />,
  },
  {
    id: "procurement", section: "Закупки", title: "Демо: закупка",
    el: (
      <DemoSlide title={<>Закупка: <br /><span className="text-aurora">от заявки до приёмки</span></>} eyebrow="Закупки · Смарт-процесс" lead="Предложения поставщиков собраны в одной карточке. Выберите лучшее и утвердите — договор, счёт и поставка запускаются по цепочке сами." points={["Сравнение по цене, сроку, отсрочке и надёжности", "Выбор фиксируется протоколом", "Договор, оплата и приёмка — по маршруту"]} format="смарт-процесс «Закупка»">
        <Procurement />
      </DemoSlide>
    ),
  },
  {
    id: "purchase", section: "Закупки", title: "Снабжение: возможности и кейс",
    el: <FeatureCase eyebrow="Закупки · Возможности" title={<>Снабжение <span className="text-aurora">под контролем</span></>} lead="Каждая закупка видна от заявки до склада: кто инициировал, кто согласовал, где задержка у поставщика." features={PURCHASE_FEATURES} cases={PURCHASE_CASES} />,
  },

  /* 05 · Планирование */
  {
    id: "s-plan", section: "Планирование", title: "Раздел: планирование",
    el: <SectionMark no="05" label="Планирование" lead="План продаж на сезон, техника и мощности, отгрузки и проекты — в одной системе с фактом." items={["Каскадное планирование продаж", "Возможности и кейс", "Календарь техники и мощностей"]} />,
  },
  {
    id: "plan", section: "Планирование", title: "Демо: каскадный план продаж",
    el: (
      <DemoSlide wide eyebrow="Планирование · Продажи" title={<>Каскадный план продаж <span className="text-aurora">на сезон</span></>} lead="Коммерческий директор раскладывает план по регионам, руководители — по менеджерам. Система проверяет суммы на каждом уровне и после утверждения создаёт плановые сделки." format="приложение · раздел в меню">
        <PlanCascade />
      </DemoSlide>
    ),
  },
  {
    id: "plan-features", section: "Планирование", title: "Планирование: возможности и кейс",
    el: <FeatureCase eyebrow="Планирование · Возможности" title={<>Планируем <span className="text-aurora">не только продажи</span></>} lead="План имеет смысл, только когда рядом виден факт. Поэтому план, техника, отгрузки и проекты живут там же, где сделки и оплаты." features={PLAN_FEATURES} cases={PLAN_CASES} />,
  },
  {
    id: "calendar", section: "Планирование", title: "Календарь техники и мощностей",
    el: (
      <DemoSlide wide eyebrow="Планирование · Ресурсы" title={<>Календарь техники <span className="text-aurora">и мощностей</span></>} lead="Бронь опрыскивателей, протравителей, сушилок и машин под даты и сделки. Переключайте неделю, кликайте по броням — пересечения видно сразу." format="раздел в меню портала">
        <ServiceCalendar />
      </DemoSlide>
    ),
  },

  /* 06 · Логистика */
  {
    id: "s-logistics", section: "Логистика", title: "Раздел: логистика и поставки",
    el: <SectionMark no="06" label="Логистика и поставки" lead="Рейсы, перевозчики, план отгрузок и трекер для клиента — в связке со сделкой и 1С." items={["Сквозная цепочка отгрузки", "Рейсы и перевозчики", "План отгрузок по дням", "Трекер для клиента", "Кейсы"]} />,
  },
  { id: "flow", section: "Логистика", title: "Цепочка отгрузки", el: <LogisticsFlow /> },
  {
    id: "trips", section: "Логистика", title: "Демо: рейсы и перевозчики",
    el: (
      <DemoSlide wide eyebrow="Логистика · Рейсы" title={<>Рейсы <span className="text-aurora">и перевозчики</span></>} lead="Каждый рейс привязан к сделке: ставки перевозчиков, статусы, водитель и документы. Выберите рейс и двигайте статус — отметьте вернувшиеся документы." format="смарт-процесс «Рейс» + приложение">
        <Trips />
      </DemoSlide>
    ),
  },
  {
    id: "ship", section: "Логистика", title: "План отгрузок по дням",
    el: (
      <DemoSlide wide eyebrow="Логистика · План" title={<>План отгрузок <span className="text-aurora">по дням</span></>} lead="Что, куда и каким тоннажем едет на неделю вперёд, с загрузкой по дням и нормой отгрузки. Перегруз дня подсвечивается." format="раздел в меню портала">
        <ShipmentPlan />
      </DemoSlide>
    ),
  },
  {
    id: "tracker", section: "Логистика", title: "Трекер для клиента",
    el: (
      <DemoSlide title={<>Трекер отгрузки <span className="text-aurora">для клиента</span></>} eyebrow="Логистика · Клиентский сервис" lead="Публичная ссылка без входа в портал: клиент видит, на каком этапе его партия — от комплектации до доставки." points={["Переключайте заказы — у каждого свой статус", "Статусы тянутся из сделки автоматически", "При смене этапа — уведомление клиенту в мессенджер"]} format="публичная ссылка">
        <OrderTracker />
      </DemoSlide>
    ),
  },
  {
    id: "logistics-cases", section: "Логистика", title: "Кейсы: логистика",
    el: <CaseSlide eyebrow="Логистика · Кейсы" title={<>Грузы, заказы и сроки — <span className="text-aurora">под контролем</span></>} lead="Как мы связывали логистику, производство и клиентский сервис с CRM у клиентов из разных отраслей." cases={LOGISTICS_CASES} />,
  },

  /* 07 · Интеграции */
  {
    id: "s-integr", section: "Интеграции", title: "Раздел: интеграции",
    el: <SectionMark no="07" label="Интеграции" lead="1С, телефония, мессенджеры, сайт и почта — данные сходятся в карточке клиента без ручного переноса." items={["Общая схема", "1С ⇄ Битрикс24", "Телефония и ИИ-контроль звонков", "Мессенджеры в одном окне", "Почта и сайт", "Кейсы"]} />,
  },
  { id: "hub", section: "Интеграции", title: "Общая схема интеграций", el: <IntegrationHub /> },
  {
    id: "onec", section: "Интеграции", title: "Демо: обмен с 1С",
    el: (
      <DemoSlide wide eyebrow="Интеграции · 1С" title={<>1С ⇄ Битрикс24: <span className="text-aurora">без двойного ввода</span></>} lead="Счёт из сделки уходит в 1С, оплата и отгрузка возвращаются в сделку и двигают её по стадиям. Пройдите сценарий по шагам." format="двусторонний обмен по расписанию или мгновенно">
        <OneCSync />
      </DemoSlide>
    ),
  },
  {
    id: "calls", section: "Интеграции", title: "Демо: телефония и ИИ",
    el: (
      <DemoSlide title={<>Телефония <br /><span className="text-aurora">и ИИ-контроль звонков</span></>} eyebrow="Интеграции · Телефония" lead="Все звонки записываются в карточку клиента. ИИ расшифровывает разговор, проверяет его по скрипту продаж и заполняет поля сделки." points={["Запись и расшифровка каждого звонка", "Оценка по пунктам скрипта и замечания", "Культура, объём и следующий шаг — сразу в сделку"]} format="телефония + приложение">
        <CallQuality />
      </DemoSlide>
    ),
  },
  {
    id: "omni", section: "Интеграции", title: "Демо: мессенджеры",
    el: (
      <DemoSlide wide eyebrow="Интеграции · Мессенджеры" title={<>Все каналы <span className="text-aurora">в одном окне</span></>} lead="Telegram, WhatsApp, MAX, ВКонтакте, Авито и чат на сайте — в Открытых линиях. Каждое обращение сразу становится лидом с источником и ответственным." format="Открытые линии + ИИ-бот">
        <Omnichannel />
      </DemoSlide>
    ),
  },
  {
    id: "mail", section: "Интеграции", title: "Демо: почта и сайт",
    el: (
      <DemoSlide title={<>Почта и сайт: <br /><span className="text-aurora">только целевые заявки</span></>} eyebrow="Интеграции · Почта" lead="Письма на общий адрес разбираются по ключевым словам: запросы хозяйств — в лиды, ответы клиентов — к их сделкам, рассылки и спам — в журнал." points={["Словарь ключевых слов настраивается", "Ответ клиента прикрепляется к его сделке", "Формы, квизы и калькуляторы сайта — тоже в лиды"]} format="фоновый сервис">
        <MailParser />
      </DemoSlide>
    ),
  },
  {
    id: "integr-cases", section: "Интеграции", title: "Кейсы: интеграции",
    el: <CaseSlide eyebrow="Интеграции · Кейсы" title={<>Звонки, чаты и переезд — <span className="text-aurora">на практике</span></>} lead="ИИ в телефонии и открытых линиях, перенос данных из другой CRM без потери истории." cases={INTEGR_CASES} />,
  },

  /* 08 · Отчёты */
  {
    id: "s-reports", section: "Отчёты", title: "Раздел: отчёты и аналитика",
    el: <SectionMark no="08" label="Отчёты и аналитика" lead="Руководитель видит компанию на одном экране — из тех же сделок, задач, звонков и данных 1С." items={["Дашборд план-факт", "Дебиторка хозяйств и взыскание", "Отчёты, которые мы строили"]} />,
  },
  {
    id: "dash", section: "Отчёты", title: "Дашборд план-факт",
    el: (
      <DemoSlide title={<>Дашборд <span className="text-aurora">план-факт сезона</span></>} eyebrow="Отчёты · Руководителю" lead="Выполнение плана по культурам и направлениям из реальных сделок. Переключайте сезон — цифры пересчитываются." points={["План-факт по культурам и направлениям", "Данные из сделок и оплат 1С", "Права: каждый видит свой уровень"]} format="раздел в меню портала">
        <Dashboard />
      </DemoSlide>
    ),
  },
  {
    id: "debt", section: "Отчёты", title: "Дебиторка и взыскание",
    el: (
      <DemoSlide wide eyebrow="Отчёты · Финансы" title={<>Дебиторка хозяйств <span className="text-aurora">и взыскание</span></>} lead="Долги из 1С разложены по корзинам просрочки. Нажмите на корзину, двигайте этап взыскания или отметьте оплату — итоги пересчитаются." format="приложение + смарт-процесс «Взыскание»" caseText="Агрохимическая компания: пять листов Excel с долгами хозяйств сведены в один реестр с отчётом недели и регламентом взыскания.">
        <DebtBuckets />
      </DemoSlide>
    ),
  },
  { id: "reports", section: "Отчёты", title: "Отчёты, которые мы строили", el: <ReportsGallery /> },

  /* 09 · Приложения */
  {
    id: "s-apps", section: "Приложения", title: "Раздел: разработка приложений",
    el: <SectionMark no="09" label="Разработка приложений" lead="Когда штатных возможностей мало — разрабатываем приложение под ваш процесс, прямо в портале." items={["Форматы приложений", "Витрина готовых решений", "Шахматка объектов", "Карта клиентов и полей", "Личный кабинет клиента"]} />,
  },
  { id: "apps-how", section: "Приложения", title: "Форматы приложений", el: <AppsHow /> },
  { id: "apps", section: "Приложения", title: "Витрина приложений", el: <AppsGallery /> },
  { id: "shahmatka", section: "Приложения", title: "Демо: шахматка объектов", el: <ShahmatkaSlide /> },
  {
    id: "clientmap", section: "Приложения", title: "Демо: карта клиентов",
    el: (
      <DemoSlide wide eyebrow="Приложения · Гео" title={<>Карта клиентов <span className="text-aurora">и полей</span></>} lead="Хозяйства и агрофирмы на карте региона со статусом сделки. Кликайте по точкам и фильтруйте по статусу — гео-разрез, которого нет в коробке." format="раздел в меню портала">
        <ClientMap />
      </DemoSlide>
    ),
  },
  {
    id: "portal", section: "Приложения", title: "Демо: личный кабинет клиента",
    el: (
      <DemoSlide title={<>Личный кабинет <span className="text-aurora">клиента</span></>} eyebrow="Приложения · Для клиента" lead="Клиент сам видит заказы, документы и баланс и повторяет закупку в один клик. Рутина уходит от менеджеров." points={["Заказы, документы и баланс — без звонка в офис", "«Повторить» — менеджеру падает задача", "Счета и УПД подтягиваются из 1С"]} format="публичная ссылка">
        <ClientPortal />
      </DemoSlide>
    ),
  },

  /* Финал */
  { id: "how", section: "Финал", title: "Как мы работаем", el: <HowWeWork /> },
  { id: "thanks", section: "Финал", title: "Спасибо за внимание", el: <Thanks /> },
];
