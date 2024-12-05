import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import { sanitizeFileName } from "@/lib/utils/fileSanitizer";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { RoleEnum } from "@prisma/client";

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const generateUniqueHref = async (name: string) => {
  let slug = generateSlug(name);
  let uniqueSlug = slug;
  let count = 1;

  while (await prisma.member.findUnique({ where: { href: uniqueSlug } })) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }

  return uniqueSlug;
};

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

    const name = formData.get("name") as string;
    const role = formData.get("role") as string | null;
    const isCurrent = formData.get("isCurrent") as string;
    const year = formData.get("year") as string;
    const quote = formData.get("quoute") as string | null;
    const about = formData.get("about") as string | null;

    const image = formData.get("image") as File | null;

    let imageUri = "";

    if (image && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const fileName = `${Date.now()}_${sanitizeFileName(name)}.${
        image.type.split("/")[1]
      }`;

      const { data, error } = await supabase.storage
        .from("members")
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
        .from("members")
        .getPublicUrl(data.path);

      if (!publicData?.publicUrl) {
        return NextResponse.json(
          { error: "Failed to get image URL" },
          { status: 500 }
        );
      }

      imageUri = publicData.publicUrl;
    } else {
      imageUri = "/medlemmer/default_profile_picture.png";
    }

    const href = await generateUniqueHref(name);

    if (!role || !Object.values(RoleEnum).includes(role as RoleEnum)) {
      return NextResponse.json(
        { error: "Invalid role provided" },
        { status: 400 }
      );
    }

    const member = await prisma.member.create({
      data: {
        name,
        href,
        imageUri,
        about,
        quote,
        isCurrent: isCurrent === "true",
        rolesByPeriod: {
          create: {
            period: `${year}`,
            role: role as RoleEnum,
          },
        },
      },
      include: {
        rolesByPeriod: true,
      },
    });

    return NextResponse.json({ member }, { status: 200 });
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const PUT = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await request.formData();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const isCurrent = formData.get("isCurrent") as string;
    const year = formData.get("year") as string;
    const image = formData.get("image") as File | null;
    const quote = formData.get("quote") as string | null; // Fixed typo
    const about = formData.get("about") as string | null;

    if (!id) {
      return NextResponse.json(
        { error: "Member ID is required for updating" },
        { status: 400 }
      );
    }

    let imageUri: string | undefined;

    if (image && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const fileName = `${Date.now()}_${sanitizeFileName(name)}.${
        image.type.split("/")[1]
      }`;

      const { data, error } = await supabase.storage
        .from("members")
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
        .from("members")
        .getPublicUrl(data.path);

      if (!publicData?.publicUrl) {
        return NextResponse.json(
          { error: "Failed to get image URL" },
          { status: 500 }
        );
      }

      imageUri = publicData.publicUrl;
    }

    interface UpdateData {
      name: string;
      role: string;
      isCurrent: boolean;
      year: number;
      imageUri?: string;
      about?: string;
      quote?: string;
    }

    const updateData: UpdateData = {
      name,
      role,
      isCurrent: isCurrent === "true",
      year: Number(year),
      ...(about !== null && { about }),
      ...(quote !== null && { quote }),
    };

    if (imageUri) {
      updateData.imageUri = imageUri;
    }

    const member = await prisma.member.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json({ member }, { status: 200 });
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const data = await request.json();
    const id = data.id;

    if (!id) {
      return NextResponse.json(
        { error: "Invalid member ID provided" },
        { status: 400 }
      );
    }

    const member = await prisma.member.delete({
      where: {
        id: Number(id),
      },
    });

    // Optionally, delete the image from Supabase storage if it's not the default image
    if (
      member.imageUri &&
      member.imageUri !== "/medlemmer/default_profile_picture.png"
    ) {
      const { error } = await supabase.storage
        .from("members")
        .remove([member.imageUri.split("/").pop()!]);

      if (error) {
        console.error("Error deleting image from storage:", error.message);
        // Continue even if image deletion fails
      }
    }

    return NextResponse.json({ member }, { status: 200 });
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    const members = await prisma.member.findMany({
      include: {
        rolesByPeriod: true,
      },
    });

    // Transform rolesByPeriod array to an object for easier access on the client
    const transformedMembers = members.map((member) => ({
      ...member,
      rolesByPeriod: member.rolesByPeriod.reduce((acc, role) => {
        acc[role.period] = role.role;
        return acc;
      }, {} as { [period: string]: "Leder" | "Nestleder" | "Økonomiansvarlig" | "Medlem" }),
    }));

    return NextResponse.json({ members: transformedMembers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
