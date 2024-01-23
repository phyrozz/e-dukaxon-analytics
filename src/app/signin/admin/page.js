'use client'
import { useState } from "react"
import signIn from "@/firebase/auth/signin"
import { useRouter } from 'next/navigation'
import { db, auth } from "@/firebase/config"
import { Button, CircularProgress, FilledInput, InputAdornment, IconButton, FormControl, InputLabel, FormHelperText } from "@mui/material"
import { Visibility, VisibilityOff, ArrowForwardRounded, ArrowBackRounded } from "@mui/icons-material"

function Page() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
	const [isEmailInvalid, setIsEmailInvalid] = useState(false)
	const [isPasswordInvalid, setIsPasswordInvalid] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleForm = async (event) => {
			event.preventDefault()
			setLoading(true)

			// Check if the user exists in the "admins" collection
			const isAdmin = await checkAdmin(email);

			if (isAdmin) {
				await signIn(email, password)
				setLoading(false)
				return router.push("/admin/home");
			} else {
				// User is not an admin
				setLoading(false)
				setIsEmailInvalid(true)
				setIsPasswordInvalid(true)
				setErrorMessage("Invalid admin account. Cannot sign in.")
			}
    }

		// Function to check if the user is an admin
		const checkAdmin = async (email) => {
			try {
					const adminSnapshot = await db.collection('admins').where('email', '==', email).get();
					return !adminSnapshot.empty;
			} catch (error) {
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
        <h1 className="text-center text-3xl pb-8">Sign in as Admin</h1>
        <form onSubmit={handleForm} className="form flex flex-col gap-2 w-full">
            <FormControl variant="filled">
                <InputLabel htmlFor="email">Email</InputLabel>
                <FilledInput 
					error={isEmailInvalid ? true : false}
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
					error={isPasswordInvalid ? true : false}
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
		<div>
			<Button onClick={() => router.push("../signup/admin")}>
				Create an account
			</Button>
		</div>
    </div>
	
</div>);
}

export default Page