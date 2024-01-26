"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { db, auth } from "@/firebase/config";
import Navbar from "@/components/Navbar";
import LessonList from "./LessonList";
import { Button, Menu, MenuItem } from "@mui/material";
import Image from "next/image"

function Page() {
	const { user } = useAuthContext()
	const router = useRouter()

	const [email, setEmail] = useState("")
	const [isParent, setIsParent] = useState(false)
	const [isEnglish, setIsEnglish] = useState(true)

	const [localeSelectAnchorEl, setlocaleSelectAnchorEl] = useState(null)
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

		getUserData()
	}, [router, user])

	return (
		<>
			<Navbar email={email} />
			<div className="m-5">
				<h1 className="text-4xl font-thin">{isParent ? "My Child's Lessons" : "My Lessons"}</h1>
			</div>
			<div className="m-5 mb-10">
				<div className="flex flex-row justify-end w-full mb-5">
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
				<LessonList 
					ariaControls="letter-lessons-content" 
					id="letter-lessons-header" 
					lessonType={"letters"}
					headerText="Letters" 
					locale={isEnglish ? "en" : "ph"} 
				/>
				<LessonList 
					ariaControls="number-lessons-content" 
					id="number-lessons-header" 
					lessonType={"numbers"}
					headerText="Numbers" 
					locale={isEnglish ? "en" : "ph"} 
				/>
				<LessonList 
					ariaControls="word-lessons-content" 
					id="word-lessons-header" 
					lessonType={"words"}
					headerText="Words" 
					locale={isEnglish ? "en" : "ph"} 
				/>
			</div>
		</>
	)
}

export default Page