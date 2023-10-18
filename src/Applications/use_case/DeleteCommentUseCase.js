class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(username, useCasePayload) {
    const { threadId, commentId } = useCasePayload;
    await this._threadRepository.verifyAvailibilityThread(threadId);
    await this._commentRepository.verifyAvailibilityComment(commentId);
    await this._commentRepository.verifyCommentOwner(username, commentId);
    return this._commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
