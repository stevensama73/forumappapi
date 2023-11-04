const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const replyUseCasePayload = {
      threadId: 'thread-xxx',
      commentId: 'comment-xxx',
      replyId: 'reply-xxx',
    };
    const commentUseCasePayload = {
      commentId: 'comment-xxx',
    };
    const threadUseCasePayload = {
      threadId: 'thread-xxx',
    };
    const fakeOwner = 'dicoding';

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockReplyRepository.verifyAvailibilityReply = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailibilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyAvailibilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const is_delete = await deleteReplyUseCase.execute(fakeOwner, replyUseCasePayload);

    // Assert
    expect(is_delete).toEqual(true);
    expect(mockReplyRepository.verifyAvailibilityReply).toBeCalledWith(replyUseCasePayload.replyId);
    expect(mockCommentRepository.verifyAvailibilityComment).toBeCalledWith(commentUseCasePayload.commentId);
    expect(mockThreadRepository.verifyAvailibilityThread).toBeCalledWith(threadUseCasePayload.threadId);
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(fakeOwner, replyUseCasePayload.replyId);
    expect(mockReplyRepository.deleteReply).toBeCalledWith(replyUseCasePayload.replyId);
  });
});
