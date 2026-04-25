import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/Button";
import { useCurrentUserQuery } from "@/app/Queries/auth.query";
import { Avatar, AvatarFallback, AvatarImage } from "@/presentation/components/ui/avatar";
import { useAuth } from "@/presentation/hooks/useAuth";
import { Mail, Shield, User as UserIcon } from "lucide-react";
import MetaData from "../components/MetaData";

export default function ProfilePage() {
  const {data: User, isLoading, isError, refetch } = useCurrentUserQuery();
  const {logout} =  useAuth();

  if(isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h5 className="mr-3 text-xl">Loading Profile </h5>
        <span className="animate-bounce text-lg font-semibold">...</span>
      </div>
    )
  }


  if(isError || !User) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-md text-destructive">Failed to load Profile</p>
        <Button variant="outline" onClick={() => refetch()}>Back to Home</Button>
      </div>
    )
  }

  return (
    <>
      <MetaData 
        title="Profile"
        description="Profile Page where you can see your Account Info."
        path="/profile"
        type="website"
        noIndex={false}
      />
      <div className="flex min-h-screen items-center justify-center px-4 selection:bg-black selection:text-white">
        <Card className="w-full max-w-lg shadow-lg overflow-hidden">
          {/* Hero: Avatar left, Name + Role right */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
            <Avatar className="w-24 h-24 sm:w-28 sm:h-28 shrink-0">
              <AvatarImage
                className="object-cover"
                src={User?.profile_image_url || (User as any)?.profilePicture}
                alt={User?.name}
              />
              <AvatarFallback className="text-3xl">{User?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{User?.name}</h2>
              <span className="inline-flex items-center gap-1.5 mt-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                <Shield className="w-3 h-3" />
                {User?.role || "Member"}
              </span>
            </div>
          </div>

          {/* Info Column */}
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <UserIcon className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium truncate">{User?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium truncate">{User?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="font-medium">{User?.role || "Member"}</p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex gap-2 p-6 pt-2">
            <Button className="w-full" asChild>
              <Link to="/profile/edit">Edit Profile</Link>
            </Button>
            <Button className="w-full" variant="outline" onClick={logout}>
              Log Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
