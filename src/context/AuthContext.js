import React from 'react';
import {
    onAuthStateChanged,
    getAuth,
} from 'firebase/auth';
import { firebase_app, db } from '@/firebase/config';
import { CircularProgress } from '@mui/material';

const auth = getAuth(firebase_app);

export const AuthContext = React.createContext({});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({
    children,
}) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                try {
                    const userDoc = await db.collection('users').doc(authUser.uid).get();
                    const adminDoc = await db.collection('admins').doc(authUser.uid).get();

                    if (userDoc.exists) {
                        setUser({ ...authUser, role: 'user' });
                    } else if (adminDoc.exists) {
                        setUser({ ...authUser, role: 'admin' });
                    } else {
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {loading ? <div className='h-screen w-screen flex justify-center items-center'><CircularProgress /></div> : children}
        </AuthContext.Provider>
    );
};
