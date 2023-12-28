import  request  from "supertest";
jest.mock('../../nats-wrapper');
let a = 3;
let b = 5;
let c = 2;
test('does he have it?', () => {
   const cokolwiek = a*b
expect(cokolwiek).toBeCloseTo(15);
})

const user = {
    id: true,
    password: true,
};
test('does he have that?', () => {
expect(user).toHaveProperty('id', true);
})
