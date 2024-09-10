import { NextFunction, Request, Response } from "express";
import {
  Document,
  Model,
  PopulateOptions as MongoosePopulateOptions,
} from "mongoose";
import { AppError, CatchAsync, APIFeatures } from "../utils";

type ModelType<T extends Document> = Model<T>;

type PopulateOptions =
  | string
  | MongoosePopulateOptions
  | Array<string | MongoosePopulateOptions>;

const deleteOne = <T extends Document>(model: ModelType<T>) =>
  CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

const updateOne = <T extends Document>(model: ModelType<T>) =>
  CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

const createOne = <T extends Document>(model: ModelType<T>) =>
  CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

const getOne = <T extends Document>(
  model: Model<T>,
  popOptions?: PopulateOptions
) =>
  CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = model.findById(req.params.id);

    if (popOptions) {
      if (typeof popOptions === "string" || Array.isArray(popOptions)) {
        query = query.populate(popOptions as string | Array<string>);
      } else {
        query = query.populate(popOptions as MongoosePopulateOptions);
      }
    }

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

const getAll = <T extends Document>(model: ModelType<T>) =>
  CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let filter: Record<string, unknown> = {};

    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.getQuery();

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: doc,
    });
  });

export { deleteOne, updateOne, getOne, getAll, createOne };
