-- Create a team for each user
INSERT INTO "Team" ("id", "name", "createdAt", "updatedAt", "ownerId")
SELECT 
  'team_' || "id" as "id",
  COALESCE("name", 'Team ' || "email") as "name",
  "createdAt",
  "updatedAt",
  "id" as "ownerId"
FROM "User";

-- Set the teamId for each user to their own team
UPDATE "User"
SET "teamId" = 'team_' || "id"
WHERE "teamId" IS NULL; 