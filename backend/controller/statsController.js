import { sql } from '../config/db.js';

export const getAdminStats = async (req, res) => {
  try {
    // Execute all queries in parallel for efficiency
    const [userCountResult, menuCountResult, orderCountResult, totalRevenueResult] = await Promise.all([
      sql`SELECT COUNT(*) FROM users;`,
      sql`SELECT COUNT(*) FROM menus;`,
      sql`SELECT COUNT(*) FROM orders;`,
      sql`SELECT SUM(total_amount) as revenue FROM orders;`
    ]);

    const stats = {
      users: parseInt(userCountResult[0].count, 10) || 0,
      products: parseInt(menuCountResult[0].count, 10) || 0,
      orders: parseInt(orderCountResult[0].count, 10) || 0,
      revenue: parseFloat(totalRevenueResult[0].revenue) || 0
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch admin statistics.' });
  }
};
