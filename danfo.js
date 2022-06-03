const dfd = require("danfojs-node");
const data = require("./data.js");

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

const dfByContent = df
  .groupby(["title"])
  .agg({
    member: "count",
  })
  .rename({ member_count: "download_count" })
  .sortValues("download_count", { ascending: false });

const dfByContentType = df
  .groupby(["typePlural"])
  .agg({
    member: "count",
  })
  .rename({ member_count: "download_count" })
  .sortValues("download_count", { ascending: false });

const dfByMemberType = df
  .groupby(["memberType"])
  .agg({
    member: "count",
  })
  .rename({ member_count: "download_count" })
  .sortValues("download_count", { ascending: false });

const dfInstructors = df.query(df["memberType"].eq("Instructor"));

const dfByUniversity = dfInstructors
  .groupby(["universityCompany"])
  .agg({
    member: "count",
  })
  .rename({ member_count: "download_count" })
  .sortValues("download_count", { ascending: false })
  .head(50);

// console.log(dfd.toJSON(dfByUniversity));

function sum_vals(col) {
  console.log(`col==`);
  console.log(col);
  return col.reduce((a, b) => a + b, 0);
}

const dfTest = dfByContentType.groupby(["typePlural"]).apply((x) => {
  console.log(x);
  return x;
});

// dfTest.print();
