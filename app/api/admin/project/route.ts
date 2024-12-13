import { NextResponse } from "next/server";
import { ProjectRoles } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { sanitizeFileName } from "@/lib/utils/fileSanitizer";
import { createClient } from "@supabase/supabase-js";

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

    const title = formData.get("title") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const description = formData.get("description") as string | null;
    const github = formData.get("github") as string | null;
    const techStack = formData.get("techStack") as string;
    const link = formData.get("link") as string | null;
    const projectMembersString = formData.get("projectMembers") as
      | string
      | null;

    const image = formData.get("image") as File | null;

    if (!title || !shortDescription || !description || !github || !techStack) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let parsedMembers: { memberId: number; Role: ProjectRoles }[] = [];
    if (projectMembersString) {
      try {
        parsedMembers = JSON.parse(projectMembersString);
      } catch (err) {
        return NextResponse.json(
          { error: "Invalid projectMembers JSON" + err },
          { status: 400 }
        );
      }
    }
    const href = generateSlug(title);
    const imageUri = await handleImageUpload(image, title);
    if (imageUri instanceof NextResponse) {
      return imageUri;
    }

    const project = await prisma.project.create({
      data: {
        title,
        shortDescription,
        description,
        github,
        imageUri,
        techStack,
        href,
        link: link || null,
        projectMembers:
          parsedMembers.length > 0
            ? {
                create: parsedMembers.map((pm) => ({
                  memberId: pm.memberId,
                  Role: pm.Role,
                })),
              }
            : undefined,
      },

      include: {
        projectMembers: {
          include: {
            Member: true,
          },
        },
      },
    });

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "ERR_INVALID_ARG_TYPE" },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        projectMembers: {
          include: {
            Member: true,
          },
        },
      },
    });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "ERR_INVALID_ARG_TYPE" },
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

    const projectId = formData.get("id");
    if (!projectId) {
      return NextResponse.json(
        { error: "Missing project ID" },
        { status: 400 }
      );
    }

    const id = parseInt(projectId.toString(), 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const title = formData.get("title") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const description = formData.get("description") as string | null;
    const github = formData.get("github") as string | null;
    const techStack = formData.get("techStack") as string | null;
    const link = formData.get("link") as string | null;
    const projectMembersString = formData.get("projectMembers") as
      | string
      | null;

    const image = formData.get("image") as File | null;

    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: { projectMembers: true },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!title || !shortDescription || !description || !github || !techStack) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let parsedMembers: { memberId: number; Role: ProjectRoles }[] = [];
    if (projectMembersString) {
      try {
        parsedMembers = JSON.parse(projectMembersString);
      } catch (err) {
        return NextResponse.json(
          { error: "Invalid projectMembers JSON" + err },
          { status: 400 }
        );
      }
    }

    let imageUri = existingProject.imageUri;
    if (image && image.size > 0) {
      const uploadedImageUri = await handleImageUpload(image, title);
      if (uploadedImageUri instanceof NextResponse) {
        return uploadedImageUri;
      }
      imageUri = uploadedImageUri;
    }

    const href = generateSlug(title);
    await prisma.projectMember.deleteMany({
      where: { projectId: id },
    });

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        shortDescription,
        description,
        github,
        imageUri,
        techStack,
        href,
        link: link || null,
        projectMembers:
          parsedMembers.length > 0
            ? {
                create: parsedMembers.map((pm) => ({
                  memberId: pm.memberId,
                  Role: pm.Role,
                })),
              }
            : undefined,
      },
      include: {
        projectMembers: {
          include: {
            Member: true,
          },
        },
      },
    });

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "ERR_INVALID_ARG_TYPE" },
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
    const projectId = Number(data.id);

    if (!projectId || isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID provided" },
        { status: 400 }
      );
    }

    await prisma.projectMember.deleteMany({
      where: {
        projectId: projectId,
      },
    });

    const project = await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    if (project.imageUri) {
      const fileName = project.imageUri.split("/").pop()!;
      const { error } = await supabase.storage
        .from("projects")
        .remove([fileName]);

      if (error) {
        console.error("Error deleting image from storage:", error.message);
      }
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting project:", error.message || error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

const handleImageUpload = async (
  image: File | null,
  projectName: string
): Promise<string | NextResponse> => {
  if (image && image.size > 0) {
    try {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const fileExtension = image.type.split("/")[1] || "png";
      const fileName = `${Date.now()}_${sanitizeFileName(
        projectName
      )}.${fileExtension}`;

      const { data, error } = await supabase.storage
        .from("projects")
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
        .from("projects")
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
    return "";
  }
};
