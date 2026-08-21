require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4100;

app.listen(PORT, () => {
  console.log(`✅ سرور Content OS روی پورت ${PORT} اجرا شد.`);
});
