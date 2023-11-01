const StructureThreadWithCommentsAndRepliesAndLikesCommentUseCase = require('../StructureThreadWithCommentsAndRepliesAndLikesCommentUseCase');
const LikeCommentRepository = require('../../../Domains/likes_comment/LikeCommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('StructureThreadWithCommentsAndReplies', () => {
  it('should orchestrating structure thread with comments and replies action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-AqVg2b9JyQXR6wSQ2TmH4',
    };

    const commentsId = ['comment-q_0uToswNf6i24RDYZJI2', 'comment-q_0uToswNf6i24RDYZJI3', 'comment-q_0uToswNf6i24RDYZJI4']

    const threadUseCasePayload = {
      id: 'thread-AqVg2b9JyQXR6wSQ2TmH4',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date(),
      owner: 'dicoding',
    };
 
    const commentUseCasePayload = [
      {
        id: 'comment-q_0uToswNf6i24RDYZJI2',
        owner: 'dicoding',
        date: new Date(),
        content: 'sebuah comment',
        thread_id: 'thread-AqVg2b9JyQXR6wSQ2TmH3',
        is_delete: false,
      },
      {
        id: 'comment-q_0uToswNf6i24RDYZJI3',
        owner: 'dicoding',
        date: new Date(),
        content: 'sebuah comment',
        thread_id: 'thread-AqVg2b9JyQXR6wSQ2TmH4',
        is_delete: true,
      },
      {
        id: 'comment-q_0uToswNf6i24RDYZJI4',
        owner: 'dicoding',
        date: new Date(),
        content: 'sebuah comment',
        thread_id: 'thread-AqVg2b9JyQXR6wSQ2TmH4',
        is_delete: false,
      },
    ];
 
    const replyUseCasePayload = [
      {
        id: 'reply-BErOXUSefjwWGW1Z10Ihl',
        content: 'sebuah balasan',
        date: new Date(),
        owner: 'johndoe',
        comment_id: 'comment-q_0uToswNf6i24RDYZJI2',
        is_delete: true,
      },
      {
        id: 'reply-BErOXUSefjwWGW1Z10Ihk',
        content: 'sebuah balasan',
        date: new Date(),
        owner: 'johndoe',
        comment_id: 'comment-q_0uToswNf6i24RDYZJI3',
        is_delete: true,
      },
      {
        id: 'reply-BErOXUSefjwWGW1Z10Ihl',
        content: 'sebuah balasan',
        date: new Date(),
        owner: 'johndoe',
        comment_id: 'comment-q_0uToswNf6i24RDYZJI3',
        is_delete: false,
      },
    ];
    
    const likeCommentUseCasePayload = [
      {
        comment_id: 'comment-q_0uToswNf6i24RDYZJI3',
        is_like: 1,
      },
    ]

    const mockLikeCommentRepository = new LikeCommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    mockLikeCommentRepository.getLikesCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(likeCommentUseCasePayload));
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(threadUseCasePayload));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(commentUseCasePayload));
    mockReplyRepository.getRepliesByCommentsId = jest.fn()
      .mockImplementation(() => Promise.resolve(replyUseCasePayload));

    /** creating use case instance */
    const structureThreadWithCommentsAndRepliesAndLikesCommentUseCase = new StructureThreadWithCommentsAndRepliesAndLikesCommentUseCase({
      likesCommentRepository: mockLikeCommentRepository,
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await structureThreadWithCommentsAndRepliesAndLikesCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockLikeCommentRepository.getLikesCommentByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesByCommentsId).toBeCalledWith(commentsId);
  });
});
