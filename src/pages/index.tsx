import useGoogleSheets from "@/hooks/useGoogleSheets";
import DefaultLayout from "@/layouts/DefaultLayout";

export default function Home() {
  const { data } = useGoogleSheets();
  console.log('data', data);

  return (
    <div>
      HELLO WORLD
      {data?.map((row, index) => (
        <h1 className="text-white" key={index}>{row.tournament}</h1>
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
