class StructureThreadWithCommentsAndRepliesUseCase {
  constructor({
    likesCommentRepository, replyRepository, commentRepository, threadRepository,
  }) {
    this._likesCommentRepository = likesCommentRepository;
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const replies = await this._replyRepository.getRepliesByCommentsId(comments.map((comment) => comment.id));
    const likesComment = await this._likesCommentRepository.getLikesCommentByThreadId(threadId);
    const result = {
      thread: {
        id: threadId,
        title: thread.title,
        body: thread.body,
        date: thread.date,
        username: thread.owner,
        comments: [],
      },
    };
    comments.forEach((comment) => {
      if (comment.thread_id === threadId) {
        const commentData = {
          id: comment.id,
          username: comment.owner,
          date: comment.date,
          content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
          replies: [],
        };

        likesComment.forEach((likeComment) => {
          if (likeComment.comment_id === comment.id) {
            commentData.likeCount = parseInt(likeComment.likecount, 10);
          }
        });

        replies.forEach((reply) => {
          if (reply.comment_id === comment.id) {
            commentData.replies.push({
              id: reply.id,
              content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
              date: reply.date,
              username: reply.owner,
            });
          }
        });

        result.thread.comments.push(commentData);
      }
    });
    return result;
  }
}

module.exports = StructureThreadWithCommentsAndRepliesUseCase;
