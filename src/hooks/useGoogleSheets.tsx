import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface DataRow {
  [key: string]: string; // You can adjust the type according to your data
}

export default function useGoogleSheets() {
  const getGoogleSheetsData = async () => {
    const sheetId = '13KE6j122Muoo-mTZ-wjM6CTySMnWbquaiJRT67am-nw';
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    const range = 'Sheet1!A:Z';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.values;
    } catch (error) {
      return error;
    }
  };

  const { data: googleSheetsData } = useQuery<any>({ 
    queryKey: ['getGoogleSheetsData'], 
    queryFn: () => getGoogleSheetsData(),
  });

  console.log('googleSheetsData', googleSheetsData);

  const data = useMemo(() => {
    if (googleSheetsData) {
      const headers = googleSheetsData[0];
      const rows = googleSheetsData.slice(1).reverse();
      const result: DataRow[] = [];
  
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const obj: DataRow = {};

        for (let j = 0; j < headers.length; j++) {
          obj[headers[j].toLowerCase()] = row[j];
        }
        result.push(obj);
      }
  
      return result;
    }
  }, [googleSheetsData]);

  return { data };
}