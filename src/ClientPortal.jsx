import { useState } from "react";
import { Icon } from "./ui.jsx";

// Demo — личный кабинет клиента. Клиент заходит по ссылке и сам видит заказы,
// документы и баланс, повторяет закупку в 1 клик. Коробка наружу ЛК не отдаёт.

const ORDERS = [
  { id: "А-1042", date: "08.10.2026", crop: "Пшеница «Дарья», 24 т", sum: "672 000 ₽", st: "В пути" },
  { id: "А-1018", date: "15.09.2026", crop: "Рапс яровой, 8 т", sum: "760 000 ₽", st: "Доставлено" },
  { id: "А-0975", date: "20.08.2026", crop: "Протравитель, 40 л", sum: "76 000 ₽", st: "Доставлено" },
];
const DOCS = [
  { name: "Счёт № 1042 от 08.10.2026", kind: "Счёт", size: "PDF · 48 КБ" },
  { name: "УПД № 1018 от 18.09.2026", kind: "УПД", size: "PDF · 62 КБ" },
  { name: "Договор поставки № 7-2026", kind: "Договор", size: "PDF · 210 КБ" },
  { name: "Спецификация № 3 к дог. 7-2026", kind: "Спец.", size: "PDF · 54 КБ" },
];

export default function ClientPortal() {
  const [tab, setTab] = useState("orders");
  const [toast, setToast] = useState("");

  function repeat(o) {
    setToast(`Заказ ${o.id} продублирован — менеджер свяжется`);
    setTimeout(() => setToast(""), 2600);
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/12 text-ember ring-1 ring-ember/20">
            <Icon.people className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-espresso">Кабинет · КФХ «Восход»</p>
            <p className="font-mono text-[10px] text-umber">lk.agro&hellip;/ voskhod</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-sage/12 px-2.5 py-1 text-[10px] font-semibold text-[#3c6b32] ring-1 ring-sage/25">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-sage" /> публичная ссылка
        </span>
      </div>

      <div className="p-5">
        <div className="mb-4 flex gap-1 rounded-full bg-espresso/[0.05] p-0.5 ring-1 ring-espresso/10">
          {[["orders", "Заказы"], ["docs", "Документы"], ["balance", "Баланс"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ease-spring ${tab === k ? "bg-espresso text-cream" : "text-umber hover:text-espresso"}`}>{l}</button>
          ))}
        </div>

        {tab === "orders" && (
          <div className="space-y-2.5">
            {ORDERS.map((o) => (
              <div key={o.id} className="flex items-center gap-3 rounded-xl bg-espresso/[0.03] p-3 ring-1 ring-espresso/[0.06]">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-espresso">{o.crop}</p>
                  <p className="text-[11px] text-umber">№ {o.id} · {o.date} · {o.sum}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${o.st === "Доставлено" ? "bg-sage/15 text-[#3c6b32]" : "bg-ember/12 text-ember"}`}>{o.st}</span>
                <button onClick={() => repeat(o)} className="flex items-center gap-1.5 rounded-full bg-espresso px-3 py-1.5 text-[11px] font-semibold text-cream transition-all active:scale-95 hover:bg-bark">
                  <Icon.repeat className="h-3.5 w-3.5 stroke-current fill-none" /> Повторить
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "docs" && (
          <div className="space-y-2">
            {DOCS.map((d) => (
              <div key={d.name} className="flex items-center gap-3 rounded-xl bg-espresso/[0.03] p-3 ring-1 ring-espresso/[0.06]">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ember/10 text-ember ring-1 ring-ember/15"><Icon.doc className="h-4.5 w-4.5 stroke-current fill-none" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-espresso">{d.name}</p>
                  <p className="text-[11px] text-umber">{d.kind} · {d.size}</p>
                </div>
                <button className="rounded-full bg-espresso/[0.06] px-3 py-1.5 text-[11px] font-semibold text-espresso ring-1 ring-espresso/10 transition-all hover:bg-espresso/10">Скачать</button>
              </div>
            ))}
          </div>
        )}

        {tab === "balance" && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2.5">
              <Tile label="Задолженность" value="118 000 ₽" tone="gold" />
              <Tile label="Кредитный лимит" value="500 000 ₽" tone="ghost" />
              <Tile label="Доступно" value="382 000 ₽" tone="sage" />
            </div>
            <div className="rounded-xl bg-espresso/[0.03] p-3.5 ring-1 ring-espresso/[0.06]">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-umber">Последние платежи</p>
              {[["01.10.2026", "+ 350 000 ₽"], ["10.09.2026", "+ 200 000 ₽"], ["18.08.2026", "+ 150 000 ₽"]].map(([d, s]) => (
                <div key={d} className="flex justify-between border-t border-espresso/[0.06] py-1.5 text-[12.5px] first:border-0">
                  <span className="text-umber">{d}</span><span className="font-semibold tabular-nums text-[#3c6b32]">{s}</span>
                </div>
              ))}
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-ember px-4 py-2.5 text-sm font-semibold text-cream transition-all active:scale-[0.98] hover:brightness-105">
              Оплатить задолженность <Icon.arrowUpRight className="h-4 w-4 stroke-current fill-none" />
            </button>
          </div>
        )}

        {toast && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-sage/12 px-3.5 py-2.5 text-[12px] font-medium text-[#3c6b32] ring-1 ring-sage/25">
            <Icon.check className="h-4 w-4 stroke-current fill-none" /> {toast}
          </div>
        )}
      </div>
    </div>
  );
}

function Tile({ label, value, tone }) {
  const tones = { sage: "bg-sage/12 text-[#3c6b32]", gold: "bg-gold/12 text-[#8a6410]", ghost: "bg-espresso/[0.04] text-espresso" };
  return (
    <div className={`rounded-xl px-3 py-2.5 ${tones[tone]}`}>
      <p className="text-[9px] font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className="font-display text-[15px] font-semibold tabular-nums">{value}</p>
    </div>
  );
}
