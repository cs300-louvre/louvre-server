import { Response, Request } from "express";
import asyncHandler from "express-async-handler";

import Museum from "../models/Museum";
import Event from "../models/Event";
import type { IMuseumResponse, IEventResponse } from "../types";

// @desc    Get all museums with at most 3 museums per genres
// @route   GET /browse/museum
// @access  Public
exports.getBrowseMuseums = asyncHandler(
  async (req: Request, res: Response, next: any) => {
    // Fetch all museums from the API
    const museums = await Museum.find();

    // sort museum by createdAt (timestamp string), newest first
    museums.sort((a, b) => {
      return parseInt(b.createdAt) - parseInt(a.createdAt);
    });

    // Group the museums by genre
    const museumsByGenre = museums.reduce((acc, museum) => {
      acc[museum.genre] = acc[museum.genre] || [];
      acc[museum.genre].push(museum);
      return acc;
    }, {} as { [genre: string]: IMuseumResponse[] });

    // Keep at most 3 museums for each genre
    const filteredMuseums = Object.entries(museumsByGenre).map(
      ([genre, museums]) => {
        return museums.slice(0, 3);
      }
    );

    // Flatten the array of museums
    const data = filteredMuseums.flat();

    res.status(200).json(data);
  }
);

// @desc    Get all events with at most 3 events per genres
// @route   GET /browse/event
// @access  Public
exports.getBrowseEvents = asyncHandler(
  async (req: Request, res: Response, next: any) => {
    // Fetch all events from the API
    const events = await Event.find();

    // sort events by createdAt (timestamp string), newest first
    events.sort((a, b) => {
      return parseInt(b.createdAt) - parseInt(a.createdAt);
    });

    // Group the events by genre
    const eventsByGenre = events.reduce((acc, event) => {
      acc[event.genre] = acc[event.genre] || [];
      acc[event.genre].push(event);
      return acc;
    }, {} as { [genre: string]: IEventResponse[] });

    // Keep at most 3 events for each genre
    const filteredEvents = Object.entries(eventsByGenre).map(
      ([genre, events]) => {
        return events.slice(0, 3);
      }
    );

    // Flatten the array of events
    const data = filteredEvents.flat();

    res.status(200).json(data);
  }
);

// @desc    Get list of events with descending numOfFollowers (integers)
// @route   GET /browse/event_chart
// @access  Public
exports.getEventChart = asyncHandler(
  async (req: Request, res: Response, next: any) => {
    // Fetch all events from the API
    const events = await Event.find();

    // sort events by number of followers, descending integers
    events.sort((a, b) => {
      return b.numOfFollowers - a.numOfFollowers;
    });

    // Keep at most 3 events
    const data = events.slice(0, 3);

    res.status(200).json(data);
  }
);

// @desc    Get list of museums with descending numOfFollowers (integers)
// @route   GET /browse/museum_chart
// @access  Public
exports.getMuseumChart = asyncHandler(
  async (req: Request, res: Response, next: any) => {
    // Fetch all museums from the API
    const museums = await Museum.find();

    // sort museums by number of followers, descending integers
    museums.sort((a, b) => {
      return b.numOfFollowers - a.numOfFollowers;
    });

    // Keep at most 3 museums
    const data = museums.slice(0, 3);

    res.status(200).json(data);
  }
);
