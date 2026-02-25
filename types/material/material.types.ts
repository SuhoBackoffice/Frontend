// 요청
export interface GetMaterialSummaryRequest {
  projectId: number;
}

export interface GetMaterialInboundHistroyRequest {
  projectId: number;
  keyword?: string;
}

/** 페이징 조회 요청 (sort 기본 LATEST, type 없으면 ALL) */
export interface GetMaterialHistoryPagedRequest {
  projectId: number;
  keyword?: string;
  sort?: 'LATEST' | 'OLDEST';
  type?: string;
  page: number;
  size: number;
}

export interface GetMaterialInboundDetailHistroyRequest {
  projectId: number;
  keyword?: string;
  date: string;
}

export interface GetMaterialSearchRequest {
  projectId: number;
  keyword: string;
}

export interface PostMaterialInboundRequest {
  projectId: number;
  materials: MaterialInboundItemRequest[];
}

export interface MaterialInboundItemRequest {
  projectMaterialStockId: number;
  quantity: number;
}

// 응답
export interface GetMaterialSummaryResponse {
  inboundPercent: number;
  unitKindCount: number;
  totalCount: number;
  inboundCount: number;
  usedCount: number;
}

export interface GetMaterialInboundHistoryResponse {
  date: string;
  kindCount: number;
  totalCount: number;
}

/** 페이징 이력 한 건 */
export interface MaterialHistoryItemResponse {
  id: number;
  materialCode: string;
  itemName: string;
  quantity: number;
  description: string;
  type: string;
  createdAt: string;
}

export interface GetMaterialInboundDetailHistoryResponse {
  id: number;
  drawingNumber: string;
  itemName: string;
  receivedAt: string;
  quantity: number;
}

export interface GetMaterialSearchResponse {
  id: number;
  drawingNumber: string;
  itemName: string;
  /** 입고 필요 수량 (정보성, 강제 아님) */
  needInboundQuantity: number;
}

// 자재 재고 현황
export type MaterialStockSortType =
  | 'MATERIAL_CODE'
  | 'ITEM_NAME'
  | 'PLAN_QUANTITY'
  | 'INBOUND_QUANTITY'
  | 'USED_QUANTITY';

export type MaterialStockDirType = 'ASC' | 'DESC';

export interface GetMaterialStockSortResponse {
  sort: MaterialStockSortType;
  description: string;
}

export interface GetMaterialStockListRequest {
  projectId: number;
  sort: MaterialStockSortType;
  dir: MaterialStockDirType;
  keyword?: string;
}

export interface GetMaterialStockItemResponse {
  id: number;
  materialCode: string;
  itemName: string;
  totalPlanQuantity: number;
  totalInboundQuantity: number;
  totalUsedQuantity: number;
  remainingInbound: number;
}
