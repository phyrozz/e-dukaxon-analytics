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


function Page() {
	const { user } = useAuthContext()
	const router = useRouter()
	const [localeSelectAnchorEl, setlocaleSelectAnchorEl] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [email, setEmail] = useState("")
	
	const [isEnglish, setIsEnglish] = useState(true)
	const [isTopPlayedLessonsListDescending, setIsTopPlayedLessonsListDescending] = useState(true)
	const [isTopPlayedGamesListDescending, setIsTopPlayedGamesListDescending] = useState(true)
  const [topPlayedLessons, setTopPlayedLessons] = useState([])
  const [topPlayedGames, setTopPlayedGames] = useState([])

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
    

    getUserData()
		getTopPlayedLessons()
    getTopPlayedGames()
		// Disable loading after all data are fetched
		setIsLoading(false)
	}, [isEnglish, isTopPlayedLessonsListDescending, isTopPlayedGamesListDescending, router, user])

	return (
		<>
      {isLoading ? <div className='h-screen w-screen flex justify-center items-center'><CircularProgress /></div> : 
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
                endIcon={isEnglish ? <Image alt="United States" src={"http://purecatamphetamine.github.io/country-flag-icons/1x1/US.svg"} width="22" height="22"/> 
                : <Image alt="Philippines" src={"http://purecatamphetamine.github.io/country-flag-icons/1x1/PH.svg"} width="22" height="22"/>}
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
                <MenuItem onClick={() => {
                  handleLocaleSelectClose()
                  setIsEnglish(true)
                }}>English</MenuItem>
                <MenuItem onClick={() => {
                  handleLocaleSelectClose()
                  setIsEnglish(false)
                }}>Filipino</MenuItem>
              </Menu>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1">
            <div className="m-5 mt-10 flex flex-col gap-3 items-stretch">
              <div className="flex flex-row justify-between">
                <h2 className="text-xl">Most Played Lessons</h2>
                <Button 
                  id="top-played-lessons-sort"
                  onClick={() => {
                    if (isTopPlayedLessonsListDescending) {
                      setIsTopPlayedLessonsListDescending(false)
                    } else {
                      setIsTopPlayedLessonsListDescending(true)
                    }
                  }}
                  endIcon={isTopPlayedLessonsListDescending ? <ArrowDownwardRoundedIcon /> : <ArrowUpwardRoundedIcon />}
                >
                  {isTopPlayedLessonsListDescending ? "Descending" : "Ascending"}
                </Button>
              </div>
              <div className="flex flex-col gap-3">
              <TopPlayedChart 
                data={{
                  labels: topPlayedLessons.slice(0, 10).map((lesson, index) => lesson.lessonName),
                  datasets: [{
                    data: topPlayedLessons.slice(0, 10).map((lesson) => lesson.lessonCounter),
                      label: "Times played",
                      backgroundColor: "#334155",
                      borderRadius: 5,
                  },]
                }}
              
                />
              </div>
            </div>
            <div className="m-5 mt-10 flex flex-col gap-3 items-stretch">
              <div className="flex flex-row justify-between">
                <h2 className="text-xl">Most Played Games</h2>
                <Button 
                  id="top-played-games-sort"
                  onClick={() => {
                    if (isTopPlayedGamesListDescending) {
                      setIsTopPlayedGamesListDescending(false)
                    } else {
                      setIsTopPlayedGamesListDescending(true)
                    }
                  }}
                  endIcon={isTopPlayedGamesListDescending ? <ArrowDownwardRoundedIcon /> : <ArrowUpwardRoundedIcon />}
                >
                  {isTopPlayedGamesListDescending ? "Descending" : "Ascending"}
                </Button>
              </div>
              <div className="flex flex-col gap-3">
                <TopPlayedChart 
                  data={{
                    labels: topPlayedGames.slice(0, 10).map((game, index) => game.gameName),
                    datasets: [{
                      data: topPlayedGames.slice(0, 10).map((game) => game.gameCounter),
                        label: "Times played",
                        backgroundColor: "#334155",
                        borderRadius: 5,
                    },]
                  }}
                  
                />
              </div>
            </div>
          </div>
        </div>
      }
		</>
	)
}

export default Page