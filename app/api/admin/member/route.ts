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
    const isCurrent = formData.get("isCurrent") as string;
    const quote = formData.get("quote") as string | null;
    const about = formData.get("about") as string | null;
    const rolesByPeriodRaw = formData.get("rolesByPeriod") as string;

    const image = formData.get("image") as File | null;

    let rolesByPeriod: { period: string; role: RoleEnum }[] = [];
    if (rolesByPeriodRaw) {
      try {
        const parsed = JSON.parse(rolesByPeriodRaw);
        if (Array.isArray(parsed)) {
          rolesByPeriod = parsed.map((item: any) => ({
            period: item.period,
            role: item.role as RoleEnum,
          }));
        } else {
          return NextResponse.json(
            { error: "Invalid rolesByPeriod format" },
            { status: 400 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid JSON for rolesByPeriod" },
          { status: 400 }
        );
      }
    }

    for (const pr of rolesByPeriod) {
      if (!Object.values(RoleEnum).includes(pr.role)) {
        return NextResponse.json(
          { error: `Invalid role provided: ${pr.role}` },
          { status: 400 }
        );
      }
    }

    const imageUri = await handleImageUpload(image, name);
    if (imageUri instanceof NextResponse) {
      return imageUri;
    }

    const href = await generateUniqueHref(name);

    const member = await prisma.member.create({
      data: {
        name,
        href,
        imageUri,
        about,
        quote,
        isCurrent: isCurrent === "true",
        rolesByPeriod: {
          create: rolesByPeriod.map((pr) => ({
            period: pr.period,
            role: pr.role,
          })),
        },
      },
      include: {
        rolesByPeriod: true,
      },
    });

    return NextResponse.json({ member }, { status: 200 });
  } catch (error) {
    console.error("Error creating member:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
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
    const isCurrent = formData.get("isCurrent") as string;
    const quote = formData.get("quote") as string | null;
    const about = formData.get("about") as string | null;
    const rolesByPeriodRaw = formData.get("rolesByPeriod") as string;

    const image = formData.get("image") as File | null;
    console.log("hei");

    if (!id) {
      return NextResponse.json(
        { error: "Member ID is required for updating" },
        { status: 400 }
      );
    }

    console.log("hei2");

    let rolesByPeriod: { period: string; role: RoleEnum }[] = [];
    if (rolesByPeriodRaw) {
      try {
        const parsed = JSON.parse(rolesByPeriodRaw);
        if (Array.isArray(parsed)) {
          rolesByPeriod = parsed.map((item: any) => ({
            period: item.period,
            role: item.role as RoleEnum,
          }));
        } else {
          return NextResponse.json(
            { error: "Invalid rolesByPeriod format" },
            { status: 400 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid JSON for rolesByPeriod" },
          { status: 400 }
        );
      }
    }
    console.log("hei3");

    for (const pr of rolesByPeriod) {
      if (!Object.values(RoleEnum).includes(pr.role)) {
        return NextResponse.json(
          { error: `Invalid role provided: ${pr.role}` },
          { status: 400 }
        );
      }
    }

    const imageUri = await handleImageUpload(image, name);
    if (imageUri instanceof NextResponse) {
      return imageUri;
    }

    interface UpdateData {
      name: string;
      isCurrent: boolean;
      imageUri?: string;
      about?: string;
      quote?: string;
    }

    const updateData: UpdateData = {
      name,
      isCurrent: isCurrent === "true",
      ...(about !== null && { about }),
      ...(quote !== null && { quote }),
    };

    if (imageUri) {
      updateData.imageUri = imageUri;
    }

    const member = await prisma.member.update({
      where: { id: Number(id) },
      data: {
        ...updateData,
        rolesByPeriod: {
          deleteMany: {},
          create: rolesByPeriod.map((pr) => ({
            period: pr.period,
            role: pr.role,
          })),
        },
      },
      include: {
        rolesByPeriod: true,
      },
    });

    return NextResponse.json({ member }, { status: 200 });
  } catch (error) {
    console.error("Error creating member:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
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
      include: {
        rolesByPeriod: true,
      },
    });

    if (
      member.imageUri &&
      member.imageUri !== "/medlemmer/default_profile_picture.png"
    ) {
      const fileName = member.imageUri.split("/").pop()!;
      const { error } = await supabase.storage
        .from("members")
        .remove([fileName]);

      if (error) {
        console.error("Error deleting image from storage:", error.message);
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

    const transformedMembers = members.map((member) => ({
      ...member,
      rolesByPeriod: member.rolesByPeriod.map((role) => ({
        period: role.period,
        role: role.role,
      })),
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

const handleImageUpload = async (
  image: File | null,
  name: string
): Promise<string | NextResponse> => {
  if (image && image.size > 0) {
    try {
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

      return publicData.publicUrl;
    } catch (uploadError) {
      console.error("Error processing image:", uploadError);
      return NextResponse.json(
        { error: "Error processing image" },
        { status: 500 }
      );
    }
  } else {
    return "/medlemmer/default_profile_picture.png";
  }
};
