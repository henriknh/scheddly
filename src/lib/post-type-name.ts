import { PostType } from "@/generated/prisma";

export function getPostTypeName(postType: PostType) {
  switch (postType) {
    case PostType.IMAGE:
      return "Image";
    case PostType.VIDEO:
      return "Video";
    case PostType.TEXT:
      return "Text";
    default:
      return postType;
  }
}
