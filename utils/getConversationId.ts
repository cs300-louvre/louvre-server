export function getConversationId(userId1: string, userId2: string) {
  const arr = [userId1, userId2];
  arr.sort();
  return arr.join("");
}

export function parseConversationId(conversationId: string) {
  // Split by half to get userId1 and userId2
  const userId1 = conversationId.slice(0, conversationId.length / 2);
  const userId2 = conversationId.slice(conversationId.length / 2);
  return [userId1, userId2];
}