export interface StraightTypeResponse {
  id: number;
  type: string;
}

export interface StraightLoopTypeResponse {
  id: number;
  type: string;
}

export interface SerialInfo {
  serial: string;
  serialState: string;
  productionState: string;
  producedAt: string | null;
  inactiveReason: string | null;
}

export interface StraightDetailResponse {
  serial: string;
  length: number;
  totalQuantity: number;
  completedQuantity: number;
  isLoopRail: boolean;
  holePosition: number;
  serialInfoList: SerialInfo[];
}

export interface StraightBomItem {
  straightBomId: number;
  materialCode: string;
  itemName: string;
  unitQuantity: number;
}
