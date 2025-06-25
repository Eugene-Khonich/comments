import { useEffect, useState } from 'react'
import { fetchComments } from '../../api/comments'
import CommentItem from '../CommentItem/CommentItem'
import styles from './CommentList.module.css'

export default function CommentList() {
  const [comments, setComments] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sort, setSort] = useState('createdAt')
  const [order, setOrder] = useState('DESC')

  const limit = 5

  useEffect(() => {
    const loadComments = async () => {
      const { data, total } = await fetchComments({ page, limit, sort, order })
      setComments(data)
      setTotalPages(Math.ceil(total / limit))
    }

    loadComments()
  }, [page, sort, order])

  return (
    <div className={styles.wrapper}>
      <div className={styles.controls}>
        <label>
          Sort by:
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className={styles.select}
          >
            <option value="createdAt">Date</option>
            <option value="userName">Username</option>
            <option value="email">Email</option>
          </select>
        </label>

        <button
          onClick={() => setOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))}
          className={styles.button}
        >
          Order: {order}
        </button>
      </div>

      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}

      <div className={styles.pagination}>
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page <= 1}
          className={styles.button}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages}
          className={styles.button}
        >
          Next
        </button>
      </div>
    </div>
  )
}
