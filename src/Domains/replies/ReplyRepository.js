class ReplyRepository {
  /* eslint-disable no-unused-vars */
  async addReply(owner, commentId, addReply) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /* eslint-disable no-unused-vars */
  async verifyAvailibilityReply(replyId) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /* eslint-disable no-unused-vars */
  async verifyReplyOwner(userId, replyId) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /* eslint-disable no-unused-vars */
  async getRepliesByCommentsId(commentsId) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /* eslint-disable no-unused-vars */
  async deleteReply(replyId) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ReplyRepository;
