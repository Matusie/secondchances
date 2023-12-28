import mongoose from "mongoose";
//import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ItemAttrs {
    title: string;
    price: number;
 //   description: string;
    userId: string;
    
}

interface ItemDoc extends mongoose.Document {
    title: string;
    price: number;
 //   description: string;
    userId: string;
    purchaseId?: string; //purchase Id with ? sign to show it is optional
 //   version: number;
 
}


interface ItemModel extends mongoose.Model<ItemDoc> {
    build(attrs: ItemAttrs): ItemDoc;
}

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    // description: {
    //     type: String,
    //     required: true
    // },
    userId: {
        type: String,
        required: true,
    }, //adding purchaseId that is not required, because before buying it, it doesn't have an ID
    purchaseId: {
        type: String,
    }
},   {
    // deleteing that mongoose nonsense
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
});//applying if-current mongogoose shit, to fight with concurency by adding versioning
//itemSchema.set('versionKey', 'version');
//itemSchema.plugin(updateIfCurrentPlugin);
//build of build method, in the itemschema
// one and only way to create new records
itemSchema.statics.build = (attrs: ItemAttrs) => {
return new Item(attrs);
};

//Item model

const Item = mongoose.model<ItemDoc, ItemModel>('Item', itemSchema);

export {Item};