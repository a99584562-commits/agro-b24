import { useState } from "react";
import { Icon } from "./ui.jsx";

// Demo — сезонные напоминания. По истории закупок приложение подсказывает, кому и когда
// пора предлагать семена/СЗР под озимые/яровые. Коробка про сезонность не напоминает.

const ROWS = [
  { who: "КФХ «Восход»", last: "Пшеница «Дарья» · апр 2026", next: "Предзаказ яровых · ноябрь", rec: "Яровая пшеница + протравитель", urg: "soon", days: 12 },
  { who: "Агрохолдинг «Степь»", last: "Озимая пшеница · авг 2025", next: "Подкормка · март", rec: "СЗР + микроудобрения", urg: "soon", days: 21 },
  { who: "Агрофирма «Заря»", last: "Рапс яровой · апр 2026", next: "Предзаказ СЗР · декабрь", rec: "Гербициды + фунгициды на весну", urg: "season", days: 48 },
  { who: "ООО «Нива»", last: "Горох · апр 2026", next: "Яровые · март 2027", rec: "Горох + инокулянт", urg: "cold", days: 280 },
  { who: "ИП Лебедев", last: "Ячмень · май 2025", next: "Яровые · апрель", rec: "Ячмень, 1 репродукция", urg: "soon", days: 9 },
  { who: "КХ «Колос»", last: "Подсолнечник · апр 2026", next: "Подсолнечник · март 2027", rec: "Гибрид подсолнечника", urg: "cold", days: 300 },
];

const URG = {
  soon: { label: "Скоро", c: "#C0563B", s: "rgba(192,86,59,0.12)" },
  season: { label: "В сезон", c: "#C2922E", s: "rgba(194,146,46,0.14)" },
  cold: { label: "Запас", c: "#566B53", s: "rgba(86,107,83,0.12)" },
};

export default function SeasonReminders() {
  const [filter, setFilter] = useState("all");
  const [done, setDone] = useState([]);
  const rows = ROWS.filter((r) => filter === "all" || r.urg === filter);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/12 text-ember ring-1 ring-ember/20">
            <Icon.bell className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-espresso">Сезонные напоминания</p>
            <p className="text-[10px] text-umber">Повторные закупки по истории</p>
          </div>
        </div>
        <div className="hidden gap-1.5 sm:flex">
          <Chip active={filter === "all"} onClick={() => setFilter("all")}>Все</Chip>
          {Object.entries(URG).map(([k, v]) => (
            <Chip key={k} active={filter === k} onClick={() => setFilter(k)} dot={v.c}>{v.label}</Chip>
          ))}
        </div>
      </div>

      <div className="thin-scroll max-h-[24rem] overflow-y-auto p-4 sm:p-5">
        <div className="space-y-2">
          {rows.map((r) => {
            const u = URG[r.urg];
            const isDone = done.includes(r.who);
            return (
              <div key={r.who} className={`grid grid-cols-[1.1fr_1fr_1.2fr_auto] items-center gap-3 rounded-xl px-3.5 py-2.5 ring-1 transition-all ${isDone ? "bg-sage/[0.06] ring-sage/20 opacity-70" : "bg-espresso/[0.03] ring-espresso/[0.06]"}`}>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-espresso">{r.who}</p>
                  <p className="truncate text-[10.5px] text-umber">был: {r.last}</p>
                </div>
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: u.s, color: u.c }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: u.c }} /> {r.next}
                  </span>
                  <p className="mt-0.5 text-[10px] tabular-nums text-umber">через ~{r.days} дн.</p>
                </div>
                <p className="min-w-0 truncate text-[12px] text-espresso/90"><span className="text-umber">предложить:</span> {r.rec}</p>
                <button
                  onClick={() => setDone((d) => (d.includes(r.who) ? d.filter((x) => x !== r.who) : [...d, r.who]))}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all active:scale-95 ${isDone ? "bg-sage/15 text-[#3c6b32]" : "bg-espresso text-cream hover:bg-bark"}`}
                >
                  {isDone ? <><Icon.check className="h-3.5 w-3.5 stroke-current fill-none" /> Задача</> : <><Icon.bell className="h-3.5 w-3.5 stroke-current fill-none" /> Поставить</>}
                </button>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-center text-[10px] text-umber/70">«Поставить» создаёт задачу менеджеру и черновик КП · кликайте по строкам</p>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children, dot }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all duration-300 ease-spring ${active ? "bg-espresso text-cream" : "bg-espresso/[0.05] text-umber ring-1 ring-espresso/10 hover:bg-espresso/10"}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />}
      {children}
    </button>
  );
}
