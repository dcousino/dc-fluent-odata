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

  expand = (field: string, fn: (bldr: QueryBuilder) => QueryBuilder) => {
    if (this.operations["expand"]) {
      this.operations["expand"] += `,${field}${
        fn ? `(${fn(new QueryBuilder())._build()})` : ""
      }`;
    } else {
      this.operations["expand"] = `$expand=${field}${
        fn ? `(${fn(new QueryBuilder())._build()})` : ""
      }`;
    }

    return this;
  };
  select = (fields: string) => {
    this.operations["select"] = `$select=${fields}`;
    return this;
  };
  build = () => {
    return "?" + this._build();
  };

  private _build = () => {
    const operations = Object.entries(this.operations).filter((x) => x[1]);

    return operations.map((sf) => sf[1]).join("&");
  };
}
