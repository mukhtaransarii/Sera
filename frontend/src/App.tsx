import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Home from './pages/Home'
import HomeReset from './pages/HomeReset'
import ChatScreen from './pages/ChatScreen'
import SideBar from './components/SideBar'
import { useAuth } from './context/useAuth'

export default function App() {
  const { user, me, loading } = useAuth()
  const location = useLocation() 
  const hasVisited = localStorage.getItem("hasVisited")

  useEffect(() => {
    me().then(() => {
      const user = useAuth.getState().user
      if (!user && !localStorage.getItem('guestId')) {
        localStorage.setItem('guestId', crypto.randomUUID())
      }
    })
  }, [])
  
  if (loading) return null  // loading
  console.log(user)

  return (
    <div className='h-screen flex flex-col md:flex-row'>
      {location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup' && <SideBar />}

      <div className='flex-1'>
        <Routes>
            {/* always accessible */}
            <Route path="/" element={hasVisited ? <Navigate to="/chat" /> : <Home />} />
            <Route path="/home" element={<HomeReset />} />

            {user ? (
              // logged in routes
              <>
                <Route path="/chat" element={<ChatScreen />} />
                <Route path="/chat/:id" element={<ChatScreen />} />
                <Route path="/login" element={<Navigate to="/chat" replace />} />
                <Route path="/signup" element={<Navigate to="/chat" replace />} />
              </>
            ) : (
              // guest routes
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                {/* <Route path="/chat" element={<Navigate to="/login" replace />} />
                <Route path="/chat/:id" element={<Navigate to="/login" replace />} /> */}
                <Route path="/chat" element={<ChatScreen />} />
                <Route path="/chat/:id" element={<ChatScreen />} />
              </>
            )}
        </Routes>
      </div>
    </div>
  )
}