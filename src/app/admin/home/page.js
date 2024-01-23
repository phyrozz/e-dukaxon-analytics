"use client"
import React from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/firebase/config"
import { useAuthContext } from "@/context/AuthContext"
import { useState } from "react"
import AdminNavbar from "@/components/AdminNavbar"


function Page() {
	const { user } = useAuthContext()
	const router = useRouter()
	const [email, setEmail] = useState("")

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

		getUserData()
	}, [router, user])

	return (
		<>
			<AdminNavbar email={email} />
			
		</>
	)
}

export default Page