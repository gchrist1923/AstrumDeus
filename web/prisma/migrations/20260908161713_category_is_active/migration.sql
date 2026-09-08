-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NewsCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_NewsCategory" ("description", "id", "name", "slug") SELECT "description", "id", "name", "slug" FROM "NewsCategory";
DROP TABLE "NewsCategory";
ALTER TABLE "new_NewsCategory" RENAME TO "NewsCategory";
CREATE UNIQUE INDEX "NewsCategory_slug_key" ON "NewsCategory"("slug");
CREATE TABLE "new_Tournament" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Tournament" ("id", "name", "organizer", "season", "year") SELECT "id", "name", "organizer", "season", "year" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
