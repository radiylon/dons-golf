import { SF_SCHOOL_ID, schoolLogoUrl } from "@/lib/constants";
import { formatScore, scoreColor } from "@/lib/format";
import type { TeamResult } from "@/lib/types";

function TeamRow({
  team,
  rank,
  isSF,
}: {
  team: TeamResult;
  rank: number;
  isSF: boolean;
}) {
  const hasScores = team.totalStrokes > 0;

  return (
    <tr
      className={
        isSF
          ? "bg-usf-green/5 border-l-4 border-l-usf-green font-semibold"
          : "border-l-4 border-l-transparent"
      }
    >
      <td className="py-2.5 pl-3 pr-2 text-center tabular-nums">{rank}</td>
      <td className="py-2.5 px-2">
        <div className="flex items-center gap-2">
          {team.schoolLogo ? (
            <img
              src={schoolLogoUrl(team.schoolLogo, 32)}
              alt=""
              className="w-5 h-5 object-contain shrink-0"
            />
          ) : (
            <div className="w-5 h-5 bg-gray-200 rounded shrink-0" />
          )}
          <span className={isSF ? "text-usf-green" : ""}>{team.schoolName}</span>
        </div>
      </td>
      <td
        className={`py-2.5 px-2 text-center tabular-nums ${hasScores ? scoreColor(team.totalScore) : "text-gray-400"}`}
      >
        {hasScores ? formatScore(team.totalScore) : "–"}
      </td>
      {team.strokes.map((strokes, i) => (
        <td
          key={i}
          className="py-2.5 px-2 text-center tabular-nums text-gray-500"
        >
          {strokes > 0 ? strokes : "–"}
        </td>
      ))}
      <td className="py-2.5 px-2 text-center tabular-nums">
        {team.totalStrokes > 0 ? team.totalStrokes : "–"}
      </td>
    </tr>
  );
}

export default function TeamStandings({
  teams,
  numRounds,
}: {
  teams: TeamResult[];
  numRounds: number;
}) {
  return (
    <div className="mx-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
            <th className="py-2.5 pl-3 pr-2 text-center font-medium w-10">
              #
            </th>
            <th className="py-2.5 px-2 text-left font-medium">Team</th>
            <th className="py-2.5 px-2 text-center font-medium">Score</th>
            {Array.from({ length: numRounds }, (_, i) => (
              <th
                key={i}
                className="py-2.5 px-2 text-center font-medium"
              >
                R{i + 1}
              </th>
            ))}
            <th className="py-2.5 px-2 text-center font-medium">
              Tot
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {teams.map((team, i) => (
            <TeamRow
              key={team.schoolId}
              team={team}
              rank={i + 1}
              isSF={team.schoolId === SF_SCHOOL_ID}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
