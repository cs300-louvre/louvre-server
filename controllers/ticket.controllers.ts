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

// export const getMyTickets = () => API.get<ITicketResponse[]>("/me/ticket");

//export const purchaseTicket = (type: IEOM, eomId: string) =>
//API.post(`/me/ticket?type=${type}&eomId=${eomId}`);

//export const getTicketById = (ticketId) =>
//API.get<ITicketResponse>(`/ticket/${ticketId}`);


// export const checkIn = (ticketId: string) =>
//   API.put(`/ticket/${ticketId}/checkin`);