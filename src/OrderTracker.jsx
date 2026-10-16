import { useState } from "react";
import { Icon } from "./ui.jsx";

// Demo app #2 — публичный трекер отгрузки. Клиент открывает ссылку без входа в Б24
// и видит статус своей партии в реальном времени. Статусы обновляются из сделки.
// Штатный Б24 наружу клиенту ничего не показывает.

const STEPS = ["Заявка принята", "Партия укомплектована", "Сушка и сортировка", "Погрузка", "В пути", "Доставлено"];

const ORDERS = {
  "А-1042": { crop: "Пшеница «Дарья», 1 репр.", weight: "24 т", car: "КамАЗ Е476ТР · прицеп", eta: "сегодня, 16:40", at: 4 },
  "А-1051": { crop: "Рапс яровой + протравитель", weight: "8 т", car: "ГАЗон К102ОР", eta: "завтра, 11:00", at: 2 },
  "А-1063": { crop: "Удобрения NPK 16:16:16", weight: "12 т", car: "Самовывоз, ваш транспорт", eta: "готово к выдаче", at: 5 },
};

const TIMES = ["12 мая, 09:14", "12 мая, 14:30", "13 мая, 08:05", "13 мая, 10:40", "13 мая, 12:15", "—"];

export default function OrderTracker() {
  const [id, setId] = useState("А-1042");
  const o = ORDERS[id];
  const pct = (o.at / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full">
      {/* public link chrome */}
      <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/12 text-ember ring-1 ring-ember/20">
            <Icon.truck className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-espresso">Отслеживание отгрузки</p>
            <p className="font-mono text-[10px] text-umber">track.agro&hellip;/ {id}</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-sage/12 px-2.5 py-1 text-[10px] font-semibold text-[#3c6b32] ring-1 ring-sage/25">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-sage" /> публичная ссылка
        </span>
      </div>

      <div className="p-5">
        {/* order switch tabs */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {Object.keys(ORDERS).map((k) => (
            <button
              key={k}
              onClick={() => setId(k)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ease-spring ${
                id === k ? "bg-espresso text-cream" : "bg-espresso/[0.05] text-umber ring-1 ring-espresso/10 hover:bg-espresso/10"
              }`}
            >
              Заказ {k}
            </button>
          ))}
        </div>

        {/* summary row */}
        <div className="mb-5 grid grid-cols-3 gap-2.5">
          <Meta icon={Icon.box} label="Что везём" value={o.crop} />
          <Meta icon={Icon.layers} label="Вес" value={o.weight} />
          <Meta icon={Icon.pin} label="Прибытие" value={o.eta} />
        </div>

        {/* progress bar */}
        <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-espresso/10">
          <div className="grow-x h-full rounded-full bg-gradient-to-r from-sage to-ember" style={{ width: `${pct}%` }} />
        </div>

        {/* steps */}
        <ol className="space-y-0">
          {STEPS.map((s, idx) => {
            const done = idx < o.at;
            const cur = idx === o.at;
            return (
              <li key={s} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ring-1 transition-all ${
                      done
                        ? "bg-sage text-white ring-sage"
                        : cur
                        ? "bg-ember text-white ring-ember"
                        : "bg-espresso/[0.04] text-umber/50 ring-espresso/10"
                    }`}
                  >
                    {done ? <Icon.check className="h-3.5 w-3.5 stroke-current fill-none" /> : idx + 1}
                  </span>
                  {idx < STEPS.length - 1 && <span className={`my-0.5 h-5 w-px ${done ? "bg-sage/50" : "bg-espresso/10"}`} />}
                </div>
                <div className={`-mt-0.5 pb-1 ${cur ? "" : "opacity-90"}`}>
                  <p className={`text-[13px] ${done || cur ? "font-semibold text-espresso" : "font-medium text-umber/70"}`}>
                    {s}
                    {cur && <span className="ml-2 rounded-full bg-ember/12 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-ember">сейчас</span>}
                  </p>
                  <p className="text-[10px] tabular-nums text-umber/70">{TIMES[idx]}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-espresso/[0.03] px-3.5 py-2.5 text-[11px] text-umber ring-1 ring-espresso/[0.06]">
          <Icon.bell className="h-4 w-4 shrink-0 stroke-current fill-none text-ember" />
          <span>Клиент получает уведомление в Telegram при смене статуса — данные тянутся из сделки автоматически.</span>
        </div>
      </div>
    </div>
  );
}

function Meta({ icon: Glyph, label, value }) {
  return (
    <div className="rounded-xl bg-espresso/[0.03] p-2.5 ring-1 ring-espresso/[0.06]">
      <span className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-umber/70">
        <Glyph className="h-3.5 w-3.5 stroke-current fill-none" /> {label}
      </span>
      <p className="mt-1 text-[12px] font-semibold leading-tight text-espresso">{value}</p>
    </div>
  );
}
