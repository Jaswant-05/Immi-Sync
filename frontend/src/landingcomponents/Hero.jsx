import { Button } from "../ui/Button"

export const Hero = () => {
    return(
        <main className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white flex flex-col justify-center item-center gap-10 py-20">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3')] mix-blend-overlay opacity-10"></div>
            <div className="flex justify-center item-center">
                <span className="rounded-full px-4 py-2 text-sm bg-white/10 backdrop-blur-2xl font-semibold">
                    Your Client Management Made easy
                </span>
            </div>
            <div className="flex justify-center item-center">
                <span className="text-4xl md:text-6xl font-bold text-center">
                    Streamline Your Immigration Practice
                </span>
            </div>
            <div className="flex justify-center item-center">
                <span className="text-gray-200 text-xl max-w-3xl text-center">
                    The all-in-one platform for immigration consultancies to manage clients, documents, and applications with ease.
                </span> 
            </div>
            <div className="flex justify-center item-center gap-5 flex-col full mx-10 md:flex-row">
                <Button>Get Started</Button>
                <Button variant="secondary">Book a Demo</Button>
            </div>
        </main>
    )
}