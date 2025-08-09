export default {
  schema: "./utils/schema.jsx",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_ex9GWQMAln3N@ep-silent-wave-ae5uv7vu-pooler.c-2.us-east-2.aws.neon.tech/Expense-tracker?sslmode=require&channel_binding=require',
  }
};
