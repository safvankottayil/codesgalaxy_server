const jwt = require("jsonwebtoken");
module.exports = {
  verifyAdminToken: async (req, res, next) => {
    try {
      console.log('iam admin veryfy');
      const token = req.header("Authorization");
      console.log(token);
      if (token) {
        const User = jwt.verify(token,process.env.ADMIN_TOKEN_KEY);
        console.log(User);
        req.User = User;
        next();
      } else {
        res.json({ status: false,type:'admin'});
      }
    } catch (err) {
      res.json({ status: false,type:'err',err });
    }
  },
};
