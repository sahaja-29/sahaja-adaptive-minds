
import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!token) {
      setMessage("Reset link is missing. Please request a new link.");
      setMessageType("error");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setMessageType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed.");
      }

      setMessage(
        data.message || "Password reset successful. You can now log in."
      );
      setMessageType("success");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(
        error.message || "Unable to reset password. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FF] flex items-center justify-center px-5 py-10 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#DCD6FF] rounded-full blur-3xl opacity-60" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#E5DDFF] rounded-full blur-3xl opacity-70" />
      <div className="absolute top-1/3 right-10 w-24 h-24 bg-[#E0F2FE] rounded-full blur-2xl opacity-60" />

      {/* Main card */}
      <div className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-[0_20px_60px_rgba(79,70,229,0.12)] overflow-hidden border border-[#E8E8F5] flex flex-col md:flex-row">
        {/* Branding section */}
        <div className="md:w-[45%] bg-gradient-to-br from-[#5B4BDB] via-[#6D5CE7] to-[#8B7CF6] p-8 sm:p-10 md:p-12 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl shadow-lg">
                🧠
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Adaptive Minds
                </h1>
                <p className="text-xs text-white/80">
                  Learn • Practice • Improve
                </p>
              </div>
            </div>

            <h2 className="text-4xl font-bold leading-tight">
              A fresh start.
              <br />
              A stronger password.
            </h2>

            <p className="mt-6 text-white/80 text-lg leading-relaxed">
              Secure your account and continue your personalized learning
              journey.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-12">
            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <div className="text-2xl mb-2">🔐</div>
              <p className="text-xs font-medium">Secure</p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <div className="text-2xl mb-2">🧠</div>
              <p className="text-xs font-medium">Personalized</p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-xs font-medium">Keep learning</p>
            </div>
          </div>
        </div>

        {/* Reset form section */}
        <div className="md:w-[55%] p-7 sm:p-10 md:p-14 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <p className="text-sm font-semibold text-[#6D5CE7] mb-2">
              ACCOUNT RECOVERY
            </p>

            <h2 className="text-3xl font-bold text-[#172554]">
              Reset Password
            </h2>

            <p className="text-[#64748B] mt-3 mb-8 leading-relaxed">
              Create a new password for your account. Choose at least
              eight characters.
            </p>

            {!token && (
              <div
                role="alert"
                className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                This reset link is missing its token. Please request a new
                password reset link.
              </div>
            )}

            <form onSubmit={handleReset}>
              <div className="mb-5">
                <label
                  htmlFor="new-password"
                  className="block text-sm font-semibold text-[#334155] mb-2"
                >
                  New Password
                </label>

                <input
                  id="new-password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F9FF] border border-[#E2E4F0] text-[#172554] placeholder-[#94A3B8] outline-none transition focus:border-[#6D5CE7] focus:ring-4 focus:ring-[#6D5CE7]/10"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-semibold text-[#334155] mb-2"
                >
                  Confirm New Password
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  placeholder="Enter your password again"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F9FF] border border-[#E2E4F0] text-[#172554] placeholder-[#94A3B8] outline-none transition focus:border-[#6D5CE7] focus:ring-4 focus:ring-[#6D5CE7]/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full bg-gradient-to-r from-[#5B4BDB] to-[#7C6FF2] text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-[#5B4BDB]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>

            {message && (
              <div
                role={messageType === "error" ? "alert" : "status"}
                aria-live="polite"
                className={`mt-5 p-4 rounded-2xl border text-sm leading-relaxed break-words ${
                  messageType === "success"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <p className="text-center text-[#64748B] mt-8">
              Remember your password?
              <Link
                to="/"
                className="font-semibold text-[#5B4BDB] ml-2 hover:text-[#4338CA] transition"
              >
                Back to Login
              </Link>
            </p>

            <div className="flex items-center justify-center gap-2 mt-8 text-xs text-[#94A3B8]">
              <span>🔒</span>
              <span>Your learning journey is secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
