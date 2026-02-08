import { Button } from "@/presentation/components/Button";
import { Link } from "react-router";
import NotFound from "@/assets/404.png";
export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 selection:text-white selection:bg-black">
        <div className="flex items-center justify-center">
            <img src={NotFound} alt="" className="w-120"/>
        </div>
        <h1 className="text-8xl font-bold text-primary">Ooops! 404</h1>
        <h2 className="text-3xl font-semibold mt-4 mb-2">Page Not Found</h2>
        <p className="text-3xl text-muted-foreground mb-6">
            the Page you are looking for doesn't exist or has been moved
        </p> 
        <Link to="/">
            <Button variant="link">Go To Home Page</Button>
        </Link> 
    </div>
  )
}
