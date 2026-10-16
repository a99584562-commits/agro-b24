import { useState } from "react";
import { Icon } from "./ui.jsx";

// Soft access gate for GitHub Pages (static hosting — no real server auth).
// Deters casual visitors; not cryptographically secure. Change PASSWORD below.
const PASSWORD = "pole2026";
const KEY = "agro-b24-unlocked";

export default function Gate({ children }) {
  const [ok, setOk] = useState(() => sessionStorage.getItem(KEY) === "1");
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);

  if (ok) return children;

  function submit(e) {
    e.preventDefault();
    if (val.trim() === PASSWORD) {
      sessionStorage.setItem(KEY, "1");
      setOk(true);
    } else {
      setErr(true);
      setVal("");
    }
  }

  return (
    <div className="grain relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#EEF3E6] px-6">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[40rem] w-[40rem] rounded-full bg-emerald-400/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-40 h-[36rem] w-[36rem] rounded-full bg-lime-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-[28rem] w-[28rem] rounded-full bg-amber-300/28 blur-3xl" />

      <div className="relative w-full max-w-md animate-floatUp">
        <div className="rounded-[2rem] bg-espresso/[0.04] p-1.5 ring-1 ring-espresso/[0.06]">
          <div className="glass-card rounded-[calc(2rem-0.375rem)] p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ember/10 text-ember ring-1 ring-ember/15">
              <Icon.shield className="h-6 w-6 stroke-current fill-none" />
            </span>
            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.24em] text-umber">Закрытый показ</p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-espresso">
              <span className="text-aurora">Битрикс24</span> для&nbsp;агробизнеса
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-umber">
              Кейсы и живые демо: продажи, процессы, логистика, интеграции и отчёты. Введите пароль, чтобы открыть показ.
            </p>

            <form onSubmit={submit} className="mt-7">
              <input
                type="password"
                autoFocus
                value={val}
                onChange={(e) => {
                  setVal(e.target.value);
                  setErr(false);
                }}
                placeholder="Пароль"
                className={`w-full rounded-2xl bg-espresso/[0.03] px-5 py-3.5 text-sm text-espresso outline-none ring-1 transition-all duration-300 ease-spring placeholder:text-umber/40 ${
                  err ? "ring-ember/60" : "ring-espresso/10 focus:ring-ember/40"
                }`}
              />
              {err && <p className="mt-2 pl-1 text-xs text-ember">Неверный пароль — попробуйте ещё раз</p>}
              <button
                type="submit"
                className="group mt-4 flex w-full items-center justify-between rounded-full bg-espresso px-6 py-3.5 text-sm font-semibold text-cream transition-all duration-500 ease-spring active:scale-[0.98] hover:bg-bark"
              >
                Открыть презентацию
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-500 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-[1px]">
                  <Icon.arrowUpRight className="h-4 w-4 stroke-current fill-none" />
                </span>
              </button>
            </form>
          </div>
        </div>
        <p className="mt-5 text-center text-xs text-umber/60">Закрытый показ · по паролю</p>
      </div>
    </div>
  );
}
