-- AlterTable
ALTER TABLE "SocialMediaIntegration" ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "accessTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "refreshTokenExpiresAt" TIMESTAMP(3);
