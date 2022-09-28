import { FilterBuilder } from "./filterBuilder";

export type ExpandProps = {
  field: string;
  select?: string;
  expand?: ExpandProps[];
  filter?: (filter: FilterBuilder) => FilterBuilder;
};

export type OdataOperations =
  | "select"
  | "expand"
  | "filter"
  | "orderBy"
  | "top"
  | "skip"
  | "count";

export class QueryBuilder {
  private operations: Record<OdataOperations, string> = {
    select: "",
    expand: "",
    filter: "",
    orderBy: "",
    top: "",
    skip: "",
    count: "",
  };
  orderBy = (fields: string) => {
    this.operations["orderBy"] = `$orderby=${fields}`;
    return this;
  };
  top = (top: number) => {
    this.operations["top"] = `$top=${top}`;
    return this;
  };
  skip = (skip: number) => {
    this.operations["skip"] = `$skip=${skip}`;
    return this;
  };
  count = () => {
    this.operations["count"] = `$count=true`;
    return this;
  };
  filter = (fn: (filter: FilterBuilder) => FilterBuilder) => {
    this.operations["filter"] = `$filter=${fn(new FilterBuilder()).build()}`;
    return this;
  };
  private _expand = (fieldsAndSelects: ExpandProps[]) => {
    if (fieldsAndSelects) {
      const smt = fieldsAndSelects
        .map(
          (x) =>
            x.field +
            `(${x.select ? `$select=${x.select}` : ""}${
              x.expand ? `&$expand=${this._expand(x.expand)}` : ""
            }${
              x.filter
                ? `&$filter=${x.filter(new FilterBuilder()).build()}`
                : ""
            })`
        )
        .join(",");
      return smt;
    }
    return "";
  };
  expand = (props: ExpandProps[]) => {
    const smt = this._expand(props);
    this.operations["expand"] = `$expand=${smt}`;
    return this;
  };
  select = (fields: string) => {
    this.operations["select"] = `$select=${fields}`;
    return this;
  };

  build = () => {
    const operations = Object.entries(this.operations).filter((x) => x[1]);

    let query = "?" + operations.map((sf) => sf[1]).join("&");

    return query;
  };
}
