const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser(registerUser);
      const addComment = new AddComment({
        content: 'content-xxx',
      });
      const fakeThread = 'thread-123';
      const fakeOwner = 'dicoding';
      const addThread = new AddThread({
        title: 'title-xxx',
        body: 'body-xxx',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.addThread(fakeOwner, addThread);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(fakeOwner, fakeThread, addComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser(registerUser);
      const addComment = new AddComment({
        content: 'content-xxx',
      });
      const fakeThread = 'thread-123';
      const fakeOwner = 'dicoding';
      const addThread = new AddThread({
        title: 'title-xxx',
        body: 'body-xxx',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.addThread(fakeOwner, addThread);

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

  describe('/verifyAvailibilityComment function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser(registerUser);
      const fakeOwner = 'dicoding';
      const addThread = new AddThread({
        title: 'title-xxx',
        body: 'body-xxx',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.addThread(fakeOwner, addThread);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await CommentsTableTestHelper.addComment({
        content: 'content-xxx',
      });
      // Action
      return expect(commentRepositoryPostgres.verifyAvailibilityComment('comment-456'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment found', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser(registerUser);
      const fakeOwner = 'dicoding';
      const addThread = new AddThread({
        title: 'title-xxx',
        body: 'body-xxx',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.addThread(fakeOwner, addThread);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await CommentsTableTestHelper.addComment({
        content: 'content-xxx',
      });
      // Action
      return expect(commentRepositoryPostgres.verifyAvailibilityComment('comment-123'))
        .resolves
        .not
        .toThrowError(NotFoundError);
    });
  });

  describe('/verifyCommentOwner function', () => {
    it('should throw AuthorizationError when user is not comment owner', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser(registerUser);
      const fakeOwner = 'dicoding';
      const addThread = new AddThread({
        title: 'title-xxx',
        body: 'body-xxx',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.addThread(fakeOwner, addThread);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await CommentsTableTestHelper.addComment({
        content: 'content-xxx',
      });

      // Action & Assert
      return expect(commentRepositoryPostgres.verifyCommentOwner('owner-456', 'comment-123'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when user is comment owner', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser(registerUser);
      const fakeOwner = 'dicoding';
      const addThread = new AddThread({
        title: 'title-xxx',
        body: 'body-xxx',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.addThread(fakeOwner, addThread);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await CommentsTableTestHelper.addComment({
        content: 'content-xxx',
      });

      // Action & Assert
      return expect(commentRepositoryPostgres.verifyCommentOwner('dicoding', 'comment-123'))
        .resolves
        .not
        .toThrowError(AuthorizationError);
    });
  });

  describe('/deleteComment function', () => {
    it('should persist delete comment', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser(registerUser);
      const fakeOwner = 'dicoding';
      const addThread = new AddThread({
        title: 'title-xxx',
        body: 'body-xxx',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.addThread(fakeOwner, addThread);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await CommentsTableTestHelper.addComment({
        content: 'content-xxx',
      });

      // Action & Assert
      
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');
      expect(comments[0].is_delete).toEqual(false);
      const is_delete = await commentRepositoryPostgres.deleteComment('comment-123');
      expect(is_delete).toEqual(true);
    });
  });

  describe('/getCommentsByThreadId', () => {
    it('should persist get comments by thread id', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser(registerUser);
      const fakeOwner = 'dicoding';
      const addThread = new AddThread({
        title: 'title-xxx',
        body: 'body-xxx',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.addThread(fakeOwner, addThread);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await CommentsTableTestHelper.addComment({
        content: 'content-xxx',
      });

      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');
      expect(comments).toHaveLength(1);
      expect(comments).toStrictEqual([{
        content: 'content-xxx', date: new Date('2021-08-08T00:59:18.982Z'), id: 'comment-123', is_delete: false, owner: 'dicoding', thread_id: 'thread-123',
      }]);
    });
  });
});
