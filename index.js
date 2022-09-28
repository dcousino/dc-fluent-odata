Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const filterBuilder_1 = require("./filterBuilder");
class QueryBuilder {
    constructor() {
        this.operations = {
            select: "",
            expand: "",
            filter: "",
            orderBy: "",
            top: "",
            skip: "",
            count: "",
        };
        this.orderBy = (fields) => {
            this.operations["orderBy"] = `$orderby=${fields}`;
            return this;
        };
        this.top = (top) => {
            this.operations["top"] = `$top=${top}`;
            return this;
        };
        this.skip = (skip) => {
            this.operations["skip"] = `$skip=${skip}`;
            return this;
        };
        this.count = () => {
            this.operations["count"] = `$count=true`;
            return this;
        };
        this.filter = (fn) => {
            this.operations["filter"] = `$filter=${fn(new filterBuilder_1.FilterBuilder()).build()}`;
            return this;
        };
        this.expand = (field, fn) => {
            if (this.operations["expand"]) {
                this.operations["expand"] += `,${field}${fn ? `(${fn(new QueryBuilder())._build()})` : ""}`;
            }
            else {
                this.operations["expand"] = `$expand=${field}${fn ? `(${fn(new QueryBuilder())._build()})` : ""}`;
            }
            return this;
        };
        this.select = (fields) => {
            this.operations["select"] = `$select=${fields}`;
            return this;
        };
        this.build = () => {
            return "?" + this._build();
        };
        this._build = () => {
            const operations = Object.entries(this.operations).filter((x) => x[1]);
            return operations.map((sf) => sf[1]).join("&");
        };
    }
}
exports.QueryBuilder = QueryBuilder;
