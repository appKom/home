import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

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

  while (await prisma.project.findUnique({ where: { href: uniqueSlug } })) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }

  return uniqueSlug;
};

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const prisma = new PrismaClient();

    const {
      title,
      shortDescription,
      description,
      github,
      imageUri,
      techStack,

      link,
      projectMembers,
    } = await req.json();

    if (
      !title ||
      !shortDescription ||
      !description ||
      !github ||
      !imageUri ||
      !techStack
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let nestedMembersCreate;
    if (Array.isArray(projectMembers) && projectMembers.length > 0) {
      nestedMembersCreate = {
        create: projectMembers.map((pm) => ({
          memberId: pm.memberId,
          Role: pm.Role,
        })),
      };
    }

    const href = await generateUniqueHref(title);

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
        projectMembers: nestedMembersCreate,
      },
      include: {
        projectMembers: {
          include: {
            Member: true,
          },
        },
      },
    });

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "ERR_INVALID_ARG_TYPE" },
      { status: 500 }
    );
  }
};
