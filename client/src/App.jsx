import CommentList from './components/CommentList'
import CommentForm from './components/CommentForm'
import { useState } from 'react'

export default function App() {
  const [activeReplyId, setActiveReplyId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const handleReplyClick = (id) => {
    setActiveReplyId(id)
  }

  const handleCancelReply = () => {
    setActiveReplyId(null)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <h1>Comments</h1>

      <CommentList
        onReplyClick={handleReplyClick}
        activeReplyId={activeReplyId}
        onCancelReply={handleCancelReply}
      />

      {!activeReplyId && !showForm && (
        <button onClick={() => setShowForm(true)}>Add a Comment</button>
      )}

      {!activeReplyId && showForm && (
        <>
          <h2>Add a Comment</h2>
          <CommentForm
            onCancel={() => setShowForm(false)}
            onSuccess={() => window.location.reload()} // перезавантаження або emit WebSocket
          />
        </>
      )}
    </div>
  )
}
