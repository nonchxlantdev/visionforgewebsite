import Image from "next/image";

type LogoProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function Logo({
  className = "h-12 w-12",
  priority = false,
  sizes = "48px",
}: LogoProps) {
  return (
    <Image
      src="/brand/vision-forge-logo.png"
      alt="Vision Forge Studio"
      width={819}
      height={819}
      priority={priority}
      sizes={sizes}
      className={`object-contain ${className}`}
    />
  );
}
