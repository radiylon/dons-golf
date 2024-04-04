import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import useGoogleSheets from "@/hooks/useGoogleSheets";
import TournamentCard from "@/components/TournamentCard";
import SchoolCard from "@/components/SchoolCard";
import { getGoogleSheetsData } from '@/hooks/useGoogleSheets';

export const getServerSideProps = (async () => {
  const initialData = await getGoogleSheetsData();
  return { props: { initialData } }
}) satisfies GetServerSideProps<{ initialData: any }>


export default function Home({ initialData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = useGoogleSheets({ initialData });
  console.log('data', data);

  if (!data) return null;

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
