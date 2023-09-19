const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const fakeId = 'thread-123';
    const fakeOwner = 'owner-xxx';
    const fakeDate = new Date();
    const useCasePayload = {
      title: 'title-xxx',
      body: 'body-xxx',
    };
    const mockAddedThread = new AddedThread({
      id: fakeId,
      title: useCasePayload.title,
      body: useCasePayload.body,
      date: fakeDate,
      owner: fakeOwner,
    });
 
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
 
    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));
 
    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });
 
    // Action
    const addedThread = await getThreadUseCase.execute(fakeOwner, useCasePayload);
 
    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: fakeId,
      title: useCasePayload.title,
      body: useCasePayload.body,
      date: fakeDate,
      owner: fakeOwner,
    }));
    expect(mockThreadRepository.addThread).toBeCalledWith(fakeOwner, new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
  });
});