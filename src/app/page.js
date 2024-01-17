"use client"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()

  return (
    <>
    <div className='flex flex-col justify-center items-start h-screen ml-3'>
      <div className="flex flex-row items-end py-8">
        <h1 className="text-5xl pb-2">eDukaxon</h1>
        <p className="text-xl">For Parents</p>
      </div>
      <p className="pt-4 font-bold pb-2">Get started by creating an account</p>
      <button type="button" className="border border-slate-700 hover:bg-slate-700 hover:text-slate-50 px-6 py-1 transition rounded-md" onClick={() => router.push('/signup')}>Sign up</button>
      <p className="absolute bottom-0 left-0 m-3">Already have an account? <a className="hover:font-bold transition-all underline underline-offset-2" href="#" onClick={() => router.push('/signin')}>Sign in</a></p>
    </div>
    </>
  )
}
