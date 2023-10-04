const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
 
describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });
 
  afterAll(async () => {
    await pool.end();
  });
 
  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'title-xxx',
        body: 'body-xxx',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const fakeOwner = 'owner-xxx';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
 
      // Action
      await threadRepositoryPostgres.addThread(fakeOwner, addThread);
 
      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });
 
    it('should return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'title-xxx',
        body: 'body-xxx',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const fakeOwner = 'owner-xxx';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      const addedThread = await threadRepositoryPostgres.addThread(fakeOwner, addThread);
      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'title-xxx',
        owner: fakeOwner
      }));
    });
  });

  describe('getDetailThread function', () => {
    it('should persist get detail thread', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({});

      const detail = await threadRepositoryPostgres.getDetailThread('thread-xxx');
      expect(detail).toHaveLength(1);
    });

    it('should persist get detail thread after comment deleted', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({});
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        is_delete: 1
      });

      const detail = await threadRepositoryPostgres.getDetailThread('thread-xxx');
      expect(detail).toHaveLength(2);
      expect(detail[1].is_delete).toEqual(true)
    });
  });
});