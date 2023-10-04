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
      threadId: 'thread-xxx'
    }
    const fakeOwner = 'owner-xxx'
 
    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
 
    /** mocking needed function */
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve(Promise.resolve()));
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(Promise.resolve()));
 
    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    });
 
    // Action
    await deleteCommentUseCase.execute(fakeOwner, commentUseCasePayload);
 
    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadUseCasePayload.threadId);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(fakeOwner, commentUseCasePayload.commentId);
  });
});