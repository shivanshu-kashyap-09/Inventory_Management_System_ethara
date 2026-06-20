const dashboardService = require('../services/dashboardService');

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
