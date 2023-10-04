const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
 
class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }
 
  async addComment(owner, threadId, addComment) {
    const { content } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, date, owner, threadId, 0],
    };
 
    const result = await this._pool.query(query);
 
    return new AddedComment({ ...result.rows[0] });
  }

  async getCommentById(commentId) {
    const query = {
      text: 'SELECT id, owner FROM comments WHERE id = $1',
      values: [commentId],
    }

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    return result.rows[0]
  }

  async deleteComment(userId, id) {
    const { owner } = await this.getCommentById(id)

    if (owner !== userId) {
      throw new AuthorizationError("anda tidak berhak mengakses resource ini")
    }

    const query = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id = $2 RETURNING is_delete',
      values: [1, id],
    }

    const result = await this._pool.query(query);

    return result.rows[0]
  }
}
 
module.exports = CommentRepositoryPostgres;