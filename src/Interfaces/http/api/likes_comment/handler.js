const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class LikesCommentHandler {
  constructor(container) {
    this._container = container;

    this.postLikeCommentHandler = this.postLikeCommentHandler.bind(this);
  }

  async postLikeCommentHandler(request, h) {
    const { username } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);
    await likeCommentUseCase.execute(username, { threadId, commentId });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesCommentHandler;
