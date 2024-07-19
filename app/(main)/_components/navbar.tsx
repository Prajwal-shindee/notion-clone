"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { Title } from "./title";
import { Banner } from "./banner";
import { Menu } from "./menu";
import { Publish } from "./publish";

interface NavbarProps {
  isClosed: boolean;
  onResetWidth: () => void;
}

export const Navbar = ({ isClosed, onResetWidth }: NavbarProps) => {
  const params = useParams();
  const document = useQuery(api.documents.getById, {
    id: params.documentId as Id<"documents">,
  });

  if (document === undefined)
    return (
      <div>
        <nav className="bg-background px-3 py-2 w-full flex items-center justify-between  dark:bg-[#1f1f1f]">
          <Title.Skeleton />
          <div className="flex items-center gap-x-2">
            <Menu.Skeleton />
          </div>
        </nav>
      </div>
    );

  if (document === null) return null;
  return (
    <>
      <nav className="bg-background px-3 py-2 w-full flex items-center justify-between gap-x-4 dark:bg-[#1f1f1f]">
        {isClosed && (
          <MenuIcon
            role="button"
            className="h-6 w-6 text-muted-foreground"
            onClick={onResetWidth}
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={document} />
          <div className="flex items-center gap-x-2">
            <Publish initialData={document} />
            <Menu documentId={document._id} />
          </div>
        </div>
      </nav>
      {document.isAchived && <Banner documentId={document._id} />}
    </>
  );
};
