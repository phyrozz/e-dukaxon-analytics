import { Chart, CategoryScale, LinearScale, BarController, BarElement } from 'chart.js';
import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';

// Register necessary components
Chart.register(CategoryScale, LinearScale, BarController, BarElement);

const TopPlayedChart = (props) => {
  const data = props.data;
  const options = props.options;

  const chartRef = useRef(null);

  // useEffect(() => {
  //   // Destroy the chart instance when the component is unmounted
  //   return () => {
  //     if (chartRef.current) {
  //       chartRef.current.chartInstance.destroy();
  //     }
  //   };
  // }, []);

  return <Bar ref={chartRef} data={data} options={options} />;
};

export default TopPlayedChart;
