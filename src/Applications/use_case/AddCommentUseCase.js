const AddComment = require('../../Domains/comments/entities/AddComment');
 
class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }
 
  async execute(userId, useCasePayload) {
    const addComment = new AddComment(useCasePayload);
    const { threadId } = useCasePayload
    await this._threadRepository.getThreadById(threadId);
    return this._commentRepository.addComment(userId, threadId, addComment);
  }
}
 
module.exports = AddCommentUseCase;