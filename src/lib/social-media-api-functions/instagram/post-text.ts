"use server";

export async function postText() {
  throw new Error(
    "Instagram text-only posts are not supported. Please add an image or video."
  );
}
