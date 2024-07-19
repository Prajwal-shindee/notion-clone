import Image from "next/image";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});
export const Logo = () => {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <Image
        src="/logo-box.svg"
        width={35}
        height={35}
        alt="logo"
        className="dark:hidden"
      />
      <Image
        src="/logo-box-dark.svg"
        width={45}
        height={45}
        alt="logo"
        className="dark:block  hidden"
      />
      <p className={cn("font-semibold", font.className)}>Motion</p>
    </div>
  );
};
