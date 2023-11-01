const LikeCommentRepository = require('../../../Domains/likes_comment/LikeCommentRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentdUseCase', () => {
  it('should orchestrating the like comment action correctly', async () => {
    // Arrange
    const fakeOwner = 'dicoding';
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    const likeComment = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'dicoding',
    };
    /** creating dependency of use case */
    const mockLikeCommentRepository = new LikeCommentRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockLikeCommentRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    
    mockLikeCommentRepository.verifyAvailibilityLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    
    mockThreadRepository.verifyAvailibilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    
    mockCommentRepository.verifyAvailibilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const likeCommentUseCase = new LikeCommentUseCase({
      likesCommentRepository: mockLikeCommentRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await likeCommentUseCase.execute(fakeOwner, useCasePayload);

    // Assert
    expect(mockLikeCommentRepository.addLike).toBeCalledWith(likeComment);
    expect(mockLikeCommentRepository.verifyAvailibilityLikeComment).toBeCalledWith(likeComment.threadId, likeComment.commentId, fakeOwner);
    expect(mockThreadRepository.verifyAvailibilityThread).toBeCalledWith(likeComment.threadId);
    expect(mockCommentRepository.verifyAvailibilityComment).toBeCalledWith(likeComment.commentId);
  
    likeComment.is_like = false
    /** mocking needed second function */
    mockLikeCommentRepository.updateLike = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    
    mockLikeCommentRepository.verifyAvailibilityLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    
    mockLikeCommentRepository.checkIsLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    
    mockThreadRepository.verifyAvailibilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    
    mockCommentRepository.verifyAvailibilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // Action
    await likeCommentUseCase.execute(fakeOwner, useCasePayload);

    // Assert
    expect(mockLikeCommentRepository.updateLike).toBeCalledWith(likeComment);
    expect(mockLikeCommentRepository.checkIsLikeComment).toBeCalledWith(likeComment.threadId, likeComment.commentId, fakeOwner);
    expect(mockLikeCommentRepository.verifyAvailibilityLikeComment).toBeCalledWith(likeComment.threadId, likeComment.commentId, fakeOwner);
    expect(mockThreadRepository.verifyAvailibilityThread).toBeCalledWith(likeComment.threadId);
    expect(mockCommentRepository.verifyAvailibilityComment).toBeCalledWith(likeComment.commentId);
  });
});
