import { SsgRoute } from "next/dist/build";

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

export interface IMemberDownloadsSummary {
  memberName: string;
  // lastName: string;
  downloadCount: number;
  
}

export interface ICountryDownloadsSummary {
  country: string;
  title: SsgRoute;
  downloadCount: number;
  
}

export interface ICountriesList{
  country: string;
  downloadCount: number;
}

export interface IDownloadsSummary {
  dfByContent: IContentDownloadSummary[];
  dfByContentType: IContentTypeDownloadsSummary[];
  dfByMemberType: IMemberTypeDownloadsSummary[];
  dfByUniversity: IUniversityDownloadsSummary[];
  dfByYearMonth: IYearMonthDownloadsSummary[];
  dfByMemberName: IMemberDownloadsSummary[];
  dfByCountry: ICountryDownloadsSummary[];
  dfCountries: ICountriesList[];
}

