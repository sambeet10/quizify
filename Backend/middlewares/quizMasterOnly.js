const quizMasterOnly = (req, res, next) => {
    if (req.user && req.user.role === 'quizmaster') {
      next()
    } else {
      return res.status(403).json({ message: 'Access denied. Only Quiz Masters can perform this action.' })
    }
  }
  
  module.exports = quizMasterOnly;
  