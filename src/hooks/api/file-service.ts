import { UI_MESSAGES } from "@/constants/constants";
import type { TUploadOptions } from "@/types/component-types/chat-types";

// File Upload Types
export type UploadResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  progress?: number;
};

// File Upload Service
export function uploadFile<T = unknown>({
  file,
  userId,
  onProgress,
  signal,
}: TUploadOptions): Promise<UploadResult<T>> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    const xhr = new XMLHttpRequest();

    // Handle progress
    if (onProgress) {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress(percentComplete);
        }
      });
    }

    // Handle abort signal
    if (signal) {
      signal.addEventListener("abort", () => {
        xhr.abort();
        reject(new Error(UI_MESSAGES.ERROR.UPLOAD_ABORTED));
      });
    }

    // Handle response
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            success: true,
            data: response,
          });
        } catch (error) {
          resolve({
            success: false,
            error: UI_MESSAGES.ERROR.PARSE_RESPONSE_FAILED,
          });
        }
      } else {
        resolve({
          success: false,
          error: `Upload failed with status: ${xhr.status}`,
        });
      }
    });

    // Handle errors
    xhr.addEventListener("error", () => {
      resolve({
        success: false,
        error: "Network error occurred during upload",
      });
    });

    // Handle abort
    xhr.addEventListener("abort", () => {
      reject(new Error(UI_MESSAGES.ERROR.UPLOAD_ABORTED));
    });

    // Start upload
    xhr.open("POST", "/api/v1/upload"); // This would need to be configured with your actual API base URL
    xhr.send(formData);
  });
}

// File Upload Hook (if you want to use it with React Query)
export const useFileUpload = () => {
  return {
    uploadFile,
  };
};
