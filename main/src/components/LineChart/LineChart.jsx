import React ,{useState,useEffect}from 'react'
import { Chart } from "react-google-charts";

const LineChart = ({historicalData}) => {

  const [data, setdata] = useState(["Date","Prices"])
  useEffect(() => {
    let dataCopy=[["Date","Prices"]];
    if(historicalData.prices){
      historicalData.prices.map((item)=>{
        dataCopy.push([`${new Date(item[0]).toLocaleDateString().slice(0,-5)}`,item[1]])
      })
      // we will provide this datacopy into setdata
      setdata(dataCopy);
    }
    //  29/12/2024
  }, [])
  // now we will use this data to create charts 
  return (
    <Chart
      chartType='LineChart'
      data={data}
      height="100%"
      legendToogle
    
    
    />
  )
}

export default LineChart