import { useEffect, useState } from "react";
import { Icon } from "./ui.jsx";

// Демо — согласование договора. Договор собран из полей сделки по шаблону,
// юрист и бухгалтерия согласуют параллельно, юрист может оставить замечание —
// менеджер правит, появляется вторая версия. Затем директор и подписание с клиентом.

const FIELDS = [
  ["Покупатель", "СХП «Нива-Юг»"],
  ["ИНН", "из реквизитов"],
  ["Сумма", "3 412 000 ₽"],
  ["Отсрочка", "60 дней"],
  ["Поставка", "до 20 марта"],
];

const SIGN = ["Отправлен", "Открыт клиентом", "Подписан"];

function Badge({ s }) {
  const m = {
    wait: ["ждёт", "bg-espresso/[0.05] text-umber ring-espresso/10"],
    remark: ["замечание", "bg-gold/12 text-[#8a6418] ring-gold/25"],
    ok: ["согласовано", "bg-sage/12 text-[#3c6b32] ring-sage/25"],
    off: ["после юриста и бухгалтерии", "bg-espresso/[0.03] text-umber/60 ring-espresso/[0.06]"],
  }[s];
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${m[1]}`}>{m[0]}</span>;
}

export default function ContractRoute() {
  const [ver, setVer] = useState(1);
  const [law, setLaw] = useState("wait");
  const [acc, setAcc] = useState("wait");
  const [dir, setDir] = useState("wait");
  const [sign, setSign] = useState(-1);

  const dirReady = law === "ok" && acc === "ok";

  useEffect(() => {
    if (sign < 0 || sign >= SIGN.length - 1) return;
    const t = setTimeout(() => setSign((s) => s + 1), 1100);
    return () => clearTimeout(t);
  }, [sign]);

  function reset() {
    setVer(1);
    setLaw("wait");
    setAcc("wait");
    setDir("wait");
    setSign(-1);
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/12 text-ember ring-1 ring-ember/20">
            <Icon.doc className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-espresso">Договор поставки № П-118/26</p>
            <p className="text-[10px] text-umber">Шаблон «Поставка СЗР с отсрочкой» · из сделки</p>
          </div>
        </div>
        <button onClick={reset} className="rounded-full bg-espresso/[0.05] px-3 py-1 text-[11px] font-medium text-umber ring-1 ring-espresso/10 transition-all hover:bg-espresso/10">
          Сначала
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-[0.85fr_1.15fr]">
        {/* document */}
        <div className="rounded-2xl bg-white/60 p-4 ring-1 ring-espresso/[0.06]">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-umber">Документ</p>
            <span key={ver} className="animate-floatUp rounded-full bg-[#2FC6F6]/12 px-2 py-0.5 text-[10px] font-semibold text-[#14799b] ring-1 ring-[#2FC6F6]/30 [animation-duration:0.5s]">
              версия {ver}
            </span>
          </div>
          <dl className="mt-3 space-y-1.5">
            {FIELDS.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-2 border-b border-dashed border-espresso/10 pb-1.5 text-[12px]">
                <dt className="text-umber">{k}</dt>
                <dd className="truncate font-semibold text-espresso">{v}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-2 text-[12px]">
              <dt className="text-umber">Пени, п. 5.2</dt>
              <dd className={`font-semibold ${ver > 1 ? "text-[#3c6b32]" : law === "remark" ? "text-[#8a6418]" : "text-espresso"}`}>{ver > 1 ? "0,1 % в день" : "0,5 % в день"}</dd>
            </div>
          </dl>
          <p className="mt-3 text-[11px] leading-snug text-umber/80">Поля подставляются из карточки сделки и реквизитов — договор собирается за секунды.</p>
        </div>

        {/* route */}
        <div className="flex flex-col gap-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-umber">Маршрут согласования</p>

          <div className="grid grid-cols-2 gap-2">
            {/* lawyer */}
            <div className={`rounded-xl p-3 ring-1 transition-all duration-300 ${law === "ok" ? "bg-sage/[0.08] ring-sage/25" : law === "remark" ? "bg-gold/[0.08] ring-gold/30" : "bg-white/55 ring-ember/30"}`}>
              <div className="flex items-center justify-between gap-1">
                <p className="text-[12.5px] font-semibold text-espresso">Юрист</p>
                <Badge s={law} />
              </div>
              {law === "remark" ? (
                <>
                  <p className="mt-1.5 text-[11px] leading-snug text-[#7a5a12]">«П. 5.2: пени 0,5 % — завышены, клиент не подпишет»</p>
                  <button
                    onClick={() => {
                      setVer(2);
                      setLaw("wait");
                    }}
                    className="mt-2 w-full rounded-full bg-espresso px-2 py-1.5 text-[11px] font-semibold text-cream transition-all active:scale-[0.98] hover:bg-bark"
                  >
                    Менеджер: исправить
                  </button>
                </>
              ) : law === "wait" ? (
                <div className="mt-2 flex flex-col gap-1.5">
                  <button onClick={() => setLaw("ok")} className="w-full rounded-full bg-ember px-2 py-1.5 text-[11px] font-semibold text-cream transition-all active:scale-[0.98] hover:brightness-105">
                    Согласовать
                  </button>
                  {ver === 1 && (
                    <button onClick={() => setLaw("remark")} className="w-full rounded-full bg-espresso/[0.05] px-2 py-1.5 text-[11px] font-medium text-umber ring-1 ring-espresso/10 hover:bg-espresso/10">
                      Замечание
                    </button>
                  )}
                </div>
              ) : (
                <p className="mt-1.5 text-[11px] text-umber">Версия {ver} согласована</p>
              )}
            </div>
            {/* accounting */}
            <div className={`rounded-xl p-3 ring-1 transition-all duration-300 ${acc === "ok" ? "bg-sage/[0.08] ring-sage/25" : "bg-white/55 ring-ember/30"}`}>
              <div className="flex items-center justify-between gap-1">
                <p className="text-[12.5px] font-semibold text-espresso">Бухгалтерия</p>
                <Badge s={acc} />
              </div>
              {acc === "wait" ? (
                <button onClick={() => setAcc("ok")} className="mt-2 w-full rounded-full bg-ember px-2 py-1.5 text-[11px] font-semibold text-cream transition-all active:scale-[0.98] hover:brightness-105">
                  Согласовать
                </button>
              ) : (
                <p className="mt-1.5 text-[11px] text-umber">Лимит дебиторки клиента в норме</p>
              )}
            </div>
          </div>
          <p className="-mt-1 text-center text-[10px] text-umber/70">↑ согласуют параллельно — не ждут друг друга</p>

          {/* director */}
          <div className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ring-1 transition-all duration-300 ${dir === "ok" ? "bg-sage/[0.08] ring-sage/25" : dirReady ? "bg-white/60 ring-ember/30" : "bg-white/35 ring-espresso/[0.06]"}`}>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[12.5px] font-semibold text-espresso">Директор</p>
                <Badge s={dir === "ok" ? "ok" : dirReady ? "wait" : "off"} />
              </div>
            </div>
            {dirReady && dir !== "ok" && (
              <button onClick={() => setDir("ok")} className="rounded-full bg-ember px-3 py-1.5 text-[11px] font-semibold text-cream transition-all active:scale-[0.98] hover:brightness-105">
                Утвердить
              </button>
            )}
          </div>

          {/* signing */}
          <div className={`rounded-xl px-3 py-2.5 ring-1 transition-all duration-300 ${sign === SIGN.length - 1 ? "bg-sage/[0.08] ring-sage/25" : dir === "ok" ? "bg-white/60 ring-ember/30" : "bg-white/35 ring-espresso/[0.06]"}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[12.5px] font-semibold text-espresso">Подписание с клиентом онлайн</p>
              {dir === "ok" && sign < 0 && (
                <button onClick={() => setSign(0)} className="rounded-full bg-ember px-3 py-1.5 text-[11px] font-semibold text-cream transition-all active:scale-[0.98] hover:brightness-105">
                  Отправить на подпись
                </button>
              )}
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              {SIGN.map((s, i) => (
                <span
                  key={s}
                  className={`flex-1 whitespace-nowrap rounded-lg px-1.5 py-1 text-center text-[10.5px] font-semibold ring-1 transition-all duration-500 ${
                    i <= sign ? "bg-sage/15 text-[#3c6b32] ring-sage/30" : "bg-espresso/[0.03] text-umber/50 ring-espresso/[0.06]"
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
            {sign === SIGN.length - 1 && (
              <p className="mt-2 animate-floatUp text-[11px] text-umber [animation-duration:0.5s]">
                Подписанный PDF — в карточке сделки. Окончание срока договора на контроле: напоминание за 30 дней.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
