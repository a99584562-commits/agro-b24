import { useState } from "react";
import { Icon } from "./ui.jsx";

// Demo — календарь техники и услуг. Бронь опрыскивателей, протравителей, сушилок и машин
// под даты и привязка к сделкам. В коробке расписания техники нет.

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const RES = ["Протравитель", "Опрыскиватель №1", "Разбрасыватель", "Сушилка СЗ-16", "КамАЗ Е476"];

const KINDS = {
  treat: { c: "#2F8F4E", s: "rgba(47,143,78,0.16)", t: "протравливание" },
  spray: { c: "#6FA85C", s: "rgba(111,168,92,0.18)", t: "опрыскивание" },
  spread: { c: "#C2922E", s: "rgba(194,146,46,0.16)", t: "внесение" },
  dry: { c: "#8a6d3b", s: "rgba(138,109,59,0.16)", t: "сушка" },
  ship: { c: "#3f6f8f", s: "rgba(63,111,143,0.16)", t: "доставка" },
};

// row, start day idx, span, client, kind
const WEEKS = {
  "Эта неделя": [
    { r: 0, d: 0, len: 2, who: "КФХ «Восход»", k: "treat", v: "24 т" },
    { r: 0, d: 3, len: 1, who: "ООО «Нива»", k: "treat", v: "12 т" },
    { r: 1, d: 2, len: 2, who: "Агрофирма «Заря»", k: "spray", v: "800 га" },
    { r: 2, d: 0, len: 1, who: "Агрохолдинг «Степь»", k: "spread", v: "320 га" },
    { r: 3, d: 3, len: 3, who: "КХ «Колос»", k: "dry", v: "влажность 18%" },
    { r: 4, d: 1, len: 1, who: "КФХ «Восход»", k: "ship", v: "24 т" },
    { r: 4, d: 4, len: 1, who: "ООО «Нива»", k: "ship", v: "18 т" },
  ],
  "Следующая": [
    { r: 1, d: 0, len: 2, who: "ИП Лебедев", k: "spray", v: "450 га" },
    { r: 0, d: 1, len: 1, who: "Агрохолдинг «Степь»", k: "treat", v: "40 т" },
    { r: 2, d: 2, len: 2, who: "КФХ «Урожай»", k: "spread", v: "300 га" },
    { r: 3, d: 0, len: 2, who: "Агрофирма «Заря»", k: "dry", v: "влажность 16%" },
    { r: 4, d: 3, len: 1, who: "КХ «Колос»", k: "ship", v: "30 т" },
  ],
};

export default function ServiceCalendar() {
  const [week, setWeek] = useState("Эта неделя");
  const [sel, setSel] = useState(null);
  const jobs = WEEKS[week];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/12 text-ember ring-1 ring-ember/20">
            <Icon.calendar className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-espresso">Календарь техники и услуг</p>
            <p className="text-[10px] text-umber">Бронь под сделки · по дням</p>
          </div>
        </div>
        <div className="flex gap-1 rounded-full bg-espresso/[0.05] p-0.5 ring-1 ring-espresso/10">
          {Object.keys(WEEKS).map((w) => (
            <button key={w} onClick={() => { setWeek(w); setSel(null); }} className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ease-spring ${week === w ? "bg-espresso text-cream" : "text-umber hover:text-espresso"}`}>{w}</button>
          ))}
        </div>
      </div>

      <div className="p-5">
        <div className="overflow-hidden rounded-2xl ring-1 ring-espresso/[0.08]">
          {/* header */}
          <div className="grid" style={{ gridTemplateColumns: `7.5rem repeat(${DAYS.length}, 1fr)` }}>
            <div className="bg-espresso/[0.03] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-umber">Ресурс</div>
            {DAYS.map((d) => (
              <div key={d} className="bg-espresso/[0.03] px-2 py-2 text-center text-[11px] font-semibold text-espresso">{d}</div>
            ))}
          </div>
          {/* rows */}
          {RES.map((res, ri) => (
            <div key={res} className="grid border-t border-espresso/[0.06]" style={{ gridTemplateColumns: `7.5rem repeat(${DAYS.length}, 1fr)` }}>
              <div className="flex items-center px-3 py-2 text-[11px] font-medium text-espresso/80">{res}</div>
              {DAYS.map((_, di) => {
                const job = jobs.find((j) => j.r === ri && j.d === di);
                const covered = jobs.find((j) => j.r === ri && di > j.d && di < j.d + j.len);
                if (covered) return null;
                if (!job) return <div key={di} className="border-l border-espresso/[0.05] py-2" />;
                const kind = KINDS[job.k];
                const isSel = sel && sel.r === ri && sel.d === di;
                return (
                  <button
                    key={di}
                    onClick={() => setSel(job)}
                    style={{ gridColumn: `span ${job.len}`, background: kind.s, borderColor: kind.c }}
                    className={`m-1 rounded-lg border-l-[3px] px-2 py-1.5 text-left transition-all duration-200 hover:brightness-[0.97] ${isSel ? "ring-2 ring-espresso/30" : ""}`}
                  >
                    <p className="truncate text-[10.5px] font-semibold leading-tight text-espresso">{job.who}</p>
                    <p className="truncate text-[9.5px] leading-tight" style={{ color: kind.c }}>{kind.t} · {job.v}</p>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* legend / detail */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {Object.values(KINDS).map((k) => (
            <span key={k.t} className="flex items-center gap-1.5 text-[10.5px] text-umber">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: k.c }} /> {k.t}
            </span>
          ))}
        </div>
        {sel && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-espresso/[0.03] px-3.5 py-2.5 text-[12px] text-espresso ring-1 ring-espresso/[0.06]">
            <Icon.check className="h-4 w-4 shrink-0 stroke-current fill-none text-ember" />
            <span><b>{sel.who}</b> — {KINDS[sel.k].t}, {sel.v}. Бронь привязана к сделке, конфликты по технике подсвечиваются.</span>
          </div>
        )}
      </div>
    </div>
  );
}
