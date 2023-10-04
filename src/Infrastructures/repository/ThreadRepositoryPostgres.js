const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
 
class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }
 
  async addThread(owner, addThread) {
    const { title, body } = addThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, owner],
    };
 
    const result = await this._pool.query(query);
 
    return new AddedThread({ ...result.rows[0] });
  }

  async getThreadById(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    const { id } = result.rows[0];

    return id;
  }

  async getDetailThread(threadId) {
    let query = {
      text: 'SELECT t.id AS thread_id, t.title, t.body, t.date AS thread_date, tu.username AS thread_username,'+
      ' c.id AS comment_id, cu.username AS comment_username, c.date AS comment_date, c.content, c.is_delete'+
      ' FROM threads AS t'+
      ' LEFT JOIN comments AS c ON t.id = c.thread_id'+
      ' LEFT JOIN users AS tu ON t.owner = tu.id'+
      ' LEFT JOIN users AS cu ON c.owner = cu.id'+
      ' WHERE thread_id = $1'+
      ' ORDER BY comment_date ASC',
      values: [threadId],
    }

    const result = await this._pool.query(query);

    return result.rows
  }
}
 
module.exports = ThreadRepositoryPostgres;