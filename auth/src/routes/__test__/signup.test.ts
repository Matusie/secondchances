import request from 'supertest';
import { app } from '../../app';
import {User} from '../../models/user';

it('returns a 400 on failed signup', async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'okay@okay.com',
        password: '1'
    })
    .expect(400);
});
//i have addded this myself, i have to work on this tho, like to check on the test, what if i will give wrong credentials
it("should throw an error if password length is less than 6", async () => {
    try {
      await new User({
        email: "sam@ed.info",
        password: "1"
      }).save()
    } catch (err) {
      expect(err).toEqual("Password must be at least 4 characters.")
    
    }
  })