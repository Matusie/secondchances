import {Item} from '../item';
test('concurency control OCC', async () =>{
   //creating item
    const item = Item.build({
        title: 'cos',
        price: 123,
        userId: '321'
    })
   //saving item to db
await item.save();
   //fetching data twice
const first = await Item.findById(item.id);
const second = await Item.findById(item.id);
   //two separate changes
first!.set({price:10});
second!.set({price:15});
   //save first
await first!.save();
   //save second but expect error
   try {
    await second!.save();
  } catch (err) {
    return;
  }
  throw new Error('Why is it here?');
})
// test("changing verison", async () =>{
//     const item = Item.build({
//         title: 'cos',
//         price: 123,
//         userId: '321'
//     });
//     await item.save();
//     await item.save();
//     await item.save();
//     expect(item.version).toEqual(2);
// });