import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await request.formData();

    const image = formData.get("image") as File | null;

    let imageHref = "";

    if (image && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const fileName = `${Date.now()}.${image.type.split("/")[1]}`;

      const { data, error } = await supabase.storage
        .from("blogg")
        .upload(fileName, buffer, {
          contentType: image.type,
        });

      if (error) {
        console.error("Error uploading image:", error.message);
        return NextResponse.json(
          { error: "Error uploading image" },
          { status: 500 }
        );
      }

      const { data: publicData } = supabase.storage
        .from("blogg")
        .getPublicUrl(data.path);

      if (!publicData?.publicUrl) {
        return NextResponse.json(
          { error: "Failed to get image URL" },
          { status: 500 }
        );
      }

      imageHref = publicData.publicUrl;
    } else {
      imageHref = "/appkom-logo-m-bakgrunn.jpg";
    }

    return NextResponse.json(
      { message: "Image uploaded successfully", imageUrl: imageHref },
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
