import useGoogleSheets from "@/hooks/useGoogleSheets";
import DefaultLayout from "@/layouts/DefaultLayout";
import CardScore from "@/components/CardScore";

export default function Home() {
  const { data } = useGoogleSheets();
  console.log('data', data);

  return (
    <div className="flex flex-row space-x-2">
      <div className='w-1/2 space-y-2 bg-opacity-50 py-4'>
        {data?.map((row, index) => {
          const score = {
            birdies: row.birdies,
            eagles: row.eagles,
            pars: row.pars
          }
          
          return <CardScore key={index} score={score} />;
        })}
      </div>
      <div className='flex flex-col w-1/2 py-4'>
        <div className="flex flex-col justify-center items-center bg-neutral min-h-48 w-full rounded-md p-4">
          <h1 className="text-center text-4xl font-bold">UNIVERSITY OF SAN FRANCISCO DONS</h1>
          <h2 className="text-secondary text-3xl font-bold">WOMEN&apos;S GOLF TEAM</h2>
        </div>
      </div>  
    </div>
  );
}

Home.getLayout = function getLayout() {
  return (
    <DefaultLayout>
      <Home />
    </DefaultLayout>
  );
}
