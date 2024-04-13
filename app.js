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
const pool = new Pool(credentials);

async function poolDemo() {
	await createTodo('yet another', true);
  const now = await pool.query("SELECT * from todos");
  await pool.end();
  console.log(now.rows);
}

// function to create todo

const createTodo = async (todo_text, done = false) => {
  const text = `insert into todos (text, done) values ($1, $2)`;
  const values = [todo_text, done];
  const test = await pool.query(text, values);
};

// function to delete todo

// function to update todo

poolDemo();
