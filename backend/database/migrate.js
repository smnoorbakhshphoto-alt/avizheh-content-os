/**
 * اجرای schema.sql روی دیتابیس (یک‌بار، روی دیتابیس خالی)
 * Usage: npm run migrate
 */
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

async function migrate() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  console.log('⏳ در حال اجرای schema.sql ...');
  try {
    await pool.query(sql);
    console.log('✅ دیتابیس با موفقیت ساخته شد.');
  } catch (err) {
    console.error('❌ خطا در اجرای migration:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrate();
