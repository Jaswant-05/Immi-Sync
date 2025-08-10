import axios from "axios";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!token) return setErr("Invalid or missing reset token.");
    if (pw1.length < 8) return setErr("Password must be at least 8 characters.");
    if (pw1 !== pw2) return setErr("Passwords do not match.");

    setSaving(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/complete-password-reset`, {
        token,
        newPassword: pw1,
      });
      setOk(true);
      setTimeout(() => navigate("/signin"), 1500);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to reset password");
    } finally {
      setSaving(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50 px-4">
        <div className="bg-white border rounded-xl p-6 shadow-sm max-w-md w-full">
          <p className="text-red-600">Reset link is invalid.</p>
          <Link className="text-indigo-600 text-sm inline-block mt-2" to="/forgot-password">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white border rounded-xl p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Set a new password</h1>

        <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">New password</label>
        <input
          type="password"
          required
          minLength={8}
          placeholder="********"
          value={pw1}
          onChange={(e) => setPw1(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />

        <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Confirm new password</label>
        <input
          type="password"
          required
          minLength={8}
          placeholder="********"
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />

        <button
          type="submit"
          disabled={saving}
          className={`mt-4 w-full rounded-lg px-3 py-2 text-white ${
            saving ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {saving ? "Saving…" : "Reset password"}
        </button>

        {ok && <p className="text-green-600 text-sm mt-3">Password changed. Redirecting…</p>}
        {err && <p className="text-red-600 text-sm mt-3">{err}</p>}
      </form>
    </div>
  );
};