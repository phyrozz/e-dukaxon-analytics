"use client"
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import { ArrowForwardRounded } from "@mui/icons-material";

export default function Home() {
  const router = useRouter()

  return (
    <>
    <div className='flex flex-col justify-center items-start h-screen ml-3'>
      <div className="flex flex-row items-end py-8">
        <h1 className="text-5xl pb-2">eDukaxon</h1>
        <p className="text-xl">For Parents</p>
      </div>
      <p className="pt-4 font-bold pb-2">Get started by signing in</p>
      <Button variant="outlined" onClick={() => router.push('/signin')}>
        <ArrowForwardRounded />
      </Button>
      <p className="absolute bottom-0 left-0 m-3">Are you an admin? <a className="hover:font-bold transition-all underline underline-offset-2" href="#" onClick={() => router.push('/signin')}>Sign in here</a></p>
    </div>
    </>
  )
}
