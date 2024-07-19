"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useOrigin } from "@/hooks/useOrigin";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { Check, Copy, Globe, Globe2, Pin, Share } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PublishProps {
  initialData: Doc<"documents">;
}
export const Publish = ({ initialData }: PublishProps) => {
  const origin = useOrigin();
  const update = useMutation(api.documents.update);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const url = `${origin}/preview/${initialData._id}`;

  const onPublish = async () => {
    setIsSubmitting(true);
    const promise = update({
      id: initialData._id,
      isPublic: true,
    }).finally(() => setIsSubmitting(false));
    toast.promise(promise, {
      loading: "Publishing...",
      success: "Published!",
      error: "Failed to publish",
    });
  };
  const onUnPublish = async () => {
    setIsSubmitting(false);
    const promise = update({
      id: initialData._id,
      isPublic: false,
    }).finally(() => setIsSubmitting(false));
    toast.promise(promise, {
      loading: "Unpublishing...",
      success: "Unpublished!",
      error: "Failed to unpublish",
    });
  };
  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          size={"sm"}
          className="rounded-sm font-normal text-base"
        >
          <Share
            className={cn(
              "h-3.5 w-3.5 mr-2",
              initialData.isPublic ? "text-blue-600" : "text-muted-foreground"
            )}
          />{" "}
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublic ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe2 className="text-sky-500 animate-pulse h-4 w-4" />
              <p className="text-xs font-medium text-sky-500">
                This is live on web.
              </p>
            </div>
            <div className="flex items-center">
              <input
                value={url}
                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                disabled
                readOnly
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="h-8 rounded-l-none"
                variant={"secondary"}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              size={"sm"}
              className="w-full text-base rounded-sm"
              //       variant={"secondary"}
              onClick={onUnPublish}
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe2 className="h-8 w-8 mb-2 text-muted-foreground" />
            <p className="text-sm font-medium mb-2">Publish this document</p>
            <span className="text-xs text-muted-foreground mb-4">
              Share your work with others
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className="w-full text-base rounded-sm"
              size="sm"
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
