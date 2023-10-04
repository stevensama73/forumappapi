const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the get detail thread action correctly', async () => {
    // Arrange
    const threadUseCasePayload = {
      threadId: 'thread-xxx'
    }
 
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
 
    /** mocking needed function */
    mockThreadRepository.getDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(Promise.resolve()));
 
    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository
    });
 
    // Action
    await getDetailThreadUseCase.execute(threadUseCasePayload);
 
    // Assert
    expect(mockThreadRepository.getDetailThread).toHaveBeenCalledWith(threadUseCasePayload.threadId);
  });
});