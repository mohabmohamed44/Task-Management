import { Outlet } from "react-router";

export default function AuthLayout() {
    return (
        <main 
            className="min-h-screen w-full flex items-center justify-center bg-background"
            role="main"
            aria-label="Authentication page"
        >
            <section 
                className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-3 sm:p-4 md:p-6 lg:p-8"
                aria-labelledby="auth-heading"
            >
                <Outlet />
            </section>
        </main>
    )
}