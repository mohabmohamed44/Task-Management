import { Button } from "@/presentation/components/Button";
import { Link } from "react-router";
import NotFound from "@/assets/404.png";
import MetaData from "../components/MetaData";
export default function NotFoundPage() {
  return (
    <>
        <MetaData 
            title="Ooops"
            description="Not found"
            type="website"
            path="*"
            noIndex={false}
        />
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 selection:text-white selection:bg-black">
            <div className="flex items-center justify-center">
                <img src={NotFound} alt="" className="w-120"/>
            </div>
            <h1 className="text-8xl font-bold text-primary">Ooops! 404</h1>
            <h2 className="text-2xl font-semibold mt-4 mb-2">Page Not Found</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-6">
                the Page you are looking for doesn't exist or has been moved
            </p> 
            <Link to="/">
                <Button variant="link" name="go-to-home-page" 
                id="go-to-home-page" 
                aria-label="Go To Home Page" aria-required="true" 
                aria-invalid={false} 
                aria-describedby="go-to-home-page-error" 
                aria-pressed={false}
                >Go To Home Page</Button>
            </Link> 
        </div>
    </>
  )
}
