import useGoogleSheets from "@/hooks/useGoogleSheets";
import DefaultLayout from "@/layouts/DefaultLayout";
import Image from "next/image";

export default function Home() {
  const { data } = useGoogleSheets();
  console.log('data', data);

  return (
    <div className="mt-1 flex flex-row space-x-2">
      {data?.map((row, index) => (
        <div key={index} className="card p-4 w-[500px] h-36 bg-accent shadow-xl space-y-2" onClick={() => console.log('clicked')}>
          {/* <div className="">
            {row.image && (
              <figure><Image src={row.image} alt={`${row.course} Image`} width={500} height={100} /></figure>
            )}
          </div> */}
          <h2 className="card-title">
            <span>{row.tournament} @ {row.course} {index === 0 && <span className="badge badge-secondary">NEW</span>}</span>
          </h2>
          <p>{row.description}</p>
        </div>
      ))}
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
