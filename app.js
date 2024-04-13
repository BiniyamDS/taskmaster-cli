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

const { Pool } = require("pg");
const pool = new Pool(credentials);

async function main() {
  await actions[command](arg);
  await pool.end();
}

// function to create todo

const createTodo = async (todo_text) => {
  const text = `insert into todos (text) values ($1) returning id`;
  const values = [todo_text];
  if (!todo_text) {
    console.log("No text specified");
    return;
  }
  const { rows } = await pool.query(text, values);
  const id = rows[0]["id"];
  console.log(`Created todo with id: ${id}`);
};

// function to delete todo

const deleteTodo = async (id) => {
  const text = `delete from todos where id=$1`;
  const values = [id];
  if (!id) {
    console.log("No text specified");
    return;
  }
  try {
    const result = await pool.query(text, values);
    if (result.rowCount) {
      console.log(`Deleted todo with id: ${id}`);
      await pool.query(
        "SELECT setval('todos_id_seq', (SELECT MAX(id) FROM todos))"
      );
    } else {
      console.log(`No entries found with id: ${id}`);
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

// function to update todo

const updateTodo = async (id) => {
  const text = `update todos set done=$2 where id=$1`;
  const values = [id, true];
  if (!id) {
    console.log("No text specified");
    return;
  }

  try {
    const result = await pool.query(text, values);
    if (result.rowCount) {
      console.log(`Updated todo with id: ${id}`);
      await pool.query(
        "SELECT setval('todos_id_seq', (SELECT MAX(id) FROM todos))"
      );
    } else {
      console.log(`No entries found with id: ${id}`);
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

// function to list all todos
const listTodos = async (all = true, done = false) => {
  const base_text = `SELECT * from todos`;
  const bool_text = `where done=${done}`;
  const order = "order by id";
  const text = `${all ? base_text : `${base_text} ${bool_text}`} ${order}`;
  const { rows } = await pool.query(text);
  formatTodos(rows);
};

// format the output array and print it to the console
function formatTodos(arr) {
  arr.forEach(({ id, text, done }) =>
    console.log(`[${id}] ${done ? "✅" : "❌"} ${text}`)
  );
}

const actions = {
  new: createTodo,
  list: listTodos,
  done: updateTodo,
  delete: deleteTodo,
  help: () => console.log("help not yet setup"),
  version: () => console.log("version not yet setup"),
};

let command = process.argv[2];
command = command ? command.replace("--", "") : null;

const arg = process.argv[3];
if (command in actions) {
  main();
} else {
  console.log("Please provide an appropriate command");
}
