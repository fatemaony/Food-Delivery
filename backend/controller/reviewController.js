import { sql } from '../config/db.js'

export const createReview = async (req, res) => {
  const { menu_id, user_email, rating, comment } = req.body

  if (!menu_id || !user_email || !rating || !comment) {
    return res.status(400).json({ success: false, message: "All fields are required" })
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" })
  }

  try {
    // Get user details from users table
    const user = await sql`
      SELECT name, image FROM users WHERE email=${user_email}
    `

    if (user.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    // Create review with user information
    const newReview = await sql`
      INSERT INTO reviews (menu_id, user_email, user_name, user_image, rating, comment)
      VALUES(${menu_id}, ${user_email}, ${user[0].name}, ${user[0].image}, ${rating}, ${comment})
      RETURNING *
    `

    res.status(201).json({ success: true, data: newReview[0] })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getReviewsByMenu = async (req, res) => {
  const { id } = req.params

  try {
    const reviews = await sql`
      SELECT * FROM reviews 
      WHERE menu_id=${id}
      ORDER BY created_at DESC
    `
    res.status(200).json({ success: true, data: reviews })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateReview = async (req, res) => {
  const { id } = req.params
  const { user_email, rating, comment } = req.body

  if (!user_email || !rating || !comment) {
    return res.status(400).json({ success: false, message: "All fields are required" })
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" })
  }

  try {
    const updatedReview = await sql`
      UPDATE reviews
      SET rating=${rating}, comment=${comment}
      WHERE id=${id} AND user_email=${user_email}
      RETURNING *
    `

    if (updatedReview.length === 0) {
      return res.status(404).json({ success: false, message: "Review not found or unauthorized" })
    }

    res.status(200).json({ success: true, data: updatedReview[0] })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteReview = async (req, res) => {
  const { id } = req.params
  const { user_email } = req.body

  if (!user_email) {
    return res.status(400).json({ success: false, message: "User email is required" })
  }

  try {
    const deletedReview = await sql`
      DELETE FROM reviews 
      WHERE id=${id} AND user_email=${user_email}
      RETURNING *
    `

    if (deletedReview.length === 0) {
      return res.status(404).json({ success: false, message: "Review not found or unauthorized" })
    }

    res.status(200).json({ success: true, data: deletedReview[0] })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}