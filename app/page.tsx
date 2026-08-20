"use client";

import { useMemo, useState } from "react";

type AgeKey = "junior" | "middle" | "teen";
type AreaKey = "sleep" | "morning" | "things" | "focus" | "feelings";
type PlanLength = 3 | 7 | 14;

const AGES: Record<AgeKey, { label: string; sleep: string; approach: string }> = {
  junior: {
    label: "7–8 лет",
    sleep: "9–12 часов",
    approach: "Больше наглядности и два простых варианта на выбор.",
  },
  middle: {
    label: "9–11 лет",
    sleep: "9–12 часов",
    approach: "Планируйте вместе и отдавайте ребёнку один участок ответственности.",
  },
  teen: {
    label: "12–15 лет",
    sleep: "9–12 часов в 12 лет; 8–10 часов с 13 лет",
    approach: "Договаривайтесь о результате, а не контролируйте каждый шаг.",
  },
};

const CHECKS: Array<{ key: AreaKey; number: string; title: string; question: string }> = [
  { key: "sleep", number: "01", title: "Сон", question: "Засыпает и просыпается примерно в школьное время?" },
  { key: "morning", number: "02", title: "Утро", question: "Сборы проходят без постоянной спешки и поисков вещей?" },
  { key: "things", number: "03", title: "Готовность", question: "Всё необходимое проверено, а маршрут и расписание понятны?" },
  { key: "focus", number: "04", title: "Внимание", question: "Может спокойно заниматься одним делом хотя бы 20 минут?" },
  { key: "feelings", number: "05", title: "Настрой", question: "Может рассказать, чего ждёт и что его беспокоит?" },
];

type PlanItem = {
  id: string;
  when: string;
  title: string;
  text: string;
  areas: AreaKey[];
  time: string;
};

const PLANS: Record<PlanLength, PlanItem[]> = {
  3: [
    {
      id: "3-1",
      when: "Сегодня",
      title: "Зафиксируйте подъём и соберите базу",
      text: "Поставьте школьный будильник, посчитайте время сна назад и вместе проверьте одежду, обувь, канцелярию и дорогу.",
      areas: ["sleep", "things"],
      time: "25 мин",
    },
    {
      id: "3-2",
      when: "Завтра",
      title: "Проведите репетицию утра",
      text: "Встаньте в школьное время, соберитесь по таймеру без оценок. Днём добавьте одно спокойное дело на 20 минут.",
      areas: ["morning", "focus"],
      time: "одно утро",
    },
    {
      id: "3-3",
      when: "Накануне",
      title: "Снизьте неопределённость, а не тревогу",
      text: "Спросите, что кажется самым сложным, придумайте один план «если — то», приготовьте всё с вечера и закончите день спокойно.",
      areas: ["feelings", "morning", "sleep"],
      time: "20 мин",
    },
  ],
  7: [
    {
      id: "7-1",
      when: "День 1",
      title: "Найдите реальную точку старта",
      text: "Запишите время сна и подъёма без критики. Определите, на сколько минут нужно сдвинуть режим, чтобы выйти на школьное утро.",
      areas: ["sleep"],
      time: "10 мин",
    },
    {
      id: "7-2",
      when: "День 2",
      title: "Сдвиньте ритм на 15–20 минут",
      text: "Чуть раньше начните вечерние дела и поставьте подъём. Не пытайтесь за один день отыграть весь летний режим.",
      areas: ["sleep"],
      time: "без аврала",
    },
    {
      id: "7-3",
      when: "День 3",
      title: "Уберите утренние решения",
      text: "Сделайте короткий вечерний чек-лист: одежда, сумка, бутылка, завтрак, ключи. Пусть ребёнок выберет, за что отвечает сам.",
      areas: ["morning", "things"],
      time: "15 мин",
    },
    {
      id: "7-4",
      when: "День 4",
      title: "Верните мышце внимания тонус",
      text: "Одно спокойное занятие на 20 минут: чтение, конструктор, письмо, настольная игра. Остановитесь до усталости.",
      areas: ["focus"],
      time: "20 мин",
    },
    {
      id: "7-5",
      when: "День 5",
      title: "Разберите одно беспокойство",
      text: "Не убеждайте, что бояться нечего. Назовите чувство, уточните ситуацию и вместе найдите один маленький следующий шаг.",
      areas: ["feelings"],
      time: "10 мин",
    },
    {
      id: "7-6",
      when: "День 6",
      title: "Проживите школьное утро заранее",
      text: "Подъём, завтрак, сборы и выход — как в учебный день. После спросите только: «Что сделало бы завтра на 10% легче?»",
      areas: ["morning", "things"],
      time: "одно утро",
    },
    {
      id: "7-7",
      when: "День 7",
      title: "Оставьте место для нормального старта",
      text: "Соберите всё с вечера, сократите экраны перед сном и не добавляйте учебный марафон. Цель первого дня — войти в ритм, не стать идеальным.",
      areas: ["sleep", "feelings"],
      time: "тихий вечер",
    },
  ],
  14: [
    {
      id: "14-1",
      when: "Дни 14–11",
      title: "Выровняйте время подъёма",
      text: "Каждые 1–2 дня двигайте сон и подъём на 15–20 минут. Сначала стабилизируйте утро, затем подтянется вечер.",
      areas: ["sleep"],
      time: "4 дня",
    },
    {
      id: "14-2",
      when: "Дни 10–8",
      title: "Верните опорные точки дня",
      text: "Завтрак, прогулка, спокойное дело и вечерний ритуал примерно в одно время. Не расписывайте весь день по минутам.",
      areas: ["sleep", "focus"],
      time: "3 дня",
    },
    {
      id: "14-3",
      when: "Дни 7–5",
      title: "Разберите быт по частям",
      text: "Проверьте вещи, маршрут, расписание и место для сборов. Покупайте только после списка, составленного вместе.",
      areas: ["things", "morning"],
      time: "по 15 мин",
    },
    {
      id: "14-4",
      when: "Дни 4–3",
      title: "Потренируйте фокус и утро",
      text: "Добавьте два коротких занятия по 20 минут и одну репетицию школьного утра. После меняйте только то, что реально мешало.",
      areas: ["focus", "morning"],
      time: "2 дня",
    },
    {
      id: "14-5",
      when: "Дни 2–1",
      title: "Поговорите и сбавьте обороты",
      text: "Обсудите ожидания, договоритесь о помощи на первой неделе и подготовьте спокойный вечер без последней попытки «успеть всё».",
      areas: ["feelings", "sleep"],
      time: "2 дня",
    },
  ],
};

const WORRIES: Array<{ key: string; label: string; object: string; step: string }> = [
  { key: "friends", label: "Друзья", object: "отношения с ребятами", step: "написать одному знакомому до начала занятий" },
  { key: "study", label: "Учёба", object: "учебная нагрузка", step: "выбрать один предмет и подготовить по нему только самое нужное" },
  { key: "class", label: "Класс / учитель", object: "новый класс или учитель", step: "заранее узнать, к какому взрослому можно обратиться" },
  { key: "morning", label: "Утро", object: "утренние сборы", step: "один раз пройти утро по шагам без спешки" },
  { key: "sleep", label: "Сон", object: "ранний подъём", step: "сегодня сдвинуть отбой всего на 15–20 минут" },
];

export default function Home() {
  const [age, setAge] = useState<AgeKey>("junior");
  const [days, setDays] = useState<PlanLength>(7);
  const [answers, setAnswers] = useState<Partial<Record<AreaKey, boolean>>>({});
  const [completed, setCompleted] = useState<string[]>([]);
  const [worry, setWorry] = useState(WORRIES[0]);

  const needs = useMemo(
    () => CHECKS.filter((item) => answers[item.key] === false).map((item) => item.key),
    [answers],
  );
  const answeredCount = Object.keys(answers).length;
  const completion = Math.round((completed.filter((id) => PLANS[days].some((item) => item.id === id)).length / PLANS[days].length) * 100);

  function changeDays(value: PlanLength) {
    setDays(value);
    setCompleted([]);
  }

  function toggleCompleted(id: string) {
    setCompleted((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <main>
      <section className="hero" id="top">
        <nav className="nav" aria-label="Навигация">
          <a className="brand header-brand" href="#top" aria-label="Kids Blogging School — Мягкий старт, в начало">
            <img className="brand-logo" src="/brand/kbs-logo.svg" alt="Kids Blogging School" width={545} height={162} fetchPriority="high" />
            <span className="brand-divider" aria-hidden="true" />
            <span className="material-name">Мягкий старт</span>
          </a>
          <div className="nav-links">
            <a href="#checkup">Проверка</a>
            <a href="#plan">Мой план</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span /> До школы — без рывка</div>
            <h1>Помогите ребёнку <em>мягко</em> вернуться в учебный ритм</h1>
            <p className="lead">
              Не «повторить всё за лето», а вернуть сон, спокойное утро и ощущение:
              <strong> я справлюсь.</strong>
            </p>
            <fieldset className="age-picker">
              <legend>Возраст ребёнка</legend>
              <div className="age-options">
                {(Object.entries(AGES) as Array<[AgeKey, typeof AGES[AgeKey]]>).map(([key, item]) => (
                  <button type="button" key={key} className={age === key ? "active" : ""} onClick={() => setAge(key)} aria-pressed={age === key}>
                    {item.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <a className="primary-button" href="#checkup">
              Начать проверку <span aria-hidden="true">↓</span>
            </a>
          </div>

          <aside className="preview-card" aria-label="Первый практический шаг">
            <div className="card-topline"><span>Шаг 1 из 5</span><span className="time-chip">15 минут</span></div>
            <div className="moon" aria-hidden="true"><i /></div>
            <p className="card-label">Сегодня вечером</p>
            <h2>Сдвиньте отбой всего на 15–20 минут</h2>
            <p>Маленький шаг легче принять, чем резкий переход на «школьный режим».</p>
            <div className="mini-progress"><span /></div>
          </aside>
        </div>

        <div className="promise-strip" aria-label="О материале">
          <span><b>5</b> коротких вопросов</span>
          <span><b>3</b> минуты</span>
        </div>
      </section>

      <section className="checkup section-shell" id="checkup">
        <div className="section-heading">
          <div><p className="kicker">Быстрая проверка</p><h2>Где сейчас нужна поддержка?</h2></div>
          <div className="question-progress" aria-live="polite"><b>{answeredCount}/5</b><span>ответов</span></div>
        </div>
        <p className="section-intro">Не ставим оценку ребёнку. Просто замечаем, какую часть перехода можно сделать легче.</p>

        <div className="check-grid">
          {CHECKS.map((item) => (
            <article className={`check-card ${answers[item.key] === false ? "needs-help" : answers[item.key] === true ? "ready" : ""}`} key={item.key}>
              <div className="check-card-head"><span>{item.number}</span><b>{item.title}</b></div>
              <p>{item.question}</p>
              <div className="answer-buttons" aria-label={`Ответ: ${item.title}`}>
                <button type="button" onClick={() => setAnswers((current) => ({ ...current, [item.key]: true }))} aria-pressed={answers[item.key] === true}>Скорее да</button>
                <button type="button" onClick={() => setAnswers((current) => ({ ...current, [item.key]: false }))} aria-pressed={answers[item.key] === false}>Нужно помочь</button>
              </div>
            </article>
          ))}
        </div>

        <div className="readiness-summary" aria-live="polite">
          <div className="summary-symbol" aria-hidden="true">{answeredCount < 5 ? "…" : needs.length === 0 ? "✓" : needs.length}</div>
          <div>
            <p className="summary-label">Ваш ориентир</p>
            <h3>{answeredCount < 5 ? "Ответьте на вопросы — план расставит приоритеты" : needs.length === 0 ? "База уже собрана. Сохраняем спокойный ритм" : `Зоны внимания: ${needs.length}. Они отмечены в плане`}</h3>
            <p>{AGES[age].approach} Рекомендуемая продолжительность сна: <strong>{AGES[age].sleep} в сутки</strong>.</p>
          </div>
          <a href="#plan">Перейти к плану <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="plan-section" id="plan">
        <div className="section-shell">
          <div className="plan-header">
            <div><p className="kicker light">Практический маршрут</p><h2>План без героизма</h2></div>
            <fieldset className="days-picker">
              <legend>Сколько дней до школы?</legend>
              <div>{([3, 7, 14] as PlanLength[]).map((value) => <button type="button" key={value} onClick={() => changeDays(value)} className={days === value ? "active" : ""} aria-pressed={days === value}>{value}</button>)}</div>
            </fieldset>
          </div>

          <div className="plan-meta">
            <span>{AGES[age].label}</span><span>{days} дней</span><span>{needs.length ? `${needs.length} приоритета` : "базовый план"}</span>
          </div>

          <div className="plan-progress" aria-label={`Выполнено ${completion}%`}>
            <div><span>Ваш прогресс</span><b>{completion}%</b></div>
            <div className="progress-track"><i style={{ width: `${completion}%` }} /></div>
          </div>

          <div className="timeline">
            {PLANS[days].map((item) => {
              const priority = needs.some((area) => item.areas.includes(area));
              const isDone = completed.includes(item.id);
              return (
                <article className={`timeline-card ${priority ? "priority" : ""} ${isDone ? "done" : ""}`} key={item.id}>
                  <div className="timeline-marker"><span /></div>
                  <div className="timeline-content">
                    <div className="timeline-top">
                      <span className="when">{item.when}</span>
                      <div>{priority && <span className="priority-chip">Ваш приоритет</span>}<span className="duration">{item.time}</span></div>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                  <button className="done-button" type="button" onClick={() => toggleCompleted(item.id)} aria-pressed={isDone} aria-label={`${isDone ? "Отменить выполнение" : "Отметить выполненным"}: ${item.title}`}>
                    <span aria-hidden="true">{isDone ? "✓" : ""}</span>{isDone ? "Готово" : "Сделать"}
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="tools section-shell">
        <div className="section-heading compact">
          <div><p className="kicker">Три работающих заготовки</p><h2>Можно взять и сделать сегодня</h2></div>
        </div>
        <div className="tool-grid">
          <article className="tool-card lime"><span>01</span><h3>Вечерний чек-лист</h3><ol><li>Одежда готова</li><li>Сумка собрана</li><li>Завтрак понятен</li><li>Ключи на месте</li></ol><p>10 минут вечером экономят гораздо больше нервов утром.</p></article>
          <article className="tool-card violet"><span>02</span><h3>Разогрев внимания</h3><div className="focus-clock"><b>20</b><small>минут</small></div><p>Одно спокойное дело без переключений. Закончить до усталости — и не проверять знания.</p></article>
          <article className="tool-card coral"><span>03</span><h3>Репетиция утра</h3><p className="big-quote">«Что сделало бы это утро на 10% легче?»</p><p>Один прогон, один вопрос, одно небольшое улучшение. Без разбора ошибок.</p></article>
        </div>
      </section>

      <section className="conversation">
        <div className="section-shell conversation-grid">
          <div>
            <p className="kicker light">Разговор на 5 минут</p>
            <h2>Не гасить тревогу.<br />Дать опору.</h2>
            <p className="conversation-intro">Выберите, что больше всего волнует ребёнка. Получится простая фраза, с которой можно начать разговор.</p>
            <div className="worry-options" aria-label="Что беспокоит ребёнка">
              {WORRIES.map((item) => <button type="button" key={item.key} onClick={() => setWorry(item)} className={worry.key === item.key ? "active" : ""} aria-pressed={worry.key === item.key}>{item.label}</button>)}
            </div>
          </div>
          <div className="phrase-card" aria-live="polite">
            <span className="quote-mark" aria-hidden="true">“</span>
            <p>«Похоже, тебя сейчас волнует <strong>{worry.object}</strong>. Я рядом. Давай не решать всё сразу, а попробуем один шаг: <strong>{worry.step}</strong>. Как тебе?»</p>
            <div><span aria-hidden="true">♥</span> Сначала понять, потом предлагать решение</div>
          </div>
        </div>
      </section>

      <section className="avoid section-shell">
        <div className="section-heading compact">
          <div><p className="kicker">Анти-чек-лист</p><h2>Чего сейчас лучше не делать</h2></div>
        </div>
        <div className="avoid-grid">
          <article><b>Не надо</b><h3>Резко переводить режим за одну ночь</h3><p>Маленькие сдвиги легче выдержать и ребёнку, и семье.</p></article>
          <article><b>Не надо</b><h3>Устраивать марафон «вспомнить всю программу»</h3><p>Верните привычку к одному делу, а не проверяйте объём знаний.</p></article>
          <article><b>Не надо</b><h3>Говорить «нечего бояться»</h3><p>Лучше назвать тревогу и придумать конкретный план на сложный момент.</p></article>
          <article><b>Не надо</b><h3>Требовать идеального первого дня</h3><p>На адаптацию нормально закладывать время; усталость вначале ожидаема.</p></article>
        </div>
      </section>

      <section className="first-week">
        <div className="section-shell first-week-card">
          <div className="week-number">1</div>
          <div><p className="kicker">Главное после первого сентября</p><h2>Первая неделя — продолжение адаптации</h2><p>Вместо «Какие оценки?» спросите: «Что сегодня оказалось легче, чем ты думал?» и «Где тебе нужна помощь завтра?»</p></div>
        </div>
      </section>

      <footer>
        <div className="section-shell footer-grid">
          <div><div className="footer-brand"><img className="brand-logo" src="/brand/kbs-logo.svg" alt="Kids Blogging School" width={545} height={162} loading="lazy" /></div><p>«Мягкий старт» — практический материал для родителей.</p></div>
          <div className="sources"><b>На чём основаны рекомендации</b><a href="https://www.healthychildren.org/English/ages-stages/gradeschool/school/Pages/back-to-school-tips.aspx" target="_blank" rel="noreferrer">American Academy of Pediatrics ↗</a><a href="https://www.cdc.gov/physical-activity-education/staying-healthy/sleep.html" target="_blank" rel="noreferrer">CDC: сон школьников ↗</a><a href="https://www.unicef.org/parenting/child-care/handling-holidays" target="_blank" rel="noreferrer">UNICEF Parenting ↗</a></div>
        </div>
        <div className="section-shell footer-note">Материал носит образовательный характер. Если тревога, бессонница или отказ идти в школу сохраняются и заметно мешают жизни, стоит обсудить это с педиатром или детским психологом.</div>
      </footer>
    </main>
  );
}
