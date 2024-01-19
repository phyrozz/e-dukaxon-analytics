'use client'
import './globals.css'
import { AuthContextProvider } from '@/context/AuthContext'
import ProgressBarProvider from '@/context/ProgressBarContext'
import { createTheme, ThemeProvider } from '@mui/material'

const { palette } = createTheme()
const { augmentColor } = palette
const createColor = (mainColor) => augmentColor({color: {main: mainColor}});

const theme = createTheme({
  palette: {
    primary: createColor("#1E293B"),
    secondary: createColor("#334155"),
  }
})


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className='bg-slate-200'>
        <ThemeProvider theme={theme}>
          <ProgressBarProvider>
            <AuthContextProvider>
                {children}
            </AuthContextProvider>
          </ProgressBarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}