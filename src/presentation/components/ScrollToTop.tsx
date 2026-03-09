import {useEffect, useState} from "react";
import { Button } from "@/presentation/components/Button";
import { CircleArrowUp } from "lucide-react";


export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false); // Start with true for testing
    useEffect(() => {
        const toggleVisibility = () => {
            if(window.scrollY > 100) { // Reduced threshold for testing
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, [])


    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    return (
        <Button 
            variant="outline" 
            size="icon" 
            role="button"
            name="Scroll Button"
            className={`fixed bottom-10 right-10 z-50 rounded-full shadow-lg transition-all duration-300 bg-black hover:bg-gray-900 dark:border-black border-gray-200 dark:bg-white
                ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
            onClick={scrollToTop}
            aria-label="Scroll to top"
        >
            <CircleArrowUp size={24} className="flex items-center justify-center  text-white dark:text-black" />
        </Button>
    )
}