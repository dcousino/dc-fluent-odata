const QueryBuilder = require("./dist/index");

var a = new QueryBuilder.QueryBuilder();

console.log(
  a
    .expand([
      { field: "one", select: "name,id" },
      {
        field: "two",
        select: "butts, nutts",
        filter: (f) => f.where("test gt '2'"),
        expand: [{ field: "nested", select: "name,id" }],
      },
    ])
    .select("name, test")
    .filter((f) =>
      f
        .where("test gt '2'")
        .or((o) =>
          o.where("queso eq 'cheese'").where("cheese eq 'queso'", "or")
        )
    )
    .build()
);
