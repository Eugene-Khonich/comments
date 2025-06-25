import { useState } from 'react'
import styles from './CommentItem.module.css'
import { fetchReplies } from '../../api/comments'
import CommentForm from '../CommentForm/CommentForm'

export default function CommentItem({ comment }) {
  const [replies, setReplies] = useState([])
  const [showReplies, setShowReplies] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)

  const handleToggleReplies = async () => {
    if (!showReplies && replies.length === 0) {
      setLoading(true)
      const data = await fetchReplies(comment.id)
      setReplies(data)
      setLoading(false)
    }
    setShowReplies(!showReplies)
  }

  const handleReplySubmit = (newReply) => {
    setReplies((prev) => [...prev, newReply])
    setShowReplyForm(false)
    if (!showReplies) setShowReplies(true)
  }

  return (
    <div className={styles.commentItem}>
      <div className={styles.header}>
        <strong>{comment.userName}</strong> <span>({comment.email})</span>
      </div>

      <div
        className={styles.text}
        dangerouslySetInnerHTML={{ __html: comment.text }}
      />

      {comment.attachment && (
        <div className={styles.attachment}>
          {comment.attachment.match(/\.(jpg|jpeg|png|gif)$/i) ? (
            <img
              src={`/uploads/${comment.attachment}`}
              alt="Attachment"
              className={styles.image}
            />
          ) : (
            <a
              href={`/uploads/${comment.attachment}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View file
            </a>
          )}
        </div>
      )}
      <div>
        <button onClick={() => setShowReplyForm((v) => !v)}>
          {showReplyForm ? 'Cancel' : 'Reply'}
        </button>
        <button className={styles.toggleButton} onClick={handleToggleReplies}>
          {showReplies ? 'Hide Replies' : 'Show Replies'}
        </button>
      </div>
      {showReplyForm && (
        <CommentForm parentId={comment.id} onSuccess={handleReplySubmit} />
      )}
      {loading && <div className={styles.loading}>Loading...</div>}

      {showReplies &&
        replies.map((reply) => <CommentItem key={reply.id} comment={reply} />)}
    </div>
  )
}
