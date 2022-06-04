export interface IContentDownloadSummary {
  title: string;
  downloadCount: number;
  university: number;
  country: number;
  state: number;
}

export interface IContentTypeDownloadsSummary {
  typePlural: string;
  numMaterials: number;
  downloadCount;
}

export interface IMemberTypeDownloadsSummary {
  memberType: string;
  downloadCount: number;
}

export interface IUniversityDownloadsSummary {
  university: string;
  downloadCount: number;
}

export interface IYearMonthDownloadsSummary {
  yearMonth: string;
  downloadCount: number;
}
