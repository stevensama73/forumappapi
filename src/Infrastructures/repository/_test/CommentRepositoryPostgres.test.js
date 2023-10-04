const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
 
describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });
 
  afterAll(async () => {
    await pool.end();
  });
 
  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        content: "content-xxx"
      });
      const fakeIdGenerator = () => '123'; // stub!
      const fakeThread = 'thread-xxx'
      const fakeOwner = 'owner-xxx';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
 
      // Action
      await commentRepositoryPostgres.addComment(fakeOwner, fakeThread, addComment);
 
      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });
 
    it('should return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        content: "content-xxx"
      });
      const fakeIdGenerator = () => '123'; // stub!
      const fakeThread = 'thread-xxx'
      const fakeOwner = 'owner-xxx';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      const addedComment = await commentRepositoryPostgres.addComment(fakeOwner, fakeThread, addComment);
      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'content-xxx',
        owner: fakeOwner,
      }));
    });
  });

  describe('/deleteComment function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
 
      // Action
      return expect(commentRepositoryPostgres.getCommentById('comment-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when user is not comment owner', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.addComment({
        content: 'content-xxx'
      });

      // Action & Assert
      return expect(commentRepositoryPostgres.deleteComment('owner-123', 'comment-xxx'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should persist delete comment', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.addComment({
        content: 'content-xxx'
      });

      // Action & Assert
      const { is_delete } = await commentRepositoryPostgres.deleteComment('owner-xxx', 'comment-xxx') 
      return expect(is_delete).toEqual(true)
    });
  })
});