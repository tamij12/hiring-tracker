import { createUploadthing } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  resumeUploader: f({
    image: { maxFileSize: "4MB" },
    pdf: { maxFileSize: "4MB" },
  }).onUploadComplete(async ({ file }) => {
    console.log("Archivo subido:", file.url);
  }),
};
