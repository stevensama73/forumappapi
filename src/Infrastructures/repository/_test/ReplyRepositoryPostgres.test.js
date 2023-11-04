const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser(registerUser);
      const addReply = new AddReply({
        content: 'content-xxx',
      });
      const addComment = new AddComment({
        content: 'content-xxx',
      });
      const fakeThread = 'thread-123';
      const fakeComment = 'comment-123';
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
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(fakeOwner, fakeComment, addReply);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser(registerUser);
      const addReply = new AddReply({
        content: 'content-xxx',
      });
      const addComment = new AddComment({
        content: 'content-xxx',
      });
      const fakeThread = 'thread-123';
      const fakeComment = 'comment-123';
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

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      const addedReply = await replyRepositoryPostgres.addReply(fakeOwner, fakeComment, addReply);
      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'content-xxx',
        owner: fakeOwner,
      }));
    });
  });

  describe('/verifyAvailibilityReply function', () => {
    it('should throw NotFoundError when reply not found', async () => {
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
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await RepliesTableTestHelper.addReply({
        content: 'content-xxx',
      });
      return expect(replyRepositoryPostgres.verifyAvailibilityReply('reply-456'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply found', async () => {
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
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await RepliesTableTestHelper.addReply({
        content: 'content-xxx',
      });
      return expect(replyRepositoryPostgres.verifyAvailibilityReply('reply-123'))
        .resolves
        .not
        .toThrowError(NotFoundError);
    });
  });

  describe('/verifyReplyOwner function', () => {
    it('should throw AuthorizationError when user is not reply owner', async () => {
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
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await RepliesTableTestHelper.addReply({
        content: 'content-xxx',
      });

      // Action & Assert
      return expect(replyRepositoryPostgres.verifyReplyOwner('owner-456', 'reply-123'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when user is reply owner', async () => {
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
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await RepliesTableTestHelper.addReply({
        content: 'content-xxx',
      });

      // Action & Assert
      return expect(replyRepositoryPostgres.verifyReplyOwner('dicoding', 'reply-123'))
        .resolves
        .not
        .toThrowError(AuthorizationError);
    });
  });

  describe('/deleteReply function', () => {
    it('should persist delete reply', async () => {
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
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await RepliesTableTestHelper.addReply({
        content: 'content-xxx',
      });

      // Action & Assert
      const replies = await replyRepositoryPostgres.getRepliesByCommentsId(['comment-123']);
      expect(replies[0].is_delete).toEqual(false);
      const is_delete = await replyRepositoryPostgres.deleteReply('reply-123');
      expect(is_delete).toEqual(true);
    });
  });

  describe('/getRepliesByCommentsId', () => {
    it('should persist get replies by comments id', async () => {
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
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await RepliesTableTestHelper.addReply({
        content: 'content-xxx',
      });

      const replies = await replyRepositoryPostgres.getRepliesByCommentsId(['comment-123']);
      expect(replies).toHaveLength(1);
      expect(replies).toEqual([{
        content: 'content-xxx', date: new Date('2021-08-08T00:59:18.982Z'), id: 'reply-123', is_delete: false, owner: 'dicoding', comment_id: 'comment-123',
      }]);
    });
  });
});
