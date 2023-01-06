const User = require("../models/User");

const { Types, isValidObjectId } = require("mongoose");
import { Response, Request } from "express";
import asyncHandler from "express-async-handler";

import Ticket from "../models/Ticket";
import ErrorResponse from "../utils/errorResponse";
import type { ITicketCoreData, ITicketResponse } from "../types";
import {
  RequestWithUser,
  GenericRequestWithUser,
} from "../utils/requestWithUser";

//export const getTicketById = (ticketId) =>
//API.get<ITicketResponse>(`/ticket/${ticketId}`);


// export const checkIn = (ticketId: string) =>
//   API.put(`/ticket/${ticketId}/checkin`);