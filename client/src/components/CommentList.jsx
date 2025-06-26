import { useEffect, useState, useCallback } from 'react'
import { fetchCommentTree } from '../api'
import Comment from './Comment'

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
    <div>
      <div style={{ marginBottom: 10 }}>
        <label>Sort by: </label>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="userName">User Name</option>
          <option value="email">Email</option>
          <option value="createdAt">Date</option>
        </select>
        <button onClick={toggleOrder}>
          {order === 'ASC' ? '⬆ Ascending' : '⬇ Descending'}
        </button>
      </div>

      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onReplyClick={onReplyClick}
          activeReplyId={activeReplyId}
          onCancelReply={onCancelReply}
        />
      ))}

      <div style={{ marginTop: 20 }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            style={{
              marginRight: 5,
              fontWeight: i + 1 === page ? 'bold' : 'normal',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
