import { Tokens } from "../social-media-api-functions";

export const consumeAuthorizationCode = async (
  code: string,
  state?: string
): Promise<Tokens> => {
  throw new Error("Not implemented");
};
