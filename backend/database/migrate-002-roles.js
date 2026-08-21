/**
 * افزودن سطح دسترسی (role) به اعضای تیم — روی دیتابیس‌هایی که قبل از این ویژگی ساخته شده‌اند
 * Usage: node database/migrate-002-roles.js
 */
const { Pool } = require('pg');
require('dotenv').config();

async function migrate() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await pool.query(`ALTER TABLE team_members ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'member';`);
    console.log('✅ ستون role اضافه شد (یا از قبل وجود داشت).');
  } catch (err) {
    console.error('❌ خطا:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrate();
