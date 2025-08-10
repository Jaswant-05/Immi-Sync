import { AlertCircle, ArrowRight, Lock } from "lucide-react"
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { useForm } from "react-hook-form";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const SignUp = () => {
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const onSubmit = async (data) => {
    try {
        const response = await axios.post("http://localhost:3000/api/v1/auth/signup", {
            username: data.emailAddress,
            password: data.password,
            role: 'client'
        });


    }   catch (error) {
            console.error("Sign-up error:", error);
            
            if (error.response?.status === 409) {
                setError("An account with this email already exists");
            } else if (error.response?.status === 400) {
                setError(error.response?.data?.message || "Please check your input");
            } else if (error.response?.status === 500) {
                setError("Server error. Please try again later.");
            } else {
                setError(error.response?.data?.message || "An error occurred during registration");
            }
        }
    };

    return (
        <div className="flex flex-1 items-center justify-center bg-gray-50">
            <div className="mx-4 md:mx-0 w-full max-w-md p-8 bg-white shadow rounded-xl">
                <div className="flex justify-center mb-4">
                    <Lock className="w-7 h-7 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-center">Welcome</h2>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Create a new account
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

                    <Button 
                        variant="secondary" 
                        className="w-full flex justify-center gap-2"
                        type="submit"
                    >
                        Sign Up
                        <ArrowRight />
                    </Button>

                </form>
        
                <div className="text-center mt-4 text-sm text-gray-500">
                   Already have an account <span className="text-blue-600 cursor-pointer">Sign In</span>
                </div>
            </div>
        </div>
    );
  };
  