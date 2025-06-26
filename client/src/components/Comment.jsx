import CommentForm from './CommentForm'

export default function Comment({
  comment,
  onReplyClick,
  activeReplyId,
  onCancelReply,
}) {
  return (
    <div
      style={{
        marginLeft: comment.parent ? 20 : 0,
        borderLeft: comment.parent ? '1px solid #ccc' : 'none',
        paddingLeft: 10,
        marginTop: 10,
      }}
    >
      <div>
        <b>{comment.userName}</b> ({comment.email}){' '}
        <i>{new Date(comment.createdAt).toLocaleString()}</i>
      </div>
      <div dangerouslySetInnerHTML={{ __html: comment.text }} />
      {comment.attachment && (
        <div>
          {/\.(jpg|jpeg|png|gif)$/i.test(comment.attachment) ? (
            <img
              src={`/uploads/${comment.attachment}`}
              alt="attachment"
              style={{ maxWidth: 320, maxHeight: 240, marginTop: 5 }}
            />
          ) : (
            <a
              href={`/uploads/${comment.attachment}`}
              target="_blank"
              rel="noreferrer"
              style={{ marginTop: 5, display: 'inline-block' }}
            >
              Download attachment
            </a>
          )}
        </div>
      )}
      <button onClick={() => onReplyClick(comment.id)} style={{ marginTop: 5 }}>
        Reply
      </button>

      {activeReplyId === comment.id && (
        <CommentForm parentId={comment.id} onCancel={onCancelReply} />
      )}

      {/* Відповіді */}
      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReplyClick={onReplyClick}
              activeReplyId={activeReplyId}
              onCancelReply={onCancelReply}
            />
          ))}
        </div>
      )}
    </div>
  )
}
