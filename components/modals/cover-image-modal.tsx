"use client";

import { useCoverImage } from "@/hooks/useCoverImage";
import { useParams } from "next/navigation";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { useState } from "react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { SingleImageDropzone } from "@/components/singleImageDropzone";
import { toast } from "sonner";

export const CoverImageModal = () => {
  const coverImage = useCoverImage();
  const params = useParams();
  const update = useMutation(api.documents.update);
  const [file, setFile] = useState<File>();
  const [isUploading, setIsUploading] = useState(false);
  const { edgestore } = useEdgeStore();

  const onChange = async (file?: File) => {
    if (file) {
      setIsUploading(true);
      setFile(file);

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverImage.url,
        },
      });
      const promise = update({
        id: params.documentId as Id<"documents">,
        coverImage: res.url,
      });
      toast.promise(promise, {
        loading: "Uploading cover image...",
        success: "Cover image updated!",
        error: "Error uploading cover image",
      });
      onClose();
    }
  };
  const onClose = () => {
    setIsUploading(false);
    setFile(undefined);
    coverImage.onClose();
  };
  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-lg text-center font-semibold">Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isUploading}
          onChange={onChange}
          value={file}
        />
      </DialogContent>
    </Dialog>
  );
};
