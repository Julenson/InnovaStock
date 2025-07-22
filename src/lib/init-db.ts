import { initDatabase } from '@db/managedb';

let initialized = false;

export async function initializeDatabaseOnce() {
  if (initialized) return;
  initialized = true;
  await initDatabase();
}
