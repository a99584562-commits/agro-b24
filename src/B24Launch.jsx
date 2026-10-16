import { useState } from "react";
import { Avatar, B24Shell, BI } from "./b24kit.jsx";

// Демо — запуск заявки (бизнес-процесса) из Ленты так, как это выглядит в Битрикс24:
// Лента → «Процессы» → выбрать процесс → заполнить поля → «Запустить».
// В ленте появляется пост с маршрутом согласования и кнопками «Утвердить / Отклонить».

const P = {
  invoice: {
    name: "Счёт на оплату", glyph: BI.doc, color: "#2fc6f6", time: "4 ч",
    desc: "Счёт уходит на согласование по маршруту, после оплаты — в реестр платежей и 1С.",
    fields: [["Поставщик", "ООО «ТехАгроСервис»"], ["Сумма", "184 000 ₽"], ["Статья бюджета", "Запчасти и ремонт"], ["Оплатить до", "22.10.2026"], ["Файл счёта", "📎 Счёт_2291.pdf"]],
    subject: "счёт «Запчасти к комбайну» на 184 000 ₽", approve: "Утвердить счёт", reject: "Отклонить счёт",
    route: [["Руководитель", "С. Михайлов", "#5a8dee"], ["Финдиректор", "Е. Белова", "#1a9ad6"], ["Бухгалтерия", "Н. Котова", "#3fb68b"]],
    task: "Утвердите счёт № 2291 от ООО «ТехАгроСервис» за запчасти к комбайну.",
    done: "Счёт оплачен и выгружен в 1С, остаток по статье бюджета обновлён.",
  },
  buy: {
    name: "Заявка на закупку", glyph: BI.task, color: "#7bd500", time: "1 день",
    desc: "Снабжение собирает предложения поставщиков, после утверждения создаётся элемент «Закупка».",
    fields: [["Что закупить", "Аммиачная селитра, 120 т"], ["Для чего", "Подкормка озимых"], ["Нужно к", "15.03.2027"], ["Ориентир по бюджету", "3 900 000 ₽"], ["Инициатор", "И. Сафонов, агроном"]],
    subject: "заявку «Аммиачная селитра, 120 т»", approve: "Утвердить заявку", reject: "Отклонить",
    route: [["Руководитель отделения", "А. Захаров", "#e8833a"], ["Снабжение", "Т. Ильина", "#a78bfa"], ["Финдиректор", "Е. Белова", "#1a9ad6"]],
    task: "Утвердите заявку на закупку удобрений к весенней подкормке.",
    done: "Создан элемент смарт-процесса «Закупка» № 313 — снабжение запросило КП у поставщиков.",
  },
  repair: {
    name: "Ремонт техники", glyph: BI.gear, color: "#ffb300", time: "2 ч",
    desc: "Заявка механика с фото, главный инженер принимает в работу, техника снимается с календаря.",
    fields: [["Техника", "Комбайн № 7"], ["Неисправность", "Течь гидравлики"], ["Срочность", "Высокая — уборка через 5 дней"], ["Местоположение", "Отделение № 2"], ["Фото", "📎 3 фото"]],
    subject: "заявку на ремонт «Комбайн № 7»", approve: "Принять в работу", reject: "Вернуть",
    route: [["Главный инженер", "В. Тихонов", "#3fb68b"], ["Механик", "А. Лыков", "#e8833a"]],
    task: "Примите в работу заявку на ремонт комбайна № 7.",
    done: "Создан элемент «Ремонт техники», комбайн снят с календаря бронирования.",
  },
  trip: {
    name: "Командировка", glyph: BI.cal, color: "#a78bfa", time: "1 день",
    desc: "Согласование руководителем, приказ и аванс — автоматически, отчёт о визитах — в карточки клиентов.",
    fields: [["Куда", "Хозяйства Южного района"], ["Даты", "21–23.10.2026"], ["Цель", "Объезд клиентов, 6 встреч"], ["Аванс", "18 000 ₽"], ["Транспорт", "Служебный автомобиль"]],
    subject: "командировку «Объезд хозяйств, 3 дня»", approve: "Согласовать", reject: "Отклонить",
    route: [["Руководитель", "С. Михайлов", "#5a8dee"], ["Бухгалтерия", "Н. Котова", "#3fb68b"]],
    task: "Согласуйте командировку агронома 21–23 октября.",
    done: "Приказ сформирован, аванс выдан и проведён в 1С.",
  },
  vacation: {
    name: "Заявление на отпуск", glyph: BI.home, color: "#ff8a65", time: "1 день",
    desc: "Руководитель согласует даты, кадры готовят приказ, отпуск появляется в графике отсутствий.",
    fields: [["Даты", "03.11–16.11.2026"], ["Тип", "Ежегодный оплачиваемый"], ["Замещает", "М. Орлова"], ["Комментарий", "После уборочной"]],
    subject: "заявление на отпуск с 3 ноября", approve: "Согласовать", reject: "Отклонить",
    route: [["Руководитель", "С. Михайлов", "#5a8dee"], ["Отдел кадров", "О. Савина", "#ff8a65"]],
    task: "Согласуйте отпуск с 3 по 16 ноября.",
    done: "Отпуск согласован и отмечен в графике отсутствий.",
  },
  cash: {
    name: "Выдача наличных", glyph: BI.mail, color: "#26a69a", time: "3 ч",
    desc: "Сумма и назначение — на согласование руководителю, затем задание кассиру.",
    fields: [["Сумма", "12 000 ₽"], ["На что", "ГСМ для выездной бригады"], ["Получатель", "Р. Гиниятов"], ["Отчитаться до", "25.10.2026"]],
    subject: "выдачу наличных 12 000 ₽ на ГСМ", approve: "Согласовать", reject: "Отклонить",
    route: [["Руководитель", "С. Михайлов", "#5a8dee"], ["Касса", "Л. Яковлева", "#26a69a"]],
    task: "Согласуйте выдачу 12 000 ₽ на ГСМ для выездной бригады.",
    done: "Выдача согласована, кассир получил задание.",
  },
};
const ORDER = ["invoice", "buy", "repair", "trip", "vacation", "cash"];
const ME = { name: "И. Сафонов", ini: "С", c: "#5a8dee" };
const now = () => new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

export default function B24Launch() {
  const [step, setStep] = useState("catalog"); // catalog | form | feed
  const [pid, setPid] = useState("invoice");
  const [ok, setOk] = useState(0); // сколько этапов пройдено
  const [status, setStatus] = useState("pending");
  const [log, setLog] = useState([]);
  const [launched, setLaunched] = useState(0);
  const p = P[pid];
  const cur = p.route[ok];
  const waiting = step === "feed" && status === "pending" ? 1 : 0;

  function pick(id) {
    setPid(id);
    setStep("form");
  }
  function launch() {
    setOk(0);
    setStatus("pending");
    setLog([{ t: `${ME.name} запустил(а) процесс`, time: now() }]);
    setLaunched((n) => n + 1);
    setStep("feed");
  }
  function decide(yes) {
    if (!yes) {
      setStatus("rejected");
      setLog((l) => [...l, { t: `${cur[1]} отклонил(а): «Нужно сравнение с ещё одним поставщиком»`, time: now(), bad: true }]);
      return;
    }
    const n = ok + 1;
    setLog((l) => [...l, { t: `${cur[1]}, ${cur[0].toLowerCase()}: согласовано`, time: now() }]);
    setOk(n);
    if (n >= p.route.length) setStatus("done");
  }

  return (
    <div className="w-full overflow-x-auto" data-noswipe>
      <B24Shell tabs={["Лента", "Мессенджер", "Календарь", "Ещё ▾"]} active={0} rail={1} className="h-[31rem] min-w-[60rem] rounded-[calc(2rem-0.375rem)]">
        <div className="grid h-full grid-cols-[1fr_12.5rem] gap-3 px-3 pb-3">
          {/* main */}
          <div className="flex min-h-0 flex-col">
            <h3 className="px-1 pb-2 text-[19px] font-semibold text-white">Новости</h3>
            <div className="flex min-h-0 flex-1 flex-col rounded-xl bg-white">
              {/* composer tabs */}
              <div className="flex items-center gap-4 border-b border-[#eef0f2] px-4 pt-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#535c69]">
                {["Сообщение", "Задача", "Событие", "Опрос"].map((t) => (
                  <span key={t} className="pb-2">
                    {t}
                  </span>
                ))}
                <button
                  onClick={() => setStep("catalog")}
                  className={`pb-2 font-semibold uppercase tracking-wide ${step !== "feed" ? "border-b-2 border-[#2fc6f6] text-[#1a8fc0]" : "hover:text-[#1a8fc0]"}`}
                >
                  Процессы ▾
                </button>
                {step === "feed" && <span className="ml-auto pb-2 text-[10.5px] font-normal normal-case tracking-normal text-[#a0aab4]">нажмите «Процессы», чтобы запустить ещё</span>}
              </div>

              <div className="thin-scroll min-h-0 flex-1 overflow-y-auto p-4">
                {step === "catalog" && (
                  <div className="animate-floatUp [animation-duration:0.4s]">
                    <p className="text-[12px] text-[#7b8794]">Выберите процесс — заполните поля — нажмите «Запустить»</p>
                    <div className="mt-3 grid grid-cols-3 gap-2.5">
                      {ORDER.map((id) => {
                        const x = P[id];
                        return (
                          <button key={id} onClick={() => pick(id)} className="flex items-center gap-2.5 rounded-xl bg-[#f3f6f8] p-3 text-left transition-all hover:bg-[#e5f7fe] hover:ring-1 hover:ring-[#2fc6f6]/50">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: x.color }}>
                              <x.glyph className="h-5 w-5 stroke-current fill-none" />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-[12.5px] font-semibold text-[#333]">{x.name}</span>
                              <span className="block text-[10.5px] text-[#a0aab4]">в среднем {x.time}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-3 text-[11px] text-[#a0aab4]">Свои процессы под компанию добавляются в этот же список: ремонт техники, приёмка партии, пропуск на въезд…</p>
                  </div>
                )}

                {step === "form" && (
                  <div className="animate-floatUp [animation-duration:0.4s]">
                    <button onClick={() => setStep("catalog")} className="text-[11.5px] text-[#2067b0] hover:underline">
                      ← К списку процессов
                    </button>
                    <div className="mt-1.5 flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: p.color }}>
                        <p.glyph className="h-4 w-4 stroke-current fill-none" />
                      </span>
                      <h4 className="text-[16px] font-semibold text-[#333]">{p.name}</h4>
                    </div>
                    <div className="mt-2 rounded-lg bg-[#e5f7fe] px-3 py-1.5 text-[11.5px] text-[#1f6f91]">
                      <b>Рекомендации:</b> {p.desc} Среднее время выполнения — {p.time}.
                    </div>
                    <div className="mt-2.5 grid grid-cols-3 gap-x-3 gap-y-2">
                      {p.fields.map(([k, v]) => (
                        <label key={k} className="block">
                          <span className="text-[10.5px] text-[#7b8794]">
                            {k}
                            <span className="text-[#ff5752]">*</span>
                          </span>
                          <span className="mt-0.5 block rounded-md border border-[#dfe3e8] bg-white px-2.5 py-1.5 text-[12px] text-[#333]">{v}</span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-2.5 flex items-center gap-1.5 text-[10.5px] text-[#7b8794]">
                      Маршрут:
                      {p.route.map(([r], k) => (
                        <span key={r} className="flex items-center gap-1.5">
                          <span className="rounded bg-[#f3f6f8] px-1.5 py-0.5 text-[#535c69]">{r}</span>
                          {k < p.route.length - 1 && "→"}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={launch} className="rounded-full bg-[#2fc26e] px-5 py-1.5 text-[11.5px] font-bold uppercase text-white hover:brightness-105">
                        Запустить
                      </button>
                      <button onClick={() => setStep("catalog")} className="rounded-full px-4 py-1.5 text-[11.5px] font-bold uppercase text-[#535c69] hover:bg-[#f3f6f8]">
                        Отмена
                      </button>
                    </div>
                  </div>
                )}

                {step === "feed" && (
                  <div className="animate-floatUp [animation-duration:0.4s]">
                    {/* post */}
                    <div className="rounded-xl border border-[#eef0f2] p-3">
                      <div className="flex items-start gap-2.5">
                        <Avatar ini={ME.ini} color={ME.c} size={32} />
                        <div className="min-w-0 flex-1">
                          <p className="text-[12.5px]">
                            <span className="font-semibold text-[#2067b0]">{ME.name}</span>
                            <span className="text-[#a0aab4]"> › Все сотрудники</span>
                          </p>
                          <p className="text-[10.5px] text-[#a0aab4]">Сегодня, {log[0]?.time}</p>
                        </div>
                        {status !== "pending" && (
                          <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${status === "done" ? "bg-[#eaf7d1] text-[#4e8a00]" : "bg-[#ffe3e2] text-[#d23c37]"}`}>
                            {status === "done" ? "Завершён" : "Отклонён"}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-[13px] font-semibold text-[#333]">{p.name}</p>
                      <div className="mt-1 flex items-center gap-2 text-[12px] text-[#535c69]">
                        <span className="flex h-5 w-5 items-center justify-center rounded text-white" style={{ background: p.color }}>
                          <p.glyph className="h-3 w-3 stroke-current fill-none" />
                        </span>
                        <span>
                          <span className="text-[#2067b0]">{ME.name}</span> добавил(а) {p.subject}
                        </span>
                      </div>

                      {/* route + buttons */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <Avatar ini={ME.ini} color={ME.c} size={26} />
                          {p.route.map(([r, who, c], k) => (
                            <span key={r} className="flex items-center gap-1.5">
                              <span className="text-[#c9d0d8]">→</span>
                              <span className={`relative rounded-full ${k === ok && status === "pending" ? "ring-2 ring-[#2fc6f6] ring-offset-1" : ""} ${k > ok || (k === ok && status !== "pending" && status !== "done") ? "opacity-40" : ""}`} title={`${r}: ${who}`}>
                                <Avatar ini={who.split(" ")[1][0]} color={c} size={26} />
                                {k < ok && (
                                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-[#7bd500] text-white">
                                    <BI.check className="h-2 w-2 stroke-current fill-none" />
                                  </span>
                                )}
                              </span>
                            </span>
                          ))}
                        </div>
                        {status === "pending" && (
                          <div className="flex gap-1.5">
                            <button onClick={() => decide(true)} className="flex items-center gap-1 rounded bg-[#7bd500] px-3 py-1 text-[10.5px] font-bold uppercase text-white hover:brightness-105">
                              <BI.check className="h-3 w-3 stroke-current fill-none" /> {p.approve}
                            </button>
                            <button onClick={() => decide(false)} className="flex items-center gap-1 rounded bg-[#ff5752] px-3 py-1 text-[10.5px] font-bold uppercase text-white hover:brightness-105">
                              <BI.close className="h-3 w-3 stroke-current fill-none" /> {p.reject}
                            </button>
                          </div>
                        )}
                        {status === "pending" && (
                          <span className="text-[10.5px] text-[#7b8794]">
                            ждёт: <b className="text-[#333]">{cur[0]}</b> · {cur[1]}
                          </span>
                        )}
                      </div>

                      {/* task box */}
                      <div className={`mt-2.5 rounded-lg px-3 py-2 text-[11.5px] ${status === "done" ? "bg-[#f1fae1] text-[#3d6b00]" : status === "rejected" ? "bg-[#fff1f0] text-[#a33a36]" : "bg-[#e5f7fe] text-[#1f6f91]"}`}>
                        {status === "pending" ? (
                          <>
                            <b>Задание:</b> {p.task}
                            <div className="mt-1 grid grid-cols-2 gap-x-4 text-[11px] text-[#41708a]">
                              {p.fields.slice(0, 4).map(([k, v]) => (
                                <span key={k} className="truncate">
                                  {k}: <b>{v}</b>
                                </span>
                              ))}
                            </div>
                          </>
                        ) : status === "done" ? (
                          <>
                            <b>Процесс завершён.</b> {p.done}
                          </>
                        ) : (
                          <>
                            <b>Возвращено инициатору.</b> Задача на доработку поставлена автоматически.
                          </>
                        )}
                      </div>

                      {/* comments-like log */}
                      <div className="mt-2 space-y-1 border-t border-[#f1f3f5] pt-2">
                        {log.map((e, k) => (
                          <p key={k} className="flex items-center gap-2 text-[11px] text-[#7b8794]">
                            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${e.bad ? "bg-[#ff5752]" : "bg-[#2fc6f6]"}`} />
                            <span className="text-[#535c69]">{e.t}</span>
                            <span className="ml-auto shrink-0 text-[#a0aab4]">{e.time}</span>
                          </p>
                        ))}
                      </div>
                      <div className="mt-2 flex gap-4 text-[11px] text-[#7b8794]">
                        <span>Нравится</span>
                        <span>Комментировать</span>
                        <span>Следить</span>
                        <span>Ещё</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* right widgets */}
          <div className="flex flex-col gap-2.5 pt-9">
            <div className="rounded-xl bg-white p-3">
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-[#535c69]">Бизнес-процессы</p>
              <div className="mt-2 space-y-1.5 text-[12px]">
                <p className="flex justify-between">
                  Ждут реакции
                  <span className={`rounded-full px-1.5 text-[11px] font-semibold ${waiting ? "bg-[#ff5752] text-white" : "bg-[#eef2f4] text-[#7b8794]"}`}>{waiting}</span>
                </p>
                <p className="flex justify-between">
                  Запущены мной <span className="rounded-full bg-[#eef2f4] px-1.5 text-[11px] font-semibold text-[#7b8794]">{launched}</span>
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-white p-3">
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-[#535c69]">Мои задачи</p>
              <div className="mt-2 space-y-1.5 text-[12px]">
                {[["Делаю", 4], ["Помогаю", 1], ["Поручил", 7], ["Наблюдаю", 2]].map(([k, v]) => (
                  <p key={k} className="flex justify-between">
                    {k} <span className="text-[#7b8794]">{v}</span>
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-white/15 p-3 text-[11px] leading-snug text-white">
              Задание приходит согласующему в ленту, уведомления и мобильное приложение — утвердить можно с телефона.
            </div>
          </div>
        </div>
      </B24Shell>
    </div>
  );
}
