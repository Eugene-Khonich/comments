import { useEffect, useState, useCallback } from 'react'
import { fetchCommentTree } from '../api'
import Comment from './Comment'
import styles from './CommentList.module.css'

export default function CommentList({
  onReplyClick,
  activeReplyId,
  onCancelReply,
}) {
  const [comments, setComments] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('createdAt')
  const [order, setOrder] = useState('DESC')
  const limit = 25
  const totalPages = Math.ceil(total / limit)

  const loadComments = useCallback(async () => {
    try {
      const data = await fetchCommentTree({ page, limit, sort, order })
      setComments(data.data)
      setTotal(data.total)
    } catch {
      alert('Failed to load comments')
    }
  }, [page, sort, order])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  useEffect(() => {
    const handleNewComment = () => loadComments()
    window.addEventListener('comment_added', handleNewComment)
    return () => {
      window.removeEventListener('comment_added', handleNewComment)
    }
  }, [loadComments])

  const toggleOrder = () => {
    setOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.sortControls}>
        <label htmlFor="sort">Sort by: </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="userName">User Name</option>
          <option value="email">Email</option>
          <option value="createdAt">Date</option>
        </select>
        <button onClick={toggleOrder} className={styles.sortButton}>
          {order === 'ASC' ? '⬆ Ascending' : '⬇ Descending'}
        </button>
      </div>

      <div className={styles.commentList}>
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

      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={i + 1 === page ? styles.activePage : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
