const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const fakeDate = new Date();
    const useCasePayload = {
      title: 'title-xxx',
      body: 'body-xxx',
    };
    const mockAddedComment = new AddedComment({
      id: fakeId,
      title: useCasePayload.title,
      body: useCasePayload.body,
    });
 
    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
 
    /** mocking needed function */
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
 
    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
    });
 
    // Action
    const addedComment = await getCommentUseCase.execute(fakeOwner, useCasePayload);
 
    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: fakeId,
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
    expect(mockCommentRepository.addComment).toBeCalledWith(fakeOwner, new AddComment({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
  });
});