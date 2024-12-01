import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { env } from "process";
import { getServerSession } from "next-auth";

const supabase = createClient(
  env.SUPABASE_URL as string,
  env.SUPABASE_SERVICE_ROLE_KEY as string
);

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession();

    if (!session || !session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { base64Image, fileName } = await req.json();

    const bucketName = env.SUPABASE_STORAGE_BUCKET;
    const vercelDomain = env.VERCEL_DOMAIN;

    if (!bucketName || !vercelDomain) {
      return NextResponse.json(
        { error: "Missing storage configuration" },
        { status: 400 }
      );
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear() % 10}${
      (now.getMonth() + 1) % 10
    }${now.getDate() % 10}${now.getHours() % 10}${now.getMinutes() % 10}${
      now.getSeconds() % 10
    }`;

    const sanitizedFileName = fileName.replace(/ /g, "-");
    const filename = `${sanitizedFileName}-${formattedDate}.png`;

    const imageBuffer = Buffer.from(base64Image, "base64");

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filename, imageBuffer, {
        contentType: "image/png",
        upsert: false,
      });

    if (error) {
      console.error("Supabase Upload Error:", error);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    const publicURL = supabase.storage.from(bucketName).getPublicUrl(filename)
      .data.publicUrl;

    return NextResponse.json(
      {
        message: "Image uploaded successfully",
        url: publicURL,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
};
