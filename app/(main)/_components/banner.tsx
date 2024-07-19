"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BannerProps {
  documentId: Id<"documents">;
}
export const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();
  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);

  const handleRemove = async () => {
    const promise = remove({ id: documentId });
    router.push("/documents");
    toast.promise(promise, {
      loading: "Deleting document...",
      success: "Document deleted",
      error: "Error deleting document",
    });
  };
  const handleRestore = async () => {
    const promise = restore({ id: documentId });
    toast.promise(promise, {
      loading: "Restoring document...",
      success: "Document restored",
      error: "Error restoring document",
    });
  };
  return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
      <p>This is Archived document.</p>
      <Button
        size={"sm"}
        onClick={handleRestore}
        variant={"outline"}
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal rounded-sm"
      >
        Restore Page
      </Button>
      <ConfirmModal onConfirm={handleRemove}>
        <Button
          variant={"outline"}
          size={"sm"}
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal rounded-sm"
        >
          Delete
        </Button>
      </ConfirmModal>
    </div>
  );
};
