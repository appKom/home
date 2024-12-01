import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import formidable from "formidable";
import fs from "fs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const config = {
  api: {
    bodyParser: false,
  },
};

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user || !session.user.isAdmin) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const form = new formidable.IncomingForm();

    form.parse(
      req,
      async (err: any, fields: formidable.Fields, files: formidable.Files) => {
        if (err) {
          console.error("Formidable Error:", err);
          return res.status(500).json({ error: "Failed to parse form data" });
        }

        const file = Array.isArray(files.image) ? files.image[0] : files.image;
        const fileName = Array.isArray(fields.fileName)
          ? fields.fileName[0]
          : fields.fileName;

        if (!file || !fileName) {
          return res
            .status(400)
            .json({ error: "Image and fileName are required" });
        }

        const fileContent = fs.readFileSync(file.filepath);

        const now = new Date();
        const formattedDate = `${now.getFullYear() % 10}${
          (now.getMonth() + 1) % 10
        }${now.getDate() % 10}${now.getHours() % 10}${now.getMinutes() % 10}${
          now.getSeconds() % 10
        }`;
        const sanitizedFileName = fileName.replace(/ /g, "-");
        const extension = file.originalFilename?.split(".").pop() || "png";
        const filename = `${sanitizedFileName}-${formattedDate}.${extension}`;

        const { error } = await supabase.storage
          .from("blogg")
          .upload(filename, fileContent, {
            contentType: file.mimetype || "application/octet-stream",
          });

        if (error) {
          console.error("Supabase Upload Error:", error);
          return res.status(500).json({ error: "Failed to upload image" });
        }

        const { data } = supabase.storage.from("blogg").getPublicUrl(filename);

        return res.status(200).json({
          message: "Image uploaded successfully",
          url: data.publicUrl,
        });
      }
    );
  } catch (error) {
    console.error("Unexpected Error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}
