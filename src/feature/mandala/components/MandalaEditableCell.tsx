import { useMandalaStore, type Status } from "@/lib/stores/mandalaStore";
import { cn } from "@/lib/utils";
import {
  forwardRef,
  useEffect,
  useMemo,
  type TextareaHTMLAttributes,
} from "react";
import type { CellData } from "../service/type";
import { useShallow } from "zustand/react/shallow";

type MandalaEditableCellProps = {
  goalId: string;
  // cell: CellData;
  isCenter: boolean;
  compact?: boolean;
  disabled: boolean;
  onContentChange: (
    e: React.FormEvent<HTMLTextAreaElement>,
    value: string
  ) => void;
  // onCancel: () => void;
};
function MandalaEditableCell(
  {
    goalId,
    // cell,
    compact,
    isCenter,
    disabled,
    onContentChange,
  }: // onCancel,
  MandalaEditableCellProps,
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
  useEffect(() => {
    console.log("EditableCell 마운트");
    console.log("cell", cell);
    return () => console.log("EditableCell 언마운트");
  }, []);

  // const isEditing = useMandalaStore(
  //   useShallow((state) => state.editingCellId === goalId)
  // );
  // if (!isEditing) return null;

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
