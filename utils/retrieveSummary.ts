import * as dfd from "danfojs";
import {
  IContentDownloadSummary,
  IContentTypeDownloadsSummary,
  IDownloadsSummary,
  IMemberTypeDownloadsSummary,
  IUniversityDownloadsSummary,
  IYearMonthDownloadsSummary,
  IMemberDownloadsSummary,
} from "../types/downloads-summary";

const stateAbbrevationMap = {
  alabama: "AL",
  alaska: "AK",
  arizona: "AZ",
  arkansas: "AR",
  california: "CA",
  colorado: "CO",
  connecticut: "CT",
  delaware: "DE",
  florida: "FL",
  georgia: "GA",
  hawaii: "HI",
  idaho: "ID",
  illinois: "IL",
  indiana: "IN",
  iowa: "IA",
  kansas: "KS",
  kentucky: "KY",
  louisiana: "LA",
  maine: "ME",
  maryland: "MD",
  massachusetts: "MA",
  michigan: "MI",
  minnesota: "MN",
  mississippi: "MS",
  missouri: "MO",
  montana: "MT",
  nebraska: "NB*",
  nevada: "NV",
  "new hampshire": "NH",
  "new jersey": "NJ",
  "new mexico": "NM",
  "new york": "NY",
  "north carolina": "NC",
  "north dakota": "ND",
  ohio: "OH",
  oklahoma: "OK",
  oregon: "OR",
  pennsylvania: "PA",
  "rhode island": "RI",
  "south carolina": "SC",
  "south dakota": "SD",
  tennessee: "TN",
  texas: "TX",
  utah: "UT",
  vermont: "VT",
  virginia: "VA",
  washington: "WA",
  "west virginia": "WV",
  wisconsin: "WI",
  wyoming: "WY",
};

export async function retrieveSummary(): Promise<IDownloadsSummary> {
  const res = await fetch(
    `https://centerforanalytics.giesbusiness.illinois.edu/_functions/downloads_summary`
  );
  const data = await res.json();

  const memberData = new dfd.DataFrame(data.memberData);

  memberData.rename({ i: "member" }, { inplace: true });

  const distributedContent = new dfd.DataFrame(data.distributedContent);
  distributedContent.rename({ i: "distributedContent" }, { inplace: true });

  const capturedDownloads = new dfd.DataFrame(data.capturedDownloads);

  let df1 = dfd.merge({
    left: capturedDownloads,
    right: memberData,
    on: ["member"],
    how: "left",
  });

  let df = dfd.merge({
    left: df1,
    right: distributedContent,
    on: ["distributedContent"],
    how: "left",
  });

  df.addColumn("yearMonth", df.column("downloadedAt").str.substr(0, 7), {
    inplace: true,
  });

  df.drop({ columns: ["downloadedAt"], inplace: true });

  let groupByColumn = "title";
  const dfByContent = df
    .loc({
      columns: [
        groupByColumn,
        "typePlural",
        "memberType",
        "universityCompany",
        "country",
        "stateProvince",
      ],
    })
    .groupby([groupByColumn])
    .apply((x) => {
      const originalIndices = x.index;

      const newRow = [
        x.column(groupByColumn).iat(0),
        x.column("typePlural").count(),
        "",
        x
          .query(x["memberType"].ne("Other"))
          .column("universityCompany")
          .nUnique(),
        x.column("country").nUnique(),
        x
          .query(x["country"].eq("U.S."))
          .column("stateProvince")
          .apply((state) => {
            const stateLower = String(state).trim().toLowerCase();

            if (
              Object.values(stateAbbrevationMap).includes(
                stateLower.toUpperCase()
              )
            ) {
              return stateLower.toUpperCase();
            } else if (Object.keys(stateAbbrevationMap).includes(stateLower)) {
              return stateAbbrevationMap[stateLower];
            } else {
              return null;
            }
          })
          .nUnique(),
      ];

      const y = x.append(
        [newRow] as any,
        [String(Number(x.index[x.index.length - 1])) + 1] as any
      );
      y.drop({ index: originalIndices, inplace: true });

      return y;
    });
  dfByContent.drop({
    columns: [`${groupByColumn}_Group`, "memberType"],
    inplace: true,
  });
  dfByContent.rename(
    {
      universityCompany: "university",
      stateProvince: "state",
      typePlural: "downloadCount",
    },
    { inplace: true }
  );
  dfByContent.sortValues("downloadCount", { ascending: false, inplace: true });

  const dfContentTypeCount = distributedContent
    .groupby(["typePlural"])
    .agg({
      distributedContent: "count",
    })
    .rename({ distributedContent_count: "numMaterials" });

  let dfByContentType = df
    .groupby(["typePlural"])
    .agg({
      distributedContent: "count",
    })
    .rename({ distributedContent_count: "downloadCount" });

  dfByContentType = dfd.merge({
    left: dfContentTypeCount,
    right: dfByContentType,
    on: ["typePlural"],
    how: "left",
  });

  dfByContentType.sortValues("downloadCount", {
    ascending: false,
    inplace: true,
  });

  const dfByMemberType = df
    .groupby(["memberType"])
    .agg({
      distributedContent: "count",
    })
    .rename({ distributedContent_count: "downloadCount" })
    .sortValues("downloadCount", { ascending: false })
    .fillNa(["Unknown or no longer a registered member"], {
      columns: ["memberType"],
    });

  const dfInstructors = df.query(df["memberType"].eq("Instructor"));
  const dfByUniversity = dfInstructors
    .groupby(["universityCompany"])
    .agg({
      distributedContent: "count",
    })
    .rename({
      universityCompany: "university",
      distributedContent_count: "downloadCount",
    })
    .sortValues("downloadCount", { ascending: false })
    .head(100);

  const dfByYearMonth = df
    .groupby(["yearMonth"])
    .agg({
      distributedContent: "count",
    })
    .sortValues("yearMonth")
    .rename({ distributedContent_count: "downloadCount" });

  const dfByMemberName = df
    .groupby(["member", "firstName", "lastName", "memberType"])
    .agg({
      distributedContent: "count",
    })
    .rename({
      distributedContent_count: "downloadCount",
    })
    .sortValues("downloadCount", { ascending: false })
    .head(50)
    .dropNa({ axis: 1 });

  return {
    dfByContent: dfd.toJSON(dfByContent) as IContentDownloadSummary[],
    dfByContentType: dfd.toJSON(
      dfByContentType
    ) as IContentTypeDownloadsSummary[],
    dfByMemberType: dfd.toJSON(dfByMemberType) as IMemberTypeDownloadsSummary[],
    dfByUniversity: dfd.toJSON(dfByUniversity) as IUniversityDownloadsSummary[],
    dfByYearMonth: dfd.toJSON(dfByYearMonth) as IYearMonthDownloadsSummary[],
    dfByMemberName: dfd.toJSON(dfByMemberName) as IMemberDownloadsSummary[],
  };
}
