import type { PlayerResult } from "@/lib/types";
import { playerPhotoUrl } from "@/lib/constants";

export default function PlayerAvatar({ player }: { player: PlayerResult }) {
  if (player.userPicture) {
    return (
      <img
        src={playerPhotoUrl(player.userPicture, 40)}
        alt=""
        className="w-7 h-7 rounded-md object-cover shrink-0"
        loading="lazy"
      />
    );
  }
  return (
    <div className="w-7 h-7 rounded-md bg-usf-green/10 shrink-0 flex items-center justify-center text-usf-green text-[10px] font-bold">
      {player.playerName
        ?.split(" ")
        .map((n) => n[0])
        .join("")}
    </div>
  );
}
