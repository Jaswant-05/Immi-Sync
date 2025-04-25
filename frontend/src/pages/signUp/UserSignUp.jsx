import { ArrowRight, Lock } from "lucide-react"
import { Input } from "../../ui/Input";
import { Select } from "../../ui/Select";
import { Button } from "../../ui/Button";
import { useForm } from "react-hook-form";


export const UserSignUp = () => {
    const { register, handleSubmit, setValue } = useForm();
    const onSubmit = data => console.log(data);
  
    return (
        <div className="flex flex-1 items-center justify-center bg-gray-50">
            <div className="mx-4 md:mx-0 w-full max-w-md p-8 bg-white shadow rounded-xl">
                <div className="flex justify-center mb-4">
                    <Lock className="w-7 h-7 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-center">Welcome</h2>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Create A new Account
                </p>
        
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <Input 
                        type="text" 
                        name="emailAddress"
                        label="Email Address" 
                        register={register} r
                        equired 
                    />

                    <Input
                        type="password" 
                        name="password"
                        label="Password" 
                        register={register} 
                        required 
                    />

                    <Select
                        label="Application Type"
                        register={register}
                        name="applicationType"
                        setValue={setValue}
                        required
                        className="mt-4"
                        options={[
                        { label: "Select Type", value: "" },
                        { label: "Visitor", value: "Visitor" },
                        { label: "Work Permit", value: "Work Permit" },
                        { label: "Permanent Residence", value: "Permanent Residence" },
                        { label: "Citizen", value: "Citizen" }
                        ]}
                    />

                    <Select
                        label="Consultancy"
                        register={register}
                        name="consultancy"
                        required
                        setValue={setValue}
                        className="mt-4"
                        options={[  // need to be taken from the backend need a seperate backend point for this.
                        { label: "Choose Consultancy", value: "" },
                        { label: "NNC Immigration", value: "NNC Immigratioin" },
                        ]}
                    />

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
                    Already have an account? <span className="text-blue-600 cursor-pointer">Sign In</span>
                </div>
            </div>
        </div>
    );
  };
  