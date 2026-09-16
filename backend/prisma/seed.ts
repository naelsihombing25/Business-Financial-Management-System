import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting database seed...");

  // =========================
  // ACCOUNTS
  // =========================

  const cashAccount = await prisma.account.create({
    data: {
      name: "Cash",
      type: "CASH",
      initialBalance: 0,
    },
  });

  const bankAccount = await prisma.account.create({
    data: {
      name: "Bank",
      type: "BANK",
      initialBalance: 0,
    },
  });

  const qrisAccount = await prisma.account.create({
    data: {
      name: "QRIS",
      type: "QRIS",
      initialBalance: 0,
    },
  });

  // =========================
  // INCOME CATEGORIES
  // =========================

  await prisma.category.createMany({
    data: [
      {
        name: "Cafe",
        type: "INCOME",
        description: "Income from cafe sales",
      },
      {
        name: "Billiard",
        type: "INCOME",
        description: "Income from billiard",
      },
      {
        name: "Futsal",
        type: "INCOME",
        description: "Income from futsal",
      },
      {
        name: "Other Income",
        type: "INCOME",
        description: "Other income",
      },
    ],
  });

  // =========================
  // EXPENSE CATEGORIES
  // =========================

  await prisma.category.createMany({
    data: [
      {
        name: "Rent",
        type: "EXPENSE",
        expenseType: "FIXED",
        description: "Monthly rent",
      },
      {
        name: "Utilities",
        type: "EXPENSE",
        expenseType: "FIXED",
        description: "Electricity, water, internet, etc.",
      },
      {
        name: "Salary",
        type: "EXPENSE",
        expenseType: "FIXED",
        description: "Employee salary",
      },
      {
        name: "Raw Materials",
        type: "EXPENSE",
        expenseType: "VARIABLE",
        description: "Food and beverage ingredients",
      },
      {
        name: "Operational",
        type: "EXPENSE",
        expenseType: "VARIABLE",
        description: "Daily operational expenses",
      },
      {
        name: "Other Expense",
        type: "EXPENSE",
        expenseType: "VARIABLE",
        description: "Other expenses",
      },
    ],
  });

  console.log("✅ Accounts created");
  console.log("✅ Categories created");

  console.log({
    cashAccount,
    bankAccount,
    qrisAccount,
  });
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });