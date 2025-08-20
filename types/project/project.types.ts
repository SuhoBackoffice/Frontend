export interface NewProjectRequest {
  versionId: number;
  region: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface ProjectSearchSortRequest {
  id: string;
  name: string;
}
