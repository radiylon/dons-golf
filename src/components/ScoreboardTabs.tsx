export type ScoreboardTab = "team" | "individual" | "players";

export default function ScoreboardTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: ScoreboardTab;
  onTabChange: (tab: ScoreboardTab) => void;
}) {
  return (
    <div className="relative mx-4 mb-4 flex gap-1 bg-gray-100 rounded-lg p-1">
      <div
        className="absolute top-1 bottom-1 bg-white rounded-md shadow-sm transition-[left] duration-75"
        style={{
          width: "calc((100% - 16px) / 3)",
          left: activeTab === "team"
            ? "4px"
            : activeTab === "individual"
              ? "calc(4px + (100% - 8px) / 3)"
              : "calc(4px + 2 * (100% - 8px) / 3)",
        }}
      />
      <button
        onClick={() => onTabChange("team")}
        className={`relative z-10 flex-1 text-sm font-medium py-2 rounded-md cursor-pointer ${
          activeTab === "team" ? "text-usf-green" : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Team
      </button>
      <button
        onClick={() => onTabChange("individual")}
        className={`relative z-10 flex-1 text-sm font-medium py-2 rounded-md cursor-pointer ${
          activeTab === "individual" ? "text-usf-green" : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Individual
      </button>
      <button
        onClick={() => onTabChange("players")}
        className={`relative z-10 flex-1 text-sm font-medium py-2 rounded-md cursor-pointer ${
          activeTab === "players" ? "text-usf-green" : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Dons
      </button>
    </div>
  );
}
