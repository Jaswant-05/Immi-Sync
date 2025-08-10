import { AlertCircle, ArrowRight, Lock } from "lucide-react"
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { useForm } from "react-hook-form";
import axios from "axios"
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { useAuth } from "../../hooks/useAuth";
import { authAtom } from "../../Recoil/atoms/authAtom";
import { useState } from "react";

export const SignIn = () => {
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const setToken = useSetRecoilState(authAtom);
    const navigate = useNavigate();
    const {logIn} = useAuth();
    const [error, setError] = useState("");

    const onSubmit = async (data) => {
    try {
        setError(""); 

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/signin`, {
            username: data.emailAddress,
            password: data.password,
        });

        setToken({
            token: response.data.token,
            role: response.data.user.role,
        });

        logIn({
            token: response.data.token,
            role: response.data.user.role,
        });

    
        if(response.data.user.role === 'consultancy'){
            if(response.data.subscription_status !== "active"){
                navigate("/plan")
            }else{
                navigate("/consultancy/dashboard");
            }
        } else {
            navigate('/client/dashboard')
        }
       

    } catch (error) {
    if (error.response?.status === 401) {
        // Show invalid credentials message
        setError("Invalid email or password");
    } else if (error.response?.status === 500) {
        // Show server error message
        setError("Server error. Please try again later.");
    } else {
        // Show generic error
        setError(error.response?.data?.message || "An error occurred");
    }
}
    };



    return (
        <div className="flex flex-1 items-center justify-center bg-gray-50">
            <div className="mx-4 md:mx-0 w-full max-w-md p-8 bg-white shadow rounded-xl">
                <div className="flex justify-center mb-4">
                    <Lock className="w-7 h-7 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-center">Welcome Back!</h2>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Sign in to Immi-Sync
                </p>
        
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Input 
                            type="text" 
                            name="emailAddress"
                            label="Email Address" 
                            register={register} 
                            required="Please enter a valid email address"
                            pattern={{
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Please enter a valid email address"
                            }}
                        />
                        {errors.emailAddress && <p className="text-[12px] text-red-500">{errors.emailAddress.message}</p>}
                    </div>
                    
                    <div>
                        <Input
                            type="password" 
                            name="password"
                            label="Password" 
                            register={register} 
                                // required="Password must include uppercase, lowercase, number, and special character"
                                // minlength={8}
                                // pattern={{
                                //     value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/,
                                //     message: "Password must include uppercase, lowercase, number, and special character"
                                // }}
                        />
                        {errors.password && <p className="text-[12px] text-red-500">{errors.password.message}</p>}
                    </div>

                    <div className="mt-2 text-right">
                        <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <Button 
                        variant="secondary" 
                        className="w-full flex justify-center gap-2"
                        type="submit"
                    >
                        Sign In
                        <ArrowRight />
                    </Button>

                </form>
        
                <div className="text-center mt-4 text-sm text-gray-500">
                   Create a new Account? <span className="text-blue-600 cursor-pointer">Sign Up</span>
                </div>
            </div>
        </div>
    );
  };
  