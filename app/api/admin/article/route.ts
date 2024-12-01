import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";

export const POST = async (req: NextRequest) => {
  try {
    const res = new NextResponse();
    const session = await getServerSession();

    if (!session || !session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const prisma = new PrismaClient();
    const { title, description, imageUri, imageDescription, attachmentsUri, author } =
      await req.json();

    if (!title || !description || !imageUri || !attachmentsUri || !author) {
      console.log(imageDescription);
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
        attachmentsUri,
        author
      },
    });

    return NextResponse.json({ article }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});

