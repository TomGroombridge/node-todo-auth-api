const jwt_decode = require('jwt-decode');
const Pool = require('pg').Pool

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
})

const getTodos = async (request, response) => {
  const { authorization } = request.headers
  const payload = jwt_decode(authorization)
  const { sub } = payload;
  try {
    const userResults = await pool.query('SELECT * FROM users WHERE auth_0_id = $1', [sub]);
    const { id } = userResults.rows[0];
    const todoResults = await pool.query('SELECT * FROM  todos WHERE user_id = $1', [id]);
    console.log('TODOS QUERY', todoResults);
    const { rows } = todoResults;
    response.status(200).json(rows);
  } catch (error) {
    throw error;
  }
}

const createTodos = async (request, response, next) => {
  try {
    const { task, user_id } = request.body
    const todo = await pool.query('INSERT INTO todos (user_id, is_complete, task) VALUES  ($1, $2, $3)', [user_id, false, task])
    response.status(200).json(todo.rows[0]);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTodos,
  createTodos
}