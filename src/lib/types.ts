export interface Course {
  courseLabel: string;
  totalYards: number;
  courseName: string;
  pars: number[];
  totalPar: number;
  roundId: number;
  yards: number[];
}

export interface TeamRound {
  thru: string;
  teeTime: string;
  source: string;
  roundId: number;
  status: string;
}

export interface TeamResult {
  currentRound: number;
  strokes: number[];
  courseLabels: string[];
  overallTeamRank: number;
  teamLabel: string;
  scores: number[];
  totalPar: number[];
  totalScore: number;
  currentRank: number;
  division: string;
  holeThrough: string;
  schoolId: string;
  totalStrokes: number;
  schoolName: string;
  schoolLogo: string;
  roundId: number;
  rounds: TeamRound[];
}

export interface TeamLeaderboard {
  tournamentId: string;
  courses: Course[];
  results: TeamResult[];
}

export interface PlayerRound {
  thru: string;
  courseLabel: string;
  strokes: (number | null)[];
  teeTime: string;
  scores: (number | null)[];
  startingHole: number;
  source: string;
  playerStatus: string;
  roundId: number;
  holes: number[];
  status: string;
}

export interface PlayerResult {
  userPicture: string;
  currentRound: number;
  strokes: number[];
  courseLabels: string[];
  overallTeamRank: number;
  teamLabel: string;
  playerName: string;
  scores: number[];
  totalPar: number[];
  totalScore: number;
  currentRank: number;
  division: string;
  holeThrough: string;
  schoolId: string;
  totalStrokes: number;
  schoolName: string;
  schoolLogo: string;
  overallPlayerRank: number;
  roundId: number;
  playerId: string;
  rounds: PlayerRound[];
}

export interface PlayerLeaderboard {
  tournamentId: string;
  courses: Course[];
  results: PlayerResult[];
}

export interface Tournament {
  tournamentId: string;
  tournamentName: string;
  gender: string;
  division: string;
  eventType: string;
  startDate: string;
  endDate: string;
  venue: string;
  city: string;
  state: string;
  hasResults: boolean;
  isComplete: boolean;
  numRounds: number;
  plannedRounds: number;
  season: number;
  hostName: string;
  hostBoardName: string;
}

export interface TournamentList {
  results: Tournament[];
}
