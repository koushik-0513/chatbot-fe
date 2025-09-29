import { USER_ID_KEY } from "@/constants/storage";
import { ObjectId } from "bson";

export const getUserId = (): string => {
  // Check if user ID already exists in localStorage
  const existingId = localStorage.getItem(USER_ID_KEY);

  if (existingId) {
    return existingId;
  }

  // Generate new user ID if none exists
  const id = new ObjectId();
  const newId = id.toHexString();
  localStorage.setItem(USER_ID_KEY, newId);

  return newId;
};
