import { useEffect, useRef, useState } from "react";
import { Avatar, B24Shell, BI, Pill, StageBar, StageHead, TLDot } from "./b24kit.jsx";

// Демо — смарт-процесс «Ремонт техники» так, как он выглядит в Битрикс24:
// канбан по стадиям → клик по карточке открывает элемент (слайдер) со стадиями,
// полями слева и таймлайном справа. В таймлайне — задание бизнес-процесса:
// «Приступить» → «Утвердить», после чего роботы двигают стадию и создают закупку.

const STAGES = [
  { t: "Новая заявка", c: "#c9d5e3" },
  { t: "Диагностика", c: "#47b4f5", dark: true },
  { t: "Согласование затрат", c: "#a78bfa", dark: true },
  { t: "Ремонт", c: "#ffd43b" },
  { t: "Готово", c: "#7bd500" },
];

const ROBOT = {
  1: ["Задача главному инженеру: провести диагностику", "Техника снята с календаря бронирования"],
  2: ["Запущен бизнес-процесс «Согласование затрат»"],
  3: ["Задача механику: начать ремонт", "Запущен счётчик простоя техники"],
  4: ["Акт выполненных работ сформирован по шаблону", "Техника снова доступна в календаре"],
};

const MECH = { "А. Лыков": "#e8833a", "Р. Гиниятов": "#5a8dee", "С. Петров": "#3fb68b" };

const INIT = [
  { id: 7, t: "Комбайн № 7 · течь гидравлики", cost: 184000, mech: "А. Лыков", st: 2, date: "сегодня, 09:12", inv: "ОС-000117", place: "Отделение № 2", bp: "wait" },
  { id: 14, t: "Трактор МТЗ-82 № 14 · не заводится", cost: 0, mech: "Р. Гиниятов", st: 0, date: "сегодня, 10:05", inv: "ОС-000214", place: "Центральная база" },
  { id: 3, t: "Опрыскиватель № 3 · форсунки", cost: 26500, mech: "С. Петров", st: 1, date: "вчера, 16:40", inv: "ОС-000089", place: "Отделение № 1" },
  { id: 5, t: "Сеялка № 5 · привод высевающих", cost: 41200, mech: "А. Лыков", st: 3, date: "14 окт", inv: "ОС-000156", place: "Центральная база" },
  { id: 21, t: "КамАЗ № 21 · тормозная система", cost: 63800, mech: "Р. Гиниятов", st: 3, date: "13 окт", inv: "ОС-000301", place: "Автопарк" },
  { id: 2, t: "Погрузчик № 2 · замена ковша", cost: 98000, mech: "С. Петров", st: 4, date: "10 окт", inv: "ОС-000042", place: "Склад зерна" },
];

const rub = (n) => (n ? n.toLocaleString("ru-RU") + " ₽" : "—");

function seedTimeline(it) {
  const tl = [{ k: "created", t: "Элемент создан", d: "Механик создал заявку с фото из мобильного приложения", time: "09:12" }];
  for (let k = 1; k <= it.st; k++) tl.unshift({ k: "stage", from: STAGES[k - 1].t, to: STAGES[k].t, time: `${9 + k}:${10 + k * 7}` });
  if (it.st >= 2 && it.id === 7) tl.unshift({ k: "bp", t: "Бизнес-процесс запущен", d: "Согласование затрат · маршрут: главный инженер → финдиректор", time: "11:31" });
  return tl;
}

export default function B24Smart() {
  const [items, setItems] = useState(INIT);
  const [open, setOpen] = useState(null);
  const [tls, setTls] = useState(() => Object.fromEntries(INIT.map((i) => [i.id, seedTimeline(i)])));
  const [taskOpen, setTaskOpen] = useState(false);

  const it = items.find((x) => x.id === open);
  const tlRef = useRef(null);
  const tlLen = it ? tls[it.id].length : 0;
  useEffect(() => {
    tlRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [tlLen, open]);

  function push(id, entries) {
    setTls((m) => ({ ...m, [id]: [...entries, ...m[id]] }));
  }
  function setStage(id, k) {
    const cur = items.find((x) => x.id === id);
    if (!cur || k === cur.st) return;
    const now = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    const robots = (ROBOT[k] || []).map((t) => ({ k: "robot", t, time: now }));
    push(id, [...robots.reverse(), { k: "stage", from: STAGES[cur.st].t, to: STAGES[k].t, time: now }]);
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, st: k, bp: k === 2 && x.bp !== "done" ? "wait" : x.bp } : x)));
  }
  function approve(ok) {
    const now = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    setTaskOpen(false);
    if (!ok) {
      push(it.id, [{ k: "bpdone", t: "Задание выполнено: отклонено", d: "Комментарий: «Запросить ещё одно КП на запчасти»", time: now, bad: true }]);
      setItems((xs) => xs.map((x) => (x.id === it.id ? { ...x, bp: "rejected" } : x)));
      return;
    }
    push(it.id, [
      { k: "link", t: "Создан связанный элемент «Закупка» № 312", d: `Смарт-процесс «Закупки» · запчасти на ${rub(it.cost)}`, time: now },
      { k: "bpdone", t: "Задание выполнено: затраты утверждены", d: "Финансовый директор · Е. Белова", time: now },
    ]);
    setItems((xs) => xs.map((x) => (x.id === it.id ? { ...x, bp: "done", link: "Закупка № 312" } : x)));
    setTimeout(() => setStage(it.id, 3), 650);
  }
  function reset() {
    setItems(INIT);
    setTls(Object.fromEntries(INIT.map((i) => [i.id, seedTimeline(i)])));
    setOpen(null);
    setTaskOpen(false);
  }

  return (
    <div className="relative w-full overflow-x-auto" data-noswipe>
      <B24Shell tabs={["CRM", "Ремонт техники", "Закупки", "Сделки", "Ещё"]} active={1} rail={4} className="h-[31rem] min-w-[60rem] rounded-[calc(2rem-0.375rem)]">
        {/* title row */}
        <div className="flex items-center gap-2 px-4 pb-2.5 pt-1">
          <h3 className="text-[19px] font-semibold text-white">Ремонт техники</h3>
          <span className="rounded-full bg-[#2fc26e] px-3 py-1 text-[11.5px] font-semibold text-white">Создать</span>
          <span className="rounded-md bg-white/15 px-2 py-1 text-[11.5px] text-white">Общая ▾</span>
          <span className="ml-1 flex h-7 w-56 items-center gap-2 rounded-md bg-white/90 px-2.5 text-[11.5px] text-[#9aa5b1]">
            <BI.search className="h-3.5 w-3.5 stroke-current fill-none" /> Фильтр + поиск
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-[11px] text-white/85">
            <span className="rounded-md bg-white/20 px-2 py-0.5 font-semibold text-white">Канбан</span>
            <span className="px-1.5">Список</span>
            <span className="px-1.5">Дела</span>
            <button onClick={reset} className="ml-2 rounded-md bg-white/15 px-2 py-0.5 hover:bg-white/25">↺ Сначала</button>
          </span>
        </div>

        {/* kanban */}
        <div className="flex h-[calc(100%-3.25rem)] gap-2 px-3 pb-3">
          {STAGES.map((st, k) => {
            const col = items.filter((x) => x.st === k);
            const sum = col.reduce((a, x) => a + x.cost, 0);
            return (
              <div key={st.t} className="flex min-w-0 flex-1 flex-col">
                <StageHead name={st.t} count={col.length} color={st.c} dark={st.dark} />
                <p className="mt-1.5 text-center text-[16px] font-semibold tabular-nums text-white">{sum ? rub(sum) : "0 ₽"}</p>
                <div className="mt-1 flex h-6 items-center justify-center rounded-md bg-white/15 text-[11px] text-white">+</div>
                <div className="thin-scroll mt-2 flex flex-1 flex-col gap-1.5 overflow-y-auto pr-0.5">
                  {col.map((x) => (
                    <button
                      key={x.id}
                      onClick={() => setOpen(x.id)}
                      className="animate-floatUp rounded-lg bg-white p-2 text-left shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-shadow [animation-duration:0.45s] hover:shadow-[0_6px_16px_rgba(0,0,0,0.18)]"
                      style={{ borderLeft: `3px solid ${st.c}` }}
                    >
                      <div className="flex items-start gap-1">
                        <p className="min-w-0 flex-1 text-[12px] font-semibold leading-snug text-[#333]">{x.t}</p>
                        <span className="flex flex-col gap-1 pt-0.5 text-[#b0b9c3]">
                          <BI.phone className="h-3 w-3 stroke-current fill-none" />
                          <BI.chat className="h-3 w-3 stroke-current fill-none" />
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11.5px] font-semibold tabular-nums text-[#333]">{rub(x.cost)}</p>
                      <p className="text-[11px] text-[#2067b0]">{x.mech}</p>
                      {x.bp === "wait" && x.st === 2 && <span className="mt-1 inline-block rounded bg-[#fff4c2] px-1.5 py-px text-[9.5px] font-semibold text-[#8a6d00]">Задание БП</span>}
                      {x.link && <span className="mt-1 ml-1 inline-block rounded bg-[#e5f7fe] px-1.5 py-px text-[9.5px] font-semibold text-[#1a8fc0]">{x.link}</span>}
                      <div className="mt-1.5 flex items-center justify-between text-[10.5px] text-[#a0aab4]">
                        <span>+ Дело</span>
                        <span className="flex items-center gap-1.5">
                          {x.date}
                          <Avatar ini={x.mech.split(" ")[1][0]} color={MECH[x.mech]} size={16} />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </B24Shell>

      {!open && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#1f2a37]/85 px-3 py-1 text-[11px] text-white">
          Нажмите на карточку «Комбайн № 7» — откроется элемент смарт-процесса
        </div>
      )}

      {/* item slider */}
      {it && (
        <div className="absolute inset-0 z-20 flex min-w-[60rem] overflow-hidden rounded-[calc(2rem-0.375rem)] bg-[#0b2a9e]/30 backdrop-blur-[2px]" style={{ fontFamily: '"Open Sans", "Helvetica Neue", Arial, sans-serif' }}>
          <div className="flex w-14 shrink-0 justify-center pt-3">
            <button onClick={() => setOpen(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2fc6f6] text-white shadow-md hover:brightness-110" aria-label="Закрыть">
              <BI.close className="h-4 w-4 stroke-current fill-none" />
            </button>
          </div>
          <div className="flex min-w-0 flex-1 animate-floatUp flex-col rounded-l-2xl bg-[#eef2f4] [animation-duration:0.45s]">
            {/* header */}
            <div className="rounded-tl-2xl bg-white px-4 pb-2.5 pt-3">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-[17px] font-semibold text-[#333]">{it.t}</h3>
                <BI.pencil className="h-3.5 w-3.5 shrink-0 stroke-current fill-none text-[#a0aab4]" />
                <span className="text-[11.5px] text-[#535c69]">Общая ▾</span>
                <span className="ml-auto flex shrink-0 items-center gap-1.5 text-[11px] text-[#535c69]">
                  <span className="rounded-md border border-[#dfe3e8] px-2 py-0.5">Документ ▾</span>
                  <span className="rounded-md border border-[#dfe3e8] p-1">
                    <BI.gear className="h-3.5 w-3.5 stroke-current fill-none" />
                  </span>
                </span>
              </div>
              <div className="mt-2.5">
                <StageBar stages={STAGES} current={it.st} onPick={(k) => setStage(it.id, k)} />
              </div>
              <div className="mt-2.5 flex items-center gap-4 text-[12px] text-[#535c69]">
                {["Общие", "Товары", "История", "Бизнес-процессы", "Роботы", "Связи", "Ещё ▾"].map((t, k) => (
                  <span key={t} className={k === 0 ? "border-b-2 border-[#2fc6f6] pb-0.5 font-semibold text-[#333]" : "pb-0.5"}>
                    {t}
                  </span>
                ))}
                <span className="ml-auto flex items-center gap-1 rounded-full border border-[#2fc6f6] px-2.5 py-0.5 text-[11px] font-semibold text-[#1a8fc0]">
                  <BI.bp className="h-3.5 w-3.5 stroke-current fill-none" /> Бизнес-процессы
                </span>
              </div>
            </div>

            {/* body */}
            <div className="grid min-h-0 flex-1 grid-cols-[0.9fr_1.25fr] gap-3 p-3">
              {/* left: fields */}
              <div className="thin-scroll flex min-h-0 flex-col gap-2.5 overflow-y-auto">
                <Block title="О технике">
                  <Field k="Техника" v={it.t.split(" · ")[0]} />
                  <Field k="Неисправность" v={it.t.split(" · ")[1]} />
                  <Field k="Инвентарный номер" v={it.inv} />
                  <Field k="Местоположение" v={it.place} />
                </Block>
                <Block title="Ответственные и затраты">
                  <div className="flex items-center gap-2 py-1">
                    <Avatar ini={it.mech.split(" ")[1][0]} color={MECH[it.mech]} />
                    <div className="leading-tight">
                      <p className="text-[10.5px] text-[#a0aab4]">Механик</p>
                      <p className="text-[12px] text-[#2067b0]">{it.mech}</p>
                    </div>
                  </div>
                  <Field k="Затраты на ремонт" v={<span className="text-[18px] font-semibold text-[#333]">{rub(it.cost)}</span>} />
                </Block>
                <Block title="Связи">
                  <Field k="Сделка / основание" v={<span className="text-[#2067b0]">План ТО · сезон 2026</span>} />
                  <Field k="Закупка запчастей" v={it.link ? <span className="animate-floatUp text-[#2067b0]">{it.link}</span> : <span className="text-[#a0aab4]">появится после согласования</span>} />
                </Block>
              </div>

              {/* right: timeline */}
              <div className="flex min-h-0 flex-col rounded-xl">
                <div className="rounded-xl bg-white px-3 py-2">
                  <div className="flex gap-3 text-[11.5px] text-[#535c69]">
                    <span className="border-b-2 border-[#2fc6f6] pb-0.5 font-semibold text-[#333]">Дело</span>
                    <span>Комментарий</span>
                    <span>Задача</span>
                    <span>Письмо</span>
                    <span>Ещё ▾</span>
                  </div>
                  <div className="mt-1.5 rounded-md border border-[#dfe3e8] px-2.5 py-1.5 text-[11.5px] text-[#a0aab4]">Что нужно сделать</div>
                </div>

                <div ref={tlRef} className="thin-scroll relative mt-1 min-h-0 flex-1 overflow-y-auto pr-1">
                  <span className="absolute bottom-0 left-[11px] top-0 w-px bg-[#dfe3e8]" />
                  <Pill>Что нужно сделать</Pill>
                  {it.bp === "wait" && it.st === 2 ? (
                    <div className="relative flex gap-2 pb-2">
                      <TLDot glyph={BI.bp} />
                      <div className="min-w-0 flex-1 rounded-xl border border-[#f3e3a1] bg-[#fffbea] p-2.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[12px] font-semibold text-[#333]">Задание бизнес-процесса</span>
                          <span className="rounded bg-[#e5f7fe] px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-[#1a9ad6]">ждёт выполнения</span>
                          <span className="text-[10.5px] text-[#a0aab4]">сегодня, 11:31</span>
                        </div>
                        <div className="mt-1.5 grid grid-cols-[5.5rem_1fr] gap-y-0.5 text-[11.5px]">
                          <span className="text-[#a0aab4]">Процесс</span>
                          <span className="text-[#2067b0]">Согласование затрат</span>
                          <span className="text-[#a0aab4]">Задание</span>
                          <span className="text-[#2067b0]">Утвердить затраты {rub(it.cost)}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-[#e4e8ec] bg-white px-2.5 py-1.5 text-[10px] text-[#7b8794]">
                          <span className="flex flex-col items-center">
                            <Avatar ini="Г" color="#3fb68b" size={18} />
                            гл. инженер ✓
                          </span>
                          <span className="h-px flex-1 bg-[#dfe3e8]" />
                          <span className="flex flex-col items-center font-semibold text-[#1a9ad6]">
                            <Avatar ini="Б" color="#1a9ad6" size={18} />
                            финдиректор
                          </span>
                          <span className="h-px flex-1 bg-[#dfe3e8]" />
                          <span className="flex flex-col items-center opacity-50">
                            <Avatar ini="Б" color="#9aa5b1" size={18} />
                            бухгалтерия
                          </span>
                        </div>
                        {!taskOpen ? (
                          <div className="mt-2 flex gap-1.5">
                            <button onClick={() => setTaskOpen(true)} className="rounded-full bg-[#3bc8f5] px-3.5 py-1 text-[10.5px] font-bold uppercase text-white hover:brightness-105">
                              Приступить
                            </button>
                            <span className="rounded-full border border-[#c9d0d8] px-3.5 py-1 text-[10.5px] font-bold uppercase text-[#535c69]">Открыть</span>
                          </div>
                        ) : (
                          <div className="mt-2 animate-floatUp rounded-lg border border-[#e4e8ec] bg-white p-2 [animation-duration:0.4s]">
                            <p className="text-[11px] text-[#535c69]">Комментарий</p>
                            <div className="mt-1 rounded-md border border-[#dfe3e8] px-2 py-1 text-[11px] text-[#333]">Запчасти у поставщика с лучшей ценой, в бюджете статьи.</div>
                            <div className="mt-2 flex gap-1.5">
                              <button onClick={() => approve(true)} className="flex items-center gap-1 rounded-full bg-[#7bd500] px-3.5 py-1 text-[10.5px] font-bold uppercase text-white hover:brightness-105">
                                <BI.check className="h-3 w-3 stroke-current fill-none" /> Утвердить
                              </button>
                              <button onClick={() => approve(false)} className="flex items-center gap-1 rounded-full bg-[#ff5752] px-3.5 py-1 text-[10.5px] font-bold uppercase text-white hover:brightness-105">
                                <BI.close className="h-3 w-3 stroke-current fill-none" /> Отклонить
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : it.st === 3 ? (
                    <Activity title="Начать ремонт" who={it.mech} />
                  ) : (
                    <p className="relative pb-2 pl-8 text-[11px] text-[#a0aab4]">Нет запланированных дел</p>
                  )}

                  <Pill color="#2fc6f6">Сегодня</Pill>
                  {tls[it.id].map((e, k) => (
                    <TLItem key={`${it.id}-${tls[it.id].length - k}`} e={e} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Block({ title, children }) {
  return (
    <div className="rounded-xl bg-white px-3 py-2.5">
      <p className="text-[10.5px] font-bold uppercase tracking-wide text-[#535c69]">{title}</p>
      <div className="mt-1.5 space-y-1.5">{children}</div>
    </div>
  );
}

function Field({ k, v }) {
  return (
    <div className="leading-tight">
      <p className="text-[10.5px] text-[#a0aab4]">{k}</p>
      <div className="text-[12px] text-[#333]">{v}</div>
    </div>
  );
}

function Activity({ title, who }) {
  return (
    <div className="relative flex gap-2 pb-2">
      <TLDot glyph={BI.task} color="#ffb300" />
      <div className="min-w-0 flex-1 animate-floatUp rounded-xl border border-[#f3e3a1] bg-[#fffbea] p-2.5 [animation-duration:0.45s]">
        <p className="text-[12px] font-semibold text-[#333]">☐ {title}</p>
        <p className="mt-0.5 text-[11px] text-[#7b8794]">Ответственный: {who} · поставлено роботом · срок 3 дня</p>
        <div className="mt-1.5 flex gap-1.5">
          <span className="rounded-full bg-[#3bc8f5] px-3 py-0.5 text-[10px] font-bold uppercase text-white">Выполнено</span>
          <span className="rounded-full border border-[#c9d0d8] px-3 py-0.5 text-[10px] font-bold uppercase text-[#535c69]">Редактировать</span>
        </div>
      </div>
    </div>
  );
}

function TLItem({ e }) {
  const map = {
    stage: [BI.crm, "#a0aab4"],
    robot: [BI.robot, "#2fc6f6"],
    bp: [BI.bp, "#2fc6f6"],
    bpdone: [BI.check, e.bad ? "#ff5752" : "#7bd500"],
    link: [BI.doc, "#a78bfa"],
    created: [BI.pencil, "#a0aab4"],
  }[e.k];
  return (
    <div className="relative flex animate-floatUp gap-2 pb-1.5 [animation-duration:0.45s]">
      <TLDot glyph={map[0]} color={map[1]} />
      <div className="min-w-0 flex-1 rounded-xl bg-white px-2.5 py-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[11.5px] font-semibold text-[#333]">
            {e.k === "stage" ? "Стадия изменена" : e.k === "robot" ? "Робот" : e.t}
          </span>
          <span className="text-[10.5px] text-[#a0aab4]">{e.time}</span>
        </div>
        {e.k === "stage" ? (
          <p className="mt-0.5 flex flex-wrap items-center gap-1 text-[11px]">
            <span className="rounded bg-[#eef2f4] px-1.5 py-px text-[#535c69]">{e.from}</span>→<span className="rounded bg-[#e5f7fe] px-1.5 py-px text-[#1a8fc0]">{e.to}</span>
          </p>
        ) : e.k === "robot" ? (
          <p className="mt-0.5 text-[11px] text-[#535c69]">{e.t}</p>
        ) : (
          e.d && <p className="mt-0.5 text-[11px] text-[#535c69]">{e.d}</p>
        )}
      </div>
    </div>
  );
}
