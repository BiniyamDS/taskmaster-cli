require("dotenv").config();
const { USER: db_user, DB: db, PASSWORD: db_password } = process.env;
// console.log(db_user, db_password, db)
const credentials = {
  user: db_user,
  host: "localhost",
  database: db,
  password: db_password,
  port: 5432,
};

const { Client, Pool } = require("pg");
async function poolDemo() {
  const pool = new Pool(credentials);
  const now = await pool.query("SELECT * from todos");
//   awai
  await pool.end();

  console.log(now.rows)
}



poolDemo();