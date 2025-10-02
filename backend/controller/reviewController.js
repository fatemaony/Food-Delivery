import { sql } from '../config/db.js'

export const getReviewsByMenu = async (req, res) => {
  const { menuId } = req.params
  try {
    const reviews = await sql`
      SELECT * FROM reviews WHERE menu_id = ${menuId} 
      ORDER BY created_at DESC
    `
    return res.status(200).json({ success: true, data: reviews })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const getAllRewiews = async (req, res) => {
  try {
    const reviews = await sql`
      SELECT * FROM reviews
      ORDER BY created_at DESC
    `;
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = async (req, res) => {
  const { menu_id, user_email, user_name, user_image, comment, rating } = req.body

  // Add rating to required fields validation
  if (!menu_id || !user_email || !user_name || !user_image || !comment || !rating) {
    return res.status(400).json({ success: false, message: 'All fields are required' })
  }

  // Validate rating range
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' })
  }

  try {
    const created = await sql`
      INSERT INTO reviews (menu_id, user_email, user_name, user_image, comment, rating)
      VALUES (${menu_id}, ${user_email}, ${user_name}, ${user_image}, ${comment}, ${rating})
      RETURNING *
    `
    return res.status(201).json({ success: true, data: created[0] })
  } catch (error) {
    // Handle unique constraint violation for one-review-per-user-per-menu
    if (String(error.message).toLowerCase().includes('duplicate') || String(error.message).toLowerCase().includes('unique')) {
      return res.status(409).json({ success: false, message: 'You have already reviewed this menu.' })
    }
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const updateReview = async (req, res) => {
  const { id } = req.params
  const { user_email, comment, rating } = req.body
  
  if (!comment || !user_email || !rating) {
    return res.status(400).json({ success: false, message: 'Comment, rating and user_email are required' })
  }

  // Validate rating range
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' })
  }

  try {
    const updated = await sql`
      UPDATE reviews
      SET comment = ${comment}, rating = ${rating}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND user_email = ${user_email}
      RETURNING *
    `

    if (updated.length === 0) {
      return res.status(404).json({ success: false, message: 'Review not found or not owned by user' })
    }

    return res.status(200).json({ success: true, data: updated[0] })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteReview = async (req, res) => {
  const { id } = req.params
  const { user_email } = req.body
  if (!user_email) {
    return res.status(400).json({ success: false, message: 'user_email is required' })
  }

  try {
    const deleted = await sql`
      DELETE FROM reviews WHERE id = ${id} AND user_email = ${user_email} RETURNING *
    `
    if (deleted.length === 0) {
      return res.status(404).json({ success: false, message: 'Review not found or not owned by user' })
    }
    return res.status(200).json({ success: true, data: deleted[0] })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}