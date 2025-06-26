import Comment from './Comment'

export default function CommentList({
  comments,
  onReplyClick,
  activeReplyId,
  onCancelReply,
}) {
  return (
    <div>
      {comments.length === 0 && <p>No comments yet</p>}
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onReplyClick={onReplyClick}
          activeReplyId={activeReplyId}
          onCancelReply={onCancelReply}
        />
      ))}
    </div>
  )
}
