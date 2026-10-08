import Image from "next/image";
import { LOGO_SIZE } from "@/lib/logo-variants";

type LogoProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function Logo({ className = "h-12 w-auto", priority = false, sizes = "58px" }: LogoProps) {
  return (
    <Image
      src="/brand/vision-forge-logo.png"
      alt="Vision Forge Studio"
      width={LOGO_SIZE.width}
      height={LOGO_SIZE.height}
      priority={priority}
      sizes={sizes}
      className={`object-contain ${className}`}
    />
  );
}
