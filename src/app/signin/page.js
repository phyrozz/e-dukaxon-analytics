'use client'
import React, { useState } from "react"
import signIn from "@/firebase/auth/signin"
import { useRouter } from 'next/navigation'
import { Button, CircularProgress, FilledInput, InputAdornment, IconButton, FormControl, InputLabel } from "@mui/material"
import { Visibility, VisibilityOff, ArrowForwardRounded, ArrowBackRounded } from "@mui/icons-material"

function Page() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

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
        <Button onClick={() => router.push('/')}>
            <ArrowBackRounded /> Back
        </Button>
    </div>
    <div className="flex flex-col justify-center items-center w-96">
        <h1 className="text-center text-4xl pb-8">Sign in</h1>
        <form onSubmit={handleForm} className="form flex flex-col gap-2 w-full">
            <FormControl variant="filled">
                <InputLabel htmlFor="email">Email</InputLabel>
                <FilledInput 
                    id="email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)} 
                    autoComplete="on"
                    required
                    fullWidth
                />
            </FormControl>
            <FormControl variant="filled">
                <InputLabel htmlFor="password">Password</InputLabel>
                <FilledInput 
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => setPassword(e.target.value)} 
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    autoComplete="on"
                    required
                    fullWidth
                />
            </FormControl>
            <div className="flex justify-end items-center mt-4">
                <Button type="submit" variant="outlined" color="primary" disabled={loading ? true : false}>{loading ? <CircularProgress size={20} /> : <ArrowForwardRounded />}</Button>
            </div>
        </form>
    </div>
</div>);
}

export default Page