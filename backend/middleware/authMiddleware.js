// authMiddleware.js
export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) { // Asumsi session menyimpan userId setelah login
      next(); // Lanjutkan ke fungsi berikutnya
    } else {
      res.status(401).json({ message: 'You must be logged in to add a review' });
    }
  };
  