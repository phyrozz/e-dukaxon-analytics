'use client'
import React, { useState } from "react"
import signIn from "@/firebase/auth/signin"
import { useRouter } from 'next/navigation'
import { Button, CircularProgress } from "@mui/material"

function Page() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleForm = async (event) => {
        event.preventDefault()
        setLoading(true)

        const { result, error } = await signIn(email, password)

        setLoading(false)

        if (error) {
            return console.log(error)
        }

        // else successful
        console.log(result)
        return router.push("/admin")
    }
    return (<div className="flex w-screen h-screen justify-center items-center relative bg-slate-200">
    <div className="absolute top-5 left-5">
    <button type="button" className="border border-slate-700 hover:bg-slate-700 hover:text-slate-50 px-6 py-1 transition rounded-md" onClick={() => router.push('/')}>Back</button>
    </div>
    <div className="flex flex-col justify-center items-center">
        <h1 className="text-center text-4xl pb-8">Sign in</h1>
        <form onSubmit={handleForm} className="form flex flex-col gap-2">
            <label htmlFor="email">
                <p>Email</p>
                <input className="px-1 py-1 border border-slate-700 rounded-md" onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email" placeholder="example@mail.com" autoComplete="on" />
            </label>
            <label htmlFor="password">
                <p>Password</p>
                <input className="px-1 py-1 border border-slate-700 rounded-md" onChange={(e) => setPassword(e.target.value)} required type="password" name="password" id="password" placeholder="password" autoComplete="on" />
            </label>
            <div className="flex justify-center items-center mt-4">
                <Button type="submit" variant="contained" color="primary" disabled={loading ? true : false}>{loading ? <CircularProgress size={20} /> : "Sign in"}</Button>
            </div>
        </form>
    </div>
</div>);
}

export default Page