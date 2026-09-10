-- CreateTable
CREATE TABLE "SitePage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "menuKey" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "showInNav" BOOLEAN NOT NULL DEFAULT true,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "layout" TEXT NOT NULL DEFAULT '[]'
);

-- CreateIndex
CREATE UNIQUE INDEX "SitePage_slug_key" ON "SitePage"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SitePage_menuKey_key" ON "SitePage"("menuKey");
