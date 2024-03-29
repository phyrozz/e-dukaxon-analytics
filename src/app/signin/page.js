'use client'
import React, { useState } from "react"
import signIn from "@/firebase/auth/signin"
import { useRouter } from 'next/navigation'
import { db } from "@/firebase/config"
import { Button, CircularProgress, FilledInput, InputAdornment, IconButton, FormControl, InputLabel, FormHelperText } from "@mui/material"
import { Visibility, VisibilityOff, ArrowForwardRounded, ArrowBackRounded } from "@mui/icons-material"

function Page() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [showPassword, setShowPassword] = React.useState(false);
    const [isEmailInvalid, setIsEmailInvalid] = useState(false)
    const [isPasswordInvalid, setIsPasswordInvalid] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleForm = async (event) => {
        event.preventDefault();
        setLoading(true);

        // Check if the email exists in the "users" collection
        const isEmailRegistered = await checkEmailRegistered(email);

        if (!isEmailRegistered) {
            setLoading(false);
            setIsEmailInvalid(true);
            setErrorMessage("Account does not exist. Please create one on the app.");
        } else {
            const { result, error } = await signIn(email, password);

            setLoading(false);

            if (error) {
                console.error(error);
                setIsPasswordInvalid(true);
                setErrorMessage("Invalid password. Please try again.");
            } else {
                console.log(result);
                router.push("/home");
            }
        }
    };

    const checkEmailRegistered = async (email) => {
        try {
            const usersSnapshot = await db.collection('users').where('email', '==', email).get();
            return !usersSnapshot.empty;
        } catch (error) {
            console.error('Error checking email registration:', error);
            return false;
        }
    };

    return (<div className="flex w-screen h-screen justify-center items-center relative bg-slate-200">
    <div className="absolute top-5 left-5">
        <Button onClick={() => router.back()}>
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
				{isEmailInvalid ? <FormHelperText error>Invalid email</FormHelperText> : null}
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
				{isPasswordInvalid ? <FormHelperText error>Invalid password</FormHelperText> : null}
            </FormControl>
            <p className="text-red-600 font-bold text-sm text-center">{errorMessage}</p>
            <div className="flex justify-end items-center mt-4">
                <Button type="submit" variant="outlined" color="primary" disabled={loading ? true : false}>{loading ? <CircularProgress size={20} /> : <ArrowForwardRounded />}</Button>
            </div>
        </form>
    </div>
</div>);
}

export default Page