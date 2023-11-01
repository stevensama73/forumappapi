const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const LikesCommentTableTestHelper = require('../../../../tests/LikesCommentTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const LikeCommentRepositoryPostgres = require('../LikeCommentRepositoryPostgres');

describe('LikeCommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await LikesCommentTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist add like correctly', async () => {
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
      const likeComment = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'dicoding'
      }
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.addThread(fakeOwner, addThread);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepositoryPostgres.addComment(fakeOwner, fakeThread, addComment);
      // Action
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool);
      const is_like = await likeCommentRepositoryPostgres.addLike(likeComment);
      expect(is_like).toEqual(true);
      // Assert
      const likesComment = await LikesCommentTableTestHelper.findLikesCommentByThreadIdAndCommentId('thread-123', 'comment-123');
      expect(likesComment).toHaveLength(1);
    });
  });

  describe('/updateLike function', () => {
    it('should return false when is_like is true', async () => {
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
      const likeComment = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'dicoding'
      };
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.addThread(fakeOwner, addThread);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(fakeOwner, fakeThread, addComment);
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool);
      // Assert
      const is_like = await likeCommentRepositoryPostgres.addLike(likeComment);
      expect(is_like).toEqual(true);
      const update_like = await likeCommentRepositoryPostgres.updateLike({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'dicoding',
        is_like: 0
      });
      expect(update_like).toEqual(false);
    });
  });

  describe('/verifyAvailibilityLikeComment function', () => {
    it('should return false when like comment is not found', async () => {
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool);

      // Action
      const available = await likeCommentRepositoryPostgres.verifyAvailibilityLikeComment('thread-123', 'comment-123', 'dicoding');

      // Action & Assert
      expect(available).toEqual(false);
    });

    it('should return true when like comment is found', async () => {
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
      const likeComment = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'dicoding'
      };
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.addThread(fakeOwner, addThread);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(fakeOwner, fakeThread, addComment);
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool);
      await likeCommentRepositoryPostgres.addLike(likeComment);
      // Assert
      const available = await likeCommentRepositoryPostgres.verifyAvailibilityLikeComment('thread-123', 'comment-123', 'dicoding');

      // Action & Assert
      expect(available).toEqual(true);
    });
  });

  describe('/checkIsLikeComment function', () => {
    it('should return false when is_like is false', async () => {
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
      const likeComment = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'dicoding'
      };
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.addThread(fakeOwner, addThread);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(fakeOwner, fakeThread, addComment);
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool);
      await likeCommentRepositoryPostgres.addLike(likeComment);
      await likeCommentRepositoryPostgres.updateLike({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'dicoding',
        is_like: 0
      });
      // Assert
      const is_like = await likeCommentRepositoryPostgres.checkIsLikeComment('thread-123', 'comment-123', 'dicoding');

      // Action & Assert
      expect(is_like).toEqual(false);
    });

    it('should return true when is_like is true', async () => {
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
      const likeComment = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'dicoding'
      };
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.addThread(fakeOwner, addThread);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(fakeOwner, fakeThread, addComment);
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool);
      await likeCommentRepositoryPostgres.addLike(likeComment);
      // Assert
      const is_like = await likeCommentRepositoryPostgres.checkIsLikeComment('thread-123', 'comment-123', 'dicoding');

      // Action & Assert
      expect(is_like).toEqual(true);
    });
  });

  describe('/getLikesCommentByThreadId', () => {
    it('should persist get likes comment by thread id', async () => {
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
      const likeComment = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'dicoding'
      };
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.addThread(fakeOwner, addThread);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(fakeOwner, fakeThread, addComment);
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool);
      await likeCommentRepositoryPostgres.addLike(likeComment);

      // Assert
      const likesComment = await likeCommentRepositoryPostgres.getLikesCommentByThreadId('thread-123');
      expect(likesComment).toHaveLength(1);
      expect(likesComment[0]).toStrictEqual({
        comment_id: 'comment-123',
        likecount: '1'
      });
    });
  });
});
