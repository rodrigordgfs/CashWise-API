import pkg from "@prisma/client";
const { PrismaClient } = pkg;

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    log: ["query", "error", "warn", "info"],
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["query"],
    });
  }
  prisma = global.prisma;
}

export default prisma;
