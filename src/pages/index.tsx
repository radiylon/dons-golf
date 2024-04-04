import useGoogleSheets from "@/hooks/useGoogleSheets";
import DefaultLayout from "@/layouts/DefaultLayout";
import TournamentCard from "@/components/TournamentCard";
import { ReactNode } from "react";
import SchoolCard from "@/components/SchoolCard";

export default function Home() {
  const { data } = useGoogleSheets();
  console.log('data', data);

  return (
    <div className="px-24">
      <div className="flex flex-row space-x-2">
        {/* CARDS */}
        <div className='w-1/2 overflow-y-auto space-y-2 bg-opacity-50 py-4'>
          {data?.map((row, index) => (
            <TournamentCard key={index} row={row} />
          ))}
        </div>
        {/* SCHOOL + DESCRIPTION */}
        <SchoolCard />
      </div>
    </div>
  );
}
