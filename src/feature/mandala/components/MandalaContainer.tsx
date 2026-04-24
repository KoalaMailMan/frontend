// import React, { useCallback, useEffect, useRef } from "react";
// import MandalaReadOnlyCell from "./MandalaReadOnlyCell";
// import MandalaEditableCell from "./MandalaEditableCell";
// import {
//   useMandalaStore,
// } from "@/lib/stores/mandalaStore";

// type MandalaContainerCellProps = {
//   goalId: string;
//   type?: string;
//   isCenter: boolean;
//   disabled: boolean;
//   compact: boolean;
//   className?: string;
//   "data-tutorial"?: string;
//   tutorialArrowButton?: boolean;
//   onDetailClick?: () => void;
//   editingCellId: string | null;
//   // item: MainGoal | SubGoal;
//   // isEditing: boolean;
//   // isEmpty: boolean;
//   // onStartEdit: () => void;
//   // onContentChange: (value: string) => void;
//   // onCancelEdit: () => void;
// };

// export default React.memo(function MandalaContainer({
//   // item,
//   // isEditing,
//   // isEmpty,
//   disabled,
//   goalId,
//   // type,
//   // isCenter,
//   compact,
//   className,
//   "data-tutorial": dataTutorial,
//   tutorialArrowButton = false,
//   // onStartEdit,
//   // onContentChange,
//   // onCancelEdit,
//   // editingCellId,
//   onDetailClick,
// }: MandalaContainerCellProps) {
//   const isCenter = goalId === "core-0";
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const item = useMandalaStore((state) => state.flatData?.cells[goalId]);
//   const editingMainCellId = useMandalaStore((state) => state.editingCellId);
//   const editingFullCellId = useMandalaStore((state) => state.editingFullCellId);
//   const editingSubCellId = useMandalaStore((state) => state.editingSubCellId);
//   const isFullOpen = useMandalaStore((state) => state.isFullOpen);
//   const isModalOpen = useMandalaStore((state) => state.isModalOpen);
//   const setEditingMainCell = useMandalaStore((state) => state.setEditingCell);
//   const setEditingSubCell = useMandalaStore((state) => state.setEditingSubCell);
//   const setEditingFullCell = useMandalaStore(
//     (state) => state.setEditingFullCell
//   );
//   const editingCellId = isFullOpen
//     ? editingFullCellId
//     : isModalOpen
//     ? editingSubCellId
//     : editingMainCellId;
//   console.log(editingCellId);
//   const isEditing = editingCellId === goalId;
//   const setEditingCell = isFullOpen
//     ? setEditingFullCell
//     : isModalOpen
//     ? setEditingSubCell
//     : setEditingMainCell;

//   const handleCellChange = useMandalaStore((state) => state.handleCellChange);
//   useEffect(() => {
//     console.log(textareaRef.current);
//     if (isEditing && textareaRef.current) {
//       textareaRef.current.focus();
//       textareaRef.current.select();

//       const textarea = textareaRef.current;
//       textarea.style.height = "auto";
//       textarea.style.height = textarea.scrollHeight + "px";
//     }
//   }, [isEditing]);

//   const handleStartEdit = () => {
//     if (item?.status === "DONE") return;
//     console.log("before:", goalId);
//     setEditingCell(goalId);
//     console.log("after:", useMandalaStore.getState().editingCellId);
//   };
//   const handleCancelEdit = useCallback(
//     () => setEditingCell(null),
//     [setEditingCell]
//   );

//   const handleContentChange = useCallback(
//     (value: string) => {
//       handleCellChange(goalId, value);
//       if (textareaRef.current) {
//         const textarea = textareaRef.current;
//         textarea.style.height = "auto";
//         textarea.style.height = textarea.scrollHeight + "px";
//       }
//     },
//     [goalId, handleCellChange]
//   );

//   if (isEditing) {
//     return (
//       <MandalaEditableCell
//         ref={textareaRef}
//         isCenter={isCenter}
//         compact={compact}
//         content={item.content}
//         status={item.status}
//         disabled={disabled}
//         // onContentChange={handleContentChange}
//         onCancel={handleCancelEdit}
//       />
//     );
//   }

//   return (
//     <MandalaReadOnlyCell
//       className={className}
//       // type={type}
//       // id={item!.goalId}
//       isCenter={isCenter}
//       compact={compact}
//       content={item!.content}
//       status={item!.status}
//       disabled={disabled}
//       isEmpty={!item!.content || item!.content.trim() === ""}
//       data-tutorial={dataTutorial}
//       tutorialArrowButton={tutorialArrowButton}
//       onCellClick={handleStartEdit}
//       onDetailClick={onDetailClick}
//     />
//   );
// });
