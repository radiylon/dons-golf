import useGoogleSheets from "@/hooks/useGoogleSheets";
import DefaultLayout from "@/layouts/DefaultLayout";
import Image from "next/image";

export default function Home() {
  const { data } = useGoogleSheets();
  console.log('data', data);

  return (
    <div className="mt-1 flex flex-row space-x-2">
      {data?.map((row, index) => (
        <div key={index} className="card w-full bg-base-100 shadow-xl" onClick={() => console.log('clicked')}>
          {/* <div className="">
            {row.image && (
              <figure><Image src={row.image} alt={`${row.course} Image`} width={500} height={100} /></figure>
            )}
          </div> */}
          <div className="card-body">
            <div className="flex flex-row">
              <h2 className="card-title">
                {row.tournament} @ {row.course}
              </h2>
              {index === data.length - 1 && <div className="badge badge-secondary">NEW</div>}
            </div>
            <p>{row.description}</p>
          </div>
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
