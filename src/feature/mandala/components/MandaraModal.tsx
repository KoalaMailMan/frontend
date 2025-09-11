import { Button } from "@/feature/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/feature/ui/dialog";

type Props = {
  isModalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

export default function MandalaModal({
  isModalVisible,
  setModalVisible,
}: Props) {
  return (
    <Dialog open={isModalVisible} onOpenChange={() => setModalVisible(false)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>세부 목표 설정: </DialogTitle>
        </DialogHeader>
        <div className="space-y-4"></div>

        <Button variant="outline" onClick={() => setModalVisible(false)}>
          취소
        </Button>
        <Button>저장</Button>
      </DialogContent>
    </Dialog>
  );
}
