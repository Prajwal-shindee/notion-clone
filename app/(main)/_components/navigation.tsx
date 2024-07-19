"use client";

import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  ChevronsRight,
  Clock,
  MenuIcon,
  PlusCircle,
  PlusIcon,
  Route,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import path from "path";
import { ElementRef, useRef, useState, useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import { UserItem } from "./userItem";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Item } from "./Item";
import { DocumentList } from "./documentList";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TrashBox } from "./trashBox";
import { useSearch } from "@/hooks/useSearch";
import { useSettings } from "@/hooks/useSettings";
import { Navbar } from "./navbar";

export const Navigation = () => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const resizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isRestting, setIsResetting] = useState(false);
  const [isClosed, setIsClosed] = useState(isMobile);
  const create = useMutation(api.documents.create);
  const search = useSearch();
  const settings = useSettings();

  useEffect(() => {
    if (isMobile) {
      handleClose();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      handleClose();
    }
  }, [pathname, isMobile]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    resizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!resizingRef.current) return;
    let newWidth = e.clientX;
    if (newWidth < 240) {
      newWidth = 240;
    }
    if (newWidth > 480) {
      newWidth = 480;
    }
    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    resizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsClosed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? `100%` : `240px`;
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "0" : "240px");
      setTimeout(() => {
        setIsResetting(false);
      }, 300);
    }
  };

  const handleClose = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsClosed(true);
      setIsResetting(true);
      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
    }
  };

  const handleCreate = () => {
    const promise = create({
      title: "Untitled",
    }).then((documentId) => {
      router.push(`/documents/${documentId}`);
    });

    toast.promise(promise, {
      loading: "Creating document...",
      success: "Document created!",
      error: "Failed to create document",
    });
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          "h-full group/sidebar bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
          isRestting && "transition-all duration-300 ease-in-out",
          isMobile && "w-0"
        )}
      >
        {/* Sidebar toggle for Mobile */}
        <div
          role="button"
          onClick={handleClose}
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-100 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>

        {/* Menu Items */}
        <div>
          <UserItem />
          <Item label="Search" icon={Search} isSearch onClick={search.onOpen} />
          <Item label="Updates" icon={Clock} onClick={() => {}} />
          <Item
            label="Settings & members"
            icon={Settings}
            onClick={settings.onOpen}
          />
          <Item onClick={handleCreate} label="New page" icon={PlusCircle} />
        </div>

        {/* Folder */}
        <div className="mt-4">
          <DocumentList />
          <Item onClick={handleCreate} icon={PlusIcon} label="Add a page" />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              side={isMobile ? "bottom" : "right"}
              className="p-0 w-72"
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>

        {/* Resizer */}
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>

      {/* Navbar */}
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isRestting && "transition-all duration-300 ease-in-out",
          isMobile && "w-full left-0"
        )}
      >
        {!!params.documentId ? (
          <Navbar isClosed={isClosed} onResetWidth={resetWidth} />
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full">
            {isClosed && (
              <MenuIcon
                onClick={resetWidth}
                role="button"
                className="h-6 w-6 text-muted-foreground"
              />
            )}
            {/* {isClosed && !isMobile && (
              <ChevronsRight
                onClick={resetWidth}
                role="button"
                className="h-6 w-6 text-muted-foreground"
              />
            )} */}
          </nav>
        )}
      </div>
    </>
  );
};
