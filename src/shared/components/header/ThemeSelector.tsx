import { themes, type ThemeColor } from "@/data/themes";
import Button from "@/feature/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/feature/ui/Dialog";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Palette from "./icons/Palette";

type ThemeSelectorProps = {
  currentTheme: ThemeColor;
  onThemeChange: (theme: ThemeColor) => void;
  className?: string;
};

export default function ThemeSelector({
  currentTheme,
  onThemeChange,
  className,
}: ThemeSelectorProps) {
  const [visible, setVisible] = useState(false);

  const currentThemeData = themes.find((item) => item.id === currentTheme);

  return (
    <Dialog open={visible} onOpenChange={setVisible}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className={cn("pixel-button gap-2", className)}
          aria-label="테마 선택기 열기"
        >
          <div
            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: currentThemeData?.borderColor }}
          />
          <Palette />
          <span className="hidden sm:inline">테마</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="pixel-card max-w-[427px]">
        <DialogHeader className="h-[40px]">
          <DialogTitle className="pixel-subtitle flex items-center gap-2">
            🎨 테마 선택
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className={`
                w-[180px] h-[140px] relative rounded-[10px] border-1 transition-all mb-[20px]
                ${
                  currentTheme === theme.id
                    ? `border-[${theme.borderColor}]`
                    : "border-[#CCCCCC]"
                }
              `}
              style={{
                backgroundColor:
                  currentTheme === theme.id ? `${theme.color}` : "white",
                borderColor:
                  currentTheme === theme.id ? theme.borderColor : "#CCCCCC",
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-[156px] h-[104px] rounded-[6px]"
                  style={{
                    backgroundImage: `url(${theme.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: theme.color,
                  }}
                />
                <div className="text-center">
                  {/* <div
                    className="font-medium text-sm"
                    style={{ color: theme.color }}
                  >
                    {theme.name}
                  </div> */}
                  <div className="text-xs text-gray-500">
                    {theme.description}
                  </div>
                </div>

                {/* {currentTheme === theme.id && (
                  <div
                    className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: theme.color }}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )} */}
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-xs text-gray-600">
            선택한 테마는 앱 전체에 적용됩니다 🌈
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
