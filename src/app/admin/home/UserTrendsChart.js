import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { db } from '@/firebase/config';
import 'chartjs-adapter-moment';

const UserTrendsChart = () => {
  const [userSignupData, setUserSignupData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userCollection = await db.collection('users').get();

        const userData = userCollection.docs.map((doc) => {
          const data = doc.data();
          return {
            createdAt: data.accountCreatedAt?.toDate(), // Convert Firestore timestamp to JavaScript Date
          };
        });

        // Sort userData based on createdAt
        userData.sort((a, b) => a.createdAt - b.createdAt);

        setUserSignupData(userData);
      } catch (error) {
        console.error('Error fetching user signup data:', error);
      }
    };

    fetchData();
  }, []);

  const timestamps = userSignupData.map((user) => user.createdAt);

  const chartData = {
    labels: timestamps, // X-axis: timestamp of each user
    datasets: [
      {
        label: 'Registered Users',
        data: timestamps.map((timestamp, index) => index + 1), // Y-axis: increment by one for each user
        fill: false,
        backgroundColor: '#334155',
        tension: 0.4,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        title: {
          display: true,
          text: 'Account Created At',
        },
      },
      y: {
        title: {
          display: true,
          text: 'No. of Users',
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default UserTrendsChart;
