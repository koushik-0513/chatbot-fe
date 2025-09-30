import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";

import type { TApiPromise, TMutationOpts } from "@/types/api";

// Base URL: /api/v1/file/...

// File Types
type TUploadFilePayload = {
  file: File;
  userId: string;
};

// File Services
const uploadFile = (payload: TUploadFilePayload): TApiPromise => {
  const { file, userId: user_id } = payload;
  const formData = new FormData();
  formData.append("file", file);

  return api.post(
    `/file/upload?user_id=${encodeURIComponent(user_id)}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// File Hooks
export const useUploadFile = (
  options?: TMutationOpts<TUploadFilePayload, unknown>
) => {
  return useMutation({
    mutationKey: ["useUploadFile"],
    mutationFn: uploadFile,
    ...options,
  });
};
