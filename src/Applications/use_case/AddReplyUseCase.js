const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCasePayload) {
    const addReply = new AddReply(useCasePayload);
    const { threadId, commentId } = useCasePayload;
    await this._threadRepository.verifyAvailibilityThread(threadId);
    await this._commentRepository.verifyAvailibilityComment(commentId);
    return this._replyRepository.addReply(userId, commentId, addReply);
  }
}

module.exports = AddReplyUseCase;
