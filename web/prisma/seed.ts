import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcryptjs'
import {
  adminTemplate,
  editorTemplate,
  financeTemplate,
  teamTemplate,
} from '../lib/auth/grants'
import { DUMMY_ASSETS, DUMMY_MATCHES, DUMMY_NEWS, DUMMY_PARTNERS, DUMMY_PLAYERS } from '../lib/content/dummy'

const prisma = new PrismaClient()

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function main() {
  const passwordHash = hashSync('astrum-cms-dev', 10)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@astrumdeus.id' },
    update: {},
    create: {
      email: 'admin@astrumdeus.id',
      name: 'Admin Astrum Deus',
      passwordHash,
      roles: JSON.stringify(['admin', 'editor', 'finance']),
    },
  })

  const systemRoles = [
    { name: 'Admin', slug: 'admin', isAdmin: true, grants: JSON.stringify(adminTemplate()) },
    { name: 'Editor', slug: 'editor', isAdmin: false, grants: JSON.stringify(editorTemplate()) },
    { name: 'Team', slug: 'team', isAdmin: false, grants: JSON.stringify(teamTemplate()) },
    { name: 'Finance', slug: 'finance', isAdmin: false, grants: JSON.stringify(financeTemplate()) },
  ]

  for (const role of systemRoles) {
    await prisma.accessRole.upsert({
      where: { slug: role.slug },
      update: { name: role.name, isAdmin: role.isAdmin, grants: role.grants },
      create: role,
    })
  }

  const adminRole = await prisma.accessRole.findUnique({ where: { slug: 'admin' } })
  if (adminRole) {
    await prisma.userAccessRole.upsert({
      where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
      update: {},
      create: { userId: adminUser.id, roleId: adminRole.id },
    })
  }

  await prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'Astrum Deus',
      logo: '/logo-astrum-deus.png',
      favicon: '/logo-astrum-deus.png',
      defaultMetaTitle: 'Astrum Deus',
      defaultMetaDesc: 'Tim esports PUBG Mobile Astrum Deus, roster dan hasil pertandingannya.',
      contactAddress: 'Indonesia',
      contactEmail: 'halo@astrumdeus.id',
      contactPhone: '',
      socialLinks: JSON.stringify([{ label: 'Instagram', href: 'https://instagram.com/astrumdeus' }]),
      titles: 4,
      tournaments: 12,
      wwcd: 68,
    },
  })

  const menus = [
    { key: 'home', label: 'Home', path: '/', isMandatory: true, isEnabled: true, sortOrder: 1 },
    { key: 'roster', label: 'Roster', path: '/roster', isMandatory: false, isEnabled: true, sortOrder: 2 },
    { key: 'matches', label: 'Matches', path: '/matches', isMandatory: false, isEnabled: true, sortOrder: 3 },
    { key: 'news', label: 'News', path: '/news', isMandatory: true, isEnabled: true, sortOrder: 4 },
    { key: 'media-kit', label: 'Media Kit', path: '/media-kit', isMandatory: false, isEnabled: true, sortOrder: 5 },
    { key: 'partners', label: 'Partners', path: '/partners', isMandatory: false, isEnabled: true, sortOrder: 6 },
    { key: 'contact', label: 'Contact', path: '/contact', isMandatory: true, isEnabled: true, sortOrder: 7 },
  ]

  for (const menu of menus) {
    await prisma.menuItem.upsert({
      where: { key: menu.key },
      update: { isEnabled: menu.isEnabled },
      create: menu,
    })
  }

  const books = [
    { name: 'Kas operasional', type: 'operasional', openingBalance: 0 },
    { name: 'Kas tim', type: 'tim', openingBalance: 0 },
  ]

  for (const book of books) {
    const ada = await prisma.cashBook.findFirst({ where: { type: book.type } })
    if (!ada) {
      await prisma.cashBook.create({ data: book })
    }
  }

  const categories = [
    { name: 'Hadiah turnamen', direction: 'masuk' },
    { name: 'Sponsor', direction: 'masuk' },
    { name: 'Transport', direction: 'keluar' },
    { name: 'Makan', direction: 'keluar' },
    { name: 'Peralatan', direction: 'keluar' },
  ]

  for (const category of categories) {
    const ada = await prisma.expenseCategory.findFirst({ where: { name: category.name } })
    if (!ada) {
      await prisma.expenseCategory.create({ data: category })
    }
  }

  const turnamen = [
    { name: 'PMNC 2026', organizer: 'Moonton', season: '2026', year: 2026 },
    { name: 'PMSL SEA', organizer: 'PUBG Mobile', season: '2026', year: 2026 },
    { name: 'PMPL ID Season 8', organizer: 'PUBG Mobile ID', season: 'S8', year: 2026 },
    { name: 'PMPL ID S7', organizer: 'PUBG Mobile ID', season: 'S7', year: 2025 },
    { name: 'PMSL SEA 2026', organizer: 'PUBG Mobile', season: '2026', year: 2026 },
  ]

  for (const item of turnamen) {
    const ada = await prisma.tournament.findFirst({ where: { name: item.name } })
    if (!ada) {
      await prisma.tournament.create({ data: { ...item, isActive: true } })
    }
  }

  const kategoriNama = [...new Set(DUMMY_NEWS.map((post) => post.category))]
  for (const name of kategoriNama) {
    const slug = slugify(name)
    await prisma.newsCategory.upsert({
      where: { slug },
      update: { name },
      create: { name, slug, description: name, isActive: true },
    })
  }

  for (const post of DUMMY_NEWS) {
    const category = await prisma.newsCategory.findUnique({ where: { slug: slugify(post.category) } })
    if (!category) {
      continue
    }

    await prisma.newsPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        body: post.body.join('\n\n'),
        cover: post.cover,
        categoryId: category.id,
        author: post.author,
        publishedAt: new Date(post.publishedAt),
        status: post.status,
      },
    })
  }

  for (const [index, player] of DUMMY_PLAYERS.entries()) {
    const saved = await prisma.player.upsert({
      where: { slug: player.slug },
      update: {},
      create: {
        slug: player.slug,
        ign: player.ign,
        realName: player.realName,
        role: player.role,
        photo: player.photo,
        joinedAt: new Date(`${player.joinedAt}T00:00:00+07:00`),
        leftAt: player.leftAt ? new Date(`${player.leftAt}T00:00:00+07:00`) : null,
        isActive: player.isActive,
        socials: JSON.stringify(player.socials),
        sortOrder: index + 1,
      },
    })

    for (const stat of player.stats) {
      const tournament = await prisma.tournament.findFirst({ where: { name: stat.tournament } })
      if (!tournament) {
        continue
      }

      const ada = await prisma.playerStat.findFirst({
        where: { playerId: saved.id, tournamentId: tournament.id },
      })
      if (!ada) {
        await prisma.playerStat.create({
          data: {
            playerId: saved.id,
            tournamentId: tournament.id,
            matchesPlayed: stat.matchesPlayed,
            kills: stat.kills,
            averagePlacement: stat.averagePlacement,
          },
        })
      }
    }
  }

  for (const match of DUMMY_MATCHES) {
    const tournament = await prisma.tournament.findFirst({ where: { name: match.tournament } })
    if (!tournament) {
      continue
    }

    const recap = match.recapSlug
      ? await prisma.newsPost.findUnique({ where: { slug: match.recapSlug } })
      : null

    await prisma.match.upsert({
      where: { id: match.id },
      update: {},
      create: {
        id: match.id,
        tournamentId: tournament.id,
        stage: match.stage,
        scheduledAt: new Date(match.scheduledAt),
        status: match.status,
        placement: match.placement,
        points: match.points,
        wwcdCount: match.wwcdCount,
        location: match.location,
        recapId: recap?.id,
        map: match.map,
        streamUrl: match.streamUrl,
      },
    })
  }

  for (const [index, partner] of DUMMY_PARTNERS.entries()) {
    await prisma.partner.upsert({
      where: { slug: partner.slug },
      update: {},
      create: {
        slug: partner.slug,
        name: partner.name,
        tier: partner.tier,
        logoText: partner.logoText,
        href: partner.href,
        sortOrder: index + 1,
      },
    })
  }

  for (const [index, asset] of DUMMY_ASSETS.entries()) {
    const ada = await prisma.mediaKitAsset.findUnique({ where: { id: asset.id } })
    if (!ada) {
      await prisma.mediaKitAsset.create({
        data: {
          id: asset.id,
          name: asset.name,
          description: asset.description,
          groupName: asset.group,
          href: asset.href,
          fileType: asset.fileType,
          fileSize: asset.fileSize,
          sortOrder: index + 1,
        },
      })
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
