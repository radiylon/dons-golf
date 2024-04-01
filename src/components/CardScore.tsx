interface CardScoreProps {
  score: {
    birdies: string;
    eagles: string;
    pars: string;
  },
}

export default function CardScore({ score }: CardScoreProps) {
  return (
    <div className="flex flex-row bg-primary rounded-md">
      <div className="stat space-y-2">
        <div className="stat-title text-neutral font-bold">PARS</div>
        <div className="stat-value text-accent">{score.pars}</div>
      </div>
      <div className="divider divider-horizontal bg-secondary bg-opacity-15"></div>
      <div className="stat space-y-2">
        <div className="stat-title text-neutral font-bold">BIRDIES</div>
        <div className="stat-value text-secondary">{score.birdies}</div>
      </div>
      <div className="divider divider-horizontal bg-secondary bg-opacity-15"></div>
      <div className="stat space-y-2">
        <div className="stat-title text-neutral font-bold">EAGLES</div>
        <div className="stat-value text-base-100">{score.eagles}</div>
      </div>
    </div>
  );
}