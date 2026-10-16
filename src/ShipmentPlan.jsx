import { useMemo, useState } from "react";
import { Icon } from "./ui.jsx";

// Demo — план отгрузок по дням. Что, куда и каким тоннажем едет на неделю вперёд,
// с загрузкой склада/транспорта по дням. В коробке план-карты рейсов нет.

const CAP = 60; // суточная норма отгрузки, т

const DAYS = [
  { d: "Пн", date: "13.05", rides: [
    { who: "КФХ «Восход»", crop: "Пшеница «Дарья»", t: 24, car: "КамАЗ Е476 + прицеп", to: "Алнаши" },
    { who: "Агрохолдинг «Степь»", crop: "Пшеница озим.", t: 20, car: "Самовывоз", to: "Можга" },
  ] },
  { d: "Вт", date: "14.05", rides: [
    { who: "ООО «Нива»", crop: "Горох", t: 18, car: "ГАЗон К102", to: "Сарапул" },
  ] },
  { d: "Ср", date: "15.05", rides: [
    { who: "Агрофирма «Заря»", crop: "Рапс яровой", t: 22, car: "КамАЗ Е476", to: "Игра" },
    { who: "КХ «Колос»", crop: "Подсолнечник", t: 16, car: "Самовывоз", to: "Глазов" },
    { who: "ИП Лебедев", crop: "Ячмень", t: 14, car: "ГАЗель NEXT", to: "Воткинск" },
  ] },
  { d: "Чт", date: "16.05", rides: [
    { who: "ООО «Нива»", crop: "Удобрения NPK", t: 12, car: "Самовывоз, ваш транспорт", to: "Склад клиента" },
  ] },
  { d: "Пт", date: "17.05", rides: [
    { who: "Агрохолдинг «Степь»", crop: "Пшеница озим.", t: 28, car: "КамАЗ + прицеп", to: "Можга" },
    { who: "КФХ «Урожай»", crop: "Лён семена", t: 9, car: "ГАЗель NEXT", to: "Балезино" },
  ] },
];

export default function ShipmentPlan() {
  const [sel, setSel] = useState("Ср");

  const totals = useMemo(() => {
    const t = DAYS.reduce((s, d) => s + d.rides.reduce((a, r) => a + r.t, 0), 0);
    const n = DAYS.reduce((s, d) => s + d.rides.length, 0);
    return { t, n };
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/12 text-ember ring-1 ring-ember/20">
            <Icon.truck className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-espresso">План отгрузок по дням</p>
            <p className="text-[10px] text-umber">Неделя · {totals.n} рейсов · {totals.t} т</p>
          </div>
        </div>
        <span className="hidden rounded-full bg-sage/12 px-2.5 py-1 text-[10px] font-semibold text-[#3c6b32] ring-1 ring-sage/25 sm:inline">норма {CAP} т / день</span>
      </div>

      <div className="thin-scroll overflow-x-auto p-5">
        <div className="grid min-w-[44rem] grid-cols-5 gap-3">
          {DAYS.map((day) => {
            const load = day.rides.reduce((a, r) => a + r.t, 0);
            const pct = Math.min(100, (load / CAP) * 100);
            const over = load > CAP;
            const isSel = sel === day.d;
            return (
              <div key={day.d} className={`rounded-2xl p-2.5 transition-all duration-300 ${isSel ? "bg-white/55 ring-1 ring-ember/30" : "bg-white/35 ring-1 ring-white/60"}`}>
                <button onClick={() => setSel(day.d)} className="mb-2 w-full text-left">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-sm font-semibold text-espresso">{day.d}</span>
                    <span className="text-[10px] tabular-nums text-umber">{day.date}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-espresso/10">
                    <div className="grow-x h-full rounded-full" style={{ width: `${pct}%`, background: over ? "#C0563B" : "linear-gradient(90deg,#6FA85C,#2F8F4E)" }} />
                  </div>
                  <p className={`mt-1 text-[10px] font-medium tabular-nums ${over ? "text-[#C0563B]" : "text-umber"}`}>{load} / {CAP} т{over ? " · перегруз" : ""}</p>
                </button>
                <div className="space-y-2">
                  {day.rides.map((r, i) => (
                    <div key={i} className="rounded-xl bg-white/70 p-2.5 ring-1 ring-espresso/[0.06]">
                      <p className="text-[11px] font-semibold leading-tight text-espresso">{r.who}</p>
                      <p className="mt-0.5 text-[10px] leading-tight text-umber">{r.crop}</p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="rounded-md bg-ember/10 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-ember">{r.t} т</span>
                        <span className="flex items-center gap-0.5 text-[9.5px] text-umber"><Icon.pin className="h-3 w-3 stroke-current fill-none" />{r.to}</span>
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-[9.5px] text-umber/80"><Icon.truck className="h-3 w-3 stroke-current fill-none" />{r.car}</p>
                    </div>
                  ))}
                  {day.rides.length === 0 && <p className="py-3 text-center text-[10px] text-umber/50">нет рейсов</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
