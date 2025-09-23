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
