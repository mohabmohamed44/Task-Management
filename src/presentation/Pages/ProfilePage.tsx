import { lazy, Suspense } from "react";
import { Link } from "react-router";
import { useCurrentUserQuery } from "@/app/Queries/auth.query";
import { useAuth } from "@/presentation/hooks/useAuth";

const Card = lazy(() =>
  import("@/presentation/components/ui/card").then(({ Card }) => ({ default: Card })),
);
const CardContent = lazy(() =>
  import("@/presentation/components/ui/card").then(({ CardContent }) => ({ default: CardContent })),
);
const CardFooter = lazy(() =>
  import("@/presentation/components/ui/card").then(({ CardFooter }) => ({ default: CardFooter })),
);
const Avatar = lazy(() =>
  import("@/presentation/components/ui/avatar").then(({ Avatar }) => ({ default: Avatar })),
);
const AvatarFallback = lazy(() =>
  import("@/presentation/components/ui/avatar").then(({ AvatarFallback }) => ({ default: AvatarFallback })),
);
const AvatarImage = lazy(() =>
  import("@/presentation/components/ui/avatar").then(({ AvatarImage }) => ({ default: AvatarImage })),
);
const Button = lazy(() =>
  import("@/presentation/components/Button").then(({ Button }) => ({ default: Button })),
);
const Mail = lazy(() =>
  import("lucide-react").then(({ Mail }) => ({ default: Mail })),
);
const Shield = lazy(() =>
  import("lucide-react").then(({ Shield }) => ({ default: Shield })),
);
const UserIcon = lazy(() =>
  import("lucide-react").then(({ User }) => ({ default: User })),
);
const MetaData = lazy(() => import("../components/MetaData"));

function ProfilePageFallback() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      role="status"
      aria-live="polite"
      aria-label="Loading profile page"
    >
      <p className="text-sm text-muted-foreground">Loading profile page...</p>
    </div>
  );
}

export default function ProfilePage() {
  const {data: User, isLoading, isError, refetch } = useCurrentUserQuery();
  const {logout} =  useAuth();

  if(isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <p className="mr-3 text-xl">Loading Profile</p>
        <span className="animate-bounce text-lg font-semibold" aria-hidden="true">...</span>
      </div>
    )
  }


  if(isError || !User) {
    return (
      <Suspense fallback={<ProfilePageFallback />}>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-md text-destructive">Failed to load Profile</p>
          <Button variant="outline" onClick={() => refetch()} name="back-to-home"
            id="back-to-home"
            aria-label="Back to Home" aria-required="true"
            aria-invalid={isError || !User}
            aria-describedby="back-to-home-error"
            aria-pressed={isError || !User}
            >
              <Link to="/" className="w-full">Back to Home</Link>
          </Button>
        </div>
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<ProfilePageFallback />}>
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
            <Button className="w-full" asChild
              aria-label="Edit Profile" aria-required="true" 
              aria-invalid={false} 
              aria-describedby="edit-profile-error"
              aria-pressed={false}
              name="edit-profile"
              id="edit-profile"
            >
              <Link to="/profile/edit">Edit Profile</Link>
            </Button>
            <Button className="w-full" variant="outline" onClick={logout} name="log-out" 
            id="log-out" 
            aria-label="Log Out" aria-required="true" 
            aria-invalid={false} 
            aria-describedby="log-out-error" 
            aria-pressed={false}
            >
              Log Out
            </Button>
          </CardFooter>
        </Card>
        </div>
      </>
    </Suspense>
  );
}
