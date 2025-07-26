import { ArrowRight, Lock } from "lucide-react"
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { useForm } from "react-hook-form";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { useAuth } from "../../hooks/useAuth";
import { authAtom } from "../../Recoil/atoms/authAtom";

export const SignIn = () => {
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const setToken = useSetRecoilState(authAtom);
    const navigate = useNavigate();
    const {logIn} = useAuth();
    const onSubmit = async (data) => {
    try {

        const response = await axios.post("http://localhost:3000/api/v1/auth/signin", {
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
            navigate("/consultancy/dashboard");
        } else {
            navigate('/')
        }
       

    } catch (error) {
        console.error("Sign-in error:", error);
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
        
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Input 
                            type="text" 
                            name="emailAddress"
                            label="Email Address" 
                            register={register} r
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
  