import { useRef, useState } from "react";
import { Avatar, B24Shell, BI, StageHead } from "./b24kit.jsx";

// Канбан сделок в стиле Битрикс24 — живой: сделку можно перетащить между стадиями
// (мышь или тач), суммы колонок пересчитываются, а на входе в стадию «срабатывает робот».

const COLS = [
  { name: "Новый запрос", accent: "#c9d5e3", robot: "" },
  { name: "Расчёт и КП", accent: "#47b4f5", dark: true, robot: "Робот: КП сформировано по шаблону и отправлено клиенту" },
  { name: "Согласование счёта", accent: "#a78bfa", dark: true, robot: "Робот: запущен БП согласования счёта — задача РОПу" },
  { name: "Договор", accent: "#ffd43b", robot: "Робот: договор создан из шаблона и ушёл юристу" },
  { name: "Оплата", accent: "#39d3c4", robot: "Робот: задача бухгалтерии — проверить поступление из 1С" },
  { name: "Отгрузка", accent: "#7bd500", robot: "Робот: создана заявка на рейс, логист получил задачу" },
];

const INIT = [
  { id: 1, who: "КФХ «Рассвет»", what: "Подсолнечник, 40 п.е.", sum: 1.9, av: "#3D6CB0", m: "С", stage: 0 },
  { id: 2, who: "СХП «Нива-Юг»", what: "Гербициды, 1 200 га", sum: 3.4, av: "#9D5BA8", m: "О", stage: 0 },
  { id: 3, who: "Агрофирма «Колос»", what: "Кукуруза ФАО 250", sum: 6.2, av: "#B07B3C", m: "Г", stage: 1 },
  { id: 4, who: "КФХ «Луговое»", what: "Селитра, 80 т", sum: 2.6, av: "#3D6CB0", m: "С", stage: 1 },
  { id: 5, who: "ООО «Заря-Агро»", what: "Озимая пшеница, 120 т", sum: 4.8, av: "#9D5BA8", m: "О", stage: 2 },
  { id: 6, who: "СПК «Верный путь»", what: "Фунгициды + адъюванты", sum: 2.1, av: "#B07B3C", m: "Г", stage: 3 },
  { id: 7, who: "Агрохолдинг «Поле»", what: "Семена + СЗР, сезон", sum: 11.5, av: "#3D6CB0", m: "С", stage: 4 },
  { id: 8, who: "КФХ «Ковыль»", what: "Рапс яровой, 15 т", sum: 1.4, av: "#9D5BA8", m: "О", stage: 5 },
];

export function CrmKanban() {
  const [deals, setDeals] = useState(INIT);
  const [drag, setDrag] = useState(null); // {id, x, y, dx, dy, w, h}
  const [over, setOver] = useState(null); // column index under pointer
  const [moved, setMoved] = useState(false);
  const [toast, setToast] = useState(null); // {id, text}
  const colRefs = useRef([]);
  const rootRef = useRef(null);
  const toastTimer = useRef(0);

  const sumOf = (stage) => deals.filter((d) => d.stage === stage).reduce((a, d) => a + d.sum, 0);

  // map any X to the nearest column (gaps snap left, overflow snaps to edges)
  function colAt(clientX) {
    const rects = colRefs.current.map((el) => el?.getBoundingClientRect());
    if (!rects[0]) return null;
    for (let i = 0; i < rects.length; i++) {
      if (rects[i] && clientX <= rects[i].right + 6) return i;
    }
    return rects.length - 1;
  }

  function onDown(e, deal) {
    if (e.button === 1 || e.button === 2) return;
    e.stopPropagation();
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    try {
      card.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic / unsupported pointer */
    }
    setMoved(false);
    const rr = rootRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
    setDrag({ id: deal.id, x: e.clientX, y: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, w: r.width, h: r.height, rl: rr.left, rt: rr.top });
    setOver(deal.stage);
  }
  function onMove(e) {
    if (!drag) return;
    e.stopPropagation();
    setMoved(true);
    setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : d));
    setOver(colAt(e.clientX));
  }
  function onUp(e) {
    if (!drag) return;
    e.stopPropagation();
    const target = colAt(e.clientX);
    const deal = deals.find((d) => d.id === drag.id);
    if (target != null) setDeals((ds) => ds.map((d) => (d.id === drag.id ? { ...d, stage: target } : d)));
    if (target != null && deal && target !== deal.stage && COLS[target].robot) {
      clearTimeout(toastTimer.current);
      setToast({ id: Date.now(), who: deal.who, text: COLS[target].robot });
      toastTimer.current = setTimeout(() => setToast(null), 3600);
    }
    setDrag(null);
    setOver(null);
  }

  const dragDeal = drag ? deals.find((d) => d.id === drag.id) : null;
  const fmt = (n) => n.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const card = (d, ghost) => (
    <>
      <div className="flex items-start gap-1">
        <p className="min-w-0 flex-1 truncate text-[12px] font-semibold text-[#333]">{d.who}</p>
        {!ghost && (
          <span className="flex gap-1 pt-0.5 text-[#b0b9c3]">
            <BI.phone className="h-3 w-3 stroke-current fill-none" />
            <BI.mail className="h-3 w-3 stroke-current fill-none" />
          </span>
        )}
      </div>
      <p className="mt-0.5 text-[12px] font-semibold tabular-nums text-[#333]">{fmt(d.sum)} млн ₽</p>
      <p className="truncate text-[11px] text-[#2067b0]">{d.what}</p>
      <div className="mt-1.5 flex items-center justify-between text-[10.5px] text-[#a0aab4]">
        <span>+ Дело</span>
        <Avatar ini={d.m} color={d.av} size={16} />
      </div>
    </>
  );

  return (
    <div ref={rootRef} className="relative h-full w-full" data-noswipe>
      <B24Shell tabs={["Лиды", "Сделки", "Клиенты", "Продажи", "Ещё ▾"]} active={1} rail={4} className="h-full rounded-[calc(2rem-0.375rem)]">
        <div className="flex items-center gap-2 px-4 pb-2.5 pt-1">
          <h3 className="text-[19px] font-semibold text-white">Сделки</h3>
          <span className="rounded-full bg-[#2fc26e] px-3 py-1 text-[11.5px] font-semibold text-white">Создать</span>
          <span className="rounded-md bg-white/15 px-2 py-1 text-[11.5px] text-white">Продажи семян и СЗР ▾</span>
          <span className="ml-1 hidden h-7 w-52 items-center gap-2 rounded-md bg-white/90 px-2.5 text-[11.5px] text-[#9aa5b1] md:flex">
            <BI.search className="h-3.5 w-3.5 stroke-current fill-none" /> Фильтр + поиск
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-[11px] text-white/85">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7bd500]" /> перетащите сделку между стадиями
          </span>
        </div>

        <div className="flex h-[calc(100%-3.25rem)] gap-2 px-3 pb-3">
          {COLS.map((c, ci) => {
            const colDeals = deals.filter((d) => d.stage === ci);
            const sum = sumOf(ci);
            const isOver = over === ci && drag;
            return (
              <div
                key={c.name}
                ref={(el) => (colRefs.current[ci] = el)}
                className={`flex min-w-0 flex-1 flex-col rounded-lg transition-colors duration-200 ${isOver ? "bg-white/15 ring-2 ring-white/50" : ""}`}
              >
                <StageHead name={c.name} count={colDeals.length} color={c.accent} dark={c.dark} />
                <p className="mt-1.5 text-center text-[16px] font-semibold tabular-nums text-white">{sum > 0 ? `${fmt(sum)} млн ₽` : "0 ₽"}</p>
                <div className="mt-1 flex h-6 items-center justify-center rounded-md bg-white/15 text-[11px] text-white">{ci === 0 ? "+ Быстрая сделка" : "+"}</div>
                <div className="mt-2 flex min-h-[3rem] flex-col gap-1.5">
                  {colDeals.map((d, di) => {
                    const isDragging = drag?.id === d.id;
                    return (
                      <div
                        key={d.id}
                        onPointerDown={(e) => onDown(e, d)}
                        onPointerMove={onMove}
                        onPointerUp={onUp}
                        style={{
                          borderLeft: `3px solid ${c.accent}`,
                          touchAction: "none",
                          animationDelay: `${150 + (ci * 2 + di) * 60}ms`,
                          opacity: isDragging && moved ? 0.3 : 1,
                        }}
                        className="animate-floatUp cursor-grab touch-none select-none rounded-lg bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-shadow active:cursor-grabbing hover:shadow-[0_6px_16px_rgba(0,0,0,0.18)]"
                      >
                        {card(d)}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </B24Shell>

      {/* robot toast */}
      {toast && (
        <div key={toast.id} className="pointer-events-none absolute bottom-4 left-1/2 z-40 w-[min(92%,30rem)] -translate-x-1/2 animate-floatUp">
          <div className="flex items-start gap-3 rounded-xl bg-[#1a2026] px-4 py-3 text-white shadow-[0_18px_40px_rgba(26,32,38,0.35)]">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#2FC6F6]">
              <BI.robot className="h-4 w-4 stroke-current fill-none" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] text-white/60">{toast.who} · стадия сменилась</p>
              <p className="text-[13px] font-medium leading-snug">{toast.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* drag ghost — позиция считается от корня: у предков слайда есть transform */}
      {drag && dragDeal && moved && (
        <div
          className="pointer-events-none absolute z-50 rotate-2 rounded-lg bg-white p-2 shadow-[0_18px_40px_rgba(0,0,0,0.3)] ring-1 ring-black/10"
          style={{
            left: drag.x - drag.dx - drag.rl,
            top: drag.y - drag.dy - drag.rt,
            width: drag.w,
            borderLeft: `3px solid ${COLS[dragDeal.stage].accent}`,
          }}
        >
          {card(dragDeal, true)}
        </div>
      )}
    </div>
  );
}
