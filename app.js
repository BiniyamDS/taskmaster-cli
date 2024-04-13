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
  // await createTodo('yet another', true);
  // await deleteTodo(5)
  // await updateTodo(4, false)
  await listTodos();
  await pool.end();
}

// function to create todo

const createTodo = async (todo_text, done = false) => {
  const text = `insert into todos (text, done) values ($1, $2)`;
  const values = [todo_text, done];
  await pool.query(text, values);
};

// function to delete todo

const deleteTodo = async (id) => {
  const text = `delete from todos where id=$1`;
  const values = [id];
  await pool.query(text, values);
};

// function to update todo

const updateTodo = async (id, done) => {
  const text = `update todos set done=$2 where id=$1`;
  const values = [id, done];
  await pool.query(text, values);
};

// function to list all todos
const listTodos = async (all = true, done = false) => {
  const base_text = `SELECT * from todos`;
  const bool_text = `where done=${done}`;
  const text = all ? base_text: `${base_text} ${bool_text}`;
  const now = await pool.query(text);
  console.log(now.rows);
};

poolDemo();
