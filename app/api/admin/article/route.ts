import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const prisma = new PrismaClient();
    const { title, description, imageUri, imageDescription, authorId } =
      await req.json();

    console.log(!title, !description, !imageUri, !authorId);

    if (!title || !description || !imageUri || !authorId) {
      return NextResponse.json(
        { error: "No article provided or file is not valid" },
        { status: 400 }
      );
    }

    const article = await prisma.article.create({
      data: {
        title,
        description,
        imageUri,
        imageDescription,
        authorId: authorId,
      },
    });

    return NextResponse.json({ article }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal server error",
        code: "ERR_INVALID_ARG_TYPE",
      },
      {
        status: 500,
      }
    );
  }
};
