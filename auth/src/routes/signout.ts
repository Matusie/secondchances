import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  req.session = null; //destroying cookie session
  res.send({message:"Logged out"}); // sending empty object
});

export { router as signoutRouter };
