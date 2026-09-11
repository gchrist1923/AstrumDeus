-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN "heroEyebrow" TEXT NOT NULL DEFAULT 'PUBG Mobile · Indonesia';
ALTER TABLE "SiteSetting" ADD COLUMN "heroTitle" TEXT NOT NULL DEFAULT 'Astrum Deus';
ALTER TABLE "SiteSetting" ADD COLUMN "heroTagline" TEXT NOT NULL DEFAULT 'Tim PUBG Mobile yang berlatih terjadwal dan membuka hasilnya, dari klasemen sampai catatan scrim.';
ALTER TABLE "SiteSetting" ADD COLUMN "heroImage" TEXT NOT NULL DEFAULT '/hero.jpg';
ALTER TABLE "SiteSetting" ADD COLUMN "heroImageAlt" TEXT NOT NULL DEFAULT '';
