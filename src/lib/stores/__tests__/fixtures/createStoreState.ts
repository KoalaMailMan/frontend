import {
  emptyDummyData,
  toFlatStructure,
  toLegacyStructure,
} from "@/feature/mandala/service/transform";
import { createServerMandalaFixture } from "./serverMandala";

export const createStoreFixture = () => {
  const server = createServerMandalaFixture();
  console.log(server);
  return {
    serverData: server.data,
    data: toLegacyStructure(emptyDummyData.data),
    flatData: toFlatStructure(server.data.core),
    changedCells: new Set() as Set<string>,
  };
};
