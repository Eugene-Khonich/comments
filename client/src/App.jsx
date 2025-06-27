import CommentList from './components/CommentList'
import CommentForm from './components/CommentForm'
import { useState } from 'react'
import styles from './App.module.css'

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
    <div className={styles.container}>
      <h1 className={styles.title}>Comments</h1>

      {!activeReplyId && !showForm && (
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          Add a Comment
        </button>
      )}

      {!activeReplyId && showForm && (
        <div className={styles.formSection}>
          <h2>Add a Comment</h2>
          <CommentForm onCancel={() => setShowForm(false)} />
        </div>
      )}

      <CommentList
        onReplyClick={handleReplyClick}
        activeReplyId={activeReplyId}
        onCancelReply={handleCancelReply}
      />
    </div>
  )
}
