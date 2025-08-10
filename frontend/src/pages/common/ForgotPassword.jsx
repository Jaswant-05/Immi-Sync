import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk(false);
    setSending(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`, {
        email: String(email).trim().toLowerCase(),
      });
      setOk(true);
      navigate("/signin")
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to send reset email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white border rounded-xl p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Forgot Password</h1>
        <p className="text-sm text-gray-600 mt-1">
          Enter your email and we’ll send you a reset link.
        </p>

        <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Email</label>
        <input
          type="email"
          required
          placeholder="you@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />

        <button
          type="submit"
          disabled={sending}
          className={`mt-4 w-full rounded-lg px-3 py-2 text-white ${
            sending ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {sending ? "Sending…" : "Send reset link"}
        </button>

        {ok && <p className="text-green-600 text-sm mt-3">Check your email for the reset link.</p>}
        {err && <p className="text-red-600 text-sm mt-3">{err}</p>}

        <div className="text-sm text-gray-500 mt-4">
          Remembered it? <Link className="text-indigo-600" to="/signin">Sign in</Link>
        </div>
      </form>
    </div>
  );
};