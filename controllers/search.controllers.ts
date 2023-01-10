import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
const levenshtein = require("fast-levenshtein");

import Museum from "../models/Museum";
import Event from "../models/Event";
import { IMuseumResponse, IEventResponse, ISearchResponse } from "../types";

exports.search = asyncHandler(
  async (req: Request, res: Response, next: any) => {
    let query: string = req.query.query as string;

    console.log(query);

    // created at up to 1 month ago
    let allMuseums = await Museum.find().lean();

    let allEvents = await Event.find().lean();

    // sort museum by name distance from the query, ascending
    allMuseums = allMuseums.sort((a, b) => {
      return levenshtein.get(a.name, query) - levenshtein.get(b.name, query);
    });

    // sort events by name distance from the query, ascending
    allEvents = allEvents.sort((a, b) => {
      return levenshtein.get(a.name, query) - levenshtein.get(b.name, query);
    });

    // return the first 5 results
    allMuseums = allMuseums.slice(0, 5);
    allEvents = allEvents.slice(0, 5);

    res.status(200).json({
      museums: allMuseums as IMuseumResponse[],
      events: allEvents as IEventResponse[],
    } as ISearchResponse);
  }
);
