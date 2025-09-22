// 요청
export interface GetMaterialSummaryRequest {
  projectId: number;
}

// 응답
export interface GetMaterialSummaryResponse {
  inboundPercent: number;
  unitKindCount: number;
  totalCount: number;
  inboundCount: number;
  usedCount: number;
}
