import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/Button";
import { useCurrentUserQuery } from "@/app/Queries/auth.query";
import { Avatar, AvatarFallback, AvatarImage } from "@/presentation/components/ui/avatar";
import { useAuth } from "@/presentation/hooks/useAuth";

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
    <div className="flex min-h-screen items-center justify-center px-4 selection:bg-black selection:text-white">
      <Card className="w-full max-w-md shadow-lg overflow-hidden">
        <Avatar className="h-full w-full rounded-none">
          <AvatarImage className="object-cover h-full w-full aspect-auto" src={User?.profile_image_url} alt={User?.name} />
          <AvatarFallback className="rounded-none text-4xl">{User?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold">
            Profile Info.
          </CardTitle>
          <CardDescription className="text-md text-muted-foreground">
            Manage your personal information
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Name</span>
            <span className="font-medium">{User?.name}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="font-medium">{User?.email}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Role</span>
            <span className="font-medium">{User?.role}</span>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button className="w-full">
            <Link to="/profile/edit">Edit Profile</Link>
          </Button>
          <Button className="w-full" variant="outline" onClick={logout}>
            Log Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
