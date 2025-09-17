import env from "@/config/env";
import { TUploadOptions } from "@/types/types";

export type UploadStatus = "uploading" | "success" | "error";

export type UploadResult<T = unknown> = {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
};

// Uploads a file using XMLHttpRequest to support upload progress events
export function uploadFile<T = unknown>({
  file,
  userId,
  onProgress,
  signal,
}: TUploadOptions): Promise<UploadResult<T>> {
  return new Promise((resolve, reject) => {
    try {
      const url = `${env.backendUrl}/api/v1/file/upload?user_id=${userId}`;

      const formData = new FormData();
      // Assuming backend expects the key to be 'file'
      formData.append("file", file, file.name);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);

      // Progress events for uploads
      xhr.upload.onprogress = (event) => {
        if (!onProgress) return;
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        const status = xhr.status;
        const text = xhr.responseText;
        try {
          const json = text ? JSON.parse(text) : undefined;
          if (status >= 200 && status < 300) {
            resolve({ ok: true, status, data: json });
          } else {
            resolve({
              ok: false,
              status,
              error: json?.message || text || "Upload failed",
            });
          }
        } catch {
          if (status >= 200 && status < 300) {
            resolve({ ok: true, status, data: undefined as unknown as T });
          } else {
            resolve({ ok: false, status, error: text || "Upload failed" });
          }
        }
      };

      xhr.onerror = () => {
        resolve({ ok: false, status: xhr.status || 0, error: "Network error" });
      };

      // Support cancellation via AbortSignal
      if (signal) {
        if (signal.aborted) {
          xhr.abort();
          return resolve({ ok: false, status: 0, error: "Upload aborted" });
        }
        const onAbort = () => {
          xhr.abort();
          resolve({ ok: false, status: 0, error: "Upload aborted" });
        };
        signal.addEventListener("abort", onAbort, { once: true });
      }

      xhr.send(formData);
    } catch (err) {
      reject(err);
    }
  });
}
