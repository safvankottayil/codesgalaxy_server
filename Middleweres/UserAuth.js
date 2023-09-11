const jwt = require("jsonwebtoken");
module.exports = {
  verifyToken: async (req, res, next) => {
    try {
      console.log('iam veryfy');
      const token = req.header("Authorization");
      if (token) {
        const User = jwt.verify(token,process.env.TOKEN_KEY);
        req.User = User;
        next();
      } else {
        res.json({ status: false,type:'user'});
      }
    } catch (err) {
      res.json({ status: false,type:'err',err });
    }
  },
};
