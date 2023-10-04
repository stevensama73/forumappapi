const AddedComment = require('../AddedComment');
 
describe('a AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'content-xxx',
      owner: 'owner-xxx',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
 
  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'content-123',
      content: {},
      owner: 'owner-xxx',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
 
  it('should create addedThread object correctly', () => {
    const payload = {
      id: 'content-123',
      content: 'content-xxx',
      owner: 'owner-xxx',
    };

    const { id, content, owner } = new AddedComment(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});