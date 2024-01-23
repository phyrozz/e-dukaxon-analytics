'use client'
import { useState } from "react"
import signUp from "@/firebase/auth/signup"
import { useRouter } from 'next/navigation'
import { db } from "@/firebase/config"
import firebase from "firebase/compat/app"
import { Button, CircularProgress, FilledInput, InputAdornment, IconButton, FormControl, InputLabel, FormHelperText } from "@mui/material"
import { Visibility, VisibilityOff, ArrowForwardRounded, ArrowBackRounded } from "@mui/icons-material"

function Page() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [isEmailInvalid, setIsEmailInvalid] = useState(false)
    const [isPasswordInvalid, setIsPasswordInvalid] = useState(false)
    const [isConfirmPasswordInvalid, setIsConfirmPasswordInvalid] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleForm = async (event) => {
        event.preventDefault();
        setLoading(true);

        // Check if the email already exists in the "admins" collection
        const isAdmin = await checkAdmin(email);

        if (isAdmin) {
            // Admin account already exists
            setLoading(false);
            setIsEmailInvalid(true);
            setIsPasswordInvalid(true);
            setErrorMessage("Admin account already exists.");
        } else if (password !== confirmPassword) {
            // Passwords do not match
            setLoading(false);
            setIsConfirmPasswordInvalid(true);
            setErrorMessage("Passwords do not match.");
        } else {
            try {
                // User is not an admin, and passwords match
                const authResult = await signUp(email, password);
                const userId = authResult.result.user.uid
    
                await db.collection('admins').doc(userId).set({
                    email: email,
                    accountCreatedAt: firebase.firestore.Timestamp.now(),
                });
    
                return router.push("/admin/home");
            } catch (error) {
                console.error('Error creating admin account:', error);
                setLoading(false);
                setErrorMessage('Error creating admin account. Please try again.');
            }
        }
    }

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
        <h1 className="text-center text-3xl pb-8">Create an Admin Account</h1>
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
            <FormControl variant="filled">
                <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
                <FilledInput 
					error={isConfirmPasswordInvalid ? true : false}
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    autoComplete="on"
                    required
                    fullWidth
                />
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