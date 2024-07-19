"use client";
import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DocumentsPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const create = useMutation(api.documents.create);

  const onCreate = () => {
    const promise = create({
      title: "Untitled",
    }).then((documentId) => router.push(`/documents/${documentId}`));
    toast.promise(promise, {
      loading: "Creating document...",
      success: "Document created!",
      error: "Failed to create document",
    });
  };
  return (
    <div className="flex items-center justify-center h-full flex-col space-y-4">
      <Image
        src="/empty.png"
        alt="empty"
        width={300}
        height={300}
        className="dark:hidden "
      />
      <Image
        src="/empty-dark.png"
        alt="empty"
        width={300}
        height={300}
        className="hidden dark:block "
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Motion.
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create
      </Button>
    </div>
  );
};

export default DocumentsPage;
