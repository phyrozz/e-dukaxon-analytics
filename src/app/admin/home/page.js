"use client"
import React from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/firebase/config"
import { useAuthContext } from "@/context/AuthContext"
import { useState } from "react"
import { CircularProgress, Button, Menu, MenuItem } from "@mui/material"
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import Image from "next/image"
import AdminNavbar from "@/components/AdminNavbar"
import TopPlayedChart from "./TopPlayedChart"
import DistributionPieChart from "../PieChart"
import UserTrendsChart from "./UserTrendsChart"

function Page() {
	const { user } = useAuthContext()
	const router = useRouter()
	const [localeSelectAnchorEl, setlocaleSelectAnchorEl] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [email, setEmail] = useState("")
	
	const [isEnglish, setIsEnglish] = useState(true)
  
  // useStates for charts
	const [isTopPlayedLessonsListDescending, setIsTopPlayedLessonsListDescending] = useState(true)
	const [isTopPlayedGamesListDescending, setIsTopPlayedGamesListDescending] = useState(true)
  const [isTopHighestCompletionRateLessonsListDescending, setIsTopHighestCompletionRateLessonsListDescending] = useState(true)
  const [topPlayedLessons, setTopPlayedLessons] = useState([])
  const [topPlayedGames, setTopPlayedGames] = useState([])
  const [topHighestCompletionRateLessons, setTopHighestCompletionRateLessons] = useState([])
  const [distributionOfDyslexicCategories, setDistributionOfDyslexicCategories] = useState([])

	const localeSelectOpen = Boolean(localeSelectAnchorEl)

	const handleLocaleSelectClick = (event) => {
		setlocaleSelectAnchorEl(event.currentTarget)
	};
	const handleLocaleSelectClose = () => {
		setlocaleSelectAnchorEl(null)
	};

	React.useEffect(() => {
		if (user == null || user.role == "user") router.push("/")

		const getUserData = async () => {
			try {
				const userId = auth.currentUser.uid
				const doc = await db.collection('admins').doc(userId).get()

				if (doc.exists) {
          const userData = doc.data()
          setEmail(userData?.email || '')
				}
			} catch (error) {
				console.error('Error fetching user data:', error)
			}
		}

    const getTopPlayedLessons = async () => {
			try {
				const letterLessonsSnapshot = await db
        .collection("letters")
				.doc(isEnglish ? "en" : "ph")
				.collection("lessons")
				.get();
						const numberLessonsSnapshot = await db
				.collection("words")
				.doc(isEnglish ? "en" : "ph")
				.collection("lessons")
				.get();
						const wordLessonsSnapshot = await db
				.collection("numbers")
				.doc(isEnglish ? "en" : "ph")
				.collection("lessons")
				.get();
				// Add more snapshots for new lesson types

				const topPlayedLessonsData = []

				letterLessonsSnapshot.forEach((lessonDoc) => {
          const lessonData = lessonDoc.data()
          if (lessonData) {
            topPlayedLessonsData.push({
              lessonName: lessonData.name,
              lessonCounter: lessonData.counter ?? 0,
            })
          }
				})
				numberLessonsSnapshot.forEach((lessonDoc) => {
          const lessonData = lessonDoc.data()
          if (lessonData) {
            topPlayedLessonsData.push({
              lessonName: lessonData.name,
              lessonCounter: lessonData.counter ?? 0,
            })
          }
				})
				wordLessonsSnapshot.forEach((lessonDoc) => {
          const lessonData = lessonDoc.data()
          if (lessonData) {
            topPlayedLessonsData.push({
              lessonName: lessonData.name,
              lessonCounter: lessonData.counter ?? 0,
            })
          }
				})
				// Add more forEach on new lesson types

				// Sort lessonsData array by counter
				const sortedTopPlayedLessons = topPlayedLessonsData.sort(
          (a, b) =>
            (isTopPlayedLessonsListDescending ? b.lessonCounter - a.lessonCounter : a.lessonCounter - b.lessonCounter)
				)

				setTopPlayedLessons(sortedTopPlayedLessons)
			} catch (error) {
				console.error("Error fetching top lessons:", error)
			}
    };

    const getTopPlayedGames = async () => {
      try {
        const gamesCollection = await db.collection("games").get();
        const topPlayedGamesData = [];
    
        gamesCollection.forEach((gameDoc) => {
          const gameData = gameDoc.data();
          if (gameData) {
            topPlayedGamesData.push({
              gameName: gameData.name,
              gameCounter: gameData.counter ?? 0,
            });
          }
        });
    
        // Sort gamesData array by counter
        const sortedTopPlayedGames = topPlayedGamesData.sort((a, b) =>
          isTopPlayedGamesListDescending
            ? b.gameCounter - a.gameCounter
            : a.gameCounter - b.gameCounter
        );
    
        setTopPlayedGames(sortedTopPlayedGames);

        console.log(sortedTopPlayedGames)
      } catch (error) {
        console.error("Error fetching top games:", error);
      }
    };

    const getTopCompletedLessons = async () => {
      try {
        const lessonsSnapshot = await db
          .collection("letters")
          .doc(isEnglish ? "en" : "ph")
          .collection("lessons")
          .get();
    
        const topHighestCompletionRateLessonsData = [];
    
        lessonsSnapshot.forEach((lessonDoc) => {
          const lessonData = lessonDoc.data();
    
          if (lessonData) {
            const lessonCounter = lessonData.counter ?? 0;
            const startCounter = lessonData.startCounter ?? 0;
    
            // Calculate completion rate (percentage)
            const completionRate = startCounter !== 0 ? (startCounter / lessonCounter) * 100 : 0;
    
            topHighestCompletionRateLessonsData.push({
              lessonName: lessonData.name,
              completionRate,
            });
          }
        });
    
        // Sort lessonsData array by completion rate
        const sortedTopHighestCompletionRateLessons = topHighestCompletionRateLessonsData.sort(
          (a, b) =>
            isTopHighestCompletionRateLessonsListDescending
              ? b.completionRate - a.completionRate
              : a.completionRate - b.completionRate
        );
    
        setTopHighestCompletionRateLessons(sortedTopHighestCompletionRateLessons);
        console.log(sortedTopHighestCompletionRateLessons);
      } catch (error) {
        console.error("Error fetching top completed lessons:", error);
      }
    };

    const getDistributionOfDyslexics = async () => {
      try {
        const usersSnapshot = await db.collection("users").get();
    
        const distributionOfDyslexicCategories = {
          high: 0,
          moderate: 0,
          low: 0,
          nonDyslexic: 0,
        };
    
        usersSnapshot.forEach((userDoc) => {
          const userData = userDoc.data();
    
          if (userData && userData.dyslexiaScore !== undefined) {
            const dyslexiaScore = userData.dyslexiaScore;
    
            if (dyslexiaScore >= 12 && dyslexiaScore <= 14) {
              distributionOfDyslexicCategories.high += 1;
            } else if (dyslexiaScore >= 6 && dyslexiaScore <= 11) {
              distributionOfDyslexicCategories.moderate += 1;
            } else if (dyslexiaScore >= 1 && dyslexiaScore <= 5) {
              distributionOfDyslexicCategories.low += 1;
            } else if (dyslexiaScore === 0) {
              distributionOfDyslexicCategories.nonDyslexic += 1;
            }
          }
        });
    
        // Set the state variable with the distribution
        setDistributionOfDyslexicCategories(distributionOfDyslexicCategories);
        console.log(distributionOfDyslexicCategories);
      } catch (error) {
        console.error("Error fetching distribution of dyslexics:", error);
      }
    };

    getUserData()
		getTopPlayedLessons()
    getTopPlayedGames()
    getTopCompletedLessons()
    getDistributionOfDyslexics()
		// Disable loading after all data are fetched
		setIsLoading(false)
	}, [isEnglish,
      isTopPlayedLessonsListDescending,
      isTopPlayedGamesListDescending,
      isTopHighestCompletionRateLessonsListDescending,
      router,
      user]
  )

	return (
		<>
      {isLoading ? (
        <div className='h-screen w-screen flex justify-center items-center'>
          <CircularProgress />
        </div>
      ) : (
        <div>
          <AdminNavbar email={email} />
          <div className="m-5 mb-10 text-center md:text-left">
            <h1 className="text-5xl font-thin">Welcome</h1>
            <p className="text-xl font-bold">{email}!</p>
          </div>
          <div className="m-5 flex flex-col gap-3 items-stretch">
            <div className="flex flex-row justify-between">
              <Button
                id="locale-select"
                aria-controls={localeSelectOpen ? 'locale-select-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={localeSelectOpen ? 'true' : undefined}
                onClick={handleLocaleSelectClick}
                endIcon={
                  isEnglish ? (
                    <Image
                      alt="United States"
                      src={"http://purecatamphetamine.github.io/country-flag-icons/1x1/US.svg"}
                      width="22"
                      height="22"
                    />
                  ) : (
                    <Image
                      alt="Philippines"
                      src={"http://purecatamphetamine.github.io/country-flag-icons/1x1/PH.svg"}
                      width="22"
                      height="22"
                    />
                  )
                }
              >
                Lesson Category:
              </Button>
              <Menu
                id="locale-select-menu"
                anchorEl={localeSelectAnchorEl}
                open={localeSelectOpen}
                onClose={handleLocaleSelectClose}
                MenuListProps={{
                  'aria-labelledby': 'locale-select',
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleLocaleSelectClose();
                    setIsEnglish(true);
                  }}
                >
                  English
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleLocaleSelectClose();
                    setIsEnglish(false);
                  }}
                >
                  Filipino
                </MenuItem>
              </Menu>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 px-5 pb-5">
            <div className="flex flex-col gap-3 bg-white p-5 rounded-md shadow-xl">
              <div className="flex flex-row justify-between">
                <h2 className="text-xl">Most Played Lessons</h2>
                <Button
                  id="top-played-lessons-sort"
                  onClick={() => {
                    if (isTopPlayedLessonsListDescending) {
                      setIsTopPlayedLessonsListDescending(false);
                    } else {
                      setIsTopPlayedLessonsListDescending(true);
                    }
                  }}
                  endIcon={
                    isTopPlayedLessonsListDescending ? (
                      <ArrowDownwardRoundedIcon />
                    ) : (
                      <ArrowUpwardRoundedIcon />
                    )
                  }
                >
                  {isTopPlayedLessonsListDescending ? 'Descending' : 'Ascending'}
                </Button>
              </div>
              <div className="flex flex-col gap-3 flex-grow items-stretch justify-center">
                <TopPlayedChart
                  data={{
                    labels: topPlayedLessons.slice(0, 10).map((lesson) => lesson.lessonName),
                    datasets: [
                      {
                        data: topPlayedLessons.slice(0, 10).map((lesson) => lesson.lessonCounter),
                        label: 'Times played',
                        backgroundColor: '#334155',
                        borderRadius: 10,
                      },
                    ],
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 bg-white p-5 rounded-md shadow-xl">
              <div className="flex flex-row justify-between">
                <h2 className="text-xl">Most Played Games</h2>
                <Button
                  id="top-played-games-sort"
                  onClick={() => {
                    if (isTopPlayedGamesListDescending) {
                      setIsTopPlayedGamesListDescending(false);
                    } else {
                      setIsTopPlayedGamesListDescending(true);
                    }
                  }}
                  endIcon={
                    isTopPlayedGamesListDescending ? (
                      <ArrowDownwardRoundedIcon />
                    ) : (
                      <ArrowUpwardRoundedIcon />
                    )
                  }
                >
                  {isTopPlayedGamesListDescending ? 'Descending' : 'Ascending'}
                </Button>
              </div>
              <div className="flex flex-col gap-3 flex-grow items-stretch justify-center">
                <TopPlayedChart
                  data={{
                    labels: topPlayedGames.slice(0, 10).map((game) => game.gameName),
                    datasets: [
                      {
                        data: topPlayedGames.slice(0, 10).map((game) => game.gameCounter),
                        label: 'Times played',
                        backgroundColor: '#334155',
                        borderRadius: 10,
                      },
                    ],
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 bg-white p-5 rounded-md row-span-2 shadow-xl">
              <div className="flex flex-row justify-between">
                <h2 className="text-xl">Distribution of Dyslexics</h2>
              </div>
              <div className="flex flex-col gap-3 flex-grow items-stretch justify-center">
                <DistributionPieChart
                  data={{
                    labels: ['High Dyslexia', 'Moderate Dyslexia', 'Low Dyslexia', 'Non-Dyslexic'],
                    datasets: [
                      {
                        data: [
                          distributionOfDyslexicCategories.high,
                          distributionOfDyslexicCategories.moderate,
                          distributionOfDyslexicCategories.low,
                          distributionOfDyslexicCategories.nonDyslexic,
                        ],
                        backgroundColor: ['#334155', '#44403C', '#115E59', '#B45309'],
                        hoverBackgroundColor: ['#1E293B', '#292524', '#065F46', '#92400E'],
                      },
                    ],
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 bg-white p-5 rounded-md shadow-xl">
              <div className="flex flex-row justify-between">
                <h2 className="text-xl">Top Lessons by Completion Rate</h2>
                <Button
                  id="top-lessons-by-completion-rate-sort"
                  onClick={() => {
                    if (isTopHighestCompletionRateLessonsListDescending) {
                      setIsTopHighestCompletionRateLessonsListDescending(false);
                    } else {
                      setIsTopHighestCompletionRateLessonsListDescending(true);
                    }
                  }}
                  endIcon={
                    isTopHighestCompletionRateLessonsListDescending ? (
                      <ArrowDownwardRoundedIcon />
                    ) : (
                      <ArrowUpwardRoundedIcon />
                    )
                  }
                >
                  {isTopHighestCompletionRateLessonsListDescending ? 'Descending' : 'Ascending'}
                </Button>
              </div>
              <div className="flex flex-col gap-3 flex-grow items-stretch justify-center">
                <TopPlayedChart
                  data={{
                    labels: topHighestCompletionRateLessons.slice(0, 10).map((lesson) => lesson.lessonName),
                    datasets: [
                      {
                        data: topHighestCompletionRateLessons.slice(0, 10).map((lesson) => lesson.completionRate),
                        label: 'Completion Rate (%)',
                        backgroundColor: '#334155',
                        borderRadius: 10,
                      },
                    ],
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 bg-white p-5 rounded-md shadow-xl">
              <div className="flex flex-row justify-between">
                <h2 className="text-xl">User Trend History</h2>
              </div>
              <div className="flex flex-col gap-3 flex-grow items-stretch justify-center">
                <UserTrendsChart />
              </div>
            </div>
          </div>
        </div>
      )}
		</>
	)
}

export default Page