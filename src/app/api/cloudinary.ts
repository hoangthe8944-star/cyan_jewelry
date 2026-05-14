import type { MediaAsset } from "../lib/types";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

type CloudinaryResourceType = "image" | "video" | "raw" | "auto";

export interface CloudinaryUploadOptions {
  folder?: string;
  publicId?: string;
  resourceType?: CloudinaryResourceType;
  tags?: string[];
}

export interface CloudinaryUploadResult {
  assetId: string;
  bytes: number;
  duration?: number;
  format?: string;
  height?: number;
  mediaType: MediaAsset["mediaType"];
  originalFilename: string;
  publicId: string;
  resourceType: "image" | "video" | "raw";
  secureUrl: string;
  thumbnailUrl?: string;
  width?: number;
}

interface CloudinaryApiResponse {
  asset_id: string;
  bytes: number;
  duration?: number;
  format?: string;
  height?: number;
  original_filename: string;
  public_id: string;
  resource_type: "image" | "video" | "raw";
  secure_url: string;
  width?: number;
}

function assertCloudinaryConfig() {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      "Missing Cloudinary config. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET."
    );
  }
}

function buildCloudinaryUploadUrl(resourceType: CloudinaryResourceType) {
  assertCloudinaryConfig();
  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;
}

export function buildCloudinaryVideoThumbnail(publicId: string) {
  assertCloudinaryConfig();
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/so_0/${publicId}.jpg`;
}

export async function uploadMediaToCloudinary(
  file: File,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> {
  assertCloudinaryConfig();

  const resourceType = options.resourceType ?? "auto";
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  if (options.folder) {
    formData.append("folder", options.folder);
  }

  if (options.publicId) {
    formData.append("public_id", options.publicId);
  }

  if (options.tags?.length) {
    formData.append("tags", options.tags.join(","));
  }

  const response = await fetch(buildCloudinaryUploadUrl(resourceType), {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Cloudinary upload failed: ${response.status}`);
  }

  const payload = (await response.json()) as CloudinaryApiResponse;
  const mediaType = payload.resource_type === "video" ? "MP4" : "IMAGE";

  return {
    assetId: payload.asset_id,
    bytes: payload.bytes,
    duration: payload.duration,
    format: payload.format,
    height: payload.height,
    mediaType,
    originalFilename: payload.original_filename,
    publicId: payload.public_id,
    resourceType: payload.resource_type,
    secureUrl: payload.secure_url,
    thumbnailUrl:
      payload.resource_type === "video"
        ? buildCloudinaryVideoThumbnail(payload.public_id)
        : payload.secure_url,
    width: payload.width,
  };
}

export function toMediaAsset(upload: CloudinaryUploadResult): MediaAsset {
  return {
    mediaType: upload.mediaType,
    url: upload.secureUrl,
    thumbnailUrl: upload.thumbnailUrl ?? null,
    altText: upload.originalFilename,
  };
}
