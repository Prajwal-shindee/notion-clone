"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/spinnner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getTrash);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);
  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  const handleClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };
  const handleRestore = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<"documents">
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const promise = restore({ id: documentId });
    toast.promise(promise, {
      loading: "Restoring...",
      success: "Document Restored",
      error: "Failed to restore",
    });
  };
  const handleRemove = (
    // e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<"documents">
  ) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    const promise = remove({ id: documentId });
    toast.promise(promise, {
      loading: "Deleting...",
      success: "Document Removed Permanently",
      error: "Failed to remove",
    });
    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };
  if (documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size={"lg"} />
      </div>
    );
  }
  return (
    <div className="text-xs">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="w-4 h-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className=" h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className=" hidden last:block text-xs text-center text-muted-foreground pb-2">
          Trash is empty
        </p>
        {filteredDocuments?.map((doc) => (
          <div
            key={doc._id}
            role="button"
            onClick={() => handleClick(doc._id)}
            className="flex items-center justify-between rounded-sm hover:bg-primary/5 text-xs text-primary group"
          >
            <span className=" truncate pl-2">{doc.title}</span>
            <div className="flex items-center">
              <div
                role="button"
                onClick={(e) => handleRestore(e, doc._id)}
                className="rounded-sm hover:bg-neutral-200 p-2 dark:hover:bg-neutral-600"
              >
                <Undo className="w-4 h-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => handleRemove(doc._id)}>
                <div
                  role="button"
                  className="rounded-sm text-muted-foreground p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
