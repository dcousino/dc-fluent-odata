declare class FilterBuilder {
    private _filter;
    where: (filter: string, operator?: "and" | "or") => this;
    and: (fn: (filter: FilterBuilder) => FilterBuilder) => this;
    or: (fn: (filter: FilterBuilder) => FilterBuilder) => this;
    build: () => string;
}

declare type ExpandProps = {
    field: string;
    select?: string;
    expand?: ExpandProps[];
    filter?: (filter: FilterBuilder) => FilterBuilder;
};
declare type OdataOperations = "select" | "expand" | "filter" | "orderBy" | "top" | "skip" | "count";
declare class QueryBuilder {
    private operations;
    orderBy: (fields: string) => this;
    top: (top: number) => this;
    skip: (skip: number) => this;
    count: () => this;
    filter: (fn: (filter: FilterBuilder) => FilterBuilder) => this;
    expand: (field: string, fn: (bldr: QueryBuilder) => QueryBuilder) => this;
    select: (fields: string) => this;
    build: () => string;
    private _build;
}

export { ExpandProps, OdataOperations, QueryBuilder };
