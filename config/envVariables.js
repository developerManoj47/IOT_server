import dotenv from "dotenv";
dotenv.config();

const envVariable = {
  ENVIRONMENT: process.env.ENVIRONMENT,
  PORT: process.env.PORT,
  // Mongo uri
  MONGO_URI: `mongodb+srv://manojbhatt2003:${process.env.DB_PASSWORD}@cluster0.9ukvg.mongodb.net/${process.env.DB_NAME}`,
  // jwt secret key
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  // bcrypt salt round
  BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
};

export default envVariable;
