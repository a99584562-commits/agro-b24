import { useEffect, useRef, useState } from "react";
import { Icon } from "./ui.jsx";

// Demo — ИИ-контроль качества звонков. Запись из телефонии Б24 → расшифровка по ролям →
// чек-лист скрипта загорается по ходу разговора → % соблюдения, замечания ИИ
// и поля, которые можно одним кликом записать в сделку.

const LINES = [
  { r: "m", at: "00:04", t: "Добрый день! Иван Сафонов, менеджер по семенам. Вы оставляли заявку на сайте — удобно сейчас говорить?" },
  { r: "c", at: "00:15", t: "Здравствуйте, да. На весну нужны семена — подсолнечник и кукуруза." },
  { r: "m", at: "00:31", t: "Хорошо. Какие площади планируете под каждую культуру?" },
  { r: "c", at: "00:44", t: "Подсолнечник — 320 гектаров, кукуруза — около 180." },
  { r: "m", at: "01:20", t: "Когда планируете сев и по какой технологии работаете?" },
  { r: "c", at: "01:37", t: "Сеем в начале мая. Подсолнечник — под гербицидоустойчивую технологию, кукуруза — ФАО 200–250." },
  { r: "m", at: "02:55", t: "Под вашу технологию подойдёт гибрид «Ранний-3» — 26 000 ₽ за посевную единицу, на 320 га это 48 п. е. По кукурузе — «Северный 220», 7 900 ₽ за п. е." },
  { r: "c", at: "03:48", t: "Дороговато. У соседей брали процентов на десять дешевле." },
  { r: "m", at: "04:06", t: "Ну, цена у нас такая, это прайс. Давайте я пришлю КП сегодня на почту и наберу вас в четверг в 11:00?" },
  { r: "c", at: "06:28", t: "Хорошо, присылайте — в четверг созвонимся." },
];

const CHECKS = [
  { t: "Поприветствовал и представился", at: 0, ok: true },
  { t: "Выявил культуру и площадь", at: 3, ok: true },
  { t: "Уточнил сроки и технологию", at: 5, ok: true },
  { t: "Предложил решение и цену", at: 6, ok: true },
  { t: "Отработал возражение", at: 8, ok: false },
  { t: "Договорился о следующем шаге", at: 9, ok: true },
];
const PASSED = CHECKS.filter((c) => c.ok).length;
const SCORE = Math.round((PASSED / CHECKS.length) * 100);

const REMARKS = [
  { tone: "risk", t: "Возражение по цене не отработано: менеджер не уточнил, с чем сравнивают, и не показал разницу — урожайность гибрида, обработку семян, отсрочку." },
  { tone: "ok", t: "Потребность выявлена полностью: культура, площадь, сроки и технология. Объём можно считать сразу." },
];

const FIELDS = [
  { k: "Культура", v: "Подсолнечник, кукуруза" },
  { k: "Площадь", v: "320 га + 180 га" },
  { k: "Объём", v: "48 п. е. + ≈180 п. е." },
  { k: "Срок", v: "Сев — начало мая" },
  { k: "Следующий шаг", v: "КП сегодня · звонок в чт, 11:00", wide: true },
];

// статичная «волна» записи — детерминированная, без random
const WAVE = Array.from({ length: 46 }, (_, i) => 22 + Math.round(Math.abs(Math.sin(i * 1.7) * 48 + Math.sin(i * 0.43) * 26)));

const STEP_MS = 850;
const RING_R = 26;
const RING_C = 2 * Math.PI * RING_R;

const CSS = `@keyframes cqIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }`;

function lineCheck(idx) {
  return CHECKS.find((c) => c.at === idx) || null;
}

export default function CallQuality() {
  const [phase, setPhase] = useState("idle"); // idle | run | done
  const [shown, setShown] = useState(0);
  const [tab, setTab] = useState("tr"); // tr | res
  const [saved, setSaved] = useState("no"); // no | saving | yes

  const timers = useRef([]);
  const scroller = useRef(null);

  useEffect(() => {
    const list = timers.current;
    return () =>
      list.forEach((id) => {
        clearTimeout(id);
        clearInterval(id);
      });
  }, []);

  // автопрокрутка расшифровки вниз — только внутри своего контейнера
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [shown, tab]);

  function clearAll() {
    timers.current.forEach((id) => {
      clearTimeout(id);
      clearInterval(id);
    });
    timers.current.length = 0;
  }

  function analyze() {
    clearAll();
    setShown(0);
    setPhase("run");
    setTab("tr");
    setSaved("no");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= LINES.length) {
        clearInterval(id);
        timers.current.push(setTimeout(() => setPhase("done"), 600));
        timers.current.push(setTimeout(() => setTab("res"), 1700));
      }
    }, STEP_MS);
    timers.current.push(id);
  }

  function save() {
    if (saved !== "no") return;
    setSaved("saving");
    timers.current.push(setTimeout(() => setSaved("yes"), 750));
  }

  const running = phase === "run";
  const done = phase === "done";
  const progress = shown / LINES.length;

  return (
    <div className="w-full">
      <style>{CSS}</style>

      <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/10 text-ember ring-1 ring-ember/20">
            <Icon.gauge className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-espresso">Контроль качества звонков</p>
            <p className="text-[10px] text-umber">ИИ-разбор записи · по скрипту отдела продаж</p>
          </div>
        </div>
        {done ? (
          <span className="rounded-full bg-sage/15 px-2.5 py-1 text-[10px] font-semibold text-[#3c6b32] ring-1 ring-sage/25">готово · {SCORE}%</span>
        ) : running ? (
          <span className="flex items-center gap-1.5 rounded-full bg-gold/10 px-2.5 py-1 text-[10px] font-semibold text-[#8a6418] ring-1 ring-gold/25">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-gold" /> ИИ разбирает
          </span>
        ) : (
          <span className="hidden rounded-full bg-espresso/[0.05] px-2.5 py-1 text-[10px] font-semibold text-umber ring-1 ring-espresso/10 sm:inline">ждёт разбора</span>
        )}
      </div>

      <div className="p-4">
        {/* карточка звонка */}
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-espresso/[0.02] px-3 py-2.5 ring-1 ring-espresso/[0.06]">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ember/10 text-ember ring-1 ring-ember/20">
            <Icon.phone className="h-4 w-4 stroke-current fill-none" />
            <svg viewBox="0 0 12 12" className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-sage p-0.5 text-white stroke-current fill-none" strokeWidth={1.6}>
              <path d="M9 3 3.5 8.5M3.5 4.5v4h4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="min-w-0 leading-tight">
            <p className="text-[13px] font-semibold text-espresso">
              Входящий · <span className="tabular-nums">6:42</span>
            </p>
            <p className="truncate text-[11px] text-umber">И. Сафонов ↔ КФХ «Рассвет» · сегодня 10:42</p>
          </div>
          <div className="hidden h-8 min-w-0 flex-1 items-center gap-[2px] sm:flex" aria-hidden="true">
            {WAVE.map((h, i) => (
              <span
                key={i}
                className={`w-[3px] flex-1 rounded-full transition-colors duration-300 ${i / WAVE.length < progress ? "bg-ember/70" : "bg-espresso/15"}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          {running ? (
            <span className="ml-auto flex items-center gap-2 rounded-full bg-espresso/[0.05] px-4 py-2 text-[13px] font-semibold text-umber ring-1 ring-espresso/10">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ember" /> Разбираю…
            </span>
          ) : done ? (
            <button
              onClick={analyze}
              className="ml-auto flex items-center gap-1.5 rounded-full bg-espresso/[0.05] px-4 py-2 text-[13px] font-medium text-umber ring-1 ring-espresso/10 transition-all duration-300 ease-spring hover:bg-espresso/10 active:scale-[0.98]"
            >
              <Icon.repeat className="h-4 w-4 stroke-current fill-none" /> Разобрать заново
            </button>
          ) : (
            <button
              onClick={analyze}
              className="ml-auto flex items-center gap-2 rounded-full bg-ember px-4 py-2 text-sm font-semibold text-cream transition-all duration-300 ease-spring hover:brightness-105 active:scale-[0.98]"
            >
              <Icon.spark className="h-4 w-4 stroke-current fill-none" /> Разобрать звонок
            </button>
          )}
        </div>

        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-[1fr_14.5rem]">
          {/* расшифровка / итог */}
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-1">
              {[
                { id: "tr", label: "Расшифровка" },
                { id: "res", label: "Итог для сделки" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  disabled={t.id === "res" && !done}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-all duration-300 ease-spring disabled:opacity-40 ${
                    tab === t.id ? "bg-espresso text-cream" : "text-umber enabled:hover:bg-espresso/[0.05]"
                  }`}
                >
                  {t.label}
                  {t.id === "res" && done && tab !== "res" && <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ember" />}
                </button>
              ))}
            </div>

            {tab === "tr" ? (
              <div ref={scroller} className="thin-scroll h-[16.5rem] space-y-2 overflow-y-auto rounded-2xl bg-espresso/[0.02] p-3 ring-1 ring-espresso/[0.06]">
                {phase === "idle" && (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ember/10 text-ember ring-1 ring-ember/20">
                      <Icon.spark className="h-5 w-5 stroke-current fill-none" />
                    </span>
                    <p className="mt-2 text-[13px] font-semibold text-espresso">Запись подтянута из телефонии</p>
                    <p className="mt-0.5 max-w-[16rem] text-[11px] text-umber">ИИ расшифрует разговор по ролям и проверит его по скрипту продаж</p>
                  </div>
                )}
                {LINES.slice(0, shown).map((l, i) => {
                  const c = lineCheck(i);
                  const mgr = l.r === "m";
                  return (
                    <div key={i} className={`flex flex-col ${mgr ? "items-start" : "items-end"}`} style={{ animation: "cqIn .4s cubic-bezier(0.32,0.72,0,1) both" }}>
                      <span className="mb-0.5 px-1 text-[9.5px] font-semibold uppercase tracking-wide text-umber/80">
                        {mgr ? "Менеджер" : "Клиент"} · <span className="tabular-nums">{l.at}</span>
                      </span>
                      <p
                        className={`max-w-[88%] rounded-2xl px-3 py-1.5 text-[12px] leading-snug text-espresso ring-1 ${
                          c && !c.ok ? "bg-red-500/[0.06] ring-red-500/25" : mgr ? "bg-ember/[0.07] ring-ember/15" : "bg-white/70 ring-espresso/[0.06]"
                        }`}
                      >
                        {l.t}
                      </p>
                      {c && (
                        <span className={`mt-1 flex items-center gap-1 rounded-full px-2 py-px text-[9.5px] font-semibold ring-1 ${c.ok ? "bg-sage/15 text-[#3c6b32] ring-sage/25" : "bg-red-500/10 text-red-700 ring-red-500/20"}`}>
                          {c.ok ? <Icon.check className="h-3 w-3 stroke-current fill-none" /> : <Icon.warn className="h-3 w-3 stroke-current fill-none" />}
                          {c.ok ? c.t : "Возражение не отработано"}
                        </span>
                      )}
                    </div>
                  );
                })}
                {running && shown < LINES.length && (
                  <div className={`flex ${LINES[shown].r === "m" ? "justify-start" : "justify-end"}`}>
                    <span className="flex items-center gap-1 rounded-2xl bg-white/60 px-3 py-2 ring-1 ring-espresso/[0.06]">
                      <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-umber/50" />
                      <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-umber/50 [animation-delay:200ms]" />
                      <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-umber/50 [animation-delay:400ms]" />
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="thin-scroll h-[16.5rem] space-y-2.5 overflow-y-auto rounded-2xl bg-espresso/[0.02] p-3 ring-1 ring-espresso/[0.06]" style={{ animation: "cqIn .45s cubic-bezier(0.32,0.72,0,1) both" }}>
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-umber">Замечания ИИ</p>
                  <ul className="space-y-1.5">
                    {REMARKS.map((r) => (
                      <li
                        key={r.t}
                        className={`flex items-start gap-2 rounded-xl px-2.5 py-1.5 text-[11.5px] leading-snug ring-1 ${r.tone === "risk" ? "bg-red-500/[0.06] text-red-800 ring-red-500/20" : "bg-sage/10 text-[#3c6b32] ring-sage/25"}`}
                      >
                        {r.tone === "risk" ? <Icon.warn className="mt-px h-3.5 w-3.5 shrink-0 stroke-current fill-none" /> : <Icon.check className="mt-px h-3.5 w-3.5 shrink-0 stroke-current fill-none" />}
                        {r.t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-umber">Поля для сделки</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {FIELDS.map((f) => (
                      <div
                        key={f.k}
                        className={`rounded-xl px-2.5 py-1.5 ring-1 transition-all duration-500 ease-spring ${f.wide ? "col-span-2" : ""} ${saved === "yes" ? "bg-sage/10 ring-sage/25" : "bg-white/60 ring-espresso/[0.06]"}`}
                      >
                        <p className="text-[9.5px] font-semibold uppercase tracking-wide text-umber/80">{f.k}</p>
                        <p className="truncate text-[12px] font-semibold text-espresso">{f.v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {saved === "yes" ? (
                      <span className="flex items-center gap-2 rounded-full bg-sage/15 px-3.5 py-2 text-[12px] font-semibold text-[#3c6b32] ring-1 ring-sage/25" style={{ animation: "cqIn .4s cubic-bezier(0.32,0.72,0,1) both" }}>
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-sage text-white">
                          <Icon.check className="h-3 w-3 stroke-current fill-none" />
                        </span>
                        Записано в сделку #2341
                      </span>
                    ) : (
                      <button
                        onClick={save}
                        disabled={saved === "saving"}
                        className="flex items-center gap-2 rounded-full bg-ember px-4 py-2 text-[13px] font-semibold text-cream transition-all duration-300 ease-spring hover:brightness-105 active:scale-[0.98] disabled:opacity-70"
                      >
                        {saved === "saving" ? <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-cream" /> : <Icon.arrow className="h-4 w-4 stroke-current fill-none" />}
                        {saved === "saving" ? "Записываю…" : "Записать в сделку"}
                      </button>
                    )}
                    <span className="text-[10.5px] text-umber">КФХ «Рассвет» · воронка «Семена»</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* чек-лист + итог */}
          <div className="min-w-0">
            <p className="mb-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-umber">Чек-лист скрипта</p>
            <ul className="space-y-1">
              {CHECKS.map((c, i) => {
                const st = shown > c.at ? (c.ok ? "ok" : "fail") : "wait";
                return (
                  <li
                    key={c.t}
                    className={`flex items-center gap-2 rounded-xl px-2.5 py-1 text-[12px] ring-1 transition-all duration-500 ease-spring ${
                      st === "ok" ? "bg-sage/10 font-semibold text-espresso ring-sage/25" : st === "fail" ? "bg-red-500/[0.06] font-semibold text-red-800 ring-red-500/20" : "bg-white/40 text-umber/70 ring-espresso/[0.06]"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition-all duration-500 ${
                        st === "ok" ? "bg-sage text-white" : st === "fail" ? "bg-red-500 text-white" : "bg-espresso/[0.05] text-umber/60"
                      }`}
                    >
                      {st === "ok" ? (
                        <Icon.check className="h-3 w-3 stroke-current fill-none" />
                      ) : st === "fail" ? (
                        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 stroke-current fill-none" strokeWidth={1.6}>
                          <path d="M3 3l6 6M9 3 3 9" strokeLinecap="round" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </span>
                    <span className="leading-tight">{c.t}</span>
                  </li>
                );
              })}
            </ul>

            <div className={`mt-2.5 flex items-center gap-3 rounded-2xl px-3 py-2 ring-1 transition-all duration-500 ${done ? "bg-white/60 ring-espresso/[0.08]" : "bg-espresso/[0.02] ring-espresso/[0.06]"}`}>
              <div className="relative h-14 w-14 shrink-0">
                <svg viewBox="0 0 64 64" className="h-14 w-14 -rotate-90">
                  <circle cx="32" cy="32" r={RING_R} className="fill-none stroke-espresso/10" strokeWidth={6} />
                  <circle
                    cx="32"
                    cy="32"
                    r={RING_R}
                    className="fill-none stroke-ember transition-[stroke-dashoffset] duration-1000 ease-spring"
                    strokeWidth={6}
                    strokeLinecap="round"
                    strokeDasharray={RING_C}
                    strokeDashoffset={done ? RING_C * (1 - SCORE / 100) : RING_C}
                  />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center font-display text-[15px] font-semibold tabular-nums ${done ? "text-espresso" : "text-umber/50"}`}>
                  {done ? `${SCORE}%` : "—"}
                </span>
              </div>
              <div className="leading-tight">
                <p className="text-[12px] font-semibold text-espresso">Соблюдение скрипта</p>
                <p className="mt-0.5 text-[11px] text-umber">{done ? `${PASSED} из ${CHECKS.length} пунктов · 1 замечание` : "появится после разбора"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
