import { useMemo, useState } from "react";
import { Icon } from "./ui.jsx";

// Demo app #1 — «Калькулятор потребности» — встройка (placement) в карточку сделки Б24.
// Менеджер двигает площадь и норму высева, приложение мгновенно считает тоннаж семян,
// объём и стоимость СЗР и итог сделки. Штатная карточка так не умеет.

const CULTURES = {
  wheat: { label: "Пшеница яровая", min: 180, max: 260, def: 220, price: 28, szr: { name: "Протравитель", rate: 0.5, unit: "л/т", price: 1.9 } },
  barley: { label: "Ячмень", min: 170, max: 240, def: 200, price: 22, szr: { name: "Протравитель", rate: 0.4, unit: "л/т", price: 1.7 } },
  pea: { label: "Горох", min: 200, max: 280, def: 240, price: 33, szr: { name: "Инокулянт", rate: 0.6, unit: "л/т", price: 2.4 } },
  rape: { label: "Рапс яровой", min: 6, max: 12, def: 8, price: 95, szr: { name: "Гербицид", rate: 1.2, unit: "л/га", price: 2.8 } },
  flax: { label: "Лён масличный", min: 40, max: 90, def: 60, price: 46, szr: { name: "Протравитель", rate: 0.6, unit: "л/т", price: 2.1 } },
  sun: { label: "Подсолнечник", min: 4, max: 9, def: 6, price: 120, szr: { name: "Гербицид", rate: 1.4, unit: "л/га", price: 3.2 } },
};

const fmt = (n) => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: n < 10 ? 1 : 0 }).format(n);
const rub = (n) => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(Math.round(n));

export default function SeedCalc() {
  const [crop, setCrop] = useState("wheat");
  const [area, setArea] = useState(450);
  const c = CULTURES[crop];
  const [norma, setNorma] = useState(c.def);

  // keep norma inside the selected crop's range when crop changes
  function pickCrop(k) {
    setCrop(k);
    setNorma(CULTURES[k].def);
  }

  const r = useMemo(() => {
    const seedsT = (area * norma) / 1000; // т
    const seedCost = seedsT * c.price * 1000; // ₽ (price в тыс.₽/т)
    const szrVol = c.szr.unit === "л/т" ? seedsT * c.szr.rate : area * c.szr.rate; // л
    const szrCost = szrVol * c.szr.price * 1000; // ₽
    return { seedsT, seedCost, szrVol, szrCost, total: seedCost + szrCost };
  }, [area, norma, c]);

  return (
    <div className="w-full">
      {/* faux deal-card chrome — показываем, что это панель внутри сделки */}
      <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/12 text-ember ring-1 ring-ember/20">
            <Icon.calc className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-espresso">Расчёт потребности</p>
            <p className="text-[10px] text-umber">Сделка · Поставка семян · вкладка приложения</p>
          </div>
        </div>
        <span className="hidden rounded-full bg-sage/12 px-2.5 py-1 text-[10px] font-semibold text-[#3c6b32] ring-1 ring-sage/25 sm:inline">встройка в карточку</span>
      </div>

      <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-[1.05fr_0.95fr]">
        {/* controls */}
        <div className="space-y-4">
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-umber">Культура</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(CULTURES).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => pickCrop(k)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ease-spring ${
                    crop === k ? "bg-espresso text-cream" : "bg-espresso/[0.05] text-umber ring-1 ring-espresso/10 hover:bg-espresso/10"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <Slider label="Площадь посева" value={area} min={50} max={2000} step={10} unit="га" onChange={setArea} />
          <Slider label="Норма высева" value={norma} min={c.min} max={c.max} step={c.min < 15 ? 0.5 : 5} unit={c.min < 15 ? "кг/га" : "кг/га"} onChange={setNorma} />

          <div className="flex items-center gap-2 rounded-xl bg-espresso/[0.03] px-3.5 py-2.5 text-[11px] text-umber ring-1 ring-espresso/[0.06]">
            <Icon.drop className="h-4 w-4 shrink-0 stroke-current fill-none text-ember" />
            <span>{c.szr.name}: норма {c.szr.rate} {c.szr.unit} · цена {c.szr.price} тыс.₽/л</span>
          </div>
        </div>

        {/* live output */}
        <div className="space-y-2.5 rounded-2xl bg-espresso/[0.02] p-4 ring-1 ring-espresso/[0.06]">
          <Out icon={Icon.box} label="Семян потребуется" value={`${fmt(r.seedsT)} т`} />
          <Out icon={Icon.coins} label="Стоимость семян" value={`${rub(r.seedCost)} ₽`} />
          <Out icon={Icon.drop} label={`${c.szr.name}, объём`} value={`${fmt(r.szrVol)} л`} />
          <Out icon={Icon.coins} label="Стоимость СЗР" value={`${rub(r.szrCost)} ₽`} />
          <div className="mt-1 flex items-center justify-between rounded-xl bg-espresso px-4 py-3 text-cream">
            <span className="text-[11px] font-medium uppercase tracking-wide text-cream/70">Итого по сделке</span>
            <span className="font-display text-xl font-semibold tabular-nums">{rub(r.total)} ₽</span>
          </div>
          <p className="pt-1 text-center text-[10px] text-umber/70">пересчёт мгновенно · записывается в поля сделки</p>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step, unit, onChange }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-umber">{label}</p>
        <p className="font-display text-base font-semibold tabular-nums text-espresso">
          {fmt(value)} <span className="text-xs font-medium text-umber">{unit}</span>
        </p>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-espresso/15 accent-ember"
      />
    </div>
  );
}

function Out({ icon: Glyph, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-[13px] text-umber">
        <Glyph className="h-4 w-4 stroke-current fill-none text-espresso/50" />
        {label}
      </span>
      <span className="font-display text-[15px] font-semibold tabular-nums text-espresso">{value}</span>
    </div>
  );
}
