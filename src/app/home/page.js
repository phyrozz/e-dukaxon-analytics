'use client'
import React from "react"
import { useState } from "react"
import { useAuthContext } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
// import Navbar from "@/components/Navbar"
// import logOut from "@/firebase/auth/signout"
import { db } from "@/firebase/config"
import { auth } from "@/firebase/config"
import LessonProgressCard from "./LessonProgressCard"
import { Button, Menu, MenuItem, CircularProgress } from "@mui/material"
import Image from "next/image"
import TopLessonsCard from "./TopLessonsCard"
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import TopPlayedLessonsChart from "./topPlayedLessonsChart"
import Navbar from "@/components/Navbar"

function Page() {
	const { user } = useAuthContext()
	const router = useRouter()
	const [localeSelectAnchorEl, setlocaleSelectAnchorEl] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [email, setEmail] = useState("")
	const [letterProgress, setLetterProgress] = useState(0)
	const [numberProgress, setNumberProgress] = useState(0)
	const [wordProgress, setWordProgress] = useState(0)
	
	const [isParent, setIsParent] = useState(false)
	const [isEnglish, setIsEnglish] = useState(true)
	const [isTopLessonsListDescending, setIsTopLessonsListDescending] = useState(true)
	const [isTopPlayedLessonsListDescending, setIsTopPlayedLessonsListDescending] = useState(true)
	const [topLessons, setTopLessons] = useState([])
	const [topPlayedLessons, setTopPlayedLessons] = useState([])

	const localeSelectOpen = Boolean(localeSelectAnchorEl)

	const handleLocaleSelectClick = (event) => {
		setlocaleSelectAnchorEl(event.currentTarget)
	};
	const handleLocaleSelectClose = () => {
		setlocaleSelectAnchorEl(null)
	};

	React.useEffect(() => {
		if (user == null || user.role === "admin") router.push("/")

		const getUserData = async () => {
			try {
				const userId = auth.currentUser.uid
				const doc = await db.collection('users').doc(userId).get()

				if (doc.exists) {
          const userData = doc.data()
          setEmail(userData?.email || '')
          setIsParent(userData?.isParent || false)
				}
			} catch (error) {
				console.error('Error fetching user data:', error)
			}
		}

		const getProgress = async (setProgress, locale, lessonType) => {
			try {
				const userId = auth.currentUser.uid;
				const lessonsSnapshot = await db
				.collection("users")
				.doc(userId)
				.collection(lessonType)
				.doc(locale)
				.collection("lessons")
				.get();

				let totalProgress = 0
						let totalLessonCount = lessonsSnapshot.size * 100

				lessonsSnapshot.forEach((lessonDoc) => {
				const lessonData = lessonDoc.data()
				if (lessonData && lessonData.progress) {
					totalProgress += lessonData.progress
				}
				})

				const average = (totalProgress / totalLessonCount) * 100
				setProgress(average)
			} catch (error) {
				console.error("Error fetching lesson progress:", error)
			}
		}

		const getTopandTopPlayedLessons = async () => {
			try {
				const userId = auth.currentUser.uid;
				const letterLessonsSnapshot = await db
				.collection("users")
				.doc(userId)
				.collection("letters")
				.doc(isEnglish ? "en" : "ph")
				.collection("lessons")
				.get();
						const numberLessonsSnapshot = await db
				.collection("users")
				.doc(userId)
				.collection("words")
				.doc(isEnglish ? "en" : "ph")
				.collection("lessons")
				.get();
						const wordLessonsSnapshot = await db
				.collection("users")
				.doc(userId)
				.collection("numbers")
				.doc(isEnglish ? "en" : "ph")
				.collection("lessons")
				.get();
						// Add more snapshots for new lesson types

				const topLessonsData = []
						const topPlayedLessonsData = []

				letterLessonsSnapshot.forEach((lessonDoc) => {
				const lessonData = lessonDoc.data()
				if (lessonData) {
					const accuracy =
					(lessonData.accumulatedScore /
						(lessonData.lessonTaken * lessonData.total)) *
					100
								topLessonsData.push({
									lessonName: lessonData.name,
									accuracy: isNaN(accuracy) ? 0 : accuracy,
								})
								topPlayedLessonsData.push({
									lessonName: lessonData.name,
									lessonTaken: lessonData.lessonTaken,
								})
				}
				})
						numberLessonsSnapshot.forEach((lessonDoc) => {
				const lessonData = lessonDoc.data()
				if (lessonData) {
					const accuracy =
					(lessonData.accumulatedScore /
						(lessonData.lessonTaken * lessonData.total)) *
					100
								topLessonsData.push({
									lessonName: lessonData.name,
									accuracy: isNaN(accuracy) ? 0 : accuracy,
								})
								topPlayedLessonsData.push({
									lessonName: lessonData.name,
									lessonTaken: lessonData.lessonTaken,
								})
				}
				})
						wordLessonsSnapshot.forEach((lessonDoc) => {
				const lessonData = lessonDoc.data()
				if (lessonData) {
					const accuracy =
					(lessonData.accumulatedScore /
						(lessonData.lessonTaken * lessonData.total)) *
					100
								topLessonsData.push({
									lessonName: lessonData.name,
									accuracy: isNaN(accuracy) ? 0 : accuracy,
								})
								topPlayedLessonsData.push({
									lessonName: lessonData.name,
									lessonTaken: lessonData.lessonTaken,
								})
				}
				})
						// Add more forEach on new lesson types

				// Sort lessonsData array by accuracy
				const sortedTopLessons = topLessonsData.sort(
				(a, b) =>
					(isTopLessonsListDescending ? b.accuracy - a.accuracy : a.accuracy - b.accuracy)
				)
						const sortedTopPlayedLessons = topPlayedLessonsData.sort(
				(a, b) =>
					(isTopPlayedLessonsListDescending ? b.lessonTaken - a.lessonTaken : a.lessonTaken - b.lessonTaken)
				)

				setTopLessons(sortedTopLessons)
						setTopPlayedLessons(sortedTopPlayedLessons)
			} catch (error) {
				console.error("Error fetching top lessons:", error)
			}
    	};

		getUserData()
		getTopandTopPlayedLessons()
		getProgress(setLetterProgress, isEnglish ? "en" : "ph", "letters")
		getProgress(setNumberProgress, isEnglish ? "en" : "ph", "numbers")
		getProgress(setWordProgress, isEnglish ? "en" : "ph", "words")
		// Add more getProgress for new lesson types

		// Disable loading after all data are fetched
		setIsLoading(false)
	}, [isEnglish, isTopLessonsListDescending, isTopPlayedLessonsListDescending, router, user])

	return (
		<>
			{isLoading ? <div className='h-screen w-screen flex justify-center items-center'><CircularProgress /></div> : 
				<div>
					<Navbar email={email} />
					<div className="m-5 mb-10 text-center md:text-left">
						<h1 className="text-5xl font-thin">Welcome</h1>
						<p className="text-xl font-bold">{email}!</p>
					</div>
					<div className="m-5 flex flex-col gap-3 items-stretch">
						<div className="flex flex-row justify-between">
							<h2 className="text-xl">{isParent ? "Your child's lesson progress" : "Your Lesson Progress"}</h2>
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
						<div className="flex flex-row gap-3 flex-wrap justify-center md:justify-start">
							<LessonProgressCard name="Letters" progress={letterProgress} />
							<LessonProgressCard name="Numbers" progress={numberProgress} />
							<LessonProgressCard name="Words" progress={wordProgress} />
						</div>
					</div>
					<div className="grid lg:grid-cols-2 grid-cols-1">
						<div className="m-5 mt-10 flex flex-col gap-3 items-stretch">
							<div className="flex flex-row justify-between">
								<h2 className="text-xl">{isParent ? "Your Child's Top Lessons" : "Your Top Lessons"}</h2>
								<Button 
									id="top-lessons-sort"
									onClick={() => {
										if (isTopLessonsListDescending) {
											setIsTopLessonsListDescending(false)
										} else {
											setIsTopLessonsListDescending(true)
										}
									}}
									endIcon={isTopLessonsListDescending ? <ArrowDownwardRoundedIcon /> : <ArrowUpwardRoundedIcon />}
								>
									{isTopLessonsListDescending ? "Descending" : "Ascending"}
								</Button>
							</div>
							<div className="flex flex-col gap-3">
							{topLessons.slice(0, 10).map((lesson, index) => (
								<TopLessonsCard
									key={index}
									lessonName={lesson.lessonName}
									hasSubtext={true}
									subtext="Accuracy"
									value={Math.round(lesson.accuracy * 100)/100 + "%"}
									rank={index + 1}
								/>
							))}
							</div>
						</div>
						<div className="m-5 mt-10 flex flex-col gap-3 items-stretch">
							<div className="flex flex-row justify-between">
								<h2 className="text-xl">{isParent ? "Your Child's Top Played Lessons" : "Your Top Played Lessons"}</h2>
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
								<TopPlayedLessonsChart 
									data={{
										labels: topPlayedLessons.slice(0, 10).map((lesson, index) => lesson.lessonName),
										datasets: [{
											data: topPlayedLessons.slice(0, 10).map((lesson) => lesson.lessonTaken),
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
	);
}

export default Page