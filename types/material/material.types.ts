// 요청
export interface GetMaterialSummaryRequest {
  projectId: number;
}

export interface GetMaterialInboundHistroyRequest {
  projectId: number;
  keyword?: string;
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
  drawingNumber: string;
  itemName: string;
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
}
