import express from 'express';
// import jwt from 'jsonwebtoken';

import { currentUser } from '@secondchances/common';

const router = express.Router();
// we checked if there is a jwt session set AND added middleware that checks current user
router.get('/api/users/currentuser', currentUser, (req, res) => {
// THIS IS ALL DONE IN MIDDLEWARE
  //   if (!req.session?.jwt){
//     return res.send({ currentUser: null});
//   }
// // now we check if JWT is valid
// try {
//   const payload = jwt.verify(
//     req.session.jwt,
//     process.env.jwt_key!);
//     res.send({ currentUser: payload });
//    } catch (err) {
//       res.send({ currentUser: null});
//     }
  res.send({ currentUser: req.currentUser || null});
});

export { router as currentUserRouter };
