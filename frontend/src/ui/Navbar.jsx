import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

export const Navbar = () => {
    const navigate = useNavigate();
    return (
        <div>
            <nav className="max-w-7xl mx-auto bg-white flex justify-between items-center gap-2 p-2">
                <div className="text-blue-600 font-semibold text-xl">
                    IS
                </div>
                <div className="flex justify-center items-center gap-4 ">
                    <Button variant="login">LogIn</Button>
                    <Button variant="getStarted" onClick={() => {
                        navigate('/signup')
                    }}>SignUp</Button>
                </div>
            </nav>
        </div>
        
    )
};