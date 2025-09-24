import { themes, type ThemeColor } from "@/data/themes";
import { Button } from "@/feature/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/feature/ui/Dialog";
import { cn } from "@/lib/utils";
import { Check, Palette } from "lucide-react";
import { useState } from "react";

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
          size="sm"
          className={cn("pixel-button gap-2", className)}
        >
          <div
            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: currentThemeData?.color }}
          />
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">테마</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="pixel-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="pixel-subtitle flex items-center gap-2">
            🎨 코알라트 테마 선택
          </DialogTitle>
          <DialogDescription>
            원하는 색상 테마를 선택하여 앱 전체의 색상을 변경하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 p-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                onThemeChange(theme.id);
                setVisible(false);
              }}
              className={`
                relative p-4 rounded-lg border-2 transition-all pixel-button
                ${
                  currentTheme === theme.id
                    ? "border-current shadow-lg transform scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
              style={{
                backgroundColor:
                  currentTheme === theme.id ? `${theme.color}10` : "white",
                borderColor:
                  currentTheme === theme.id ? theme.color : undefined,
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: theme.color }}
                />
                <div className="text-center">
                  <div
                    className="font-medium text-sm"
                    style={{ color: theme.color }}
                  >
                    {theme.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {theme.description}
                  </div>
                </div>

                {true && (
                  <div
                    className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: theme.color }}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
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
