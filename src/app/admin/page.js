'use client'
import React from "react"
import { useState } from "react"
import { useAuthContext } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { db } from "@/firebase/config"
import { auth } from "@/firebase/config"
import LessonProgressCard from "./LessonProgressCard"
import { Button, Menu, MenuItem } from "@mui/material"
import Image from "next/image"
import TopLessonsCard from "./TopLessonsCard"

function Page() {
	const { user } = useAuthContext()
	const router = useRouter()
	const [localeSelectAnchorEl, setlocaleSelectAnchorEl] = useState(null)

	const [email, setEmail] = useState("")
	const [letterProgress, setLetterProgress] = useState(0)
	const [numberProgress, setNumberProgress] = useState(0)
	const [wordProgress, setWordProgress] = useState(0)
	const [isParent, setIsParent] = useState(false)
	const [isEnglish, setIsEnglish] = useState(true)

	const localeSelectOpen = Boolean(localeSelectAnchorEl);

	const handleLocaleSelectClick = (event) => {
    setlocaleSelectAnchorEl(event.currentTarget);
  };
  const handleLocaleSelectClose = () => {
    setlocaleSelectAnchorEl(null);
  };

	React.useEffect(() => {
		if (user == null) router.push("/")

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
          const lessonData = lessonDoc.data();
          if (lessonData && lessonData.progress) {
            totalProgress += lessonData.progress;
          }
        });

        const average = (totalProgress / totalLessonCount) * 100;
        setProgress(average);
      } catch (error) {
        console.error("Error fetching lesson progress:", error);
      }
    }

		getUserData()
		getProgress(setLetterProgress, isEnglish ? "en" : "ph", "letters")
		getProgress(setNumberProgress, isEnglish ? "en" : "ph", "numbers")
		getProgress(setWordProgress, isEnglish ? "en" : "ph", "words")
		// Add more getProgress for new lesson types
	}, [isEnglish, router, user])

	return (
		<>
			<Navbar />
			<div className="m-5 mb-10">
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
						{isEnglish ? "English" : "Filipino"}
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
					</div>
					<div className="flex flex-col gap-3">
						<TopLessonsCard lessonName="Aa" accuracy={100} rank={1}/>
						<TopLessonsCard lessonName="Mga Hayop" accuracy={100} rank={2}/>
						<TopLessonsCard lessonName="Dd" accuracy={99} rank={3}/>
						<TopLessonsCard lessonName="Mm" accuracy={93} rank={4}/>
						<TopLessonsCard lessonName="2" accuracy={93} rank={5}/>
						<TopLessonsCard lessonName="Gg" accuracy={90} rank={6}/>
						<TopLessonsCard lessonName="Ww" accuracy={89} rank={7}/>
						<TopLessonsCard lessonName="-ng" accuracy={87} rank={8}/>
						<TopLessonsCard lessonName="Mga" accuracy={85} rank={9}/>
						<TopLessonsCard lessonName="Bb" accuracy={85} rank={10}/>
					</div>
				</div>
				<div className="m-5 mt-10 flex flex-col gap-3 items-stretch">
					<div className="flex flex-row justify-between">
						<h2 className="text-xl">{isParent ? "Your Child's Top Lessons" : "Your Top Lessons"}</h2>
					</div>
					<div className="flex flex-col gap-3">
						<TopLessonsCard lessonName="Aa" accuracy={100} rank={1}/>
						<TopLessonsCard lessonName="Mga Hayop" accuracy={100} rank={2}/>
						<TopLessonsCard lessonName="Dd" accuracy={99} rank={3}/>
						<TopLessonsCard lessonName="Mm" accuracy={93} rank={4}/>
						<TopLessonsCard lessonName="2" accuracy={93} rank={5}/>
						<TopLessonsCard lessonName="Gg" accuracy={90} rank={6}/>
						<TopLessonsCard lessonName="Ww" accuracy={89} rank={7}/>
						<TopLessonsCard lessonName="-ng" accuracy={87} rank={8}/>
						<TopLessonsCard lessonName="Mga" accuracy={85} rank={9}/>
						<TopLessonsCard lessonName="Bb" accuracy={85} rank={10}/>
					</div>
				</div>
			</div>
			
		</>
	);
}

export default Page