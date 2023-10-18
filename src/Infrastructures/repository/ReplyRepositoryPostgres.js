const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(owner, commentId, addReply) {
    const { content } = addReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, date, owner, commentId, 0],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async verifyAvailibilityReply(replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  }

  async verifyReplyOwner(username, replyId) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);
    const { owner } = result.rows[0];
    if (owner !== username) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }
  }

  async getRepliesByCommentsId(commentsId) {
    const query = {
      text: 'SELECT * FROM replies WHERE comment_id = ANY($1) ORDER BY date ASC',
      values: [commentsId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteReply(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = $1 WHERE id = $2 RETURNING is_delete',
      values: [1, id],
    };

    const result = await this._pool.query(query);

    return result.rows[0].is_delete;
  }
}

module.exports = ReplyRepositoryPostgres;
