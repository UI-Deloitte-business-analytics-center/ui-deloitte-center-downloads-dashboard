import * as dfd from "danfojs-node";

export async function retrieveSummary() {
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
        x.query(x["country"].eq("U.S.")).column("stateProvince").nUnique(),
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
  dfByContent.print();

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
    .rename({ distributedContent_count: "downloadCount" })
    .sortValues("downloadCount", { ascending: false });

  dfByContentType = dfd.merge({
    left: dfContentTypeCount,
    right: dfByContentType,
    on: ["typePlural"],
    how: "left",
  });

  dfByContentType.print();

  const dfByMemberType = df
    .groupby(["memberType"])
    .agg({
      distributedContent: "count",
    })
    .rename({ distributedContent_count: "downloadCount" })
    .sortValues("downloadCount", { ascending: false });

  dfByMemberType.print();

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
    .head(50);

  dfByUniversity.print();

  const dfByYearMonth = df
    .groupby(["yearMonth"])
    .agg({
      distributedContent: "count",
    })
    .sortValues("yearMonth")
    .rename({ distributedContent_count: "downloadCount" });

  dfByYearMonth.print();

  return {
    dfByContent: dfd.toJSON(dfByContent),
    dfByContentType: dfd.toJSON(dfByContentType, { format: "row" }),
    dfByMemberType: dfd.toJSON(dfByMemberType, { format: "row" }),
    dfByUniversity: dfd.toJSON(dfByUniversity, { format: "row" }),
    dfByYearMonth: dfd.toJSON(dfByYearMonth, { format: "row" }),
  };
}
