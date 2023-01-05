export type ISignInData = {
  email: string;
  password: string;
};

export type ISignUpData = ISignInData & {
  name: string;
};

export type ISignInResponse = {
  token: string;
};

export type ISignUpResponse = ISignInResponse;

export type IRole = "admin" | "manager" | "user";

export type IGetMeResponse = {
  userId: string;
  email: string;
  name: string;
  thumbnailUrl: string;
  role: IRole;
};

export type IFollowedMuseum = {
  museumId: string;
  thumbnailUrl: string;
  name: string;
  rating: number;
};

export type IFollowedEvent = {
  eventId: string;
  thumbnailUrl: string;
  name: string;
  rating: number;
};

export type ITicketStatus = "wait" | "paid" | "used";
export type ITicketResponse = {
  ticketId: string;
  userId: string;
  eomId: string;
  purchasedAt: string;
  thumbnailUrl: string; // Get the thumbnail of the museum or the event that sells this ticket
  name: string;
  price: number;
  location: string;
  startTime?: string; // If museum entrance ticket then there is no start or end time
  endTime?: string;
  status: ITicketStatus;
};

export type IEOM = "event" | "museum";

export type IRatingCoreData = {
  museumId: string;
  rating: number;
  content: string;
};
export type IRatingResponse = {
  ratingId: string;
  userId: string;
  museumId: string;
  thumbnailUrl: string; // the thumbnail of the user who rate
  rating: number;
  content: string;
  userName: string;
  createdAt: string;
};

export type INotificationType = "museum" | "event" | "system" | "message";

export type INotificationResponse = {
  thumbnailUrl: string;
  name: string;
  content: string;
  notificationId: string;
  type: INotificationType;
  sourceId: string;
  // if type === museum, then sourceId would be a museumId, similarly for type === "event";
  // if type === "message" then sourceId would be a userId; if type === "system", then this could be null
};

export type IConversationPreviewResponse = {
  conversationId: string;
  name: string; // GET THE NAME OF THE ONE WHO SEND THE LATEST MESSAGE
  content: string; // GET THE LATEST TEXT OF THE CONVERSATION WHETHER IT IS FROM THE CURRENT USER OF THE OTHER ONE
  userId: string; // GET THE USER ID OF THE OTHER ONE IN THE CONVERSATION
  thumbnailUrl: string; // GET THE THUMBNAIL OF THE OTHER USER
  sentAt: string;
};

export type IPostCoreData = {
  title: string;
  body: string;
  imageBase64: string;
  eomId: string;
};

export type IPostResponse = {
  createdAt: string;
  title: string;
  body: string;
  imageUrl: string;
  eomId: string;
  postId: string;
};

export type IMuseumGenre =
  | "general"
  | "natural"
  | "science"
  | "history"
  | "art"
  | "virtual";

export type IMuseumCoreData = {
  name: string;
  thumbnailBase64: string;
  coverBase64: string;
  genre: IMuseumGenre;
  ticketPrice: number;
  location: string;
  description: string;
};
export type IMuseumResponse = {
  name: string;
  museumId: string;
  thumbnailUrl: string;
  coverUrl: string;
  genre: IMuseumGenre;
  isFollowedByUser: boolean;
  numOfFollowers: number;
  numOfReviews: number;
  ticketPrice: number;
  sales: number;
  location: string;
  description: string;
  rating: number;
  createdAt: string;
  userId: string; // userId của người quản lí museum
};

export type IEventGenre =
  | "art"
  | "education"
  | "sport"
  | "festival"
  | "virtual"
  | "volunteer"
  | "corporate";
export type IEventCoreData = {
  genre: IEventGenre;
  name: string;
  description: string;
  location: string;
  thumbnailBase64: string;
  coverBase64: string;
  ticketPrice: number;
  startTime: string;
  endTime: string;
};
export type IEventResponse = {
  genre: IEventGenre;
  name: string;
  description: string;
  location: string;
  thumbnailUrl: string;
  coverUrl: string;
  sales: number;
  eventId: string;
  isFollowedByUser: boolean;
  numOfFollowers: number;
  numOfReviews: number;
  ticketPrice: number;
  rating: number;
  museumId: string; // KHI USER UPLOAD EVENT LÊN THÌ SERVER CHỈ CÓ ĐƯỢC USER ID THÔI (THÔNG QUA TOKEN), SERVER PHẢI COI USER ĐÓ QUẢN LÍ MUSEUM NÀO RỒI CHÈN MUSEUM ID VÀO ĐÂY
  museumName: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  userId: string; // USER ID của người tạo ra event (tức là người quản lí cái musem tổ chức event)
};

export type IMessageCoreData = {
  conversationId: string;
  content: string;
};

export type IMessageResponse = {
  conversationId: string;
  userId: string; // GET USER ID OF THE ONE WHO SEND THE MESSAGE
  userName: string; // GET USER NAME OF THE ONE WHO SEND THE MESSAGE
  thumbnailUrl: string; // GET THUMBNAIL OF THE USER WHO SEND THE MESSAGE (FROMUSERID)
  content: string;
  sentAt: string;
  messageId: string;
};
