const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const commentUseCasePayload = {
      threadId: 'thread-xxx',
      commentId: 'comment-xxx',
    };
    const threadUseCasePayload = {
      threadId: 'thread-xxx',
    };
    const fakeOwner = 'dicoding';

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentRepository.verifyAvailibilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyAvailibilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const is_delete = await deleteCommentUseCase.execute(fakeOwner, commentUseCasePayload);

    // Assert
    expect(is_delete).toEqual(true);
    expect(mockThreadRepository.verifyAvailibilityThread).toBeCalledWith(threadUseCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailibilityComment).toBeCalledWith(commentUseCasePayload.commentId);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(fakeOwner, commentUseCasePayload.commentId);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(commentUseCasePayload.commentId);
  });
});
