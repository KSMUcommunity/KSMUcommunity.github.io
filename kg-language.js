/* Preview localization. Translate presentation only, without changing schedule IDs or user records. */
(() => {
  const phrases = new Map(`
Расписание КГМУ|KSMU Timetable
Казанский государственный медицинский университет|Kazan State Medical University
Герб КГМУ|KSMU coat of arms
Главная|Home
Меню|Menu
Разделы|Sections
Неделя|Week
Календарь|Calendar
Калькулятор рейтинга|Rating calculator
Модули и зачёты|Modules and assessments
Модули|Modules
Объявления|Announcements
Поиск|Search
Полезное|Useful links
Контакты|Contacts
О проекте|About the project
Роли|Roles
Профиль|Profile
Статистика|Statistics
Инструменты админа|Admin tools
Инструменты старосты|Class representative tools
Администратор|Administrator
Староста|Class representative
Помощник старосты|Assistant class representative
Студент|Student
Войти: Telegram или почта|Sign in with Telegram or email
Аккаунт|Account
Настройки|Settings
Назад|Back
Закрыть|Close
Сохранить|Save
Отмена|Cancel
Отменить|Cancel
Удалить|Delete
Готово|Done
Изменить|Edit
Выбрать|Select
Войти|Sign in
Выйти|Sign out
Подгруппа|Subgroup
Все подгруппы|All subgroups
Обе подгруппы|Both subgroups
Сменить группу|Change group
сменить группу|change group
Выбор группы|Group selection
Выбор учебной группы|Study group selection
Выберите свою группу|Select your group
Группу можно будет сменить в настройках. Выбор запоминается на устройстве.|You can change your group in Settings. Your selection is saved on this device.
Направление подготовки|Degree programme
Выбор направления подготовки|Degree programme selection
Лечебное дело|General Medicine
Педиатрия|Paediatrics
Стоматология|Dentistry
Выберите курс|Select your year
Учебный курс|Year of study
Выберите поток|Select your stream
Группа|Group
группа|group
Каналы|Channels
Разработчики|Developers
Разработчик:|Developer:
Команда проекта|Project team
Нашли ошибку или есть идея? Напишите нам — ответим в Telegram или по почте.|Found an error or have an idea? Get in touch and we'll reply on Telegram or by email.
Почта|Email
Вопросы и предложения|Questions and suggestions
Telegram-канал|Telegram channel
Сообщество VK|VK community
KSMU Community в VK|KSMU Community on VK
Канал MAX|MAX channel
Приглашение в канал|Join the channel
Язык интерфейса|Interface language
Сообщить о проблеме|Report a problem
Ошибка в расписании или на сайте|An issue with the timetable or the website
Университет|University
Личный кабинет студента|Student portal
Оценки, документы, заявления|Grades, documents and applications
Официальный сайт КГМУ|Official KSMU website
Новости, учебный процесс, документы|News, academic information and documents
Официальное расписание|Official timetable
Файлы, которые публикует университет|Files published by the university
Образовательный портал|Learning portal
e.kazangmu.ru · курсы, тесты, материалы|e.kazangmu.ru · courses, quizzes and materials
Кафедры КГМУ|KSMU departments
Деканаты и все кафедры на сайте университета|Dean's offices and academic departments
Авиценна|Avicenna
База знаний и сообщество студентов в Telegram|Knowledge base and student community on Telegram
Доброе утро|Good morning
Добрый день|Good afternoon
Добрый вечер|Good evening
Пары закончились|Classes have finished
На сегодня всё|That's all for today
Сегодня|Today
сегодня|today
Завтра|Tomorrow
завтра|tomorrow
Вчера|Yesterday
Пар нет|No classes
Пар сегодня нет|No classes today
В этот день занятий нет|There are no classes on this day
Дата вне опубликованного расписания|This date is outside the published timetable
Весь день ›|Full day ›
Открыть день ›|Open day ›
Эта неделя|This week
Следующая неделя|Next week
Предыдущий месяц|Previous month
Следующий месяц|Next month
Предыдущий день|Previous day
Следующий день|Next day
Предыдущая неделя|Previous week
Важное|Important
Перерыв|Break
Маршрут|Directions
Преподаватель|Lecturer
Аудитория|Room
Занятия|Classes
Лекция|Lecture
лекция|lecture
Практика|Practical class
практика|practical class
Семинар|Seminar
семинар|seminar
Цикл|Clinical rotation
цикл|clinical rotation
Лабораторная|Lab session
отменено|cancelled
Отмена пары|Class cancellation
Перенос|Rescheduled
Модуль|Module
модуль|module
ДЗ|Homework
Домашнее задание|Homework
Изменение|Change
Изменения|Changes
Контроль|Assessment
Зачёт|Pass/fail assessment
Зачёты|Pass/fail assessments
Экзамен|Exam
Найти|Search
Ничего не найдено|No results found
Предмет, преподаватель, аудитория…|Subject, lecturer or room…
Загрузка…|Loading…
Не удалось загрузить|Unable to load
Повторить|Retry
Нет доступа|Access denied
Загружаем новости…|Loading announcements…
Общие объявления|General announcements
Новости и объявления|News and announcements
Новости и объявления КГМУ|KSMU news and announcements
Все объявления|All announcements
📣 Объявления для всех|📣 Announcements for everyone
Пока нет объявлений|No announcements yet
Тема|Theme
Как в системе|System
Светлая|Light
Тёмная|Dark
Уведомления|Notifications
Напоминания в боте|Bot reminders
Войти через Telegram|Sign in with Telegram
Вход через Telegram|Telegram sign-in
Введите код|Enter the code
Получить код|Send code
Электронная почта|Email address
Политика конфиденциальности|Privacy policy
Политика|Privacy policy
Согласие|Consent
Текст согласия|Consent form
Персональные данные|Personal data
Студенческий сервис|Student service
Команда|Team
Помощь|Help
Экспорт|Export
В разработке|Under development
Выбрать другую группу|Select another group
Биология|Biology
История России|History of Russia
Латинский язык|Latin
Анатомия|Anatomy
Гистология|Histology
Физиология|Physiology
Нормальная физиология|Normal Physiology
Биохимия|Biochemistry
Иностранный язык|Foreign Language
Физическая культура|Physical Education
Философия|Philosophy
Микробиология|Microbiology
Понедельник|Monday
Вторник|Tuesday
Среда|Wednesday
Четверг|Thursday
Пятница|Friday
Суббота|Saturday
Воскресенье|Sunday
пн|Mon
вт|Tue
ср|Wed
чт|Thu
пт|Fri
сб|Sat
вс|Sun
Январь|January
Февраль|February
Март|March
Апрель|April
Май|May
Июнь|June
Июль|July
Август|August
Сентябрь|September
Октябрь|October
Ноябрь|November
Декабрь|December
День|Day
Месяц|Month
Всё|All
Все|All
Обе|Both
1-я|1st
2-я|2nd
первая|first class
Пары|Classes
Пар|Classes
Пары отменены|Classes are cancelled
Пары ещё не начались|Classes haven't started yet
План на сегодня|Today's schedule
Сегодня пар нет|No classes today
Выходной|Day off
Свободный день|Free day
Можно отдохнуть|Time to take a break
Семестр ещё не начался|The semester hasn't started yet
Семестр закончился|The semester has ended
Воскресенье|Sunday
Пред. неделя|Previous week
След. неделя|Next week
Открыть на карте|View on map
Сверяется с сайтом КГМУ 3 раза в день|Checked against the KSMU website three times a day
точки — пары, цвет — записи|Dots show classes; colours show notes
полоска — тип занятия, точки — записи|Bars show class types; dots show notes
Гость|Guest
Авто|System
Напоминания о парах|Class reminders
в боте|in the bot
Подать заявку на старосту|Apply to be a class representative
Роли и доступ|Roles and access
синхронно с ботом|Synced with the bot
Объявлений нет|No announcements
Здесь появятся новости для вашей группы и курса|Announcements for your group and year will appear here
Какие модули показать|Which modules to show
Модулей впереди нет|No upcoming modules
Староста или помощник добавит модуль — он появится здесь и в календаре|Modules added by your class representative or their assistant will appear here and in the calendar
Предстоящие|Upcoming
Прошедшие|Past
Прошедших модулей нет|No past modules
Здесь будут модули, которые уже прошли|Completed modules will appear here
Поделиться|Share
Что найти|What to search for
Где искать|Search scope
Предмет, преподаватель, аудитория, тема|Subject, lecturer, room or topic
Поиск по всему семестру|Search the whole semester
Название предмета, фамилия преподавателя, корпус или аудитория, тема ДЗ или модуля. Например: «пато», «УЛК», «воспаление».|Search by subject, lecturer's surname, building, room, or homework or module topic. For example, search by part of the subject name or by room number.
Выберите группу|Select your group
Шаг 1 · ваша группа|Step 1 · Your group
Знаете номер? Введите сразу|Know your group number? Enter it here
Номер группы|Group number
Подходящие группы|Matching groups
Все группы|All groups
Что умеет|What it offers
всех курсов и направлений|Across all years and programmes
3 раза в день|Three times a day
сверяется с официальными файлами КГМУ|Checked against the official KSMU files
ДЗ и модули|Homework and modules
подтверждает староста группы|Confirmed by your class representative
Напоминания|Reminders
утром в Telegram-боте|In the morning via the Telegram bot
Сайт, мини-приложение и Telegram-бот с расписанием занятий Казанского государственного медицинского университета.|The Kazan State Medical University class timetable is available as a website, mini app and Telegram bot.
Telegram разработчиков, почта и канал проекта|Contact the developers by Telegram or email, or visit the project channels
Сервис сделан студентами и не является официальным ресурсом КГМУ. Источник расписания — файлы, которые университет публикует на kazangmu.ru; при расхождении верно официальное расписание.|This student-run service is independent of KSMU. The timetable is based on files published by the university at kazangmu.ru. If the schedules differ, follow the university's official timetable.
Контакты команды|Team contacts
Согласие на обработку данных|Consent to data processing
Анатомия человека|Human Anatomy
Экономика|Economics
Медицинская химия|Medical Chemistry
Химия|Chemistry
Физическая культура и спорт|Physical Education and Sport
Физкультура|Physical Education
Элективные дисциплины по физической культуре и спорту|Electives in Physical Education and Sport
Правоведение|Law
Биоэтика|Bioethics
Биоэтика и медицинское право|Bioethics and Medical Law
Патофизиология|Pathophysiology
Патанатомия|Anatomical Pathology
Акушерство|Obstetrics
Акушерство и гинекология|Obstetrics and Gynaecology
Ортопедическая стоматология|Prosthodontics
Детская хирургия|Paediatric Surgery
Инфекционные болезни|Infectious Diseases
Инфекционные болезни у детей|Paediatric Infectious Diseases
Хирургическая стоматология|Oral Surgery
Клиническая фармакология|Clinical Pharmacology
Терапевтическая стоматология|Restorative Dentistry
Дерматовенерология|Dermatology and Venereology
Топографическая анатомия и оперативная хирургия|Topographic Anatomy and Operative Surgery
Психиатрия|Psychiatry
Травматология, ортопедия|Traumatology and Orthopaedics
Эндокринология|Endocrinology
Медицинская реабилитация|Medical Rehabilitation
Судебная медицина|Forensic Medicine
Фтизиатрия|Tuberculosis Medicine
Эпидемиология|Epidemiology
Общественное здоровье и здравоохранение|Public Health and Healthcare
Общественное здоровье|Public Health
Фармакология|Pharmacology
Оториноларингология|Otorhinolaryngology
Неврология|Neurology
Офтальмология|Ophthalmology
Лучевая диагностика|Diagnostic Radiology
Гигиена|Hygiene
Урология|Urology
Гистология, эмбриология, цитология|Histology, Embryology and Cytology
Научно-исследовательская работа|Research
Профессиональные болезни|Occupational Diseases
Информатика|Computer Science
Тренинговый курс|Training Course
Психология и педагогика|Psychology and Education
Информационная культура|Information Literacy
Вид|View
Вид расписания|Timetable view
Сетка недели ›|Weekly timetable ›
Неделя и важное|Week and updates
, сменить группу|, change group
Профиль и настройки|Profile and settings
Доброй ночи|Good night
Меню, есть новые объявления|Menu, new announcements available
Нажмите на занятие — откроются аудитория, преподаватель и ДЗ|Select a class to see its room, lecturer and homework
вне семестра|outside the semester
вне опубликованного расписания|outside the published timetable
до начала семестра|before the semester starts
К текущей неделе|Back to this week
К сегодня|Back to today
Поделиться расписанием дня картинкой|Share the daily timetable as an image
Нет расписания на эту неделю|No timetable for this week
Нет расписания на эту дату|No timetable for this date
Выберите другой день недели|Select another day of the week
Свайпните или выберите другой день|Swipe or select another day
Дальше сегодня|Later today
Занятий нет|No classes
Сейчас|Now
сейчас|now
скоро|soon
Следующая пара|Next class
Ближайшая пара|Next class
Сетка календаря|Calendar grid
Подгруппа календаря|Calendar subgroup
Модули и домашние задания|Modules and homework
Пока нет записей о модулях или домашних заданиях. Добавьте первую запись для этой даты.|There are no modules or homework for this date. Add the first entry.
＋ Модуль|＋ Module
＋ ДЗ|＋ Homework
Отмены, переносы и замены|Cancellations, rescheduling and substitutions
Изменений занятий на эту дату пока нет.|There are no timetable changes for this date.
Открыть день|Open day
В этот день нет занятий.|There are no classes on this day.
Следующая неделя|Next week
Сегодня занятий нет|No classes today
Новая запись|New entry
Редактирование записи|Edit entry
Редактировать запись|Edit entry
Домашнее задание|Homework
Модуль / зачёт|Module / pass-fail assessment
Тип записи|Entry type
Предмет|Subject
Дисциплина|Subject
Другой предмет|Other subject
Другая дисциплина|Other subject
Вся группа|Entire group
вся группа|entire group
Тема / название|Topic / title
Тема или название|Topic or title
Описание|Description
Содержание|Content
Подробности|Details
Материалы и ссылки|Materials and links
Материалы и ссылки для подготовки|Preparation materials and links
В календарь телефона (.ics)|Add to your calendar (.ics)
＋ В календарь телефона (.ics)|＋ Add to your calendar (.ics)
Подтвердить|Approve
Отклонить|Reject
ждёт подтверждения старосты|awaiting approval from the class representative
Ожидает подтверждения|Pending approval
☁ Опубликовать для всей группы|☁ Publish for the whole group
Без отметки запись остаётся только на устройстве.|Leave unchecked to keep this entry on your device.
Отметьте, чтобы запись увидела вся группа — после подтверждения старосты. Без отметки она останется только в вашем браузере.|Select to share with your group once the class representative approves. Leave unchecked to keep it in this browser.
Изменение увидит вся группа.|The whole group will see this change.
Правка уйдёт старосте на подтверждение. До этого группа видит прежний вариант.|The class representative will review this edit. Until then, the group will see the previous version.
Например, патологическая анатомия|For example, anatomical pathology
Например, модуль по воспалению|For example, a module on inflammation
Что выучить, какие страницы, задания или условия зачёта|What to study, page numbers, tasks or assessment requirements
Например, УЛК №2, ауд. 215|For example, ULK 2, Room 215
Фамилия И.О.|Surname and initials
Почему изменено или что необходимо знать|Reason for the change or information students need
Тема приложения|App theme
Выбор подгруппы|Select a subgroup
Пароль|Password
Например: собрание 3-го курса|For example, third-year meeting
Дата, время, место и подробности…|Date, time, location and details…
Текст сообщения для разработчика|Message to the developer
Ничего не нашлось|No results found
Попробуйте часть слова: «анат», «хир», «213»|Try part of a subject name, such as “anatom” or “surg”, or a room number such as “213”.
Search by subject, lecturer's surname, building, room, or homework or module topic. For example, search by part of the subject name or by room number.|Search by subject, lecturer name, building, room, or homework or module topic.
Г|G
Войдите через Telegram или по почте, чтобы ваши ДЗ сохранялись за вами. Старостам вход открывает подтверждение ДЗ и изменения пар.|Sign in with Telegram or email to keep homework linked to your account. Class representatives can also approve homework and change the timetable.
Я даю|I give
согласие на обработку персональных данных|consent to the processing of my personal data
и ознакомлен с|and acknowledge the
политикой конфиденциальности|privacy policy
или по почте|or by email
Отметьте согласие выше, чтобы войти|Tick the consent box above to sign in
Почта, например ivan@mail.ru|Email, for example name@example.com
Письмо отправлено на|An email was sent to
. Введите код из письма или нажмите ссылку в нём.|. Enter the code or follow the link in that email.
Код из письма|Code from the email
Другая почта или новый код|Change email or send a new code
Отправляем письмо…|Sending email…
Проверяем код…|Verifying code…
Введите код из письма — только цифры|Enter the numeric code from the email
Входим через Telegram…|Signing in with Telegram…
Входим…|Signing in…
Вход отменён|Sign-in cancelled
Выбор запомнится на этом устройстве, сменить группу можно в профиле.|Your choice is saved on this device. You can change it in your profile.
Студенческое сообщество|Student community
Начните здесь|Start here
Ваш университет.|Your university.
Ваш ритм.|Your pace.
Расписание, домашние задания, модули и новости курса — в одном месте.|Timetable, homework, modules and course news in one place.
Студенческий проект|Student project
не официальный ресурс КГМУ|independent of KSMU
Не назначено|Not assigned
Искусственный интеллект в медицине|Artificial Intelligence in Medicine
Медицинское право|Medical Law
Психология, педагогика|Psychology and Education
Профилактическая стоматология|Preventive Dentistry
Пропедевтическая стоматология [каф. орт.стом.]|Introductory Dentistry (Prosthodontics Department)
Пропедевтическая стоматология [каф. тер.стом.]|Introductory Dentistry (Restorative Dentistry Department)
Топографическая анатомия, оперативная хирургия|Topographic Anatomy and Operative Surgery
Патологическая анатомия (в т.ч. Патологическая анатомия головы и шеи)|Anatomical Pathology (including Head and Neck Pathology)
Патологическая физиология (в т.ч. Патологическая физиология челюстно-лицевой области)|Pathophysiology (including Maxillofacial Pathophysiology)
Микробиология, вирусология (в т.ч. Микробиология полости рта)|Microbiology and Virology (including Oral Microbiology)
Биологическая химия (в т.ч. Биологическая химия полости рта)|Biochemistry (including Oral Biochemistry)
Физиология (в т.ч. Физиология челюстно-лицевой области)|Physiology (including Maxillofacial Physiology)
Госпитальная терапия|Hospital Internal Medicine
Факультетская терапия|Internal Medicine
Факультетская хирургия|General Surgery
Госпитальная педиатрия|Hospital Paediatrics
Поликлиническая терапия|Outpatient Internal Medicine
Неврология, медицинская генетика, нейрохирургия|Neurology, Medical Genetics and Neurosurgery
Неврология, нейрохирургия, медицинская генетика|Neurology, Neurosurgery and Medical Genetics
Внутренние болезни, клиническая фармакология|Internal Medicine and Clinical Pharmacology
Поликлиническая и неотложная педиатрия|Outpatient and Emergency Paediatrics
Травматология и ортопедия|Traumatology and Orthopaedics
Медицина катастроф|Disaster Medicine
Хирургические болезни|Surgical Diseases
Факультетская педиатрия|Paediatrics
Безопасность жизнедеятельности|Health and Safety
Коммунальная гигиена|Environmental Hygiene
Анестезиология, реаниматология|Anaesthesiology and Critical Care
Иммунология, клиническая иммунология|Immunology and Clinical Immunology
Неотложная кардиология|Emergency Cardiology
Психосоматическая медицина в педиатрии|Psychosomatic Medicine in Paediatrics
Патологическая анатомия|Anatomical Pathology
Патологическая физиология|Pathophysiology
Биологическая химия|Biochemistry
Клиническая практика педиатрического профиля|Paediatric Clinical Placement
Управление объявлениями|Manage announcements
Статистику видят только администраторы|Statistics are available to administrators only
Период|Period
7 дней|7 days
30 дней|30 days
90 дней|90 days
Назначить|Assign
Снять роль|Remove role
Проверяем доступ…|Checking access…
Ролей пока нет|No roles yet
Все роли|All roles
Роль|Role
Админ|Administrator
Синхронизация|Sync
Резервная копия|Backup
Опубликовать|Publish
Источник|Source
Ссылка|Link
Объявление|Announcement
Мероприятие|Event
Обычное|Normal
Важно|Important
Срочно|Urgent
Все направления|All programmes
Курс|Year
Поток|Stream
Своя группа|My group
Несколько групп|Several groups
Без срока|No expiry
Адресаты|Audience
Список объявлений|Announcements
Доступ к данным|Data access
Показать|Show
Скрыть|Hide
Только у вас|Only on this device
☁ общая запись|☁ shared entry
📱 только у вас|📱 only on this device
Удалить запись|Delete entry
Сменить|Change
Подробнее|Details
1. Общие положения|1. General provisions
Политика описывает, как сервис «Расписание КГМУ» (сайт, мини-приложение и Telegram-бот) обрабатывает персональные данные пользователей. Она составлена по Федеральному закону от 27.07.2006 № 152-ФЗ «О персональных данных».|This policy describes how KSMU Timetable (the website, Mini App and Telegram bot) processes users’ personal data. It is based on Federal Law No. 152-FZ of 27 July 2006 on Personal Data.
Оператор персональных данных — команда проекта «Расписание КГМУ». Связаться с командой можно в Telegram: контакты указаны на странице «Контакты». Сервис сделан студентами и не является официальным ресурсом КГМУ.|The KSMU Timetable project team is the personal data controller. You can reach the team on Telegram using the details on the Contacts page. The service is run by students and is independent of KSMU.
Пользуясь расписанием без входа, вы не передаёте нам персональные данные. Вход через Telegram и Telegram-бот работают только с вашего согласия.|When you use the timetable without signing in, you do not provide us with personal data. Telegram sign-in and the Telegram bot operate only with your consent.
2. Какие данные и зачем мы обрабатываем|2. What data we process and why
Вход через Telegram, подпись записей и роли. Данные: идентификатор Telegram, имя и фамилия, имя пользователя (@username), ссылка на фото профиля, если Telegram её передаёт. Цель: подтвердить, что вы — это вы, показать автора записей ДЗ и модулей, назначить роли старост, помощников и администраторов.|For Telegram sign-in, attribution and roles, we use your Telegram ID, first and last names, username (@username) and profile photo URL if Telegram supplies it. This verifies your identity, attributes homework and module entries, and allows us to assign class representative, assistant and administrator roles.
Вход по почте. Данные: адрес электронной почты и одноразовый код входа, который приходит в письме. Цель: войти без Telegram, подписывать свои записи и получать роли в группе. Письма с кодом отправляет Supabase (раздел 5).|For email sign-in, we use your email address and a one-time sign-in code sent to your inbox. This lets you sign in without Telegram, attribute your entries and receive roles in your group. Supabase sends the code emails (see Section 5).
Записи ДЗ, модулей, заявки на правку и объявления. Данные: текст записи, группа, дата, автор, статус проверки. Цель: обмен домашними заданиями и сведениями о модулях внутри группы.|For homework, modules, change requests and announcements, we process the entry text, group, date, author and review status. This enables sharing homework and module information within your group.
Telegram-бот. Данные: идентификатор чата, имя пользователя, группа, подгруппа, время напоминания, заявки на роль старосты. Цель: присылать расписание и напоминания, рассматривать заявки старост.|For the Telegram bot, we process chat ID, username, group, subgroup, reminder time and class representative applications. This lets the bot send timetables and reminders and lets the team review those applications.
Технические данные. Хостинг сайта и база данных автоматически получают IP-адрес и сведения о браузере, как любой сервер в интернете. Мы не используем их для отслеживания и не составляем по ним профили.|The site host and database automatically receive IP addresses and browser information, as web servers normally do. We do not use this information to track people or build profiles.
Анонимная статистика использования. Данные: случайный номер устройства, который создаёт сам сайт (он не связан с аккаунтом, именем и Telegram), выбранная группа, открытые разделы, площадка (сайт, мини-приложение или установленное приложение) и дата. Цель: понимать, сколько людей и какими разделами пользуются, чтобы улучшать сервис. Сводку видят только администраторы. Если в браузере включено «Не отслеживать» (Do Not Track), статистика не собирается.|Anonymous usage statistics include a random device ID generated by the site, unrelated to your account, name or Telegram identity, as well as your selected group, sections viewed, platform (website, Mini App or installed app) and date. This helps us understand usage and improve the service. Only administrators can view the summary. We do not collect these statistics if Do Not Track is enabled in your browser.
Мы не получаем номер телефона, пароль Telegram, переписку и список контактов.|We do not receive your phone number, Telegram password, messages or contact list.
3. Основание обработки|3. Legal basis for processing
Обработка ведётся на основании вашего согласия (п. 1 ч. 1 ст. 6 152-ФЗ). Согласие даётся отметкой перед входом через Telegram и запуском бота; его текст приведён на отдельной странице «Согласие на обработку персональных данных».|We process data based on your consent under Article 6(1)(1) of Federal Law No. 152-FZ. You give consent before Telegram sign-in and when starting the bot. See the separate Consent to Personal Data Processing page for the text.
4. Что мы делаем с данными|4. How we use the data
Обработка автоматизированная: сбор, запись, систематизация, хранение, уточнение, использование, передача обработчикам (раздел 5), блокирование, удаление и уничтожение. Мы не принимаем на основе этих данных решений, которые влекут для вас юридические последствия, не продаём их и не используем для рекламы.|Automated processing includes collection, recording, organisation, storage, updating, use, disclosure to processors (Section 5), blocking, erasure and destruction. We do not use the data to make decisions with legal consequences for you, sell it or use it for advertising.
5. Кто ещё получает данные|5. Who else receives the data
Для работы сервиса данные обрабатывают:|The following providers process data to operate the service:
Supabase Inc. — база данных; серверы в Германии (Франкфурт). Там хранятся аккаунты, роли и записи.|Supabase Inc. provides the database on servers in Frankfurt, Germany, where accounts, roles and entries are stored.
GitHub Inc. — хостинг сайта; серверы в США. Получает только технические данные при открытии сайта.|GitHub Inc. hosts the website on servers in the United States. It receives only technical data when you open the website.
Telegram — вход через Telegram и работа бота; данные передаёт сам Telegram по своим правилам.|Telegram supports Telegram sign-in and the bot. Telegram transmits data under its own rules.
Это трансграничная передача данных: в Германию — страну, обеспечивающую адекватную защиту прав субъектов персональных данных, и в США. Другим лицам данные передаются только по требованию закона.|This involves cross-border transfers to Germany, which provides adequate protection for the rights of data subjects, and to the United States. We disclose data to others only when required by law.
6. Что хранится на вашем устройстве|6. What is stored on your device
Выбранная группа и подгруппа, тема оформления, вид сайта, отметка о прочитанных объявлениях, отметка о согласии, ключ входа и случайный номер устройства для анонимной статистики хранятся в памяти браузера (localStorage). Сайт не использует cookie, рекламу, сторонние счётчики посещаемости и трекеры — собственная анонимная статистика описана в разделе 2. Шрифты загружаются с самого сайта.|Your chosen group and subgroup, theme, view, read-announcement indicator, consent record, sign-in token and random ID for anonymous statistics are stored in your browser’s localStorage. The site does not use cookies, advertising, third-party analytics or trackers. See Section 2 for our anonymous statistics. The website hosts its own fonts.
7. Сроки хранения|7. Retention
Данные хранятся, пока вы пользуетесь сервисом и не отозвали согласие.|We retain data while you use the service and have not withdrawn consent.
Анонимная статистика хранится не дольше 12 месяцев.|Anonymous statistics are retained for no longer than 12 months.
После отзыва согласия или запроса на удаление мы удаляем аккаунт, роли и данные бота в течение 30 дней. Записи ДЗ и модулей удаляем или обезличиваем, убирая имя автора. При закрытии сервиса все данные уничтожаются.|Within 30 days of withdrawing consent or requesting deletion, we delete your account, roles and bot data. We delete or anonymise homework and module entries by removing the author’s name. If the service closes, all data is destroyed.
8. Ваши права|8. Your rights
Вы можете узнать, какие ваши данные обрабатываются; потребовать уточнить, заблокировать или удалить их; отозвать согласие; обжаловать наши действия в Роскомнадзоре или в суде.|You can find out what data we process about you, request correction, blocking or deletion, withdraw consent, or challenge our actions with Roskomnadzor or in court.
Чтобы воспользоваться правами, напишите команде в Telegram. Мы ответим в течение 10 рабочих дней. Выйти из аккаунта можно в профиле, остановить рассылку бота — командой /stop.|To exercise your rights, contact the team on Telegram. We will respond within 10 working days. You can sign out in your profile or stop bot messages by sending /stop.
9. Как мы защищаем данные|9. How we protect data
Сайт и база работают только по защищённому соединению (HTTPS). Вход через Telegram проверяется по цифровой подписи Telegram. Доступ к записям ограничен правилами базы данных: изменять и удалять записи группы могут только её староста, помощники и администраторы. Ключи бота и сервера хранятся только на сервере. Доступ к базе есть только у команды проекта.|The website and database use HTTPS. Telegram sign-in is verified using Telegram’s digital signature. Database policies restrict who can change and delete group entries to the class representative, their assistants and administrators. Bot and server keys are stored only on the server. Only the project team has database access.
10. Изменения политики|10. Changes to this policy
Мы можем обновлять политику; новая редакция действует с момента публикации на этой странице. Дата редакции указана вверху.|We may update this policy. The revised version applies from the time it is published on this page. The revision date appears at the top.
Согласие на обработку персональных данных|Consent to Personal Data Processing
Отмечая согласие на сайте или в мини-приложении «Расписание КГМУ» либо запуская Telegram-бот сервиса, я свободно, своей волей и в своём интересе даю согласие команде проекта «Расписание КГМУ» (далее — оператор) на обработку моих персональных данных на следующих условиях.|By giving consent on the KSMU Timetable website or Mini App, or by starting its Telegram bot, I freely, voluntarily and in my own interest consent to the KSMU Timetable project team (the controller) processing my personal data under the following conditions.
Данные: идентификатор Telegram, имя и фамилия, имя пользователя (@username), ссылка на фото профиля; адрес электронной почты, если я вхожу по почте; идентификатор чата с ботом; учебная группа и подгруппа, время напоминания; созданные мной записи ДЗ и модулей, заявки и их статус.|Data: Telegram ID, first and last names, username (@username), profile photo URL, email address when I sign in by email, bot chat ID, study group and subgroup, reminder time, homework and module entries I create, and my applications and their status.
Цели: вход в сервис, подпись моих записей, назначение ролей в группе, отправка расписания и напоминаний в Telegram.|Purposes: signing in, attributing my entries, assigning group roles, and sending timetables and reminders in Telegram.
Действия: сбор, запись, систематизация, хранение, уточнение, использование, передача обработчикам, блокирование, удаление, уничтожение; обработка автоматизированная.|Actions: collection, recording, organisation, storage, updating, use, disclosure to processors, blocking, erasure and destruction. Processing is automated.
Я согласен на поручение обработки и трансграничную передачу данных Supabase Inc. (серверы в Германии) и GitHub Inc. (серверы в США) для хранения данных и работы сайта.|I consent to processing by and cross-border transfers to Supabase Inc. (servers in Germany) and GitHub Inc. (servers in the United States) for data storage and site operation.
Согласие действует до его отзыва. Отозвать его можно, написав команде проекта в Telegram (контакты на странице «Контакты»); после отзыва данные удаляются в течение 30 дней.|Consent remains in effect until withdrawn. I can withdraw it by contacting the team on Telegram using the details on the Contacts page. Data is deleted within 30 days after withdrawal.
Я ознакомлен с Политикой конфиденциальности сервиса.|I have read the service’s Privacy Policy.
Расписание|Timetable
КГМУ — Расписание занятий|KSMU — Class Timetable
Направление|Programme
Медико-профилактическое дело|Preventive Medicine
Фармация|Pharmacy
Медицинская биофизика|Medical Biophysics
Медицинская биохимия|Medical Biochemistry
Психология|Psychology
Сестринское дело|Nursing
Социальная работа|Social Work
Студенческое сообщество КГМУ|KSMU student community
Расписание, домашние задания, модули и новости курса — в одном месте. Выберите группу один раз, дальше покажем только ваше.|Timetable, homework, modules and course news in one place. Select your group once to see the information that applies to you.
пары на день, неделю и месяц|Classes by day, week and month
общие для группы, подтверждает староста|Shared with the group after class representative approval
новости и изменения в расписании|News and timetable changes
Telegram-бот|Telegram bot
утром напомнит о парах|Get morning class reminders
Например, 1307|For example, 1307
Найдена 1 группа|1 group found
Нет такой группы|Group not found
Проверьте номер или выберите по направлению и курсу|Check the number or select a programme and year
текущая|current
в разработке|in development
открыть|open
Групп нет|No groups
Показывать даты|Show dates
Изменить занятие|Edit class
Новое изменение|New timetable change
＋ Добавить изменение|＋ Add a timetable change
Тип изменения|Type of change
Выберите занятие|Select a class
Отмена занятия|Cancel class
Перенос занятия|Reschedule class
Изменение занятия|Update class
Новая дата|New date
Новое время|New time
Начало|Start
Окончание|End
Новая аудитория|New room
Новый преподаватель|New lecturer
Комментарий|Comment
Причина|Reason
Проверено|Verified
Подтверждено|Approved
Подтверждено старостой|Approved by the class representative
Не подтверждено|Unconfirmed
Локальная запись|Local entry
Общая запись|Shared entry
Удалить изменение|Delete change
Тема объявления|Announcement title
Новое объявление|New announcement
Все объявления|All announcements
Все курсы|All years
Все потоки|All streams
Все подгруппы|All subgroups
Факультет|Faculty
Направление подготовки|Degree programme
Выбор направления|Select a programme
Обычный|Normal
Важное|Important
Срочное|Urgent
Категория|Category
Важность|Priority
Приоритет|Priority
Заголовок|Title
Текст|Text
Кому показать|Who can see this
Публикация|Publication
Дата публикации|Publication date
Срок действия|Expiry date
Ссылка (необязательно)|Link (optional)
Текст ссылки|Link label
Закрепить|Pin
Сбросить|Reset
Экспорт данных|Export data
Импорт данных|Import data
Локальные записи|Local entries
Скачать резервную копию|Download backup
Назад к расписанию|Back to timetable
Домашние задания|Homework
Сообщение|Message
Скопировать|Copy
Отправить|Send
Да|Yes
Нет|No
Календарь телефона|Phone calendar
Ресурсы|Resources
Дата|Date
Тип|Type
Отправить правку|Submit edit
Запись сохранена|Entry saved
Не удалось сохранить|Unable to save
Скопировано|Copied
Нет связи|Offline
Не заполнено|Incomplete
Лента пока недоступна. Расписание продолжает работать.|Announcements are temporarily unavailable. The timetable is still available.
Пока нет объявлений для вашей группы.|No announcements for your group yet.
Опубликованы недели|Published weeks
Войти через почту|Sign in by email
Вам отправлен код|A code was sent to you
Отмена, перенос или замена|Cancellation, rescheduling or substitution
Опубликовать для всех|Publish for everyone
Настройки приложения|App settings
Произошла ошибка|Something went wrong
Редактор группы|Group editor
Подгруппы|Subgroups
Без подгруппы|No subgroup
Отделение|Department
Педиатрия [каф. дет.инф.]|Paediatrics (Paediatric Infectious Diseases Department)
Педиатрия [каф. ПДБ и ФП]|Paediatrics (Propaedeutics of Childhood Diseases and Faculty Paediatrics)
Госпитальная хирургия [каф. хир.бол.]|Hospital Surgery (Surgical Diseases Department)
Госпитальная хирургия [каф. ССХ]|Hospital Surgery (Cardiovascular Surgery Department)
Практика по получению профессиональных умений и опыта профессион|Professional Skills and Experience Placement
Травматология и ортопедия [каф. травм.]|Traumatology and Orthopaedics (Traumatology Department)
Травматология и ортопедия [каф. дет.хир.]|Traumatology and Orthopaedics (Paediatric Surgery Department)
Общая хирургия|General Surgery
Практика терапевтического профиля (Помощник врача-терапевта)|Internal Medicine Placement (Physician Assistant)
Практика хирургического профиля (Помощник врача-хирурга)|Surgical Placement (Surgeon Assistant)
Пропедевтика внутренних болезней|Introduction to Internal Medicine
Практика акушерско-гинекологического профиля (Помощник врача – акушера-гинеколога)|Obstetrics and Gynaecology Placement (Physician Assistant)
Практика общеврачебного профиля (Помощник врача амбулаторно-поликлинического учреждения)|General Practice Placement (Outpatient Physician Assistant)
Эстетические аспекты ортопедического лечения|Aesthetic Aspects of Prosthodontic Treatment
Клиническая практика акушерско-гинекологического профиля (Помощник врача стационара (акушерско-гинекологического профиля))|Obstetrics and Gynaecology Clinical Placement (Hospital Physician Assistant)
Клиническая практика хирургического профиля (Помощник врача стационара (хирургического профиля))|Surgical Clinical Placement (Hospital Surgeon Assistant)
Клиническая практика терапевтического профиля (Помощник врача стационара (терапевтического профиля))|Internal Medicine Clinical Placement (Hospital Physician Assistant)
Физика|Physics
Микробиология, вирусология|Microbiology and Virology
Сахарный диабет как междисциплинарная проблема|Diabetes Mellitus as an Interdisciplinary Issue
Экстрагенитальная патология у беременных|Non-obstetric Conditions in Pregnancy
Иммунология|Immunology
Введение в специальность|Introduction to the Profession
Детская стоматология|Paediatric Dentistry
Ортодонтия и детское протезирование|Orthodontics and Paediatric Prosthodontics
Оказание помощи при неотложных состояниях|Emergency Care
Гигиена питания|Food and Nutrition Hygiene
Основы формирования здоровья детей|Foundations of Child Health Promotion
Пропедевтика детских болезней|Introduction to Paediatric Diseases
Физика, математика|Physics and Mathematics
Инновационные технологии в кариесологии|Innovative Technologies in Cariology
Токсикологическая химия|Toxicological Chemistry
Гигиена труда|Occupational Hygiene
Учебно-методическое управление и Профком обучающихся|Academic Affairs Office and Student Union Committee
Неврология, медицинская генетика|Neurology and Medical Genetics
Внутренние болезни, военно-полевая терапия|Internal Medicine and Military Field Medicine
Татарский язык в профессиональном общении|Tatar for Professional Communication
Формирование здорового образа жизни у детей|Promoting Healthy Lifestyles in Children
Медицинская информатика [каф. ОЗ]|Medical Informatics (Public Health Department)
Медицинская информатика [каф. ЦТ]|Medical Informatics (Digital Technologies Department)
Цифровые технологии в здравоохранении|Digital Technologies in Healthcare
Инновационные технологии в эндодонтии|Innovative Technologies in Endodontics
Онкология, лучевая терапия|Oncology and Radiotherapy
Инфекционные болезни, паразитология|Infectious Diseases and Parasitology
Немецкий язык|German
Татарский язык и культура речи|Tatar Language and Speech Culture
Восстановительная медицина|Restorative Medicine
Промежуточный контроль|Interim Assessment
Общая фармацевтическая химия|General Pharmaceutical Chemistry
Гистология, эмбриология, цитология/гистология полости рта|Histology, Embryology, Cytology and Oral Histology
Неотложная и интенсивная терапия у новорожденных детей|Neonatal Emergency and Intensive Care
Военная гигиена|Military Hygiene
Психиатрия, наркология|Psychiatry and Addiction Medicine
Радиационная гигиена|Radiation Hygiene
Донозологическая диагностика|Preclinical Health Assessment
Экономика здравоохранения и Роспотребнадзора|Economics of Healthcare and Rospotrebnadzor
Гигиеническое воспитание и обучение|Hygiene Education and Training
домашнее задание|homework
Название предмета|Subject name
Кому относится|Who this applies to
Тема или название *|Topic or title *
Дополнительные сведения|Additional details
Укажите условия зачёта, темы для подготовки или подробности домашнего задания.|Enter assessment requirements, topics to prepare or homework details.
Сохранить запись|Save entry
Архив всех учебных групп|All study groups backup
Сохранить локальные ДЗ, модули и изменения занятий|Save local homework, modules and timetable changes
всех групп этого устройства|for all groups on this device
одним файлом. Экспорт не включает серверные записи Supabase. Импорт добавляет новые записи, не удаляя и не перезаписывая уже сохранённые.|in one file. Export does not include Supabase records. Import adds new entries without deleting or overwriting saved entries.
↓ Скачать все группы|↓ Download all groups
↑ Импортировать архив|↑ Import backup
При импорте перед изменениями будет скачана копия прежних локальных записей.|Import downloads a copy of your existing local entries before applying changes.
☁ Общие ДЗ/модули видны всем · автор правит своё · 📱 локальные записи видны только на этом устройстве|☁ Group members can see shared homework and modules. Authors can edit their own entries. 📱 Local entries are visible only on this device.
Любой студент может публиковать ДЗ и модули|Any student can publish homework and modules
. Отмены и переносы пар доступны только редакторам.|. Only editors can cancel or reschedule classes.
↻ Обновить общие данные|↻ Refresh shared data
локальные записи доступны|local entries are still available
Нет связи с общими данными: Failed to fetch|Shared data unavailable: connection failed
ДЗ и модули может публиковать любой студент без регистрации. При первом добавлении Supabase создаёт анонимный ID; он сохраняется только в этом браузере. Автор может править своё, редактор — записи группы. Не публикуйте личные данные. Общий архив всех групп доступен в настройках и календаре; перенос выполняется только по нажатию. Изменения расписания не являются официальными сообщениями КГМУ.|Any student can publish homework and modules without registering. Supabase creates an anonymous ID on the first submission and stores it only in this browser. Authors can edit their own entries and editors can edit group entries. Do not publish personal data. You can find the backup for all groups in settings and the calendar. Data is transferred only when you request it. Timetable changes are unofficial.
Патологическая физиология (в т.ч. Патологическая физиология челю|Pathophysiology (including Maxillofacial Pathophysiology)
🚩 МОДУЛЬ / ЗАЧЁТ:|🚩 MODULE / PASS-FAIL ASSESSMENT:
📘 ДЗ:|📘 HOMEWORK:
Модуль:|Module:
ДЗ:|Homework:
модуль / зачёт|module / pass-fail assessment
Тема|Topic
Материалы|Materials
без изменений|No changes
✕ отклонено старостой|✕ Rejected by the class representative
✓ Подтвердить|✓ Approve
✕ Отклонить|✕ Reject
Неподтверждено|Unconfirmed
Источник информации|Source of information
Сообщение преподавателя|Message from lecturer
Студенческий чат|Student group chat
Официальное объявление|Official announcement
Что произошло?|What changed?
В этой группе нет локальных ДЗ или модулей для переноса|There is no local homework or module data to transfer for this group
В этом браузере нет локальных записей для экспорта|There are no local entries to export from this browser
Время окончания должно быть позже начала|The end time must be after the start time
Вход по почте выполнен|Signed in by email
Вход по ссылке отменён|Sign-in by link cancelled
Вход через Telegram отменён|Telegram sign-in cancelled
Вы вышли из редактора · ДЗ и модули доступны всем|Signed out of the editor account · Homework and modules are available to everyone
Вы ничего не изменили|No changes made
Выберите группу для загрузки общих записей|Choose a group to load shared entries
Выберите учебный день внутри семестра|Choose a date within the semester
Выделен текст — скопируйте его вручную|The text is selected. You can copy it manually.
Запись удалена|Entry deleted
Заполните заголовок и текст|Enter a title and text
Изменение занятия сохранено|Class change saved
Изменение удалено|Change deleted
Информация скопирована — можно отправить в чат|Copied. You can now paste it into the chat.
Массовая публикация доступна только администратору|Only an administrator can publish in bulk
На выбранную дату в исходном расписании нет занятий|The published timetable has no classes on this date
Не удалось определить занятие|Unable to find the class
Не удалось сохранить в памяти браузера. Экспортируйте данные.|Could not save in browser storage. Export your data.
Не удалось сохранить изменение|Unable to save the change
Не удалось сохранить новость|Unable to save the announcement
Нет локальных ДЗ и модулей для публикации|There are no local homework or module entries to publish
Нет прав для изменения общей записи|You do not have permission to edit this shared entry
Нет прав для изменения этой записи|You do not have permission to edit this entry
Общее изменение удалено|Shared change deleted
Общий серверный архив доступен только администратору|Only an administrator can download the shared server backup
Объявление удалено|Announcement deleted
Открываю браузер, чтобы добавить в календарь|Opening the browser to add this to your calendar
Подтверждать записи может только староста группы|Only the class representative can approve entries
Подтверждать правки может только староста группы|Only the class representative can approve edits
Публикация объявлений доступна только администратору|Only an administrator can publish announcements
Публикуем локальные ДЗ и модули…|Publishing local homework and modules…
Создаём анонимную сессию для публикации…|Creating an anonymous session to publish…
Ссылка должна начинаться с https:// или http://|The link must start with https:// or http://
Ссылка из письма устарела — запросите новый код|The email link has expired. Request a new code.
Текст обращения скопирован|Message copied
Удалить изменение для ВСЕЙ группы?|Delete the change for the ENTIRE group?
Удалить это изменение занятия?|Delete this class change?
Удалять общее изменение может только редактор группы|Only a group editor can delete a shared change
Удалять общие записи может только староста или администратор|Only the class representative or an administrator can delete shared entries
Укажите дату переноса|Enter the new date
Укажите предмет|Enter the subject
Укажите тему или название|Enter a topic or title
Файл для календаря создан|Calendar file created
⏳ Правка отправлена старосте на подтверждение|⏳ Edit submitted to the class representative for approval
☁ Изменение опубликовано (неофициальная информация)|☁ Change published (unofficial information)
✈️ Вы вошли через Telegram|✈️ Signed in with Telegram
Картинка с расписанием дня|Daily timetable image
Не указан|Not specified
Подключено|Connected
Не удалось загрузить расписание|Unable to load the timetable
Все занятия прошли|All classes have finished
Ещё занятия|More classes
Не удалось загрузить данные|Unable to load data
Отмена занятия|Class cancelled
Перенос занятия|Class rescheduled
Замена занятия|Class substitution
Другое|Other
`.trim().split('\n').map(line => line.split('|')));

  const schedule = window.KG_SCHEDULE_EN || {};
  const scheduleTerms = new Map(Object.entries(schedule.terms || {}));
  const scheduleTopics = new Map(Object.entries(schedule.topics || {}));
  let embeddedTerms;
  function translateScheduleParts(text) {
    if (!scheduleTerms.size || !/[А-Яа-яЁё]/.test(text)) return text;
    if (!embeddedTerms) {
      const escape = key => key.replace(/[\^$.*+?()[\]{}|\\]/g, '\\$&');
      const keys = [...scheduleTerms.keys()].sort((a,b) => b.length - a.length).map(escape);
      embeddedTerms = new RegExp('(?<![A-Za-zА-Яа-яЁё0-9])(?:' + keys.join('|') + ')(?![A-Za-zА-Яа-яЁё0-9])', 'gu');
    }
    return text.replace(embeddedTerms, key => scheduleTerms.get(key));
  }
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const fullDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' });
  const localizedDate = new RegExp('(\\d{1,2}) (' + months.join('|') + ')', 'g');
  const modulesPlaceholder = 'Вопросы к модулю | https://example.org/questions.pdf\nТесты | https://example.org/test\nУчебник: главы 4–6';
  phrases.set(modulesPlaceholder, 'Module questions | https://example.org/questions.pdf\nPractice tests | https://example.org/test\nTextbook: Chapters 4–6');
  const attributes = ['aria-label', 'title', 'placeholder', 'alt'];
  const translated = new Map();
  const excluded = 'script,style,[contenteditable],[data-own-locale],[data-language],[translate="no"]';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const url = new URL(location.href);
  let language = url.searchParams.get('lang');
  if (!['ru', 'en'].includes(language)) {
    try { language = localStorage.getItem('kg-interface-language'); } catch {}
  }
  language = language === 'en' ? 'en' : 'ru';
  document.documentElement.lang = language;

  const feedbackPrefixes = [
    ['Войти на сайт как ', 'Sign in as '], ['Удалить запись ', 'Delete entry '],
    ['Удалить объявление ', 'Delete announcement '], ['Удалить общую запись для ВСЕЙ группы ', 'Delete shared entry for the ENTIRE group '],
    ['Удалить заявку на правку ', 'Delete edit request '], ['Снять роль ', 'Remove role '],
    ['Не опубликовано: ', 'Not published: '], ['Не удалось войти через Telegram: ', 'Unable to sign in with Telegram: '],
    ['Не удалось получить права редактора: ', 'Unable to load editor permissions: '],
    ['Ошибка загрузки: ', 'Load error: '], ['Ошибка импорта: ', 'Import error: '],
    ['Ошибка серверного архива: ', 'Server backup error: '], ['Ошибка удаления: ', 'Deletion error: '],
    ['Ошибка экспорта: ', 'Export error: '], ['Ошибка: ', 'Error: '],
    ['Загружаем общие записи для ', 'Loading shared entries for '],
    ['Публикация остановлена: ', 'Publishing stopped: '],
    ['Вход через Telegram', 'Signed in with Telegram'], ['Вход по почте: ', 'Signed in by email: ']
  ];
  function translate(source) {
    const input = source.trim();
    if (!/[А-Яа-яЁё]/.test(input)) return source;
    const prefix = feedbackPrefixes.find(([ru]) => input.startsWith(ru));
    if (prefix && !phrases.has(input)) return source.replace(input, () => prefix[1] + input.slice(prefix[0].length));
    const label = phrases.get(input) ?? scheduleTopics.get(input) ?? scheduleTerms.get(input) ?? input.split(/( · |; | \/ )/).map(part => {
      let result = phrases.get(part) ?? scheduleTerms.get(part) ?? part;
      result = result
        .replace(/^Расписание группы (.+)$/u, 'Timetable for group $1')
        .replace(/^Расписание (.+) — КГМУ$/u, 'KSMU timetable — $1')
        .replace(/^· (\d+)-я$/u, '· Week $1')
        .replace(/^Группы /u, 'Groups ')
        .replace(/^Найдена 1 группа$/u, '1 group found')
        .replace(/^Найдено: (\d+) (?:группа|группы|групп)(?:, показаны первые (\d+))?$/u, (_, n, shown) => n + ' groups found' + (shown ? ', showing the first ' + shown : ''))
        .replace(/, модуль(?=$|,)/gu, ', module')
        .replace(/, ДЗ(?=$|,)/gu, ', homework')
        .replace(/, изменение(?=$|,)/gu, ', timetable change')
        .replace(/^через (\d+) (?:день|дня|дней)$/u, (_,n) => 'in ' + n + (n==='1'?' day':' days'))
        .replace(/^(\d+) (?:день|дня|дней) назад$/u, (_,n) => n + (n==='1'?' day ago':' days ago'))
        .replace(/^(\d+) (?:модуль|модуля|модулей) впереди$/u, (_,n) => n + (n==='1'?' upcoming module':' upcoming modules'))
        .replace(/^Ближайший — ([^,]+), (.*)$/u, (_,subject,when) => 'Next: ' + (phrases.get(subject)||subject) + ', ' + (phrases.get(when)||when.replace(/^через (\d+) (?:день|дня|дней)$/u,'in $1 days')))
        .replace(/^Опубликовать локальные ДЗ и модули \((\d+)\)$/u, 'Publish local homework and modules ($1)')
        .replace(/^Нет связи с общими данными: /u, 'Shared data unavailable: ')
        .replace(/^Ошибк[аa] входа: /u, 'Sign-in error: ')
        .replace(/^Кнопка входа недоступна: /u, 'Sign-in is unavailable: ')
        .replace(/^Редакция от /u, 'Last revised ')
        .replace(/^(\d{1,2} [а-яё]+ \d{4}) г\.$/u, '$1')
        .replace(/(\d{4}) г\.$/u, '$1')
        .replace(/^(\d+) неделя$/u, 'Week $1')
        .replace(/^(\d+)-я$/u, 'Week $1')
        .replace(/^перерыв, ещё /u, 'break, ')
        .replace(/^Опубликованы недели /u, 'Published weeks ')
        .replace(/^(\d+) из (\d+)$/u, '$1 of $2')
        .replace(/(\d+) (пара|пары|пар|занятие|занятия|занятий)(?=$|[, ])/gu, (_, count) => count + (count === '1' ? ' class' : ' classes'))
        .replace(/^(\d\d:\d\d) (.+)$/u, (match,time,subject) => phrases.has(subject) || scheduleTerms.has(subject) ? time+' '+(phrases.get(subject) ?? scheduleTerms.get(subject)) : match)
        .replace(/^Группа ([\wА-Яа-яЁё-]+)$/u, 'Group $1')
        .replace(/^([1-6]) курс$/u, 'Year $1')
        .replace(/^(\d+)-й поток$/u, 'Stream $1')
        .replace(/^Осень (\d{4}\/\d{2})$/u, 'Autumn $1')
        .replace(/^Весна (\d{4}\/\d{2})$/u, 'Spring $1')
        .replace(/^Расписание обновлено /u, 'Timetable updated ')
        .replace(/^Версия /u, 'Version ')
        .replace(/^(\d+)-я неделя$/u, 'Week $1')
        .replace(/^(\d+)-я (?:подгр\.|подгруппа)$/u, 'Subgroup $1')
        .replace(/^(\d+) (?:пара|пары|пар|занятие|занятия|занятий)$/u, (_, count) => count + (count === '1' ? ' class' : ' classes'))
        .replace(/^(\d+) групп$/u, '$1 groups')
        .replace(/^([А-ЯЁ][а-яё]+) (\d{4})$/u, (match, month, year) => phrases.has(month) ? phrases.get(month) + ' ' + year : match)
        .replace(/^ещё (\d+)$/u, '$1 more')
        .replace(/^Найдено: (\d+)$/u, 'Results: $1')
        .replace(/^Последняя закончилась в (.+)$/u, 'The last class ended at $1')
        .replace(/^Перерыв (.+)$/u, 'Break $1')
        .replace(/^(Практика|Лекция|Семинар|Цикл)( \d+\/\d+)$/u, (_, kind, progress) => phrases.get(kind) + progress)
        .replace(/^(Доброе утро|Добрый день|Добрый вечер)$/u, key => phrases.get(key))
        .replace(/^(Понедельник|Вторник|Среда|Четверг|Пятница|Суббота|Воскресенье)(?=, )/u, key => phrases.get(key))
        .replace(/^(пн|вт|ср|чт|пт|сб|вс)(?=, )/u, key => phrases.get(key))
        .replace(localizedDate, (_, day, month) => fullDate.format(new Date(Date.UTC(2024, months.indexOf(month), +day))));
      result = result.replace(/(?<![А-Яа-яЁё])(?:НУК|ГУК|УЛК|ОСЦ)(?=\d|[^А-Яа-яЁё]|$)/gu, code => ({НУК:'NUK',ГУК:'GUK',УЛК:'ULK',ОСЦ:'OSC'})[code])
        .replace(/ауд\.\s*/gu, 'Room ')
        .replace(/лекц\./gu, 'Lecture Hall')
        .replace(/Стомат\. КГМУ/gu, 'KSMU Dental Centre')
        .replace(/Стомат\. пол\./gu, 'Dental Clinic')
        .replace(/\bNUK Ректор/gu, 'NUK Rector Hall')
        .replace(/(\d+)[бБ](?=$|[ ,])/gu, '$1B');
      if (result.startsWith('Break ') || result.startsWith('break, ')) result = result.replace(/(\d+) ч\b/gu, '$1 hr').replace(/(\d+) мин/gu, '$1 min').replace(/(\d+) ч(?= |$)/gu, '$1 hr');
      return translateScheduleParts(result);
    }).join('');
    return input === label ? source : source.replace(input, () => label);
  }

  function update(node, key) {
    const textNode = key === 'data';
    const value = textNode ? node.data : node.getAttribute(key);
    if (!value) return;
    let saved = translated.get(node);
    let entry = saved?.get(key);
    if (entry && entry.output !== value) {
      saved.delete(key);
      entry = undefined;
    }
    const original = entry?.original ?? value;
    const output = language === 'en' ? translate(original) : original;
    if (output === value) return;
    if (!saved) translated.set(node, saved = new Map());
    if (output === original) saved.delete(key);
    else saved.set(key, { original, output });
    if (textNode) {
      const option = node.parentElement;
      if (option?.tagName === 'OPTION' && !option.hasAttribute('value')) option.setAttribute('value', option.value);
      node.data = output;
    }
    else node.setAttribute(key, output);
  }

  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.parentElement && !node.parentElement.closest(excluded + ',textarea')) update(node, 'data');
    } else if (node.nodeType === Node.ELEMENT_NODE && !node.closest(excluded)) {
      for (const key of attributes) update(node, key);
      if (node.tagName !== 'TEXTAREA') for (const child of node.childNodes) walk(child);
    }
  }

  function refresh() {
    for (const node of translated.keys()) {
      if (!node.isConnected || !translated.get(node).size) translated.delete(node);
    }
    walk(document.querySelector('title'));
    walk(document.body);
    for (const button of document.querySelectorAll('[data-language]')) {
      const title = button.querySelector('b');
      const label = language === 'en' ? 'Russian' : 'English';
      if (title.textContent !== label) title.textContent = label;
      title.lang = 'en';
      const description = title.parentElement.querySelector('span');
      const hint = language === 'en' ? 'Interface language' : 'Язык интерфейса';
      if (description.textContent !== hint) description.textContent = hint;
    }
  }

  let switching = false;
  window.kgSwitchLanguage = () => {
    if (switching) return;
    const switchLanguage = () => {
      language = language === 'ru' ? 'en' : 'ru';
      document.documentElement.lang = language;
      try { localStorage.setItem('kg-interface-language', language); } catch {}
      const current = new URL(location.href);
      current.searchParams.set('lang', language);
      history.replaceState(history.state, '', current);
      document.dispatchEvent(new Event('kg-language'));
      refresh();
    };
    const section = document.getElementById('kgPage');
    if (!motion.matches && !document.hidden && document.startViewTransition) {
      switching = true;
      const transition = document.startViewTransition(switchLanguage);
      transition.ready.catch(() => {});
      transition.finished.then(() => { switching = false; }, () => { switching = false; });
    } else {
      switchLanguage();
      if (!motion.matches) section?.animate([
        { opacity: .55, transform: 'translateY(7px)' },
        { opacity: 1, transform: 'none' }
      ], { duration: 300, easing: 'cubic-bezier(.16,1,.3,1)' });
    }
  };
  window.kgTranslateLabel = text => language === 'en' ? translate(text) : text;
  document.addEventListener('DOMContentLoaded', () => {
    refresh();
    new MutationObserver(() => {
      if (language === 'en') refresh();
    }).observe(document.documentElement, {
      subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: attributes
    });
  });
})();
