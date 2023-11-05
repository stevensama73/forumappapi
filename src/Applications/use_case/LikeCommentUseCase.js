class LikeCommentUseCase {
  constructor({ likesCommentRepository, commentRepository, threadRepository }) {
    this._likesCommentRepository = likesCommentRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCasePayload) {
    const { threadId, commentId } = useCasePayload;
    await this._threadRepository.verifyAvailibilityThread(threadId);
    await this._commentRepository.verifyAvailibilityComment(commentId);
    const available = await this._likesCommentRepository.verifyAvailibilityLikeComment(threadId, commentId, userId);
    if (available) {
      const is_like = await this._likesCommentRepository.checkIsLikeComment(threadId, commentId, userId);
      await this._likesCommentRepository.updateLike({
        threadId: useCasePayload.threadId,
        commentId: useCasePayload.commentId,
        owner: userId,
        is_like: !is_like,
      });
    } else {
      await this._likesCommentRepository.addLike({
        threadId: useCasePayload.threadId,
        commentId: useCasePayload.commentId,
        owner: userId,
      });
    }
  }
}

module.exports = LikeCommentUseCase;
