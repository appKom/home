"use client";

import { formatDate } from "@/lib/utils/dateUtils";
import { Article, Member } from "@prisma/client";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import MarkdownComponents from "../Markdown";
import { stripHtmlAndMarkdown } from "@/lib/utils/textHelper";

interface ExtendedArticle extends Article {
  author: Member;
}

interface Props {
  blog: ExtendedArticle;
}

export const BlogCard = ({ blog }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get author initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Link href={`blogg/${blog.slug}`} className="block w-full h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{
          y: -5,
          transition: { duration: 0.2 },
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="h-full"
      >
        <Card className="overflow-hidden h-full border-gray-700 bg-gray-800 hover:bg-gray-750 transition-colors duration-300 flex flex-col">
          <div className="relative w-full pt-[56.25%] overflow-hidden">
            <motion.div
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image
                src={blog.imageUri || "/placeholder.svg"}
                alt={blog.title + " illustration"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-70" />
            </motion.div>

            {blog.createdAt >
              new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) && (
              <div className="absolute top-4 left-4">
                <Badge
                  variant="secondary"
                  className="bg-primary/80 hover:bg-primary text-white"
                >
                  Ny
                </Badge>
              </div>
            )}
          </div>

          <CardHeader className="pb-2">
            <motion.h2
              className="text-xl font-bold text-white line-clamp-2"
              animate={{
                color: isHovered ? "gray" : "white",
              }}
              transition={{ duration: 0.2 }}
            >
              {blog.title}
            </motion.h2>
            <article className="text-gray-300 line-clamp-2 text-sm mt-1">
              {stripHtmlAndMarkdown(blog.description)}
            </article>
          </CardHeader>

          <CardContent className="pb-2 flex-grow">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Clock size={14} />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
          </CardContent>

          <CardFooter className="pt-2 border-t border-gray-700">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border border-gray-600">
                  <AvatarImage
                    src={blog.author.imageUri || undefined}
                    alt={blog.author.name}
                  />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {getInitials(blog.author.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-300">
                  {blog.author.name}
                </span>
              </div>

              <motion.div
                animate={{
                  x: isHovered ? 0 : 5,
                  opacity: isHovered ? 1 : 0.7,
                }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1 text-primary"
              >
                <span className="text-sm text-white">Les</span>
                <ArrowRight className="text-white" />
              </motion.div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
};
