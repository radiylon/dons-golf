import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import useGoogleSheets from "@/hooks/useGoogleSheets";
import TournamentCard from "@/components/TournamentCard";
import SchoolCard from "@/components/SchoolCard";
import { getGoogleSheetsData } from '@/hooks/useGoogleSheets';
import { useEffect, useState } from 'react';
import TournamentDetails from '@/components/TournamentDetails';

export const getServerSideProps = (async () => {
  const initialData = await getGoogleSheetsData();
  return { props: { initialData } }
}) satisfies GetServerSideProps<{ initialData: any }>


export default function Home({ initialData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [tournament, setTournament] = useState<any>();
  
  const { data } = useGoogleSheets({ initialData });
  console.log('data', data);

  const onTournamentSelect = (row: any) => {
    sessionStorage.setItem('tournament', JSON.stringify(row));
    setTournament(row)
  };

  useEffect(() => {
    const sessionData = sessionStorage.getItem('tournament');
    if (sessionData) {
      setTournament(JSON.parse(sessionData));
    }
  }, []);
  
  if (!data) return null;

  return (
    <div className="px-24">
      <div className="flex flex-row space-x-2">
        {/* CARDS */}
        <div className='w-1/2 overflow-y-auto space-y-2 bg-opacity-50 py-4'>
          {data?.map((row, index) => (
            <TournamentCard key={index} row={row} index={index} onClick={onTournamentSelect} />
          ))}
        </div>
        {/* SCHOOL + TOURNAMENT DETAILS */}
        <div className='flex flex-col w-1/2 space-y-2 py-4'>
          <SchoolCard />
          <TournamentDetails tournament={tournament} />
        </div>
      </div>
    </div>
  );
}
