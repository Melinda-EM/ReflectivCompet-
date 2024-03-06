import { useState, useEffect } from 'react';
import axios from "axios"
import Chart from '../components/utils/Chart'

function ChartPage() {
  const [names, setNames] = useState([]);

  useEffect(() => {
    axios.get("/api/ranking").then(({data}) => setNames(data))
  }, []);
  return (
    <>
      <div className="container mx-auto pb-8">
        <div className="md:bg-red h-10 rounded-md p-8 flex flex-col items-center justify-center">
          <h1 className="text-center text-white text-2xl font-smile font-bold p-2">Que la compétition commence ! Que le plus déterminé l'emporte. Nous vous souhaitons bon courage !</h1>
        </div> 
      </div>
      <Chart data={names.map(item => ({ name: item.employee, value: item.value }))} />
    </>
  )
}

export default ChartPage