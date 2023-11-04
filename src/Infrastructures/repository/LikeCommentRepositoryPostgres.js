const LikeCommentRepository = require('../../Domains/likes_comment/LikeCommentRepository');

class LikeCommentRepositoryPostgres extends LikeCommentRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addLike(likeComment) {
    const { threadId, commentId, owner } = likeComment;

    const query = {
      text: 'INSERT INTO likes_comment VALUES($1, $2, $3, $4) RETURNING is_like',
      values: [threadId, commentId, owner, 1],
    };

    const result = await this._pool.query(query);

    return result.rows[0].is_like;
  }

  async updateLike(likeComment) {
    const {
      threadId, commentId, owner, is_like,
    } = likeComment;

    const query = {
      text: 'UPDATE likes_comment SET is_like = $1 WHERE thread_id = $2 AND comment_id = $3 AND owner = $4 RETURNING is_like',
      values: [is_like, threadId, commentId, owner],
    };

    const result = await this._pool.query(query);

    return result.rows[0].is_like;
  }

  async verifyAvailibilityLikeComment(threadId, commentId, owner) {
    const query = {
      text: 'SELECT * FROM likes_comment WHERE thread_id = $1 AND comment_id = $2 AND owner = $3',
      values: [threadId, commentId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return false;
    }

    return true;
  }

  async checkIsLikeComment(threadId, commentId, owner) {
    const query = {
      text: 'SELECT is_like FROM likes_comment WHERE thread_id = $1 AND comment_id = $2 AND owner = $3',
      values: [threadId, commentId, owner],
    };

    const result = await this._pool.query(query);

    return result.rows[0].is_like;
  }

  async getLikesCommentByThreadId(threadId) {
    const query = {
      text:
        'SELECT comment_id, COUNT(*) AS likecount'
        + ' FROM likes_comment'
        + ' WHERE thread_id = $1 AND is_like = $2'
        + ' GROUP BY comment_id',
      values: [threadId, 1],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = LikeCommentRepositoryPostgres;
