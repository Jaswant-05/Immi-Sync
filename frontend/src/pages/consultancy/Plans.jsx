import { useState, useEffect } from "react";
import { Button } from "../../ui/Button"; 
import { Check, ArrowRight } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { plans } from "../../utils/plan";
import { useAuth } from "../../hooks/useAuth";

export const Plans = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const { token } = useAuth();
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token, navigate]);

  const handleCheckout = async () => {
    if (!selected) {
      setError("Please select a plan.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const priceId = plans[selected].price_id[billingCycle];
      console.log(priceId);

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/stripe/create-checkout-session`,
        { priceId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to start checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold">Choose Your Plan</h1>
          <p className="text-gray-500 mt-2">
            Select a subscription to unlock the dashboard.
          </p>
        </div>

        {/* Billing cycle toggle */}
        <div className="flex justify-center gap-4 mb-6">
          {["monthly", "yearly"].map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`px-4 py-2 rounded-lg border ${
                billingCycle === cycle
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(plans).map(([key, plan]) => {
            const active = selected === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(key)}
                className={`text-left rounded-xl border p-5 bg-white shadow-sm hover:shadow transition ${
                  active
                    ? "border-blue-600 ring-2 ring-blue-500/20"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">{plan.name}</div>
                  {active && (
                    <span className="text-blue-600 text-sm font-medium">
                      Selected
                    </span>
                  )}
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {billingCycle === "monthly"
                    ? `$${plan.monthly_price} / mo`
                    : `$${plan.yearly_price} / yr`}{" "}
                  {/* Replace with real display prices if needed */}
                </div>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    {plan.user_limit} user limit
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    {plan.application_limit
                      ? `${plan.application_limit} application limit`
                      : "Unlimited applications"}
                  </li>
                </ul>
              </button>
            );
          })}
        </div>

        {/* Checkout button */}
        <div className="mt-6 flex justify-center">
          <Button
            variant="secondary"
            className="min-w-[200px] flex items-center justify-center gap-2"
            onClick={handleCheckout}
            disabled={loading || !selected}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Redirecting…
              </>
            ) : (
              <>
                Continue to Checkout
                <ArrowRight />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
