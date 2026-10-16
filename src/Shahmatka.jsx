import { useMemo, useState } from "react";
import { Icon } from "./ui.jsx";

// Live demo: interactive apartment "chessboard" wired to a mock Bitrix24 deal.
// Pick a free flat -> book it -> a CRM deal card materialises (the sync story).

const STATUS = {
  free: { label: "Свободна", dot: "bg-sage", cell: "bg-sage/12 text-bark ring-sage/25 hover:bg-sage/20", live: true },
  booked: { label: "Бронь", dot: "bg-ember", cell: "bg-ember/15 text-ember ring-ember/25", live: false },
  sold: { label: "Продана", dot: "bg-espresso/40", cell: "bg-espresso/[0.06] text-espresso/35 ring-espresso/10", live: false },
};

const ROOMS = { 1: "1-комн.", 2: "2-комн.", 3: "3-комн." };

// deterministic plan for "Дом №8" — 7 floors × 4 flats
function buildPlan() {
  const seed = [2, 0, 1, 2, 1, 0, 0, 1, 2, 0, 1, 1, 0, 2, 0, 1, 1, 0, 0, 2, 0, 1, 0, 0, 1, 0, 0, 2]; // 0 free,1 booked,2 sold
  const roomsByCol = [1, 2, 2, 3];
  const flats = [];
  let k = 0;
  for (let floor = 7; floor >= 1; floor--) {
    for (let col = 0; col < 4; col++) {
      const s = seed[k] === 0 ? "free" : seed[k] === 1 ? "booked" : "sold";
      const rooms = roomsByCol[col];
      const area = { 1: 38, 2: 54, 3: 72 }[rooms] + col + floor * 0.4;
      const num = floor * 10 + (col + 1);
      flats.push({
        id: num,
        num,
        floor,
        rooms,
        area: Math.round(area * 10) / 10,
        price: Math.round((area * 92) / 10) / 100, // млн ₽
        status: s,
      });
      k++;
    }
  }
  return flats;
}

export default function Shahmatka() {
  const initial = useMemo(buildPlan, []);
  const [flats, setFlats] = useState(initial);
  const [sel, setSel] = useState(null);
  const [deal, setDeal] = useState(null);

  const selFlat = flats.find((f) => f.id === sel) || null;
  const counts = flats.reduce((a, f) => ((a[f.status] = (a[f.status] || 0) + 1), a), {});

  function book(flat) {
    setFlats((prev) => prev.map((f) => (f.id === flat.id ? { ...f, status: "booked" } : f)));
    setDeal({
      id: 1240 + flat.id,
      flat,
      stage: "Бронь",
    });
  }

  function reset() {
    setFlats(initial);
    setSel(null);
    setDeal(null);
  }

  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 lg:grid-cols-[1.35fr_1fr]">
      {/* ─── shahmatka grid ─── */}
      <div className="flex h-full flex-col rounded-[calc(2rem-0.375rem)] bg-white/80 p-5">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-umber">Жилой комплекс · Дом №8</p>
            <h3 className="font-display text-2xl font-semibold text-espresso">Шахматка квартир</h3>
          </div>
          <div className="flex gap-3 text-xs">
            {Object.entries(STATUS).map(([k, v]) => (
              <span key={k} className="inline-flex items-center gap-1.5 text-umber">
                <span className={`h-2 w-2 rounded-full ${v.dot}`} />
                {v.label} · {counts[k] || 0}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-1 gap-2">
          {/* floor rail */}
          <div className="flex flex-col justify-around pr-1 text-[11px] font-medium text-umber/70">
            {[7, 6, 5, 4, 3, 2, 1].map((fl) => (
              <span key={fl} className="leading-none">{fl} эт.</span>
            ))}
          </div>
          <div className="grid flex-1 grid-cols-4 gap-2">
            {flats.map((f) => {
              const st = STATUS[f.status];
              const active = sel === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => st.live && setSel(f.id)}
                  disabled={!st.live}
                  className={`group relative flex flex-col items-start justify-center rounded-xl px-2.5 py-2 text-left ring-1 transition-all duration-300 ease-spring ${st.cell} ${
                    st.live ? "cursor-pointer hover:-translate-y-0.5" : "cursor-not-allowed"
                  } ${active ? "ring-2 ring-ember ring-offset-1 ring-offset-cream" : ""}`}
                >
                  <span className="text-base font-bold leading-none">№{f.num}</span>
                  <span className="mt-1 text-[11px] leading-tight opacity-80">
                    {f.rooms}к · {f.area} м²
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <p className="mt-3 text-xs text-umber/70">
          Кликните <span className="font-semibold text-sage">свободную</span> квартиру — бронь уйдёт в CRM →
        </p>
      </div>

      {/* ─── detail + CRM card ─── */}
      <div className="flex h-full flex-col gap-4">
        <div className="flex-1 rounded-[calc(2rem-0.375rem)] bg-bark p-5 text-cream">
          {!selFlat ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                <Icon.grid className="h-7 w-7 stroke-current fill-none text-cream/80" />
              </span>
              <p className="mt-4 max-w-[14rem] text-sm text-cream/70">
                Выберите квартиру на плане, чтобы увидеть карточку и оформить бронь
              </p>
            </div>
          ) : (
            <div className="flex h-full flex-col">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ember/90">Квартира</p>
              <div className="mt-1 flex items-baseline gap-3">
                <h3 className="font-display text-3xl font-semibold">№{selFlat.num}</h3>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium">{ROOMS[selFlat.rooms]}</span>
              </div>

              {/* floor plan */}
              <div className="mt-3 flex min-h-0 flex-1 flex-col rounded-2xl bg-white/[0.92] p-3">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-bark/45">Планировка</p>
                <div className="min-h-0 flex-1">
                  <FloorPlan rooms={selFlat.rooms} />
                </div>
              </div>

              {/* compact specs */}
              <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-cream/70">
                <span>Этаж <b className="text-cream">{selFlat.floor}/7</b></span>
                <span className="text-cream/25">·</span>
                <span>Площадь <b className="text-cream">{selFlat.area} м²</b></span>
                <span className="text-cream/25">·</span>
                <span>Цена <b className="text-cream">{selFlat.price} млн ₽</b></span>
              </div>

              <div className="mt-3">
                {selFlat.status === "free" ? (
                  <button
                    onClick={() => book(selFlat)}
                    className="group flex w-full items-center justify-between rounded-full bg-ember px-5 py-3 text-sm font-semibold text-cream transition-all duration-500 ease-spring active:scale-[0.98]"
                  >
                    Забронировать в CRM
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-500 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-[1px]">
                      <Icon.arrowUpRight className="h-4 w-4 stroke-current fill-none" />
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 rounded-full bg-white/10 py-3 text-sm font-medium text-cream/80">
                    <Icon.check className="h-4 w-4 stroke-current fill-none text-sage" /> Бронь оформлена
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* mock Bitrix24 deal card */}
        <div
          className={`rounded-[calc(2rem-0.375rem)] bg-white/80 p-4 ring-1 ring-espresso/[0.06] transition-all duration-700 ease-spring ${
            deal ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-umber">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#2FC6F6] text-[9px] font-bold text-white">B24</span>
              Новая сделка
            </span>
            {deal && <span className="text-[11px] text-umber/70">#{deal.id}</span>}
          </div>
          {deal && (
            <div className="mt-3">
              <p className="font-display text-lg font-semibold text-espresso">
                Бронь · кв. №{deal.flat.num}, {deal.flat.area} м²
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                {["Лид", "Бронь", "ДДУ", "Ипотека", "Сделка"].map((s) => {
                  const done = s === "Бронь";
                  return (
                    <span
                      key={s}
                      className={`flex-1 rounded-full px-1 py-1.5 text-center text-[10px] font-medium ${
                        done ? "bg-ember text-cream" : "bg-espresso/[0.05] text-umber/60"
                      }`}
                    >
                      {s}
                    </span>
                  );
                })}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-umber">
                <span>Сумма: <b className="text-espresso">{deal.flat.price} млн ₽</b></span>
                <span>Ответственный: <b className="text-espresso">авто</b></span>
              </div>
            </div>
          )}
        </div>

        {deal && (
          <button onClick={reset} className="self-end text-[11px] font-medium text-umber underline-offset-2 hover:underline">
            Сбросить демо
          </button>
        )}
      </div>
    </div>
  );
}

// ─── realistic vector floor plans: walls, doors, windows, furniture ───
const WC = "#3E4A63"; // walls
const FC = "#9DA8BE"; // furniture lines
const LC = "#5B677D"; // labels
const fur = { stroke: FC, strokeWidth: 0.9, fill: "none", strokeLinejoin: "round", strokeLinecap: "round" };
const furF = { ...fur, fill: "#EEF2F8" };

const Room = ({ x, y, w, h, fill = "#F6F8FC" }) => <rect x={x} y={y} width={w} height={h} fill={fill} />;
const Lab = ({ x, y, t, r }) => (
  <text x={x} y={y} fontSize="7" fontWeight="600" fill={LC} textAnchor="middle" dominantBaseline="central" transform={r ? `rotate(${r} ${x} ${y})` : undefined}>{t}</text>
);
const Wall = ({ d, w = 2.6 }) => <path d={d} stroke={WC} strokeWidth={w} fill="none" strokeLinecap="butt" />;
const Win = ({ x, y, w, h }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#FBFCFE" />
    {w >= h ? <line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2} stroke={WC} strokeWidth="0.7" /> : <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke={WC} strokeWidth="0.7" />}
  </g>
);
function Door({ hx, hy, r, a }) {
  const R = (d) => (d * Math.PI) / 180;
  const x1 = hx + r * Math.cos(R(a)), y1 = hy + r * Math.sin(R(a));
  const x2 = hx + r * Math.cos(R(a + 90)), y2 = hy + r * Math.sin(R(a + 90));
  return (<g {...fur}><line x1={hx} y1={hy} x2={x1} y2={y1} /><path d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`} /></g>);
}
// furniture
const Bed = ({ x, y, w, h }) => (<g {...furF}><rect x={x} y={y} width={w} height={h} rx="2" /><rect x={x + 2} y={y + 2} width={w - 4} height={Math.min(9, h * 0.26)} rx="1.5" /><line x1={x + w / 2} y1={y + h * 0.34} x2={x + w / 2} y2={y + h - 2} /></g>);
const Sofa = ({ x, y, w, h }) => (<g {...furF}><rect x={x} y={y} width={w} height={h} rx="2.5" /><rect x={x + 3} y={y + 3} width={w - 6} height={h * 0.45} rx="2" /></g>);
const Tbl = ({ x, y, w, h }) => <rect x={x} y={y} width={w} height={h} rx="2" {...furF} />;
const TV = ({ x, y, w }) => <rect x={x} y={y} width={w} height="2.6" rx="1" {...furF} />;
const Kitchen = ({ x, y, w }) => (<g {...furF}><rect x={x} y={y} width={w} height="10" rx="1" />{[0.18, 0.38, 0.58, 0.78].map((f, i) => <circle key={i} cx={x + w * f} cy={y + 5} r="1.7" fill="none" stroke={FC} strokeWidth="0.8" />)}</g>);
const Fridge = ({ x, y }) => (<g {...furF}><rect x={x} y={y} width="11" height="13" rx="1" /><line x1={x} y1={y + 5} x2={x + 11} y2={y + 5} /></g>);
const Bath = ({ x, y, w, h }) => (<g {...furF}><rect x={x} y={y} width={w} height={h} rx="3" /><rect x={x + 2.5} y={y + 2.5} width={w - 5} height={h - 5} rx="2.5" fill="none" stroke={FC} strokeWidth="0.8" /></g>);
const Toilet = ({ x, y }) => (<g {...furF}><rect x={x} y={y} width="9" height="3.5" rx="1" /><ellipse cx={x + 4.5} cy={y + 7.5} rx="4.5" ry="5.5" /></g>);
const Sink = ({ x, y }) => (<g {...furF}><rect x={x} y={y} width="10" height="7" rx="1.5" /><circle cx={x + 5} cy={y + 3.5} r="2" fill="none" stroke={FC} strokeWidth="0.8" /></g>);
const Wardrobe = ({ x, y, w, h }) => (<g {...furF}><rect x={x} y={y} width={w} height={h} /><line x1={x} y1={y} x2={x + w} y2={y + h} /><line x1={x + w} y1={y} x2={x} y2={y + h} /></g>);
const Balc = ({ x, y, w, h }) => (
  <g>
    <Room x={x} y={y} w={w} h={h} fill="#EAF1FB" />
    <Wall d={`M${x} ${y} H${x + w} V${y + h} H${x}`} w={1.8} />
  </g>
);

// 2-комн (flagship)
const Plan2 = () => (
  <g>
    <Room x={8} y={8} w={104} h={64} /><Room x={112} y={8} w={120} h={108} />
    <Room x={8} y={72} w={64} h={88} /><Room x={72} y={72} w={40} h={44} /><Room x={72} y={116} w={160} h={44} />
    <Balc x={198} y={20} w={34} h={70} />
    {/* furniture */}
    <Kitchen x={14} y={12} w={90} /><Fridge x={14} y={26} />
    <Sofa x={140} y={94} w={80} h={16} /><Tbl x={152} y={68} w={52} h={13} /><TV x={150} y={11} w={36} />
    <Bath x={93} y={78} w={15} h={32} /><Toilet x={76} y={80} /><Sink x={76} y={99} />
    <Wardrobe x={12} y={80} w={12} h={40} />
    <Bed x={150} y={122} w={46} h={34} /><Tbl x={199} y={124} w={9} h={9} /><Wardrobe x={78} y={120} w={14} h={36} />
    {/* interior walls */}
    <Wall d="M8 72 H28" /><Wall d="M44 72 H112" />
    <Wall d="M72 72 V86" /><Wall d="M72 100 V132" /><Wall d="M72 146 V160" />
    <Wall d="M112 8 V34" /><Wall d="M112 50 V116" />
    <Wall d="M72 116 H150" /><Wall d="M166 116 H232" />
    <Wall d="M198 20 V48" /><Wall d="M198 64 V90" />
    {/* outer */}
    <rect x={6} y={6} width={228} height={156} fill="none" stroke={WC} strokeWidth="3.4" />
    {/* windows */}
    <Win x={36} y={3.6} w={44} h={4.8} /><Win x={138} y={3.6} w={52} h={4.8} /><Win x={150} y={157.6} w={52} h={4.8} /><Win x={229.6} y={36} w={4.8} h={44} />
    {/* doors */}
    <Door hx={44} hy={160} r={20} a={180} /><Door hx={44} hy={72} r={15} a={90} />
    <Door hx={72} hy={100} r={13} a={180} /><Door hx={72} hy={146} r={13} a={180} />
    <Door hx={112} hy={50} r={15} a={90} /><Door hx={150} hy={116} r={15} a={0} /><Door hx={198} hy={64} r={13} a={180} />
    {/* labels */}
    <Lab x={60} y={40} t="Кухня" /><Lab x={130} y={40} t="Гостиная" /><Lab x={40} y={142} t="Прихожая" />
    <Lab x={101} y={112} t="С/у" /><Lab x={110} y={140} t="Спальня" /><Lab x={215} y={55} t="Балкон" r={-90} />
  </g>
);

// 1-комн
const Plan1 = () => (
  <g>
    <Room x={8} y={8} w={56} h={48} /><Room x={8} y={56} w={56} h={48} /><Room x={8} y={104} w={56} h={56} />
    <Room x={64} y={8} w={168} h={152} />
    <Balc x={198} y={40} w={34} h={80} />
    <Kitchen x={12} y={12} w={46} /><Fridge x={50} y={12} />
    <Bath x={42} y={60} w={16} h={36} /><Toilet x={14} y={60} /><Sink x={14} y={84} />
    <Wardrobe x={12} y={110} w={12} h={44} />
    <Sofa x={78} y={120} w={74} h={18} /><Tbl x={94} y={92} w={46} h={14} /><TV x={98} y={11} w={36} /><Tbl x={80} y={36} w={30} h={24} />
    <Bed x={180} y={104} w={44} h={42} /><Tbl x={172} y={106} w={8} h={9} />
    <Wall d="M64 8 V26" /><Wall d="M64 42 V124" /><Wall d="M64 140 V160" />
    <Wall d="M8 56 H64" />
    <Wall d="M8 104 H28" /><Wall d="M44 104 H64" />
    <Wall d="M198 40 V68" /><Wall d="M198 84 V120" />
    <rect x={6} y={6} width={228} height={156} fill="none" stroke={WC} strokeWidth="3.4" />
    <Win x={24} y={3.6} w={30} h={4.8} /><Win x={120} y={3.6} w={56} h={4.8} /><Win x={120} y={157.6} w={56} h={4.8} /><Win x={229.6} y={56} w={4.8} h={48} />
    <Door hx={44} hy={160} r={20} a={180} /><Door hx={28} hy={104} r={13} a={0} />
    <Door hx={64} hy={42} r={14} a={90} /><Door hx={64} hy={140} r={15} a={270} /><Door hx={198} hy={84} r={13} a={180} />
    <Lab x={30} y={32} t="Кухня" /><Lab x={48} y={98} t="С/у" /><Lab x={36} y={150} t="Прихожая" />
    <Lab x={120} y={150} t="Комната" /><Lab x={215} y={80} t="Балкон" r={-90} />
  </g>
);

// 3-комн (2 спальни)
const Plan3 = () => (
  <g>
    <Room x={8} y={8} w={72} h={64} /><Room x={80} y={8} w={152} h={64} />
    <Room x={8} y={72} w={52} h={88} /><Room x={60} y={72} w={46} h={42} /><Room x={106} y={72} w={126} h={42} /><Room x={60} y={114} w={172} h={46} />
    <Balc x={198} y={20} w={34} h={46} />
    <Kitchen x={12} y={12} w={58} /><Fridge x={12} y={26} />
    <Sofa x={108} y={50} w={80} h={16} /><Tbl x={124} y={30} w={48} h={12} /><TV x={128} y={11} w={34} />
    <Bath x={88} y={76} w={14} h={32} /><Toilet x={64} y={78} /><Sink x={64} y={97} />
    <Wardrobe x={12} y={76} w={12} h={40} />
    <Bed x={150} y={76} w={44} h={32} /><Wardrobe x={110} y={76} w={12} h={34} />
    <Bed x={150} y={120} w={44} h={34} /><Wardrobe x={66} y={120} w={12} h={36} />
    <Wall d="M8 72 H20" /><Wall d="M36 72 H150" /><Wall d="M166 72 H232" />
    <Wall d="M80 8 V28" /><Wall d="M80 44 V72" />
    <Wall d="M60 72 V84" /><Wall d="M60 98 V128" /><Wall d="M60 142 V160" />
    <Wall d="M106 72 V114" /><Wall d="M60 114 H232" />
    <Wall d="M198 20 V30" /><Wall d="M198 44 V66" />
    <rect x={6} y={6} width={228} height={156} fill="none" stroke={WC} strokeWidth="3.4" />
    <Win x={26} y={3.6} w={36} h={4.8} /><Win x={108} y={3.6} w={44} h={4.8} /><Win x={229.6} y={80} w={4.8} h={26} /><Win x={140} y={157.6} w={52} h={4.8} /><Win x={229.6} y={28} w={4.8} h={22} />
    <Door hx={36} hy={72} r={13} a={90} /><Door hx={40} hy={160} r={18} a={180} />
    <Door hx={60} hy={84} r={11} a={0} /><Door hx={60} hy={142} r={14} a={0} />
    <Door hx={80} hy={44} r={13} a={270} /><Door hx={150} hy={72} r={14} a={0} /><Door hx={198} hy={44} r={11} a={180} />
    <Lab x={44} y={30} t="Кухня" /><Lab x={95} y={40} t="Гостиная" /><Lab x={96} y={108} t="С/у" />
    <Lab x={32} y={150} t="Прихожая" /><Lab x={128} y={100} t="Спальня" /><Lab x={108} y={142} t="Спальня" /><Lab x={215} y={40} t="Балкон" r={-90} />
  </g>
);

export function FloorPlan({ rooms }) {
  return (
    <svg viewBox="0 0 240 168" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      {rooms === 1 ? <Plan1 /> : rooms === 3 ? <Plan3 /> : <Plan2 />}
    </svg>
  );
}

function Spec({ label, value }) {
  return (
    <div className="rounded-xl bg-white/[0.06] px-3 py-2 ring-1 ring-white/10">
      <dt className="text-[11px] uppercase tracking-wider text-cream/50">{label}</dt>
      <dd className="mt-0.5 text-[15px] font-semibold text-cream">{value}</dd>
    </div>
  );
}
