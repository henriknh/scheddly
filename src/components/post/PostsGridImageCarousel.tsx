"use client";
import { PostWithRelations } from "@/app/api/post/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface PostsGridImageCarouselProps {
  post: PostWithRelations;
}

export function PostsGridImageCarousel({ post }: PostsGridImageCarouselProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const handleNextImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setCurrentImage((currentImage + 1) % post.images.length);
  };

  const handlePreviousImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setCurrentImage(
      (currentImage - 1 + post.images.length) % post.images.length
    );
  };

  return (
    <div className="relative h-full w-full">
      <img
        src={`/api/file/${post.images[currentImage].id}`}
        alt={post.description}
        className="rounded-xl w-full h-full object-cover"
      />

      {post.images.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <Button
            size="icon"
            variant="secondary"
            onClick={handlePreviousImage}
            className="z-20"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="secondary"
            onClick={handleNextImage}
            className="z-20"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
