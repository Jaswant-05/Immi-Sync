import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export const VerifyEmail = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState("loading"); 
  const token = params.get("token");

  console.log(token);
  useEffect(() => {
    (async () => {
      try {
        if (!token) throw new Error("Missing token");
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/verify-email`, {
          params: { token },
        });
        setState("success");
        setTimeout(() => navigate("/signin"), 1500);
      } catch (e) {
        setState("error");
      }
    })();
  }, [token, navigate]);

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 px-4">
      <div className="bg-white border rounded-xl p-6 shadow-sm max-w-md w-full text-center">
        {state === "loading" && <p>Verifying your email…</p>}
        {state === "success" && <p className="text-green-600">Email verified! Redirecting…</p>}
        {state === "error" && (
          <>
            <p className="text-red-600">Verification link is invalid.</p>
            <Link className="text-indigo-600 text-sm inline-block mt-2" to="/signin">
              Go to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
};