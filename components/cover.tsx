"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/useCoverImage";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useEdgeStore } from "@/lib/edgestore";
import { Skeleton } from "./ui/skeleton";

interface CoverProps {
  url?: string;
  preview?: boolean;
}

export const Cover = ({ url, preview }: CoverProps) => {
  const coverImage = useCoverImage();
  const params = useParams();
  const removeCoverImage = useMutation(api.documents.removeCoverImage);
  const { edgestore } = useEdgeStore();

  const onRemove = async () => {
    if (url) await edgestore.publicFiles.delete({ url });
    const promise = removeCoverImage({
      id: params.documentId as Id<"documents">,
    });
    toast.promise(promise, {
      loading: "Removing cover image...",
      success: "Cover image removed",
      error: "Error removing cover image",
    });
    coverImage.onClose();
  };
  return (
    <div
      className={cn(
        "relative w-full group",
        !url && "h-[12vh]",
        url && "bg-muted h-[35vh]"
      )}
    >
      {!!url && <Image src={url} alt="Cover" fill className="object-cover" />}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => coverImage.onReplace(url)}
            className="text-muted-foreground text-xs"
            variant={"outline"}
            size={"sm"}
          >
            <ImageIcon className="h-4 w-4 mr-1" />
            Change cover
          </Button>
          <Button
            onClick={onRemove}
            className="text-muted-foreground text-xs"
            variant={"outline"}
            size={"sm"}
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="w-full h-[12vh]" />;
};
