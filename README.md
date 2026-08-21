# Avizheh Content OS

ابزار داخلی و **کاملاً مستقل** برنامه‌ریزی محتوای تیم آویژه. هیچ وابستگی‌ای به `avizhehphoto.ir` یا `avizhehteam.com` ندارد — دیتابیس، احراز هویت و کد کاملاً جدا هستند.

## ساختار

```
backend/    Express API (own PostgreSQL DB, own JWT auth)
frontend/   React + Vite (mobile-first, RTL)
```

## نصب و اجرا (سرور تولید)

### ۱. دیتابیس

```bash
sudo -u postgres psql -c "CREATE USER content_os_user WITH PASSWORD 'یک-رمز-قوی';"
sudo -u postgres psql -c "CREATE DATABASE content_os_db OWNER content_os_user;"
sudo -u postgres psql -d content_os_db -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
```

### ۲. بک‌اند

```bash
cd backend
cp .env.example .env
# .env را ویرایش کن: DATABASE_URL، JWT_SECRET (یک رشته‌ی تصادفی بلند)، CLIENT_URL
npm install --omit=dev
npm run migrate
npm run seed:member -- "نام کامل" username رمز-عبور   # برای هر عضو تیم یک‌بار
```

اجرا با systemd (نمونه در پایین) یا `npm start` (پورت پیش‌فرض ۴۱۰۰).

### ۳. فرانت‌اند

```bash
cd frontend
npm install
npm run build   # خروجی در frontend/dist
```

### ۴. Nginx

خروجی `frontend/dist` را استاتیک سرو کن و `/api/` را به بک‌اند (پورت ۴۱۰۰) پروکسی کن — دقیقاً مثل الگوی `avizhehphoto.ir`.

### ۵. systemd (نمونه)

```ini
# /etc/systemd/system/content-os-backend.service
[Unit]
Description=Avizheh Content OS Backend
After=network.target postgresql.service

[Service]
Type=simple
WorkingDirectory=/var/www/content-os/backend
ExecStart=/usr/bin/node src/server.js
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

## توسعه محلی

```bash
# backend
cd backend && npm install && npm run migrate && npm run dev   # پورت 4100

# frontend
cd frontend && npm install && npm run dev                      # پورت 5173
```
