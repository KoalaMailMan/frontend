import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { useShallow } from "zustand/react/shallow";

type MandalaEditableCellProps = {
  goalId: string;
  isCenter: boolean;
  compact?: boolean;
  disabled: boolean;
  onContentChange: (
    e: React.FormEvent<HTMLTextAreaElement>,
    value: string
  ) => void;
};
function MandalaEditableCell(
  {
    goalId,
    compact,
    isCenter,
    disabled,
    onContentChange,
  }: MandalaEditableCellProps,
  ref: React.Ref<HTMLTextAreaElement>
) {
  const isModalOpen = useMandalaStore((state) => state.isModalOpen);
  const cell = useMandalaStore(
    useShallow((state) => state.flatData.cells[goalId])
  );
  const cancelEditing = useMandalaStore((state) => state.cancelEditing);
  // if (status === "DONE") return;
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      cancelEditing("enter");
    } else if (e.key === "Escape") {
      cancelEditing("escape");
    }
  };
  return (
    <div
      data-editable-cell
      data-mandala-cell={isModalOpen && "editing"}
      className={cn(
        "w-full h-full border-2 border-primary bg-white flex items-center justify-center relative rounded-lg",
        compact ? "p-1" : "p-2",
        isCenter && "bg-primary/10"
      )}
      style={{
        minHeight: compact ? "40px" : "100px",
        aspectRatio: "1",
      }}
    >
      <textarea
        ref={ref}
        // autoFocus
        // onFocus={(e) => {
        //   console.log(e);
        //   e.target.select();
        //   e.target.style.height = "auto";
        //   e.target.style.height = e.target.scrollHeight + "px";
        // }}
        className={cn(
          "w-full h-full resize-none border-none outline-none bg-transparent text-center leading-tight",
          compact ? "text-xs" : "text-sm"
        )}
        style={{ minHeight: "20px" }}
        maxLength={40}
        value={cell.content}
        onChange={(e) => onContentChange(e, e.target.value)}
        onMouseDown={(e) => e.stopPropagation()}
        onBlur={(e) => cancelEditing("blur", e)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
    </div>
  );
}
export default forwardRef(MandalaEditableCell);
