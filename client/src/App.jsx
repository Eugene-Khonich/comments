import { useEffect, useState, useCallback } from 'react'
import CommentList from './components/CommentList'
import CommentForm from './components/CommentForm'
import { fetchCommentTree } from './api'

export default function App() {
  const [comments, setComments] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(25)
  const [sort, setSort] = useState('createdAt')
  const [order, setOrder] = useState('DESC')
  const [activeReplyId, setActiveReplyId] = useState(null)
  const totalPages = Math.ceil(total / limit)
  const [showForm, setShowForm] = useState(false)

  const loadComments = useCallback(async () => {
    try {
      const data = await fetchCommentTree({ page, limit, sort, order })
      setComments(data.data)
      setTotal(data.total)
      setActiveReplyId(null)
    } catch {
      alert('Failed to load comments')
    }
  }, [page, limit, sort, order])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  const handleReplyClick = (id) => {
    setActiveReplyId(id)
  }

  const handleCancelReply = () => {
    setActiveReplyId(null)
  }

  const handleSortChange = (newSort, newOrder) => {
    setSort(newSort)
    setOrder(newOrder)
    setPage(1)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <h1>Comments</h1>

      <SortControls sort={sort} order={order} onSortChange={handleSortChange} />

      <CommentList
        comments={comments}
        onReplyClick={handleReplyClick}
        activeReplyId={activeReplyId}
        onCancelReply={handleCancelReply}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {!activeReplyId && !showForm && (
        <button onClick={() => setShowForm(true)}>Add a Comment</button>
      )}

      {!activeReplyId && showForm && (
        <>
          <h2>Add a Comment</h2>
          <CommentForm
            onCancel={() => setShowForm(false)}
            onSuccess={loadComments}
          />
        </>
      )}
    </div>
  )
}
