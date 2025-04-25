import { Button } from "./Button";

export const Navbar = () => {
    return (
        <div>
            <nav className="max-w-7xl mx-auto bg-white flex justify-between items-center gap-2 p-4">
                <div className="text-blue-600 font-semibold text-xl">
                    IS
                </div>
                <div className="flex justify-center items-center gap-4 ">
                    <Button variant="login">LogIn</Button>
                    <Button variant="getStarted">SignIn</Button>
                </div>
            </nav>
        </div>
        
    )
};