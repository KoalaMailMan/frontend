import { useState } from "react";
import MandalaCell from "./MandaraCell";
import MandalaModal from "./MandaraModal";

export default function MandalaContainer() {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <div className={`grid grid-cols-3 gap-1 max-w-lg mx-auto aspect-square`}>
      {Array(9)
        .fill(2)
        .map((item, i) => (
          <>
            <MandalaCell
              key={i}
              compact={false}
              isCenter={Math.floor(9 / 2) === i}
              showAsEmpty={false}
              disabled={false}
              getModalVisible={setModalVisible}
            />
          </>
        ))}
      <MandalaModal
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
      />
    </div>
  );
}
