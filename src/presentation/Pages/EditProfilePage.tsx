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
import { useState, useEffect } from "react";
import { CloudUpload } from "lucide-react";
import MetaData from "../components/MetaData";

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
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <label
                htmlFor="profile-picture"
                className="flex flex-col items-center cursor-pointer"
              >
                <CloudUpload className="h-12 w-12 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">
                  Upload Image
                </span>
              </label>
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
          <Button className="w-full" variant="outline" asChild>
            <Link to="/profile">Back to Profile</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
    </>
  );
}