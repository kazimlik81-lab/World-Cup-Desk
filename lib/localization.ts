import type { MatchEntry } from "@/lib/tournament-data";

export type LanguageCode = "ru" | "en" | "az" | "tr";

export type MissionId = "custom" | "harbor-rush" | "night-escort" | "storm-wall";

export type ShipClassCode = "SC" | "DS" | "CA" | "CG" | "RS" | "SM" | "IB" | "MB";

export type LanguageOption = {
  code: LanguageCode;
  label: string;
  shortLabel: string;
};

type NewsCopy = {
  title: string;
  summary: string;
  sourceName: string;
  publishedAt: string;
};

type FactCopy = {
  label: string;
  value: string;
};

type TeamStatisticCopy = {
  label: string;
  value: string;
};

type MissionCopy = {
  name: string;
  objective: string;
};

type ShipClassCopy = {
  name: string;
  role: string;
};

export type AppCopy = {
  language: {
    selectorLabel: string;
  };
  common: {
    noDate: string;
    open: string;
    group: string;
    soon: string;
    versus: string;
  };
  matchFilters: {
    all: string;
    finished: string;
    scheduled: string;
  };
  home: {
    heroLabel: string;
    eyebrow: string;
    title: string;
    copy: string;
    actionsLabel: string;
    openNews: string;
    refreshFeed: string;
    openGameLabel: string;
    securityLabel: string;
    httpsEnabled: string;
    secureByDefault: string;
    secureCopy: string;
    summaryLabel: string;
    metricGroups: string;
    metricFinished: string;
    metricScheduled: string;
    metricFeed: string;
    factsLabel: string;
    dataLabel: string;
    matchesEyebrow: string;
    matchesTitle: string;
    searchPlaceholder: string;
    searchLabel: string;
    matchFilterLabel: string;
    newsEyebrow: string;
    newsTitle: string;
  };
  tournamentFacts: FactCopy[];
  teamStatistics: TeamStatisticCopy[];
  fallbackNews: NewsCopy[];
  tournamentTable: {
    eyebrow: string;
    titlePrefix: string;
    selectLabel: string;
    tableLabelPrefix: string;
    columns: {
      team: string;
      played: string;
      won: string;
      drawn: string;
      lost: string;
      goals: string;
      points: string;
    };
  };
  statisticsPanel: {
    eyebrow: string;
    title: string;
    scorersTitle: string;
    teamsTitle: string;
    goalsLabel: string;
    assistsShortLabel: string;
  };
  matchRow: {
    reportHint: string;
  };
  newsModal: {
    eyebrow: string;
    title: string;
    closeLabel: string;
    lead: string;
  };
  matchReport: {
    eyebrow: string;
    title: string;
    closeLabel: string;
    dateLabel: string;
    timeLabel: string;
    statusLabel: string;
    finishedStatus: string;
    scheduledStatus: string;
    finishedIntro: string;
    finishedInsight: string;
    finishedStorage: string;
    scheduledIntro: string;
    scheduledInsight: string;
    scheduledStorage: string;
  };
  game: {
    back: string;
    eyebrow: string;
    serialLabel: string;
    downloadLabel: string;
    downloadAriaLabel: string;
    statusLabel: string;
    shipsLabel: string;
    lanesLabel: string;
    missionLabel: string;
    readyStatus: string;
    boardLabel: string;
    missionChooserLabel: string;
    catalogLabel: string;
    catalogTitle: string;
    additionalShipsLabel: string;
    downloadColumns: {
      ship: string;
      lane: string;
      className: string;
      armor: string;
      speed: string;
      fire: string;
    };
    missions: Record<MissionId, MissionCopy>;
    shipClasses: Record<ShipClassCode, ShipClassCopy>;
  };
};

export const DEFAULT_LANGUAGE: LanguageCode = "ru";

export const languageOptions: LanguageOption[] = [
  { code: "ru", label: "Русский", shortLabel: "RU" },
  { code: "en", label: "English", shortLabel: "EN" },
  { code: "az", label: "Azərbaycanca", shortLabel: "AZ" },
  { code: "tr", label: "Türkçe", shortLabel: "TR" }
];

export const languageDateLocales: Record<LanguageCode, string> = {
  ru: "ru-RU",
  en: "en-US",
  az: "az-Latn-AZ",
  tr: "tr-TR"
};

export const appCopies: Record<LanguageCode, AppCopy> = {
  ru: {
    language: { selectorLabel: "Выберите язык сайта" },
    common: { noDate: "нет даты", open: "Открыть", group: "Группа", soon: "скоро", versus: "vs" },
    matchFilters: { all: "Все", finished: "Результаты", scheduled: "Календарь" },
    home: {
      heroLabel: "World Cup Desk",
      eyebrow: "Secure tournament command center",
      title: "World Cup Desk",
      copy: "Новости, таблицы, календарь матчей, результаты и статистика чемпионата собраны прямо здесь, без переходов на FIFA при открытии новостей.",
      actionsLabel: "Основные действия",
      openNews: "Новости чемпионата",
      refreshFeed: "Обновить ленту",
      openGameLabel: "Открыть игру",
      securityLabel: "Безопасность соединения",
      httpsEnabled: "HTTPS включен",
      secureByDefault: "Secure by default",
      secureCopy: "Формы и API-запросы работают через тот же защищенный origin.",
      summaryLabel: "Сводка чемпионата",
      metricGroups: "Группы",
      metricFinished: "Сыграно",
      metricScheduled: "В календаре",
      metricFeed: "Лента",
      factsLabel: "Информация о чемпионате",
      dataLabel: "Данные чемпионата",
      matchesEyebrow: "Матчи и результаты",
      matchesTitle: "Календарь матчей",
      searchPlaceholder: "Команда, группа, город",
      searchLabel: "Поиск матчей",
      matchFilterLabel: "Фильтр матчей",
      newsEyebrow: "На нашей странице",
      newsTitle: "Новости чемпионата"
    },
    tournamentFacts: [
      { label: "Формат", value: "48 команд, 12 групп по 4 сборные" },
      { label: "Матчи", value: "104 игры с 11 июня по 19 июля 2026" },
      { label: "Плей-офф", value: "Топ-2 групп и 8 лучших третьих мест выходят в 1/16" },
      { label: "Хозяева", value: "Канада, Мексика, США" }
    ],
    teamStatistics: [
      { label: "Лучшая атака", value: "7 голов" },
      { label: "Крупнейшая разница", value: "+6" },
      { label: "Самый результативный старт", value: "5 голов" },
      { label: "Лидер хозяев", value: "4:1 в первом матче" }
    ],
    fallbackNews: [
      {
        title: "Групповой этап набрал темп: все 12 групп уже в рабочем режиме",
        summary: "Расширенный формат держит турнир плотным: 72 матча группового этапа определяют 24 прямых участника плей-офф и восемь лучших третьих мест.",
        sourceName: "World Cup Desk",
        publishedAt: "2026-06-17T12:00:00.000Z"
      },
      {
        title: "Месси, Мбаппе и Холанд резко подняли планку гонки бомбардиров",
        summary: "После первых матчей гонку возглавляет Lionel Messi, а Kylian Mbappe и Erling Haaland идут рядом с группой преследователей.",
        sourceName: "World Cup Desk",
        publishedAt: "2026-06-17T13:05:00.000Z"
      },
      {
        title: "Германия и Швеция дали самые мощные атакующие сигналы первой недели",
        summary: "Germany забила семь, Sweden пять, а USA и Norway начали с убедительных побед, которые сразу повлияли на разницу мячей.",
        sourceName: "World Cup Desk",
        publishedAt: "2026-06-17T16:30:00.000Z"
      }
    ],
    tournamentTable: {
      eyebrow: "Таблица результатов",
      titlePrefix: "Группа",
      selectLabel: "Выберите группу",
      tableLabelPrefix: "Таблица группы",
      columns: { team: "Команда", played: "И", won: "В", drawn: "Н", lost: "П", goals: "М", points: "О" }
    },
    statisticsPanel: {
      eyebrow: "Игроки и команды",
      title: "Статистика чемпионата",
      scorersTitle: "Бомбардиры",
      teamsTitle: "Команды",
      goalsLabel: "гола",
      assistsShortLabel: "асс."
    },
    matchRow: { reportHint: "Нажмите для отчета" },
    newsModal: {
      eyebrow: "Без перехода на FIFA",
      title: "Новости чемпионата",
      closeLabel: "Закрыть новости",
      lead: "Все новости открываются внутри World Cup Desk."
    },
    matchReport: {
      eyebrow: "На нашем сайте",
      title: "Отчет о матче",
      closeLabel: "Закрыть отчет",
      dateLabel: "Дата",
      timeLabel: "Время",
      statusLabel: "Статус",
      finishedStatus: "Матч завершен",
      scheduledStatus: "Матч в календаре",
      finishedIntro: "Матч {homeTeam} против {awayTeam} завершился со счетом {scoreLabel}. Результат уже учтен в таблице группы {groupCode}.",
      finishedInsight: "Ключевой вывод: команда-победитель получила важное преимущество по очкам и разнице мячей, а проигравшей стороне теперь нужно активнее играть в следующих турах.",
      finishedStorage: "Отчет хранится прямо внутри World Cup Desk: пользователь остается на нашей странице и может вернуться к календарю без внешних переходов.",
      scheduledIntro: "Матч {homeTeam} против {awayTeam} запланирован в группе {groupCode}.",
      scheduledInsight: "Перед матчем важно следить за положением команд в таблице, текущей разницей мячей и результатами соседних игр группы.",
      scheduledStorage: "После финального свистка этот блок можно расширить подробным отчетом: счет, ключевые моменты, влияние на таблицу и статистика команд."
    },
    game: {
      back: "Назад",
      eyebrow: "Игра",
      serialLabel: "Серийный номер игры",
      downloadLabel: "Скачать экран",
      downloadAriaLabel: "Скачать экран выбранной миссии",
      statusLabel: "Параметры игры",
      shipsLabel: "Корабли",
      lanesLabel: "Ряды",
      missionLabel: "Миссия",
      readyStatus: "Ready",
      boardLabel: "Игровое поле Jumdo Javelin",
      missionChooserLabel: "Выбор миссии",
      catalogLabel: "Дополнительные корабли",
      catalogTitle: "Дополнительные корабли",
      additionalShipsLabel: "Дополнительные корабли",
      downloadColumns: { ship: "Корабль", lane: "Ряд", className: "Класс", armor: "Броня", speed: "Скорость", fire: "Огонь" },
      missions: {
        custom: { name: "Custom Mission", objective: "Большая пользовательская миссия с плотным флотом и быстрым стартом." },
        "harbor-rush": { name: "Harbor Rush", objective: "Захватить гавань до подхода второго флота." },
        "night-escort": { name: "Night Escort", objective: "Провести конвой через темный сектор без потери флагмана." },
        "storm-wall": { name: "Storm Wall", objective: "Развернуть оборону против самой плотной волны кораблей." }
      },
      shipClasses: buildShipClassCopies("ru")
    }
  },
  en: {
    language: { selectorLabel: "Choose site language" },
    common: { noDate: "no date", open: "Open", group: "Group", soon: "soon", versus: "vs" },
    matchFilters: { all: "All", finished: "Results", scheduled: "Schedule" },
    home: {
      heroLabel: "World Cup Desk",
      eyebrow: "Secure tournament command center",
      title: "World Cup Desk",
      copy: "News, tables, match schedule, results, and tournament statistics stay here in one secure desk, without sending you to FIFA when opening news.",
      actionsLabel: "Primary actions",
      openNews: "Tournament news",
      refreshFeed: "Refresh feed",
      openGameLabel: "Open game",
      securityLabel: "Connection security",
      httpsEnabled: "HTTPS enabled",
      secureByDefault: "Secure by default",
      secureCopy: "Forms and API requests use the same protected origin.",
      summaryLabel: "Tournament summary",
      metricGroups: "Groups",
      metricFinished: "Played",
      metricScheduled: "Scheduled",
      metricFeed: "Feed",
      factsLabel: "Tournament information",
      dataLabel: "Tournament data",
      matchesEyebrow: "Matches and results",
      matchesTitle: "Match schedule",
      searchPlaceholder: "Team, group, city",
      searchLabel: "Search matches",
      matchFilterLabel: "Match filter",
      newsEyebrow: "On this page",
      newsTitle: "Tournament news"
    },
    tournamentFacts: [
      { label: "Format", value: "48 teams, 12 groups of 4 national teams" },
      { label: "Matches", value: "104 games from June 11 to July 19, 2026" },
      { label: "Knockout", value: "Top 2 in each group and the 8 best third-place teams enter the round of 32" },
      { label: "Hosts", value: "Canada, Mexico, United States" }
    ],
    teamStatistics: [
      { label: "Best attack", value: "7 goals" },
      { label: "Largest difference", value: "+6" },
      { label: "Highest-scoring start", value: "5 goals" },
      { label: "Host leader", value: "4:1 in the first match" }
    ],
    fallbackNews: [
      {
        title: "The group stage is moving fast: all 12 groups are now active",
        summary: "The expanded format keeps the tournament dense: 72 group-stage matches decide 24 direct knockout places and eight best third-place teams.",
        sourceName: "World Cup Desk",
        publishedAt: "2026-06-17T12:00:00.000Z"
      },
      {
        title: "Messi, Mbappe, and Haaland lift the top-scorer race",
        summary: "After the first matches, Lionel Messi leads the race, while Kylian Mbappe and Erling Haaland sit close with the chasing pack.",
        sourceName: "World Cup Desk",
        publishedAt: "2026-06-17T13:05:00.000Z"
      },
      {
        title: "Germany and Sweden send the strongest attacking signals",
        summary: "Germany scored seven, Sweden five, and USA plus Norway started with convincing wins that changed goal difference immediately.",
        sourceName: "World Cup Desk",
        publishedAt: "2026-06-17T16:30:00.000Z"
      }
    ],
    tournamentTable: {
      eyebrow: "Results table",
      titlePrefix: "Group",
      selectLabel: "Choose group",
      tableLabelPrefix: "Group table",
      columns: { team: "Team", played: "P", won: "W", drawn: "D", lost: "L", goals: "G", points: "Pts" }
    },
    statisticsPanel: {
      eyebrow: "Players and teams",
      title: "Tournament statistics",
      scorersTitle: "Top scorers",
      teamsTitle: "Teams",
      goalsLabel: "goals",
      assistsShortLabel: "ast."
    },
    matchRow: { reportHint: "Open match report" },
    newsModal: {
      eyebrow: "No FIFA redirect",
      title: "Tournament news",
      closeLabel: "Close news",
      lead: "All news opens inside World Cup Desk."
    },
    matchReport: {
      eyebrow: "On this site",
      title: "Match report",
      closeLabel: "Close report",
      dateLabel: "Date",
      timeLabel: "Time",
      statusLabel: "Status",
      finishedStatus: "Match finished",
      scheduledStatus: "Match scheduled",
      finishedIntro: "{homeTeam} vs {awayTeam} finished {scoreLabel}. The result is already reflected in group {groupCode}.",
      finishedInsight: "Key takeaway: the winning team gained an important points and goal-difference advantage, while the losing side needs a stronger next round.",
      finishedStorage: "The report stays inside World Cup Desk, so the user can return to the calendar without external redirects.",
      scheduledIntro: "{homeTeam} vs {awayTeam} is scheduled in group {groupCode}.",
      scheduledInsight: "Before kickoff, watch the table position, goal difference, and nearby group results.",
      scheduledStorage: "After full time this block can expand with the score, key moments, table impact, and team statistics."
    },
    game: buildGameCopy("en")
  },
  az: {
    language: { selectorLabel: "Sayt dilini seçin" },
    common: { noDate: "tarix yoxdur", open: "Aç", group: "Qrup", soon: "tezliklə", versus: "vs" },
    matchFilters: { all: "Hamısı", finished: "Nəticələr", scheduled: "Təqvim" },
    home: {
      heroLabel: "World Cup Desk",
      eyebrow: "Təhlükəsiz turnir idarə paneli",
      title: "World Cup Desk",
      copy: "Çempionat xəbərləri, cədvəllər, oyun təqvimi, nəticələr və statistika burada toplanır; xəbərləri açanda FIFA-ya keçid olmur.",
      actionsLabel: "Əsas əməliyyatlar",
      openNews: "Çempionat xəbərləri",
      refreshFeed: "Lenti yenilə",
      openGameLabel: "Oyunu aç",
      securityLabel: "Bağlantı təhlükəsizliyi",
      httpsEnabled: "HTTPS aktivdir",
      secureByDefault: "Standart olaraq təhlükəsiz",
      secureCopy: "Formalar və API sorğuları eyni qorunan origin üzərindən işləyir.",
      summaryLabel: "Çempionat xülasəsi",
      metricGroups: "Qruplar",
      metricFinished: "Oynanılıb",
      metricScheduled: "Təqvimdə",
      metricFeed: "Lent",
      factsLabel: "Çempionat məlumatı",
      dataLabel: "Çempionat məlumatları",
      matchesEyebrow: "Oyunlar və nəticələr",
      matchesTitle: "Oyun təqvimi",
      searchPlaceholder: "Komanda, qrup, şəhər",
      searchLabel: "Oyun axtarışı",
      matchFilterLabel: "Oyun filtri",
      newsEyebrow: "Bu səhifədə",
      newsTitle: "Çempionat xəbərləri"
    },
    tournamentFacts: [
      { label: "Format", value: "48 komanda, hərəsində 4 yığma olan 12 qrup" },
      { label: "Oyunlar", value: "11 iyun - 19 iyul 2026 arası 104 oyun" },
      { label: "Pley-off", value: "Qruplarda ilk 2 yer və ən yaxşı 8 üçüncü yer 1/16 mərhələsinə çıxır" },
      { label: "Ev sahibləri", value: "Kanada, Meksika, ABŞ" }
    ],
    teamStatistics: [
      { label: "Ən yaxşı hücum", value: "7 qol" },
      { label: "Ən böyük fərq", value: "+6" },
      { label: "Ən məhsuldar başlanğıc", value: "5 qol" },
      { label: "Ev sahiblərinin lideri", value: "ilk oyunda 4:1" }
    ],
    fallbackNews: [
      {
        title: "Qrup mərhələsi sürət yığır: 12 qrupun hamısı artıq aktivdir",
        summary: "Genişləndirilmiş format turniri sıx saxlayır: 72 qrup oyunu 24 birbaşa pley-off iştirakçısını və ən yaxşı 8 üçüncü yeri müəyyən edir.",
        sourceName: "World Cup Desk",
        publishedAt: "2026-06-17T12:00:00.000Z"
      },
      {
        title: "Messi, Mbappe və Haaland bombardirlər yarışında səviyyəni qaldırdı",
        summary: "İlk oyunlardan sonra Lionel Messi yarışı aparır, Kylian Mbappe və Erling Haaland isə izləyici qrupla yaxındadır.",
        sourceName: "World Cup Desk",
        publishedAt: "2026-06-17T13:05:00.000Z"
      },
      {
        title: "Almaniya və İsveç ilk həftənin ən güclü hücum siqnallarını verdi",
        summary: "Germany yeddi, Sweden beş qol vurdu, USA və Norway isə top fərqinə dərhal təsir edən inamlı qələbələrlə başladı.",
        sourceName: "World Cup Desk",
        publishedAt: "2026-06-17T16:30:00.000Z"
      }
    ],
    tournamentTable: {
      eyebrow: "Nəticələr cədvəli",
      titlePrefix: "Qrup",
      selectLabel: "Qrupu seçin",
      tableLabelPrefix: "Qrup cədvəli",
      columns: { team: "Komanda", played: "O", won: "Q", drawn: "H", lost: "M", goals: "T", points: "X" }
    },
    statisticsPanel: {
      eyebrow: "Oyunçular və komandalar",
      title: "Çempionat statistikası",
      scorersTitle: "Bombardirlər",
      teamsTitle: "Komandalar",
      goalsLabel: "qol",
      assistsShortLabel: "as."
    },
    matchRow: { reportHint: "Hesabatı aç" },
    newsModal: {
      eyebrow: "FIFA-ya keçid yoxdur",
      title: "Çempionat xəbərləri",
      closeLabel: "Xəbərləri bağla",
      lead: "Bütün xəbərlər World Cup Desk daxilində açılır."
    },
    matchReport: buildMatchReportCopy("az"),
    game: buildGameCopy("az")
  },
  tr: {
    language: { selectorLabel: "Site dilini seçin" },
    common: { noDate: "tarih yok", open: "Aç", group: "Grup", soon: "yakında", versus: "vs" },
    matchFilters: { all: "Tümü", finished: "Sonuçlar", scheduled: "Takvim" },
    home: {
      heroLabel: "World Cup Desk",
      eyebrow: "Güvenli turnuva komuta merkezi",
      title: "World Cup Desk",
      copy: "Şampiyona haberleri, tablolar, maç takvimi, sonuçlar ve istatistikler burada toplanır; haberleri açarken FIFA'ya geçiş yapılmaz.",
      actionsLabel: "Ana işlemler",
      openNews: "Şampiyona haberleri",
      refreshFeed: "Akışı yenile",
      openGameLabel: "Oyunu aç",
      securityLabel: "Bağlantı güvenliği",
      httpsEnabled: "HTTPS açık",
      secureByDefault: "Varsayılan olarak güvenli",
      secureCopy: "Formlar ve API istekleri aynı korumalı origin üzerinden çalışır.",
      summaryLabel: "Şampiyona özeti",
      metricGroups: "Gruplar",
      metricFinished: "Oynandı",
      metricScheduled: "Takvimde",
      metricFeed: "Akış",
      factsLabel: "Şampiyona bilgisi",
      dataLabel: "Şampiyona verileri",
      matchesEyebrow: "Maçlar ve sonuçlar",
      matchesTitle: "Maç takvimi",
      searchPlaceholder: "Takım, grup, şehir",
      searchLabel: "Maç ara",
      matchFilterLabel: "Maç filtresi",
      newsEyebrow: "Bu sayfada",
      newsTitle: "Şampiyona haberleri"
    },
    tournamentFacts: [
      { label: "Format", value: "48 takım, 4 milli takımdan oluşan 12 grup" },
      { label: "Maçlar", value: "11 Haziran - 19 Temmuz 2026 arasında 104 maç" },
      { label: "Eleme", value: "Gruplarda ilk 2 ve en iyi 8 üçüncü takım son 32 turuna çıkar" },
      { label: "Ev sahipleri", value: "Kanada, Meksika, ABD" }
    ],
    teamStatistics: [
      { label: "En iyi hücum", value: "7 gol" },
      { label: "En büyük fark", value: "+6" },
      { label: "En skorlu başlangıç", value: "5 gol" },
      { label: "Ev sahibi lideri", value: "ilk maçta 4:1" }
    ],
    fallbackNews: [
      {
        title: "Grup aşaması hız kazandı: 12 grubun tamamı artık aktif",
        summary: "Genişletilmiş format turnuvayı yoğun tutuyor: 72 grup maçı 24 doğrudan eleme katılımcısını ve en iyi 8 üçüncüyü belirliyor.",
        sourceName: "World Cup Desk",
        publishedAt: "2026-06-17T12:00:00.000Z"
      },
      {
        title: "Messi, Mbappe ve Haaland gol krallığı yarışını yükseltti",
        summary: "İlk maçların ardından Lionel Messi yarışı önde götürüyor; Kylian Mbappe ve Erling Haaland takip grubuyla yakın.",
        sourceName: "World Cup Desk",
        publishedAt: "2026-06-17T13:05:00.000Z"
      },
      {
        title: "Almanya ve İsveç ilk haftanın en güçlü hücum sinyallerini verdi",
        summary: "Germany yedi, Sweden beş gol attı; USA ve Norway ise averajı hemen etkileyen net galibiyetlerle başladı.",
        sourceName: "World Cup Desk",
        publishedAt: "2026-06-17T16:30:00.000Z"
      }
    ],
    tournamentTable: {
      eyebrow: "Sonuç tablosu",
      titlePrefix: "Grup",
      selectLabel: "Grup seçin",
      tableLabelPrefix: "Grup tablosu",
      columns: { team: "Takım", played: "O", won: "G", drawn: "B", lost: "M", goals: "A", points: "P" }
    },
    statisticsPanel: {
      eyebrow: "Oyuncular ve takımlar",
      title: "Şampiyona istatistikleri",
      scorersTitle: "Gol kralları",
      teamsTitle: "Takımlar",
      goalsLabel: "gol",
      assistsShortLabel: "ast."
    },
    matchRow: { reportHint: "Raporu aç" },
    newsModal: {
      eyebrow: "FIFA yönlendirmesi yok",
      title: "Şampiyona haberleri",
      closeLabel: "Haberleri kapat",
      lead: "Tüm haberler World Cup Desk içinde açılır."
    },
    matchReport: buildMatchReportCopy("tr"),
    game: buildGameCopy("tr")
  }
};

export function getSupportedLanguage(value: string | null): LanguageCode {
  if (value === "ru" || value === "en" || value === "az" || value === "tr") {
    return value;
  }

  return DEFAULT_LANGUAGE;
}

export function interpolateMatchText(template: string, matchEntry: MatchEntry): string {
  return template
    .replaceAll("{homeTeam}", matchEntry.homeTeam)
    .replaceAll("{awayTeam}", matchEntry.awayTeam)
    .replaceAll("{scoreLabel}", matchEntry.scoreLabel ?? "")
    .replaceAll("{groupCode}", matchEntry.groupCode);
}

function buildMatchReportCopy(languageCode: "az" | "tr"): AppCopy["matchReport"] {
  if (languageCode === "az") {
    return {
      eyebrow: "Bizim saytda",
      title: "Oyun hesabatı",
      closeLabel: "Hesabatı bağla",
      dateLabel: "Tarix",
      timeLabel: "Vaxt",
      statusLabel: "Status",
      finishedStatus: "Oyun bitib",
      scheduledStatus: "Oyun təqvimdədir",
      finishedIntro: "{homeTeam} - {awayTeam} oyunu {scoreLabel} hesabı ilə bitdi. Nəticə artıq {groupCode} qrupunun cədvəlində nəzərə alınıb.",
      finishedInsight: "Əsas nəticə: qalib komanda xal və top fərqində vacib üstünlük qazandı, uduzan tərəf isə növbəti turlarda daha aktiv oynamalıdır.",
      finishedStorage: "Hesabat World Cup Desk daxilində qalır: istifadəçi xarici keçid olmadan təqvimə qayıda bilər.",
      scheduledIntro: "{homeTeam} - {awayTeam} oyunu {groupCode} qrupunda planlaşdırılıb.",
      scheduledInsight: "Oyundan əvvəl komandaların cədvəldəki mövqeyini, top fərqini və qrupdakı digər nəticələri izləmək vacibdir.",
      scheduledStorage: "Final fitindən sonra bu blok hesab, əsas anlar, cədvələ təsir və komanda statistikası ilə genişləndirilə bilər."
    };
  }

  return {
    eyebrow: "Sitemizde",
    title: "Maç raporu",
    closeLabel: "Raporu kapat",
    dateLabel: "Tarih",
    timeLabel: "Saat",
    statusLabel: "Durum",
    finishedStatus: "Maç tamamlandı",
    scheduledStatus: "Maç takvimde",
    finishedIntro: "{homeTeam} - {awayTeam} maçı {scoreLabel} skoruyla bitti. Sonuç {groupCode} grubu tablosuna işlendi.",
    finishedInsight: "Temel çıkarım: kazanan takım puan ve averajda önemli avantaj aldı; kaybeden tarafın sonraki turlarda daha aktif oynaması gerekiyor.",
    finishedStorage: "Rapor World Cup Desk içinde kalır; kullanıcı dış yönlendirme olmadan takvime dönebilir.",
    scheduledIntro: "{homeTeam} - {awayTeam} maçı {groupCode} grubunda planlandı.",
    scheduledInsight: "Maçtan önce takımların tablodaki yeri, averajı ve gruptaki diğer sonuçlar izlenmeli.",
    scheduledStorage: "Final düdüğünden sonra bu blok skor, önemli anlar, tablo etkisi ve takım istatistikleriyle genişletilebilir."
  };
}

function buildGameCopy(languageCode: Exclude<LanguageCode, "ru">): AppCopy["game"] {
  const gameCopies: Record<Exclude<LanguageCode, "ru">, AppCopy["game"]> = {
    en: {
      back: "Back",
      eyebrow: "Game",
      serialLabel: "Game serial number",
      downloadLabel: "Download screen",
      downloadAriaLabel: "Download selected mission screen",
      statusLabel: "Game parameters",
      shipsLabel: "Ships",
      lanesLabel: "Lanes",
      missionLabel: "Mission",
      readyStatus: "Ready",
      boardLabel: "Jumdo Javelin game board",
      missionChooserLabel: "Mission chooser",
      catalogLabel: "Additional ships",
      catalogTitle: "Additional ships",
      additionalShipsLabel: "Additional ships",
      downloadColumns: { ship: "Ship", lane: "Lane", className: "Class", armor: "Armor", speed: "Speed", fire: "Fire" },
      missions: {
        custom: { name: "Custom Mission", objective: "A large custom mission with a dense fleet and a fast start." },
        "harbor-rush": { name: "Harbor Rush", objective: "Capture the harbor before the second fleet arrives." },
        "night-escort": { name: "Night Escort", objective: "Escort the convoy through a dark sector without losing the flagship." },
        "storm-wall": { name: "Storm Wall", objective: "Deploy defense against the densest wave of ships." }
      },
      shipClasses: buildShipClassCopies("en")
    },
    az: {
      back: "Geri",
      eyebrow: "Oyun",
      serialLabel: "Oyunun seriya nömrəsi",
      downloadLabel: "Ekranı endir",
      downloadAriaLabel: "Seçilmiş missiya ekranını endir",
      statusLabel: "Oyun parametrləri",
      shipsLabel: "Gəmilər",
      lanesLabel: "Sıralar",
      missionLabel: "Missiya",
      readyStatus: "Hazır",
      boardLabel: "Jumdo Javelin oyun sahəsi",
      missionChooserLabel: "Missiya seçimi",
      catalogLabel: "Əlavə gəmilər",
      catalogTitle: "Əlavə gəmilər",
      additionalShipsLabel: "Əlavə gəmilər",
      downloadColumns: { ship: "Gəmi", lane: "Sıra", className: "Sinif", armor: "Zireh", speed: "Sürət", fire: "Atəş" },
      missions: {
        custom: { name: "Fərdi Missiya", objective: "Sıx donanma və sürətli başlanğıcla böyük fərdi missiya." },
        "harbor-rush": { name: "Liman Hücumu", objective: "İkinci donanma gəlməzdən əvvəl limanı ələ keçir." },
        "night-escort": { name: "Gecə Müşayiəti", objective: "Flaqmanı itirmədən konvoyu qaranlıq sektordan keçir." },
        "storm-wall": { name: "Fırtına Divarı", objective: "Ən sıx gəmi dalğasına qarşı müdafiə qur." }
      },
      shipClasses: buildShipClassCopies("az")
    },
    tr: {
      back: "Geri",
      eyebrow: "Oyun",
      serialLabel: "Oyun seri numarası",
      downloadLabel: "Ekranı indir",
      downloadAriaLabel: "Seçili görev ekranını indir",
      statusLabel: "Oyun parametreleri",
      shipsLabel: "Gemiler",
      lanesLabel: "Sıralar",
      missionLabel: "Görev",
      readyStatus: "Hazır",
      boardLabel: "Jumdo Javelin oyun alanı",
      missionChooserLabel: "Görev seçimi",
      catalogLabel: "Ek gemiler",
      catalogTitle: "Ek gemiler",
      additionalShipsLabel: "Ek gemiler",
      downloadColumns: { ship: "Gemi", lane: "Sıra", className: "Sınıf", armor: "Zırh", speed: "Hız", fire: "Ateş" },
      missions: {
        custom: { name: "Özel Görev", objective: "Yoğun filo ve hızlı başlangıç içeren büyük özel görev." },
        "harbor-rush": { name: "Liman Hücumu", objective: "İkinci filo gelmeden limanı ele geçir." },
        "night-escort": { name: "Gece Eskortu", objective: "Amiral gemisini kaybetmeden konvoyu karanlık sektörden geçir." },
        "storm-wall": { name: "Fırtına Duvarı", objective: "En yoğun gemi dalgasına karşı savunma kur." }
      },
      shipClasses: buildShipClassCopies("tr")
    }
  };

  return gameCopies[languageCode];
}

function buildShipClassCopies(languageCode: LanguageCode): Record<ShipClassCode, ShipClassCopy> {
  const shipClasses: Record<LanguageCode, Record<ShipClassCode, ShipClassCopy>> = {
    ru: {
      SC: { name: "Scout", role: "Быстрая разведка" },
      DS: { name: "Destroyer", role: "Линия атаки" },
      CA: { name: "Carrier", role: "Командная палуба" },
      CG: { name: "Cargo", role: "Маршрут снабжения" },
      RS: { name: "Rescue", role: "Ремонтная команда" },
      SM: { name: "Submarine", role: "Скрытый удар" },
      IB: { name: "Icebreaker", role: "Тяжелый прорыв" },
      MB: { name: "Missile Boat", role: "Дальний удар" }
    },
    en: {
      SC: { name: "Scout", role: "Fast recon" },
      DS: { name: "Destroyer", role: "Attack line" },
      CA: { name: "Carrier", role: "Command deck" },
      CG: { name: "Cargo", role: "Supply run" },
      RS: { name: "Rescue", role: "Repair team" },
      SM: { name: "Submarine", role: "Hidden strike" },
      IB: { name: "Icebreaker", role: "Heavy push" },
      MB: { name: "Missile Boat", role: "Long shot" }
    },
    az: {
      SC: { name: "Kəşfiyyatçı", role: "Sürətli kəşfiyyat" },
      DS: { name: "Esmineç", role: "Hücum xətti" },
      CA: { name: "Daşıyıcı", role: "Komanda göyərtəsi" },
      CG: { name: "Yük gəmisi", role: "Təchizat marşrutu" },
      RS: { name: "Xilasetmə", role: "Təmir komandası" },
      SM: { name: "Sualtı qayıq", role: "Gizli zərbə" },
      IB: { name: "Buzqıran", role: "Ağır irəliləyiş" },
      MB: { name: "Raket qayığı", role: "Uzaq zərbə" }
    },
    tr: {
      SC: { name: "Keşif", role: "Hızlı keşif" },
      DS: { name: "Muhrip", role: "Saldırı hattı" },
      CA: { name: "Taşıyıcı", role: "Komuta güvertesi" },
      CG: { name: "Kargo", role: "İkmal rotası" },
      RS: { name: "Kurtarma", role: "Onarım ekibi" },
      SM: { name: "Denizaltı", role: "Gizli saldırı" },
      IB: { name: "Buzkıran", role: "Ağır itiş" },
      MB: { name: "Füze Botu", role: "Uzak atış" }
    }
  };

  return shipClasses[languageCode];
}
