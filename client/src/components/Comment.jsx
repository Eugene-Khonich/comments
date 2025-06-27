import CommentForm from './CommentForm'
import styles from './Comment.module.css'

export default function Comment({
  comment,
  onReplyClick,
  activeReplyId,
  onCancelReply,
}) {
  const isNested = Boolean(comment.parent)

  return (
    <div className={`${styles.comment} ${isNested ? styles.nested : ''}`}>
      <div className={styles.header}>
        <b>{comment.userName}</b> ({comment.email}){' '}
        <i>{new Date(comment.createdAt).toLocaleString()}</i>
      </div>

      <div dangerouslySetInnerHTML={{ __html: comment.text }} />

      {comment.attachment && (
        <div className={styles.attachment}>
          {/\.(jpg|jpeg|png|gif)$/i.test(comment.attachment) ? (
            <img
              src={`/uploads/${comment.attachment}`}
              alt="attachment"
              className={styles.image}
            />
          ) : (
            <a
              href={`/uploads/${comment.attachment}`}
              target="_blank"
              rel="noreferrer"
              className={styles.download}
            >
              Download attachment
            </a>
          )}
        </div>
      )}

      <button
        onClick={() => onReplyClick(comment.id)}
        className={styles.replyButton}
      >
        Reply
      </button>

      {activeReplyId === comment.id && (
        <CommentForm parentId={comment.id} onCancel={onCancelReply} />
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className={styles.replies}>
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
