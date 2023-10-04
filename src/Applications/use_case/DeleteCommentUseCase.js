
 class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }
 
  async execute(userId, useCasePayload) {
    const { threadId, commentId } = useCasePayload
    await this._threadRepository.getThreadById(threadId);
    return this._commentRepository.deleteComment(userId, commentId);
  }
}
 
module.exports = DeleteCommentUseCase;