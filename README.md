
  # Brand Identity and Visual Style

  This is a code bundle for Brand Identity and Visual Style. The original project is available at https://www.figma.com/design/EUSviOc72i84nV89quNKli/Brand-Identity-and-Visual-Style.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Cloudinary upload for MP4 banners

  Add these env vars:

  - `VITE_CLOUDINARY_CLOUD_NAME`
  - `VITE_CLOUDINARY_UPLOAD_PRESET`

  The project now includes `uploadMediaToCloudinary()` and `toMediaAsset()` in `src/app/api/cloudinary.ts`.

  Example flow for an admin form:

  ```ts
  import { toMediaAsset, uploadMediaToCloudinary } from "./src/app/api";

  const upload = await uploadMediaToCloudinary(file, {
    folder: "cyan/banners",
    tags: ["banner", "hero"],
  });

  const media = toMediaAsset(upload);

  // Save `media` into your banner payload / database
  // {
  //   mediaType: "MP4",
  //   url: "...cloudinary secure url...",
  //   thumbnailUrl: "...cloudinary generated poster..."
  // }
  ```
  
