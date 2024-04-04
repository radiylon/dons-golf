import { DataRow } from "@/hooks/useGoogleSheets";

interface TournamentCardProps {
  row: DataRow;
  index: number;
  onClick: (row: any) => void;
}

export default function TournamentCard({ row, onClick }: TournamentCardProps) {
  const today = new Date();
  const startDate = new Date(row.start);
  const endDate = new Date(row.end);
  const isTournamentStarted = today >= startDate;

  const formatDate = (date: Date ) => new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);

  if (!row) return null;

  return (
    <div className="flex flex-col hover:opacity-80 hover:cursor-pointer" onClick={() => onClick(row)}>
      <div className="bg-secondary rounded-t-md p-2 pl-4">
        <span className="text-neutral font-bold">{row.tournament}</span>
        <span className="text-neutral">{` @ ${row.course}`}</span>
        <span className="text-base-100">{` [${row.city}, ${row.state}]`}</span>
      </div>
      <div className="flex flex-row bg-primary">
        <div className="stat space-y-2">
          <div className="stat-title text-neutral font-bold">PARS</div>
          <div className="stat-value text-accent">{isTournamentStarted ? row.pars : 'TBD'}</div>
        </div>
        <div className="divider divider-horizontal bg-secondary bg-opacity-15"></div>
        <div className="stat space-y-2">
          <div className="stat-title text-neutral font-bold">BIRDIES</div>
          <div className="stat-value text-secondary">{isTournamentStarted ? row.birdies : 'TBD'}</div>
        </div>
        <div className="divider divider-horizontal bg-secondary bg-opacity-15"></div>
        <div className="stat space-y-2">
          <div className="stat-title text-neutral font-bold">EAGLES</div>
          <div className="stat-value text-base-100">{isTournamentStarted ? row.eagles : 'TBD'}</div>
        </div>
      </div>
      <div className="bg-warning rounded-b-md p-2 pl-4">
        <div className="flex flex-row justify-between items-center space-x-2">
          <span className="text-neutral">{`${formatDate(startDate)} - ${formatDate(endDate)}`}</span>
          <span className="badge text-white">{`${row.holes} Holes`}</span>
        </div>
      </div>
    </div>
  );
}