import { PurchaseStatus } from '@secondchances/common';
import mongoose, { mongo } from 'mongoose';

interface PurchaseAttrs {
    id: string;
    userId: string;
    price: number;
    status: PurchaseStatus;
} //no id because it is already in the mongoose
interface PurchaseDoc extends mongoose.Document{
    userId: string;
    price: number;
    status: PurchaseStatus;
}
//actually building a model
interface PurchaseModel extends mongoose.Model<PurchaseDoc>{
    build(attrs: PurchaseAttrs): PurchaseDoc;
}

const purchaseSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    }
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
});
purchaseSchema.statics.build = (attrs: PurchaseAttrs) =>{
    return new Purchase({
        _id: attrs.id,
        price: attrs.price,
        userId: attrs.userId,
        status: attrs.status,
    });
};
const Purchase = mongoose.model<PurchaseDoc, PurchaseModel>('Purchase', purchaseSchema);
export{Purchase};