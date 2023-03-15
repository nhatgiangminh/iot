const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

module.exports = {
  // cấu hình port muốn sử dụng
  server: {
    environment: process.env.environment,
    port: 1010,
  },

  // cấu hình db
  database: {
    uri: process.env.mongoose_url,
    database_name: process.env.database_name,
  },

  // logger lưu dữ liệu truy cập của server
  logger: {
    file_name: process.env.environment,
  },
};
