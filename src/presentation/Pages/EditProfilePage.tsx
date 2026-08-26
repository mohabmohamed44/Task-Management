import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router";
import { useUpdateProfilePictureMutation } from "@/app/Queries/auth.query";

const Card = lazy(() =>
  import("@/presentation/components/ui/card").then(({ Card }) => ({ default: Card })),
);
const CardContent = lazy(() =>
  import("@/presentation/components/ui/card").then(({ CardContent }) => ({ default: CardContent })),
);
const CardHeader = lazy(() =>
  import("@/presentation/components/ui/card").then(({ CardHeader }) => ({ default: CardHeader })),
);
const CardTitle = lazy(() =>
  import("@/presentation/components/ui/card").then(({ CardTitle }) => ({ default: CardTitle })),
);
const CardDescription = lazy(() =>
  import("@/presentation/components/ui/card").then(({ CardDescription }) => ({ default: CardDescription })),
);
const CardFooter = lazy(() =>
  import("@/presentation/components/ui/card").then(({ CardFooter }) => ({ default: CardFooter })),
);
const Button = lazy(() =>
  import("@/presentation/components/Button").then(({ Button }) => ({ default: Button })),
);
const CloudUpload = lazy(() =>
  import("lucide-react").then(({ CloudUpload }) => ({ default: CloudUpload })),
);
const MetaData = lazy(() => import("../components/MetaData"));

function EditProfileFallback() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      role="status"
      aria-live="polite"
      aria-label="Loading edit profile page"
    >
      <p className="text-sm text-muted-foreground">Loading edit profile page...</p>
    </div>
  );
}

export default function EditProfilePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const updateProfilePictureMutation = useUpdateProfilePictureMutation();

  // Derive the preview URL from selectedFile
  const imagePreview = selectedFile ? URL.createObjectURL(selectedFile) : null;

  // Clean up object URL when component unmounts or file changes
  useEffect(() => {
    if (imagePreview) {
      return;
    }
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      updateProfilePictureMutation.mutate(selectedFile);
    }
  };

  return (
    <Suspense fallback={<EditProfileFallback />}>
      <>
        <MetaData
          title="Edit Profile Page"
          description="change and edit your Profile Data"
          type="website"
          path="profile/edit"
          noIndex={false}
        />
        <div className="flex min-h-screen items-center justify-center px-4 selection:bg-black selection:text-white">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold">
            Edit Profile
          </CardTitle>
          <CardDescription className="text-md text-muted-foreground">
            Update your profile picture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <label
                htmlFor="profile-picture"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary border-muted-foreground/25 transition-colors"
              >
                <CloudUpload className="h-12 w-12 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">
                  Select Profile Picture
                </span>
              </label>
            )}
            <input
              id="profile-picture"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            className="w-full"
            onClick={handleUpload}
            disabled={!selectedFile || updateProfilePictureMutation.isPending}
            aria-label="Upload picture"
            aria-required="true"
            aria-invalid={false}
            aria-describedby="upload-picture-error"
            aria-pressed={false}
            name="upload-picture"
            id="upload-picture"
          >
            {updateProfilePictureMutation.isPending ? "Uploading..." : "Upload Picture"}
          </Button>
          <Button className="w-full" variant="outline" asChild
            aria-label="Back to profile"
            aria-required="true"
            aria-invalid={false}
            aria-describedby="back-to-profile-error"
            aria-pressed={false}
            name="back-to-profile"
            id="back-to-profile"
          >
            <Link to="/profile">Back to Profile</Link>
          </Button>
        </CardFooter>
      </Card>
        </div>
      </>
    </Suspense>
  );
}