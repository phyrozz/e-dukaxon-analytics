import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

export default function TopPlayedLessonsChart(props) {
  const data = props.data;
  const chartRef = useRef(null);

  useEffect(() => {
    // Check if chartRef has a current property and if a chart instance exists
    if (chartRef.current && chartRef.current.destroy) {
      chartRef.current.destroy(); // Destroy the existing chart
    }

    // Create a new chart on the canvas
    const ctx = document.getElementById('myChart').getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: data,
    });

    // Return a cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartRef.current && chartRef.current.destroy) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return (
	<div className='p-5 rounded-xl w-full h-fit my-auto'>
		<canvas id='myChart'></canvas>
	</div>
  );
}
