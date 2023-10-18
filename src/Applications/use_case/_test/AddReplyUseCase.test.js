const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const fakeId = 'reply-xxx';
    const fakeOwner = 'owner-xxx';
    const useCasePayload = {
      content: 'content-xxx',
      commentId: 'comment-xxx',
      threadId: 'thread-xxx',
    };
    const mockAddedReply = new AddedReply({
      id: fakeId,
      content: useCasePayload.content,
      owner: fakeOwner,
    });

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    mockThreadRepository.verifyAvailibilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyAvailibilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const getReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedReply = await getReplyUseCase.execute(fakeOwner, useCasePayload);
    // Assert
    expect(addedReply).toStrictEqual(new AddedReply({
      id: fakeId,
      content: useCasePayload.content,
      owner: fakeOwner,
    }));
    expect(mockReplyRepository.addReply).toBeCalledWith(fakeOwner, useCasePayload.commentId, new AddReply({
      content: useCasePayload.content,
    }));
    expect(mockThreadRepository.verifyAvailibilityThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailibilityComment).toBeCalledWith(useCasePayload.commentId);
  });
});
