import { Outlet } from "react-router";

export default function AuthLayout() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center">
            <div className="w-full max-w-md p-6 rounded-xl">
                <Outlet />
            </div>
        </div>
    )
}