import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const noticeVariants = cva("mailbox-card mx-auto p-8 bg-white/92", {
  variants: {
    variant: {
      default: "max-w-lg relative",
      max: "max-w-2xl",
    },
    shadow: {
      none: "",
      xl: "shadow-2xl",
    },
    defaultVariants: {
      variant: "default",
      shadow: "none",
    },
  },
});

type Props = { children: React.ReactNode } & VariantProps<
  typeof noticeVariants
> & { className?: string };
export default function NoticeContainer({
  children,
  variant,
  shadow,
  className,
}: Props) {
  return (
    <div className={cn(noticeVariants({ variant, shadow, className }))}>
      {children}
    </div>
  );
}
