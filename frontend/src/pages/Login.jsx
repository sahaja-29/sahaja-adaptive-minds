import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("studentId", String(data.user.id));
    localStorage.setItem("studentName", data.user.name);
    localStorage.setItem("studentEmail", data.user.email);

    navigate("/semester");
  } catch (error) {
    alert(error.message || "Unable to log in. Please try again.");
  }
};


  return (
    <div className="min-h-screen bg-[#F7F8FF] flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background decorations */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#DCD6FF] rounded-full blur-3xl opacity-60"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#E5DDFF] rounded-full blur-3xl opacity-70"></div>
      <div className="absolute top-1/3 right-10 w-24 h-24 bg-[#E0F2FE] rounded-full blur-2xl opacity-60"></div>

      {/* Main card */}
      <div className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-[0_20px_60px_rgba(79,70,229,0.12)] overflow-hidden border border-[#E8E8F5] flex flex-col md:flex-row">

        {/* Left branding section */}
        <div className="md:w-[48%] bg-gradient-to-br from-[#5B4BDB] via-[#6D5CE7] to-[#8B7CF6] p-10 md:p-14 text-white flex flex-col justify-between min-h-[520px]">

          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl shadow-lg">
                🧠
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Adaptive Minds
                </h1>
                <p className="text-xs text-white/70">
                  Learn • Practice • Improve
                </p>
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Learn smarter.
              <br />
              Grow faster.
            </h2>

            <p className="mt-6 text-white/80 text-lg leading-relaxed max-w-md">
              Your personalized learning journey powered by AI.
              Learn at your own pace and build stronger skills.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-3 gap-3 mt-10">

            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-xs font-medium">
                Personalized
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <div className="text-2xl mb-2">🤖</div>
              <p className="text-xs font-medium">
                AI Powered
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-xs font-medium">
                Track Progress
              </p>
            </div>

          </div>
        </div>

        {/* Right login section */}
        <div className="md:w-[52%] p-8 md:p-14 flex items-center">

          <div className="w-full max-w-md mx-auto">

            <div className="mb-8">
              <p className="text-sm font-semibold text-[#6D5CE7] mb-2">
                WELCOME BACK 👋
              </p>

              <h2 className="text-3xl font-bold text-[#172554]">
                Sign in to your account
              </h2>

              <p className="text-[#64748B] mt-2">
                Continue your personalized learning journey.
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-[#334155] mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F9FF] border border-[#E2E4F0] text-[#172554] placeholder-[#94A3B8] outline-none transition focus:border-[#6D5CE7] focus:ring-4 focus:ring-[#6D5CE7]/10"
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="block text-sm font-semibold text-[#334155] mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F9FF] border border-[#E2E4F0] text-[#172554] placeholder-[#94A3B8] outline-none transition focus:border-[#6D5CE7] focus:ring-4 focus:ring-[#6D5CE7]/10"
                />
              </div>

              <div className="flex justify-end mb-7">
                <button
                  type="button"
                  className="text-sm font-medium text-[#6D5CE7] hover:text-[#4F46E5] transition"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#5B4BDB] to-[#7C6FF2] text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-[#5B4BDB]/20 hover:shadow-xl hover:shadow-[#5B4BDB]/25 hover:-translate-y-0.5 transition-all duration-300"
              >
                Login →
              </button>

            </form>

            {/* Register */}
            <p className="text-center text-[#64748B] mt-8">
              Don't have an account?

              <Link
                to="/register"
                className="font-semibold text-[#5B4BDB] ml-2 hover:text-[#4338CA] transition"
              >
                Create account
              </Link>
            </p>

            {/* Bottom text */}
            <div className="flex items-center justify-center gap-2 mt-10 text-xs text-[#94A3B8]">
              <span>🔒</span>
              <span>Your learning journey is secure</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;