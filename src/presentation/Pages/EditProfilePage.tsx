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
import { useUpdateProfilePictureMutation } from "@/app/Queries/auth.query";
import { useState } from "react";

export default function EditProfilePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const updateProfilePictureMutation = useUpdateProfilePictureMutation();

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
          <div className="flex flex-col items-center space-y-2">
            <label htmlFor="profile-picture" className="text-sm text-muted-foreground">
              Select Profile Picture
            </label>
            <input
              id="profile-picture"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
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
          >
            {updateProfilePictureMutation.isPending ? "Uploading..." : "Upload Picture"}
          </Button>
          <Button className="w-full" variant="outline">
            <Link to="/profile">Back to Profile</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
