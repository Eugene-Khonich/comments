import CommentForm from './CommentForm'
import styles from './Comment.module.css'
import 'yet-another-react-lightbox/styles.css'
import Lightbox from 'yet-another-react-lightbox'
import { useState } from 'react'

const baseUrl = import.meta.env.VITE_API_BASE_URL || ''

export default function Comment({
  comment,
  onReplyClick,
  activeReplyId,
  onCancelReply,
}) {
  const [open, setOpen] = useState(false)

  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(comment.attachment || '')
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
          {isImage ? (
            <>
              <img
                src={`${baseUrl}/uploads/${comment.attachment}`}
                alt="attachment"
                className={styles.image}
                onClick={() => setOpen(true)}
                style={{ cursor: 'pointer' }}
              />
              <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={[
                  {
                    src: `${baseUrl}/uploads/${comment.attachment}`,
                  },
                ]}
              />
            </>
          ) : (
            <a
              href={`${baseUrl}/uploads/${comment.attachment}`}
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

      {comment.replies?.length > 0 && (
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
