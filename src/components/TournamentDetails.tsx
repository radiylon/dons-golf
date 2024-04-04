interface TournamentDetailsProps {
  tournament: any;
}

export default function TournamentDetails({ tournament }: TournamentDetailsProps) {
  return (
    <div className="flex flex-col justify-center items-center bg-primary min-h-48 w-full rounded-md p-4">
      {tournament ? (
        <>
          <h1 className="text-neutral text-4xl font-bold">{tournament.tournament}</h1>
          <h2 className="text-base-100 text-3xl font-bold italic">{tournament.course}</h2>
        </>
      ) : (
        <h1 className="text-neutral text-4xl font-bold uppercase">Select a tournament</h1>
      )}
    </div>  
  );
}