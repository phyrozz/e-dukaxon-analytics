'use client'
import React from "react";
import signUp from "@/firebase/auth/signup";
import { useRouter } from 'next/navigation'

function Page() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const router = useRouter()

    const handleForm = async (event) => {
        event.preventDefault()

        const { result, error } = await signUp(email, password);

        if (error) {
            return console.log(error)
        }

        // else successful
        console.log(result)
        return router.push("/admin/home")
    }
    return (<div className="flex w-screen h-screen justify-center items-center relative bg-slate-200">
        <div className="absolute top-5 left-5">
        <button type="button" className="border border-slate-700 hover:bg-slate-700 hover:text-slate-50 px-6 py-1 transition rounded-md" onClick={() => router.push('/')}>Back</button>
        </div>
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-center text-4xl pb-8">Create an account</h1>
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
                    <button type="submit" className="border border-slate-700 hover:bg-slate-700 hover:text-slate-50 px-6 py-1 transition rounded-md">Sign up</button>
                </div>
            </form>
        </div>
    </div>);
}

export default Page;