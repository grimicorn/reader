import { truncateE2eData } from "./seed";

export default async function globalTeardown() {
  const dbUrl = process.env.E2E_DATABASE_URL;
  if (!dbUrl) return;

  // Leave the branch data clean for the next run
  await truncateE2eData(dbUrl);
}
