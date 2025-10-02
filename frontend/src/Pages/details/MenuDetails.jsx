import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import useAxios from '../../Hooks/useAxios'
import useAuth from '../../Hooks/useAuth'

const MenuDetails = () => {
  const { id } = useParams()
  const axios = useAxios()
  const { user } = useAuth() || {}

  const [menu, setMenu] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [reviews, setReviews] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editRating, setEditRating] = useState(5)
  const [editComment, setEditComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const isLoggedIn = useMemo(() => Boolean(user?.email || user?.name), [user])

  useEffect(() => {
    let ignore = false
    async function fetchData() {
      try {
        setLoading(true)
        const [menuRes, reviewsRes] = await Promise.all([
          axios.get(`/api/menus/${id}`),
          axios.get(`/api/reviews/menu/${id}`)
        ])
        if (ignore) return
        setMenu(menuRes.data?.data || null)
        setReviews(reviewsRes.data?.data || [])
        setError('')
      } catch (e) {
        if (ignore) return
        setError(e?.response?.data?.message || e.message || 'Failed to load')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    if (id) fetchData()
    return () => { ignore = true }
  }, [axios, id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLoggedIn) return
    try {
      setSubmitting(true)
      const payload = {
        menu_id: Number(id),
        user_email: user?.email || user?.user_email,
        rating: Number(rating),
        comment: comment.trim()
      }
      const res = await axios.post('/api/reviews/', payload)
      const newReview = res.data?.data
      if (newReview) {
        setReviews((prev) => [newReview, ...prev])
        setRating(5)
        setComment('')
      }
    } catch (e) {
      // Optionally surface toast
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }
  if (error) {
    return <div className="container mx-auto p-4 text-error">{error}</div>
  }
  if (!menu) {
    return <div className="container mx-auto p-4">Menu not found.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-6">
            <img src={menu.image} alt={menu.name} className="w-full md:w-80 h-56 object-cover rounded" />
            <div className="flex-1">
              <h2 className="card-title text-2xl">{menu.name}</h2>
              <p className="mt-2 text-base-content/80">{menu.description}</p>
              <p className="mt-3 text-xl font-semibold">${menu.price}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold mb-3">Customer Reviews</h3>
          {reviews.length === 0 ? (
            <div className="p-4 rounded bg-base-200">No reviews yet.</div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 rounded border border-base-300">
                  <div className="flex items-center gap-3">
                    <img src={r.user_image || menu.image} alt={r.user_name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-medium">{r.user_name}</p>
                      <p className="text-sm text-base-content/70">{new Date(r.created_at).toLocaleString()}</p>
                    </div>
                    <div className="ml-auto">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                    {user?.email && user?.email === r.user_email && (
                      <div className="ml-4 flex gap-2">
                        <button className="btn btn-xs" onClick={() => {
                          setEditingId(r.id)
                          setEditRating(r.rating)
                          setEditComment(r.comment)
                        }}>Edit</button>
                        <button className="btn btn-xs btn-error" onClick={async () => {
                          try {
                            await axios.delete(`/api/reviews/${r.id}`, { data: { user_email: user.email } })
                            setReviews(prev => prev.filter(rv => rv.id !== r.id))
                          } catch (e) {}
                        }}>Delete</button>
                      </div>
                    )}
                  </div>
                  {editingId === r.id ? (
                    <form className="mt-3 space-y-2" onSubmit={async (e) => {
                      e.preventDefault()
                      try {
                        const res = await axios.put(`/api/reviews/${r.id}`, {
                          user_email: user.email,
                          rating: Number(editRating),
                          comment: editComment.trim()
                        })
                        const updated = res.data?.data
                        setReviews(prev => prev.map(rv => rv.id === r.id ? updated : rv))
                        setEditingId(null)
                      } catch (e) {}
                    }}>
                      <select className="select select-bordered select-sm" value={editRating} onChange={(e) => setEditRating(e.target.value)}>
                        {[5,4,3,2,1].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                      <textarea className="textarea textarea-bordered w-full" value={editComment} onChange={(e) => setEditComment(e.target.value)} />
                      <div className="flex gap-2">
                        <button className="btn btn-sm btn-primary" type="submit">Save</button>
                        <button className="btn btn-sm" type="button" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <p className="mt-2">{r.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Write a Review</h3>
          {!isLoggedIn ? (
            <div className="p-4 rounded bg-base-200">Please sign in to write a review.</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Rating</span>
                </label>
                <select
                  className="select select-bordered"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  required
                >
                  {[5,4,3,2,1].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Comment</span>
                </label>
                <textarea
                  className="textarea textarea-bordered min-h-24"
                  placeholder="Share details of your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting || comment.trim().length === 0}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default MenuDetails
