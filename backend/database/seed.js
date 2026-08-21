/**
 * ساخت یک عضو تیم جدید (چون این ابزار داخلیه و ثبت‌نام عمومی نداره)
 * Usage: node database/seed.js "نام کامل" username password [admin]
 */
const { Pool } = require('pg');
require('dotenv').config();
const { hashPassword } = require('../src/utils/password');

async function seed() {
  const [fullName, username, password, roleArg] = process.argv.slice(2);
  if (!fullName || !username || !password) {
    console.error('Usage: node database/seed.js "نام کامل" username password [admin]');
    process.exitCode = 1;
    return;
  }
  const role = roleArg === 'admin' ? 'admin' : 'member';

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const passwordHash = hashPassword(password);
    const { rows } = await pool.query(
      `INSERT INTO team_members (full_name, username, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash, full_name = EXCLUDED.full_name, role = EXCLUDED.role
       RETURNING id, full_name, username, role`,
      [fullName, username, passwordHash, role]
    );
    console.log('✅ عضو تیم ساخته/بروزرسانی شد:', rows[0]);
  } catch (err) {
    console.error('❌ خطا:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();
