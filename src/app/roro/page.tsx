import type { Metadata } from "next";
import RoroTracker from "@/components/RoroTracker";

export const metadata: Metadata = {
  title: "Roro | USF Dons Golf",
};

export default function RoroPage() {
  return (
    <main className="min-h-screen pb-8">
      <RoroTracker />
    </main>
  );
}
