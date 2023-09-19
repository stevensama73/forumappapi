const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
 
describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });
 
  afterAll(async () => {
    await pool.end();
  });
 
  describe('addThread function', () => {
    it('should persist add thread', async () => {
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
      const fakeDate = new Date();
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      const addedThread = await threadRepositoryPostgres.addThread(fakeOwner, addThread);
      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'title-xxx',
        body: 'body-xxx',
        date: fakeDate,
        owner: fakeOwner,
      }));
    });
  });
});