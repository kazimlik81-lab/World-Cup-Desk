import type { LanguageCode } from "@/lib/localization";
import type { MatchEntry } from "@/lib/tournament-data";

type SeoCopy = {
  homeTitle: string;
  homeDescription: string;
  matchCenterTitle: string;
  matchCenterLabel: string;
  matchPageEyebrow: string;
  matchPageBack: string;
  matchPageGroup: string;
  matchPageVenue: string;
  matchPageStatus: string;
  matchPageFinished: string;
  matchPageScheduled: string;
  matchPageScore: string;
  matchPageSummaryTitle: string;
  matchPageRelatedTitle: string;
  buildMatchTitle: (matchEntry: MatchEntry) => string;
  buildMatchDescription: (matchEntry: MatchEntry) => string;
  buildMatchLead: (matchEntry: MatchEntry) => string;
};

export const seoCopies: Record<LanguageCode, SeoCopy> = {
  ru: {
    homeTitle: "World Cup Desk | Матчи, результаты и таблицы чемпионата мира 2026",
    homeDescription:
      "Матчи чемпионата мира 2026, результаты, календарь, таблицы групп, статистика игроков и новости на русском языке.",
    matchCenterTitle: "Матч-центр чемпионата мира",
    matchCenterLabel: "Индексируемые страницы матчей чемпионата мира",
    matchPageEyebrow: "Матч чемпионата мира 2026",
    matchPageBack: "Назад к матчам",
    matchPageGroup: "Группа",
    matchPageVenue: "Стадион",
    matchPageStatus: "Статус",
    matchPageFinished: "Матч завершен",
    matchPageScheduled: "Матч запланирован",
    matchPageScore: "Счет",
    matchPageSummaryTitle: "Краткая сводка",
    matchPageRelatedTitle: "Другие матчи этой группы",
    buildMatchTitle: (matchEntry) =>
      `${matchEntry.homeTeam} - ${matchEntry.awayTeam}: ${matchEntry.scoreLabel ?? "календарь"} | Чемпионат мира 2026`,
    buildMatchDescription: (matchEntry) =>
      `${matchEntry.homeTeam} - ${matchEntry.awayTeam}, группа ${matchEntry.groupCode}: дата, стадион, статус матча и ${matchEntry.scoreLabel ? `счет ${matchEntry.scoreLabel}` : "календарь чемпионата мира 2026"}.`,
    buildMatchLead: (matchEntry) =>
      matchEntry.scoreLabel
        ? `Матч ${matchEntry.homeTeam} - ${matchEntry.awayTeam} завершился со счетом ${matchEntry.scoreLabel}. Результат учитывается в таблице группы ${matchEntry.groupCode}.`
        : `Матч ${matchEntry.homeTeam} - ${matchEntry.awayTeam} запланирован в группе ${matchEntry.groupCode}. На странице собраны дата, время, стадион и контекст календаря.`
  },
  en: {
    homeTitle: "World Cup Desk | World Cup 2026 matches, results, schedule, and tables",
    homeDescription:
      "World Cup 2026 matches, results, schedule, group tables, player statistics, and tournament news in English.",
    matchCenterTitle: "World Cup match center",
    matchCenterLabel: "Indexable World Cup match pages",
    matchPageEyebrow: "World Cup 2026 match",
    matchPageBack: "Back to matches",
    matchPageGroup: "Group",
    matchPageVenue: "Venue",
    matchPageStatus: "Status",
    matchPageFinished: "Match finished",
    matchPageScheduled: "Match scheduled",
    matchPageScore: "Score",
    matchPageSummaryTitle: "Match summary",
    matchPageRelatedTitle: "Other matches in this group",
    buildMatchTitle: (matchEntry) =>
      `${matchEntry.homeTeam} vs ${matchEntry.awayTeam}: ${matchEntry.scoreLabel ?? "schedule"} | World Cup 2026`,
    buildMatchDescription: (matchEntry) =>
      `${matchEntry.homeTeam} vs ${matchEntry.awayTeam}, group ${matchEntry.groupCode}: date, venue, match status, and ${matchEntry.scoreLabel ? `score ${matchEntry.scoreLabel}` : "World Cup 2026 schedule"}.`,
    buildMatchLead: (matchEntry) =>
      matchEntry.scoreLabel
        ? `${matchEntry.homeTeam} vs ${matchEntry.awayTeam} finished ${matchEntry.scoreLabel}. The result is reflected in group ${matchEntry.groupCode}.`
        : `${matchEntry.homeTeam} vs ${matchEntry.awayTeam} is scheduled in group ${matchEntry.groupCode}. This page keeps the date, time, venue, and schedule context together.`
  },
  az: {
    homeTitle: "World Cup Desk | Dünya çempionatı 2026 oyunları, nəticələr və cədvəllər",
    homeDescription:
      "Dünya çempionatı 2026 oyunları, nəticələr, təqvim, qrup cədvəlləri, oyunçu statistikası və turnir xəbərləri.",
    matchCenterTitle: "Dünya çempionatı oyun mərkəzi",
    matchCenterLabel: "İndekslənə bilən Dünya çempionatı oyun səhifələri",
    matchPageEyebrow: "Dünya çempionatı 2026 oyunu",
    matchPageBack: "Oyunlara qayıt",
    matchPageGroup: "Qrup",
    matchPageVenue: "Stadion",
    matchPageStatus: "Status",
    matchPageFinished: "Oyun bitib",
    matchPageScheduled: "Oyun planlaşdırılıb",
    matchPageScore: "Hesab",
    matchPageSummaryTitle: "Qısa xülasə",
    matchPageRelatedTitle: "Bu qrupdakı digər oyunlar",
    buildMatchTitle: (matchEntry) =>
      `${matchEntry.homeTeam} - ${matchEntry.awayTeam}: ${matchEntry.scoreLabel ?? "təqvim"} | Dünya çempionatı 2026`,
    buildMatchDescription: (matchEntry) =>
      `${matchEntry.homeTeam} - ${matchEntry.awayTeam}, ${matchEntry.groupCode} qrupu: tarix, stadion, oyun statusu və ${matchEntry.scoreLabel ? `${matchEntry.scoreLabel} hesabı` : "Dünya çempionatı 2026 təqvimi"}.`,
    buildMatchLead: (matchEntry) =>
      matchEntry.scoreLabel
        ? `${matchEntry.homeTeam} - ${matchEntry.awayTeam} oyunu ${matchEntry.scoreLabel} hesabı ilə bitdi. Nəticə ${matchEntry.groupCode} qrupunun cədvəlində nəzərə alınır.`
        : `${matchEntry.homeTeam} - ${matchEntry.awayTeam} oyunu ${matchEntry.groupCode} qrupunda planlaşdırılıb. Səhifədə tarix, vaxt, stadion və təqvim konteksti var.`
  },
  tr: {
    homeTitle: "World Cup Desk | Dünya Kupası 2026 maçları, sonuçlar ve tablolar",
    homeDescription:
      "Dünya Kupası 2026 maçları, sonuçlar, takvim, grup tabloları, oyuncu istatistikleri ve turnuva haberleri.",
    matchCenterTitle: "Dünya Kupası maç merkezi",
    matchCenterLabel: "İndekslenebilir Dünya Kupası maç sayfaları",
    matchPageEyebrow: "Dünya Kupası 2026 maçı",
    matchPageBack: "Maçlara dön",
    matchPageGroup: "Grup",
    matchPageVenue: "Stadyum",
    matchPageStatus: "Durum",
    matchPageFinished: "Maç tamamlandı",
    matchPageScheduled: "Maç planlandı",
    matchPageScore: "Skor",
    matchPageSummaryTitle: "Kısa özet",
    matchPageRelatedTitle: "Bu gruptaki diğer maçlar",
    buildMatchTitle: (matchEntry) =>
      `${matchEntry.homeTeam} - ${matchEntry.awayTeam}: ${matchEntry.scoreLabel ?? "takvim"} | Dünya Kupası 2026`,
    buildMatchDescription: (matchEntry) =>
      `${matchEntry.homeTeam} - ${matchEntry.awayTeam}, ${matchEntry.groupCode} grubu: tarih, stadyum, maç durumu ve ${matchEntry.scoreLabel ? `${matchEntry.scoreLabel} skoru` : "Dünya Kupası 2026 takvimi"}.`,
    buildMatchLead: (matchEntry) =>
      matchEntry.scoreLabel
        ? `${matchEntry.homeTeam} - ${matchEntry.awayTeam} maçı ${matchEntry.scoreLabel} skoruyla tamamlandı. Sonuç ${matchEntry.groupCode} grubu tablosuna yansır.`
        : `${matchEntry.homeTeam} - ${matchEntry.awayTeam} maçı ${matchEntry.groupCode} grubunda planlandı. Bu sayfada tarih, saat, stadyum ve takvim bağlamı yer alır.`
  }
};
