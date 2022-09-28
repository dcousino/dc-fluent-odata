export class FilterBuilder {
  private _filter: string = "";

  where = (filter: string, operator: "and" | "or" = "and") => {
    if (this._filter) {
      this._filter += ` ${operator} ${filter}`;
    } else {
      this._filter = filter;
    }
    return this;
  };
  and = (fn: (filter: FilterBuilder) => FilterBuilder) => {
    this._filter += ` and (${fn(new FilterBuilder()).build()})`;
    return this;
  };
  or = (fn: (filter: FilterBuilder) => FilterBuilder) => {
    this._filter += ` or (${fn(new FilterBuilder()).build()})`;
    return this;
  };
  build = () => {
    return this._filter;
  };
}
