import { useState } from "react"
import { useAuth } from "../context/useAuth"
import { useNavigate } from "react-router-dom"
import { MessageCircle } from "lucide-react"

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    await login(email, password)
  }

  return (
    <div className="h-screen px-4 flex flex-col items-center justify-center gap-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-4 flex flex-col gap-4">

        <h2 className="text-xl font-bold font-[ClashDisplay] text-green-700">Login</h2>

        <input 
          type="email"
          placeholder="Enter you email e.g bbs@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-1 focus:ring-black"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-1 focus:ring-black"
        />

        <button
          onClick={handleLogin}
          disabled={loading || !email || !password}
          className="w-full bg-black text-white rounded-xl p-2.5 cursor-pointer disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Don’t have an account?{" "}
          <span className="text-black cursor-pointer" onClick={() => navigate("/signup")}>Signup</span>
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-md shadow-lg p-4 flex items-center justify-center gap-4 cursor-pointer" onClick={() => navigate("/chat")}>
        <MessageCircle strokeWidth={0.8} size={16} />
        <p className="text-xs text-gray-700 text-center">Continue as Guest</p>
      </div>
    </div>
  )
}