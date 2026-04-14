import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ChatScreen from './pages/ChatScreen'
import SideBar from './components/SideBar'

export default function App() {
  return (
    <div className='h-screen flex flex-col md:flex-row'>
      <SideBar />
      <div className='flex-1'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatScreen />} />
          <Route path="/chat/:id" element={<ChatScreen />} />
        </Routes>
      </div>
    </div>
  )
}