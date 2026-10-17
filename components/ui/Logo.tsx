import Image from "next/image";
import { LOGO_SIZE } from "@/lib/logo-variants";

type LogoProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** Set when the surrounding link already names the brand, so screen readers don't hear it twice. */
  decorative?: boolean;
};

export function Logo({ className = "h-12 w-auto", priority = false, sizes = "58px", decorative = false }: LogoProps) {
  const shared = {
    width: LOGO_SIZE.width,
    height: LOGO_SIZE.height,
    priority,
    sizes,
    className: `object-contain ${className}`,
  };
  return decorative ? (
    <Image src="/brand/vision-forge-logo.png" alt="" {...shared} />
  ) : (
    <Image src="/brand/vision-forge-logo.png" alt="Vision Forge Studio" {...shared} />
  );
}
