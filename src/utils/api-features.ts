import { Query } from "mongoose";
import { ParsedQs } from "qs";

type QueryString = {
  page?: string;
  sort?: string;
  limit?: string;
  fields?: string;
  [key: string]: string | string[] | ParsedQs | ParsedQs[] | undefined;
};

type MongooseQuery<T> = Query<T[], T> & {
  find: (query: object) => MongooseQuery<T>;
  sort: (sortBy: string) => MongooseQuery<T>;
  select: (fields: string) => MongooseQuery<T>;
  skip: (skip: number) => MongooseQuery<T>;
  limit: (limit: number) => MongooseQuery<T>;
};

export default class APIFeatures<T> {
  private query: MongooseQuery<T>;
  private queryString: QueryString;

  constructor(query: MongooseQuery<T>, queryString: ParsedQs) {
    this.query = query;
    this.queryString = this.parseQueryString(queryString);
  }

  private parseQueryString(queryString: ParsedQs): QueryString {
    const parsed: QueryString = {};
    Object.keys(queryString).forEach((key) => {
      const value = queryString[key];

      if (Array.isArray(value)) {
        parsed[key] = value;
      } else if (typeof value === "object") {
        parsed[key] = JSON.stringify(value);
      } else {
        parsed[key] = value;
      }
    });

    return parsed;
  }

  filter(): this {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort(): this {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields(): this {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate(): this {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  public getQuery() {
    return this.query;
  }
}
