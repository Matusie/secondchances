import mongoose from 'mongoose';
//import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import {PurchaseStatus} from '@secondchances/common';
import {ItemDoc} from './item';
export {PurchaseStatus};
//properties to create an purchase
interface PurchaseAttrs {
    userId: string;
    status: PurchaseStatus;
    expiresAt: Date;
    item: ItemDoc;
    
}
//properties that actually end up on the purchase
interface PurchaseDoc extends mongoose.Document {
    userId: string;
    status: PurchaseStatus;
    expiresAt: Date;
    //version: number;
    item: ItemDoc;
}
//our model has one extra method
interface PurchaseModel extends mongoose.Model<PurchaseDoc> {
    build(attrs: PurchaseAttrs): PurchaseDoc;
}
//schema that descirbes different properties and rules

const purchaseSchema = new mongoose.Schema({
    userId: { //reminder that here is moongoose, so String with capital S
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(PurchaseStatus), //to be sure it gonna be enum status
    },
    expiresAt: { //this one is not required, because maybe there are some cases we want to make it like that
        type: mongoose.Schema.Types.Date
    },
    item: { //actual reference to microservice items where the Item is
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }
},{ //transforming the _id to id from mongoDB
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});
//purchaseSchema.set('versionKey', 'version');
//purchaseSchema.plugin(updateIfCurrentPlugin);
//definig build method on the static object
purchaseSchema.statics.build = (attrs: PurchaseAttrs) => {
    return new Purchase(attrs);
};
const Purchase = mongoose.model<PurchaseDoc, PurchaseModel>('Purchase', purchaseSchema);
export { Purchase };
