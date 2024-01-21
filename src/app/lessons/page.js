"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { db, auth } from "@/firebase/config";
import Navbar from "@/components/Navbar";

function Page() {
	const { user } = useAuthContext()
	const [email, setEmail] = useState("")

	const router = useRouter()

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

		getUserData()
	}, [router, user])

	return (
		<>
			<Navbar email={email} />
			<div className="m-5">
				<h1 className="text-5xl font-thin">My Lessons</h1>
			</div>
		</>
	)
}

export default Page