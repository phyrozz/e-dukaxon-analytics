"use client"
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@mui/material";
import { ArrowForwardRounded } from "@mui/icons-material";
import { useAuthContext } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuthContext()
  const router = useRouter()

  React.useEffect(() => {
    if (user == null) {
      router.push("/")
    } else if (user.role === "user") {
      router.push("/home")
    } else if (user.role === "admin") {
      router.push("/admin/home")
    }
  }, [router, user])

  return (
    <>
    <div className='flex flex-col justify-center items-start h-screen ml-3'>
      <div className="flex flex-col items-start py-8">
        <h1 className="text-5xl pb-2">eDukaxon</h1>
        <p className="text-xl">For Parents and Admin</p>
      </div>
      <p className="pt-4 font-bold pb-2">Get started by signing in</p>
      <Button variant="outlined" onClick={() => router.push('/signin')}>
        <ArrowForwardRounded />
      </Button>
      <p className="absolute bottom-0 left-0 m-3">Are you an admin? <a className="hover:font-bold transition-all underline underline-offset-2" href="#" onClick={() => router.push('/signin/admin')}>Sign in here</a></p>
    </div>
    </>
  )
}
