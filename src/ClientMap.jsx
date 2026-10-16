import { useState } from "react";
import { Icon } from "./ui.jsx";

// Demo — карта клиентов и полей. КФХ и агрофирмы на карте региона со статусом сделки.
// Штатный Б24 гео-аналитики не даёт. Клик по пину — карточка клиента справа.

const STATUS = {
  active: { label: "Активная сделка", color: "#2F8F4E", soft: "rgba(47,143,78,0.14)" },
  lead: { label: "Лид", color: "#C2922E", soft: "rgba(194,146,46,0.16)" },
  shipped: { label: "Отгружено", color: "#6FA85C", soft: "rgba(111,168,92,0.16)" },
  debt: { label: "Дебиторка", color: "#C0563B", soft: "rgba(192,86,59,0.14)" },
};

const CLIENTS = [
  { name: "Агрохолдинг «Степь»", x: 28, y: 30, st: "active", crop: "Пшеница озимая", area: "2 100 га", sum: "5,9 млн ₽", note: "Отгрузка через 3 дня" },
  { name: "КФХ «Восход»", x: 52, y: 22, st: "active", crop: "Пшеница «Дарья»", area: "1 200 га", sum: "2,9 млн ₽", note: "Согласование цены" },
  { name: "ООО «Нива»", x: 68, y: 42, st: "active", crop: "Горох", area: "950 га", sum: "1,8 млн ₽", note: "Счёт выставлен" },
  { name: "Агрофирма «Заря»", x: 40, y: 56, st: "shipped", crop: "Рапс яровой", area: "800 га", sum: "3,1 млн ₽", note: "Доставлено 12 мая" },
  { name: "ИП Лебедев", x: 74, y: 66, st: "lead", crop: "Ячмень", area: "450 га", sum: "—", note: "Ждёт КП" },
  { name: "КФХ «Урожай»", x: 22, y: 68, st: "lead", crop: "Лён масличный", area: "300 га", sum: "—", note: "Первичный контакт" },
  { name: "КХ «Колос»", x: 58, y: 78, st: "debt", crop: "Подсолнечник", area: "600 га", sum: "0,7 млн ₽", note: "Просрочка 14 дней" },
];

export default function ClientMap() {
  const [filter, setFilter] = useState("all");
  const [sel, setSel] = useState(1);
  const visible = (c) => filter === "all" || c.st === filter;
  const client = CLIENTS[sel];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/12 text-ember ring-1 ring-ember/20">
            <Icon.map className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-espresso">Карта клиентов и полей</p>
            <p className="text-[10px] text-umber">Регион · сделки по статусам</p>
          </div>
        </div>
        <div className="hidden flex-wrap gap-1.5 sm:flex">
          <Chip active={filter === "all"} onClick={() => setFilter("all")}>Все</Chip>
          {Object.entries(STATUS).map(([k, v]) => (
            <Chip key={k} active={filter === k} onClick={() => setFilter(k)} dot={v.color}>{v.label}</Chip>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-[1.5fr_1fr]">
        {/* map */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-espresso/[0.08]" style={{ background: "linear-gradient(135deg,#eef4e4,#e2ecd6)" }}>
          <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            {/* field stripes */}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={i} x1={i * 11} y1="0" x2={i * 11 - 20} y2="75" stroke="#6FA85C" strokeWidth="0.3" opacity="0.18" />
            ))}
            {/* region blob */}
            <path d="M12 22 Q20 8 42 12 Q62 6 78 20 Q92 32 84 50 Q80 68 58 70 Q34 74 20 60 Q6 46 12 22 Z" fill="rgba(47,143,78,0.08)" stroke="#2F8F4E" strokeWidth="0.5" strokeOpacity="0.35" />
            {/* river */}
            <path d="M30 10 Q44 30 38 46 Q34 60 50 72" fill="none" stroke="#5b9bd0" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" />
          </svg>

          {CLIENTS.map((c, i) => {
            const s = STATUS[c.st];
            const on = visible(c);
            const active = i === sel;
            return (
              <button
                key={c.name}
                onClick={() => { setSel(i); }}
                className="absolute -translate-x-1/2 -translate-y-full transition-all duration-300 ease-spring"
                style={{ left: `${c.x}%`, top: `${c.y}%`, opacity: on ? 1 : 0.2, zIndex: active ? 20 : 10 }}
                title={c.name}
              >
                <span className="relative flex flex-col items-center">
                  <span
                    className={`flex items-center justify-center rounded-full ring-2 ring-white transition-all duration-300 ${active ? "h-6 w-6" : "h-4 w-4"}`}
                    style={{ background: s.color, boxShadow: active ? `0 0 0 6px ${s.soft}` : "0 2px 6px rgba(21,41,28,0.3)" }}
                  >
                    {active && <Icon.pin className="h-3.5 w-3.5 stroke-white fill-none" />}
                  </span>
                  {active && <span className="mt-1 whitespace-nowrap rounded-full bg-espresso px-2 py-0.5 text-[9px] font-semibold text-cream">{c.name}</span>}
                </span>
              </button>
            );
          })}
        </div>

        {/* detail */}
        <div className="rounded-2xl bg-espresso/[0.02] p-4 ring-1 ring-espresso/[0.06]">
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold" style={{ background: STATUS[client.st].soft, color: STATUS[client.st].color }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS[client.st].color }} /> {STATUS[client.st].label}
          </span>
          <h4 className="mt-2.5 font-display text-lg font-semibold leading-tight text-espresso">{client.name}</h4>
          <dl className="mt-3 space-y-2">
            <Row icon={Icon.sprout} k="Культура" v={client.crop} />
            <Row icon={Icon.map} k="Площадь" v={client.area} />
            <Row icon={Icon.coins} k="Сумма сделки" v={client.sum} />
            <Row icon={Icon.spark} k="Статус" v={client.note} />
          </dl>
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-espresso px-4 py-2.5 text-sm font-semibold text-cream transition-all active:scale-[0.98] hover:bg-bark">
            Открыть сделку <Icon.arrowUpRight className="h-4 w-4 stroke-current fill-none" />
          </button>
          <p className="mt-3 text-center text-[10px] text-umber/70">кликайте по пинам на карте →</p>
        </div>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children, dot }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all duration-300 ease-spring ${
        active ? "bg-espresso text-cream" : "bg-espresso/[0.05] text-umber ring-1 ring-espresso/10 hover:bg-espresso/10"
      }`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />}
      {children}
    </button>
  );
}

function Row({ icon: Glyph, k, v }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-2 text-[12px] text-umber"><Glyph className="h-4 w-4 stroke-current fill-none text-espresso/45" /> {k}</dt>
      <dd className="text-[13px] font-semibold text-espresso">{v}</dd>
    </div>
  );
}
