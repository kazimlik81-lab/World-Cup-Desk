export type GroupCode =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L";

export type StandingTeam = {
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

export type MatchStatus = "finished" | "scheduled";

export type MatchEntry = {
  matchDate: string;
  timeLabel: string;
  homeTeam: string;
  awayTeam: string;
  groupCode: GroupCode;
  venue: string;
  city: string;
  status: MatchStatus;
  scoreLabel: string | null;
};

export type TournamentGroup = {
  groupCode: GroupCode;
  teams: StandingTeam[];
  matches: MatchEntry[];
};

export type PlayerStatistic = {
  playerName: string;
  teamName: string;
  goals: number;
  assists: number;
};

export type TeamStatistic = {
  label: string;
  teamName: string;
  value: string;
};

export type ChampionshipNewsItem = {
  title: string;
  summary: string;
  sourceName: string;
  publishedAt: string;
};

export const playerStatistics: PlayerStatistic[] = [
  { playerName: "Lionel Messi", teamName: "Argentina", goals: 3, assists: 0 },
  { playerName: "Kylian Mbappe", teamName: "France", goals: 2, assists: 0 },
  { playerName: "Erling Haaland", teamName: "Norway", goals: 2, assists: 0 },
  { playerName: "Kai Havertz", teamName: "Germany", goals: 2, assists: 0 },
  { playerName: "Yasin Ayari", teamName: "Sweden", goals: 2, assists: 0 },
  { playerName: "Elijah Just", teamName: "Australia", goals: 2, assists: 0 },
  { playerName: "Folarin Balogun", teamName: "USA", goals: 2, assists: 0 }
];

export const teamStatistics: TeamStatistic[] = [
  { label: "Best attack", teamName: "Germany", value: "7 goals" },
  { label: "Largest difference", teamName: "Germany", value: "+6" },
  { label: "Highest-scoring start", teamName: "Sweden", value: "5 goals" },
  { label: "Host leader", teamName: "USA", value: "4:1 in the first match" }
];

export const tournamentGroups: TournamentGroup[] = [
  {
    groupCode: "A",
    teams: [
      standing("Mexico", 1, 1, 0, 0, 2, 0, 3),
      standing("South Korea", 1, 1, 0, 0, 2, 1, 3),
      standing("Czechia", 1, 0, 0, 1, 1, 2, 0),
      standing("South Africa", 1, 0, 0, 1, 0, 2, 0)
    ],
    matches: [
      finished("2026-06-11", "15:00 ET", "Mexico", "South Africa", "A", "2-0", "Estadio Azteca", "Mexico City"),
      finished("2026-06-11", "22:00 ET", "South Korea", "Czechia", "A", "2-1", "Estadio Akron", "Guadalajara"),
      scheduled("2026-06-18", "12:00 ET", "Czechia", "South Africa", "A", "Atlanta Stadium", "Atlanta"),
      scheduled("2026-06-18", "21:00 ET", "Mexico", "South Korea", "A", "Los Angeles Stadium", "Los Angeles"),
      scheduled("2026-06-24", "21:00 ET", "Czechia", "Mexico", "A", "Mexico City Stadium", "Mexico City"),
      scheduled("2026-06-24", "21:00 ET", "South Africa", "South Korea", "A", "Monterrey Stadium", "Monterrey")
    ]
  },
  {
    groupCode: "B",
    teams: [
      standing("Canada", 1, 0, 1, 0, 1, 1, 1),
      standing("Bosnia and Herzegovina", 1, 0, 1, 0, 1, 1, 1),
      standing("Qatar", 1, 0, 1, 0, 1, 1, 1),
      standing("Switzerland", 1, 0, 1, 0, 1, 1, 1)
    ],
    matches: [
      finished("2026-06-12", "15:00 ET", "Canada", "Bosnia and Herzegovina", "B", "1-1", "BMO Field", "Toronto"),
      finished("2026-06-13", "21:00 ET", "Qatar", "Switzerland", "B", "1-1", "Levi's Stadium", "Santa Clara"),
      scheduled("2026-06-18", "15:00 ET", "Switzerland", "Bosnia and Herzegovina", "B", "BC Place", "Vancouver"),
      scheduled("2026-06-18", "18:00 ET", "Canada", "Qatar", "B", "BMO Field", "Toronto"),
      scheduled("2026-06-24", "15:00 ET", "Switzerland", "Canada", "B", "BC Place", "Vancouver"),
      scheduled("2026-06-24", "15:00 ET", "Bosnia and Herzegovina", "Qatar", "B", "Seattle Stadium", "Seattle")
    ]
  },
  {
    groupCode: "C",
    teams: [
      standing("Scotland", 1, 1, 0, 0, 1, 0, 3),
      standing("Morocco", 1, 0, 1, 0, 1, 1, 1),
      standing("Brazil", 1, 0, 1, 0, 1, 1, 1),
      standing("Haiti", 1, 0, 0, 1, 0, 1, 0)
    ],
    matches: [
      finished("2026-06-13", "18:00 ET", "Brazil", "Morocco", "C", "1-1", "MetLife Stadium", "New York New Jersey"),
      finished("2026-06-13", "21:00 ET", "Scotland", "Haiti", "C", "1-0", "Gillette Stadium", "Boston"),
      scheduled("2026-06-19", "18:00 ET", "Scotland", "Morocco", "C", "Philadelphia Stadium", "Philadelphia"),
      scheduled("2026-06-19", "21:00 ET", "Brazil", "Haiti", "C", "Hard Rock Stadium", "Miami"),
      scheduled("2026-06-24", "18:00 ET", "Scotland", "Brazil", "C", "Hard Rock Stadium", "Miami"),
      scheduled("2026-06-24", "18:00 ET", "Morocco", "Haiti", "C", "Philadelphia Stadium", "Philadelphia")
    ]
  },
  {
    groupCode: "D",
    teams: [
      standing("USA", 1, 1, 0, 0, 4, 1, 3),
      standing("Australia", 1, 1, 0, 0, 2, 0, 3),
      standing("Turkiye", 1, 0, 0, 1, 0, 2, 0),
      standing("Paraguay", 1, 0, 0, 1, 1, 4, 0)
    ],
    matches: [
      finished("2026-06-12", "21:00 ET", "USA", "Paraguay", "D", "4-1", "SoFi Stadium", "Los Angeles"),
      finished("2026-06-13", "15:00 ET", "Australia", "Turkiye", "D", "2-0", "Seattle Stadium", "Seattle"),
      scheduled("2026-06-19", "15:00 ET", "USA", "Australia", "D", "Seattle Stadium", "Seattle"),
      scheduled("2026-06-19", "00:00 ET", "Turkiye", "Paraguay", "D", "Los Angeles Stadium", "Los Angeles"),
      scheduled("2026-06-25", "22:00 ET", "Turkiye", "USA", "D", "Los Angeles Stadium", "Los Angeles"),
      scheduled("2026-06-25", "22:00 ET", "Paraguay", "Australia", "D", "San Francisco Bay Area Stadium", "Santa Clara")
    ]
  },
  {
    groupCode: "E",
    teams: [
      standing("Germany", 1, 1, 0, 0, 7, 1, 3),
      standing("Cote d'Ivoire", 1, 1, 0, 0, 1, 0, 3),
      standing("Ecuador", 1, 0, 0, 1, 0, 1, 0),
      standing("Curacao", 1, 0, 0, 1, 1, 7, 0)
    ],
    matches: [
      finished("2026-06-14", "15:00 ET", "Germany", "Curacao", "E", "7-1", "NRG Stadium", "Houston"),
      finished("2026-06-14", "18:00 ET", "Cote d'Ivoire", "Ecuador", "E", "1-0", "Lincoln Financial Field", "Philadelphia"),
      scheduled("2026-06-20", "16:00 ET", "Germany", "Cote d'Ivoire", "E", "MetLife Stadium", "New York New Jersey"),
      scheduled("2026-06-20", "20:00 ET", "Ecuador", "Curacao", "E", "Levi's Stadium", "Santa Clara"),
      scheduled("2026-06-25", "16:00 ET", "Ecuador", "Germany", "E", "Philadelphia Stadium", "Philadelphia"),
      scheduled("2026-06-25", "16:00 ET", "Curacao", "Cote d'Ivoire", "E", "Boston Stadium", "Boston")
    ]
  },
  {
    groupCode: "F",
    teams: [
      standing("Sweden", 1, 1, 0, 0, 5, 1, 3),
      standing("Japan", 1, 0, 1, 0, 2, 2, 1),
      standing("Netherlands", 1, 0, 1, 0, 2, 2, 1),
      standing("Tunisia", 1, 0, 0, 1, 1, 5, 0)
    ],
    matches: [
      finished("2026-06-14", "15:00 ET", "Netherlands", "Japan", "F", "2-2", "AT&T Stadium", "Dallas"),
      finished("2026-06-14", "21:00 ET", "Sweden", "Tunisia", "F", "5-1", "Mercedes-Benz Stadium", "Atlanta"),
      scheduled("2026-06-20", "13:00 ET", "Netherlands", "Sweden", "F", "MetLife Stadium", "New York New Jersey"),
      scheduled("2026-06-20", "00:00 ET", "Tunisia", "Japan", "F", "Seattle Stadium", "Seattle"),
      scheduled("2026-06-25", "19:00 ET", "Japan", "Sweden", "F", "Dallas Stadium", "Dallas"),
      scheduled("2026-06-25", "19:00 ET", "Tunisia", "Netherlands", "F", "Atlanta Stadium", "Atlanta")
    ]
  },
  {
    groupCode: "G",
    teams: [
      standing("New Zealand", 1, 0, 1, 0, 2, 2, 1),
      standing("Iran", 1, 0, 1, 0, 2, 2, 1),
      standing("Egypt", 1, 0, 1, 0, 1, 1, 1),
      standing("Belgium", 1, 0, 1, 0, 1, 1, 1)
    ],
    matches: [
      finished("2026-06-15", "15:00 ET", "Belgium", "Egypt", "G", "1-1", "MetLife Stadium", "New York New Jersey"),
      finished("2026-06-15", "21:00 ET", "Iran", "New Zealand", "G", "2-2", "BC Place", "Vancouver"),
      scheduled("2026-06-21", "15:00 ET", "Belgium", "Iran", "G", "Los Angeles Stadium", "Los Angeles"),
      scheduled("2026-06-21", "21:00 ET", "New Zealand", "Egypt", "G", "BC Place", "Vancouver"),
      scheduled("2026-06-26", "23:00 ET", "Egypt", "Iran", "G", "Seattle Stadium", "Seattle"),
      scheduled("2026-06-26", "23:00 ET", "New Zealand", "Belgium", "G", "Los Angeles Stadium", "Los Angeles")
    ]
  },
  {
    groupCode: "H",
    teams: [
      standing("Saudi Arabia", 1, 0, 1, 0, 1, 1, 1),
      standing("Uruguay", 1, 0, 1, 0, 1, 1, 1),
      standing("Spain", 1, 0, 1, 0, 0, 0, 1),
      standing("Cabo Verde", 1, 0, 1, 0, 0, 0, 1)
    ],
    matches: [
      finished("2026-06-15", "12:00 ET", "Spain", "Cabo Verde", "H", "0-0", "Mercedes-Benz Stadium", "Atlanta"),
      finished("2026-06-15", "18:00 ET", "Saudi Arabia", "Uruguay", "H", "1-1", "Hard Rock Stadium", "Miami"),
      scheduled("2026-06-21", "12:00 ET", "Spain", "Saudi Arabia", "H", "Mercedes-Benz Stadium", "Atlanta"),
      scheduled("2026-06-21", "18:00 ET", "Uruguay", "Cabo Verde", "H", "Hard Rock Stadium", "Miami"),
      scheduled("2026-06-26", "20:00 ET", "Cabo Verde", "Saudi Arabia", "H", "Miami Stadium", "Miami"),
      scheduled("2026-06-26", "20:00 ET", "Uruguay", "Spain", "H", "Atlanta Stadium", "Atlanta")
    ]
  },
  {
    groupCode: "I",
    teams: [
      standing("Norway", 1, 1, 0, 0, 4, 1, 3),
      standing("France", 1, 1, 0, 0, 3, 1, 3),
      standing("Senegal", 1, 0, 0, 1, 1, 3, 0),
      standing("Iraq", 1, 0, 0, 1, 1, 4, 0)
    ],
    matches: [
      finished("2026-06-16", "17:00 ET", "France", "Senegal", "I", "3-1", "MetLife Stadium", "New York New Jersey"),
      finished("2026-06-16", "20:00 ET", "Norway", "Iraq", "I", "4-1", "Arrowhead Stadium", "Kansas City"),
      scheduled("2026-06-22", "17:00 ET", "France", "Iraq", "I", "Philadelphia Stadium", "Philadelphia"),
      scheduled("2026-06-22", "20:00 ET", "Norway", "Senegal", "I", "Kansas City Stadium", "Kansas City"),
      scheduled("2026-06-26", "15:00 ET", "Norway", "France", "I", "Philadelphia Stadium", "Philadelphia"),
      scheduled("2026-06-26", "15:00 ET", "Senegal", "Iraq", "I", "Kansas City Stadium", "Kansas City")
    ]
  },
  {
    groupCode: "J",
    teams: [
      standing("Argentina", 1, 1, 0, 0, 3, 0, 3),
      standing("Austria", 1, 1, 0, 0, 3, 1, 3),
      standing("Jordan", 1, 0, 0, 1, 1, 3, 0),
      standing("Algeria", 1, 0, 0, 1, 0, 3, 0)
    ],
    matches: [
      finished("2026-06-16", "13:00 ET", "Argentina", "Algeria", "J", "3-0", "AT&T Stadium", "Dallas"),
      finished("2026-06-17", "19:00 ET", "Austria", "Jordan", "J", "3-1", "Arrowhead Stadium", "Kansas City"),
      scheduled("2026-06-22", "13:00 ET", "Argentina", "Austria", "J", "Dallas Stadium", "Dallas"),
      scheduled("2026-06-22", "23:00 ET", "Jordan", "Algeria", "J", "Kansas City Stadium", "Kansas City"),
      scheduled("2026-06-27", "22:00 ET", "Algeria", "Austria", "J", "Dallas Stadium", "Dallas"),
      scheduled("2026-06-27", "22:00 ET", "Jordan", "Argentina", "J", "Kansas City Stadium", "Kansas City")
    ]
  },
  {
    groupCode: "K",
    teams: [
      standing("Portugal", 1, 0, 1, 0, 1, 1, 1),
      standing("DR Congo", 1, 0, 1, 0, 1, 1, 1),
      standing("Colombia", 0, 0, 0, 0, 0, 0, 0),
      standing("Uzbekistan", 0, 0, 0, 0, 0, 0, 0)
    ],
    matches: [
      finished("2026-06-17", "13:00 ET", "Portugal", "DR Congo", "K", "1-1", "NRG Stadium", "Houston"),
      scheduled("2026-06-17", "22:00 ET", "Uzbekistan", "Colombia", "K", "Dallas Stadium", "Dallas"),
      scheduled("2026-06-23", "13:00 ET", "Portugal", "Uzbekistan", "K", "Houston Stadium", "Houston"),
      scheduled("2026-06-23", "22:00 ET", "Colombia", "DR Congo", "K", "Dallas Stadium", "Dallas"),
      scheduled("2026-06-27", "19:30 ET", "Colombia", "Portugal", "K", "Miami Stadium", "Miami"),
      scheduled("2026-06-27", "19:30 ET", "DR Congo", "Uzbekistan", "K", "Houston Stadium", "Houston")
    ]
  },
  {
    groupCode: "L",
    teams: [
      standing("England", 0, 0, 0, 0, 0, 0, 0),
      standing("Croatia", 0, 0, 0, 0, 0, 0, 0),
      standing("Ghana", 0, 0, 0, 0, 0, 0, 0),
      standing("Panama", 0, 0, 0, 0, 0, 0, 0)
    ],
    matches: [
      scheduled("2026-06-17", "16:00 ET", "England", "Croatia", "L", "AT&T Stadium", "Dallas"),
      scheduled("2026-06-17", "19:00 ET", "Ghana", "Panama", "L", "BMO Field", "Toronto"),
      scheduled("2026-06-23", "16:00 ET", "England", "Ghana", "L", "Dallas Stadium", "Dallas"),
      scheduled("2026-06-23", "19:00 ET", "Panama", "Croatia", "L", "Toronto Stadium", "Toronto"),
      scheduled("2026-06-27", "17:00 ET", "Panama", "England", "L", "New York New Jersey Stadium", "New York New Jersey"),
      scheduled("2026-06-27", "17:00 ET", "Croatia", "Ghana", "L", "Toronto Stadium", "Toronto")
    ]
  }
];

export const allMatches = tournamentGroups.flatMap((group) => group.matches);

function standing(
  teamName: string,
  played: number,
  won: number,
  drawn: number,
  lost: number,
  goalsFor: number,
  goalsAgainst: number,
  points: number
): StandingTeam {
  return {
    teamName,
    played,
    won,
    drawn,
    lost,
    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,
    points
  };
}

function finished(
  matchDate: string,
  timeLabel: string,
  homeTeam: string,
  awayTeam: string,
  groupCode: GroupCode,
  scoreLabel: string,
  venue: string,
  city: string
): MatchEntry {
  return {
    matchDate,
    timeLabel,
    homeTeam,
    awayTeam,
    groupCode,
    venue,
    city,
    status: "finished",
    scoreLabel
  };
}

function scheduled(
  matchDate: string,
  timeLabel: string,
  homeTeam: string,
  awayTeam: string,
  groupCode: GroupCode,
  venue: string,
  city: string
): MatchEntry {
  return {
    matchDate,
    timeLabel,
    homeTeam,
    awayTeam,
    groupCode,
    venue,
    city,
    status: "scheduled",
    scoreLabel: null
  };
}
