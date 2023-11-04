class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCasePayload) {
    const { threadId, commentId, replyId } = useCasePayload;
    await this._threadRepository.verifyAvailibilityThread(threadId);
    await this._commentRepository.verifyAvailibilityComment(commentId);
    await this._replyRepository.verifyAvailibilityReply(replyId);
    await this._replyRepository.verifyReplyOwner(userId, replyId);
    return this._replyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
