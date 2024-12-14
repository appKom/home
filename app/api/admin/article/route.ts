import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { clearBlogCache } from "@/lib/blogCache";
import { revalidatePath } from "next/cache";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { title, description, imageUri, imageDescription, authorId } =
      await req.json();

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
        memberId: authorId,
      },
    });

    clearBlogCache();

    revalidatePath("/");
    revalidatePath("/blogg");
    revalidatePath(`/blogg/${encodeURIComponent(article.title)}`);
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
