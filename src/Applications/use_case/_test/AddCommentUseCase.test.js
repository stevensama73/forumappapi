const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const fakeId = 'comment-xxx';
    const fakeOwner = 'dicoding';
    const useCasePayload = {
      content: 'content-xxx',
      threadId: 'thread-xxx',
    };
    const mockAddedComment = new AddedComment({
      id: fakeId,
      content: useCasePayload.content,
      owner: fakeOwner,
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    mockThreadRepository.verifyAvailibilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await getCommentUseCase.execute(fakeOwner, useCasePayload);
    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: fakeId,
      content: useCasePayload.content,
      owner: fakeOwner,
    }));
    expect(mockThreadRepository.verifyAvailibilityThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(fakeOwner, useCasePayload.threadId, new AddComment({
      content: useCasePayload.content,
    }));
  });
});
