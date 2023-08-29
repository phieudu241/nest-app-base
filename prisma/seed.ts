import { PrismaClient, User } from "@prisma/client";

import { USER_SEEDS } from "./seeds";

const prisma = new PrismaClient();

async function main() {
  // Seed data here
  for (const user of USER_SEEDS) {
    await prisma.user.upsert({
      where: {
        id: user.id || undefined,
      },
      update: user as User,
      create: user as User,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
