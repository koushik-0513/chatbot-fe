import { ObjectId } from "bson";

const USER_ID_KEY = "chatbot_user_id";
const USER_CREATED_KEY = "chatbot_user_created";

export const generateUserId = (): string => {
  const id = new ObjectId();
  return id.toHexString();
};

export const getUserId = (): string => {
  // Check if user ID already exists in localStorage
  const existing_id = localStorage.getItem(USER_ID_KEY);

  if (existing_id) {
    return existing_id;
  }

  // Generate new user ID if none exists
  const new_id = generateUserId();
  localStorage.setItem(USER_ID_KEY, new_id);

  return new_id;
};

export const clearUserId = (): void => {
  localStorage.removeItem(USER_ID_KEY);
};

export const isValidUserId = (id: string): boolean => {
  try {
    // Check if the string is a valid ObjectId format
    return ObjectId.isValid(id);
  } catch {
    return false;
  }
};

export const isUserCreatedOnBackend = (): boolean => {
  const created = localStorage.getItem(USER_CREATED_KEY);
  return created === "true";
};

export const setUserCreatedOnBackend = (): void => {
  localStorage.setItem(USER_CREATED_KEY, "true");
};

export const clearUserCreatedStatus = (): void => {
  localStorage.removeItem(USER_CREATED_KEY);
};
