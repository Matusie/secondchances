import mongoose from 'mongoose';
import {PurchaseStatus, Purchase} from './purchase' //remember about double import
//import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
interface ItemAttrs {
    id: string;
    title: string;
    price: number;
}
// exportujemy zeby mozna bylo dac referencje w modelu purchase
export interface ItemDoc extends mongoose.Document {
    title: string;
    price: number;
    //version: number;
    isReserved(): Promise<boolean> //added state with promise of false or true
}
//interface BUT also creating query abstraction
interface ItemModel extends mongoose.Model<ItemDoc>{
    build(attrs: ItemAttrs): ItemDoc;
    findByEvent(event: {
      id: string;
      //version: number;
    }): Promise<ItemDoc | null>;
  }
const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
},{
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }

});
//adding the query versioning
//itemSchema.set('versionKey', 'version');
//itemSchema.plugin(updateIfCurrentPlugin);

//static object is how we add a new method, directly to the item model itself
// unfortunetly because of concourency of mongodb, we need to add change from _id to id
itemSchema.statics.build =(attrs: ItemAttrs) => {
    return new Item({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price,
    });
};
// if we want to add method to the document tho, its done with keywoord function instead of an arrow function (because of values inside)
itemSchema.statics.findByEvent = (event: { id: string }) => {
    return Item.findOne({
      _id: event.id,
    });
  };

itemSchema.methods.isReserved = async function (){
//the value here has to be equal to the on from item document
const purchase = await Purchase.findOne({ //finding one in the collection
    item: this, //finding exactly the one we had step before
    status : {
        $in: [  //in with the dolar sign operator tells us that mongodb will look for certain status(es)
        PurchaseStatus.Created,
        PurchaseStatus.PaymentInProcess,
    PurchaseStatus.Completed]
    }
});
return !!purchase;
}
const Item = mongoose.model<ItemDoc, ItemModel>('Item', itemSchema);

export {Item}