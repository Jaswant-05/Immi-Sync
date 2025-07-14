import { useLoadScript } from "@react-google-maps/api";
import { useRef, useEffect, useState } from "react";
import { useForm, useController } from "react-hook-form";
import axios from "axios";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const libraries = ["places"];

export const Onboard = () => {
  const { register, handleSubmit, control, formState: {errors} } = useForm();
  const [geometry, setGeometry] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  
  const { field: addressField } = useController({
    name: "address",
    control,
    rules: { required: true }
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitError("");
      
      const payload = {
        username: data.emailAddress,
        password: data.password,
        role: "consultancy",
        name: data.name,
        address: {
          addressString: data.address,
          longitude: geometry.lng || null,
          latitude: geometry.lat || null
        },
        phoneNumber: parseInt(data.phoneNumber)
      };
      
      console.log("Sending payload:", payload);
      
      const response = await axios.post("http://localhost:3000/api/v1/auth/signup", payload);
      
      console.log("Registration successful:", response.data);
      
      
    } catch (error) {
      console.error("Registration failed:", error);
      
      if (error.response) {
        setSubmitError(error.response.data.message || "Registration failed");
      } else if (error.request) {
        setSubmitError("Network error. Please check your connection.");
      } else {
        setSubmitError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
      navigate('/')
    }
  };

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;
    
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      fields: ["formatted_address", "geometry"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      
      if (place.geometry) {
        setGeometry({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          viewport: place.geometry.viewport,
        });
      }
    
      if (place.formatted_address) {
        addressField.onChange(place.formatted_address);
      }
    });
  }, [isLoaded, addressField]);

  if (loadError) return <div>Failed to load Google Maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50">
      <div className="mx-4 md:mx-0 w-full max-w-md p-8 bg-white shadow rounded-xl">
        <div className="flex justify-center mb-4">
          <Lock className="w-7 h-7 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-center">Welcome</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Register Your Consultancy
        </p>
        
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{submitError}</p>
            </div>
          )}
          
         <div>
            <Input
              type="email"
              name="emailAddress"
              label="Email Address"
              register={register}
              required="Please enter a valid email address"
              pattern={{
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address"
              }}
            />
            {errors.emailAddress && (
              <p className="text-[12px] text-red-500 mt-1">
                {errors.emailAddress.message}
              </p>
            )}
          </div>
          
          <div>
            <Input
              type="password"
              name="password"
              label="Password"
              register={register}
              required="Password is required"
              minLength={{
                value: 8,
                message: "Password must be at least 8 characters"
              }}
              // pattern={{
              //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/,
              //   message: "Password must include uppercase, lowercase, number, and special character"
              // }}
            />
            {errors.password && (
              <p className="text-[12px] text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          
          <div>
            <Input
              type="text"
              name="name"
              label="Name"
              register={register}
              required="Name is required"
              minLength={{
                value: 2,
                message: "Name must be at least 2 characters"
              }}
              pattern={{
                value: /^[A-Za-z\s\-']+$/,
                message: "Name can only contain letters, spaces, hyphens, and apostrophes"
              }}
            />
            {errors.name && (
              <p className="text-[12px] text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              {...addressField}
              ref={inputRef}
              type="text"
              placeholder="Start typing your address..."
              className="block w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Please select from the dropdown suggestions
            </p>
          </div>
          
          <div>
            <Input
              type="tel"
              name="phoneNumber"
              label="Phone Number"
              register={register}
              required="Phone number is required"
              pattern={{
                value: /^[\+]?[1-9][\d]{0,15}$/,
                message: "Please enter a valid phone number"
              }}
            />
            {errors.phoneNumber && (
              <p className="text-[12px] text-red-500 mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <Button
            variant="secondary"
            className="w-full flex justify-center gap-2"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing Up...
              </>
            ) : (
              <>
                Sign Up
                <ArrowRight />
              </>
            )}
          </Button>
        </form>
        
        <div className="text-center mt-4 text-sm text-gray-500">
          Already have an account?{" "}
          <span className="text-blue-600 cursor-pointer">Sign In</span>
        </div>
      </div>
    </div>
  );
};