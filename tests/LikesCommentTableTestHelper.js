/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikeCommentTableTestHelper = {
  async addLike({
    thread_id = 'thread-123',
    comment_id = 'comment-123',
    owner = 'dicoding',
    is_like = 1,
  }) {
    const query = {
      text: 'INSERT INTO likes_comment VALUES($1, $2, $3, $4)',
      values: [thread_id, comment_id, owner, is_like],
    };

    await pool.query(query);
  },

  async findLikesCommentByThreadIdAndCommentId(threadId, commentId) {
    const query = {
      text: 'SELECT * FROM likes_comment WHERE thread_id = $1 AND comment_id = $2',
      values: [threadId, commentId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes_comment WHERE 1=1');
  },
};

module.exports = LikeCommentTableTestHelper;
