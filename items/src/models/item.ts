import mongoose from "mongoose";
//import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ItemAttrs {
    title: string;
    price: number;
    description?: string;
    avatar?: string;
    userId: string;
    // purchaseId?: string;
    
}

interface ItemDoc extends mongoose.Document {
    title: string;
    price: number;
    description?: string;
    avatar?: string;
    userId: string;
    // purchaseId?: string; //purchase Id with ? sign to show it is optional
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
    description: {
        type: String||null,
    },
    userId: {
        type: String,
        required: true,
    }, 
    purchaseId: {
        type: String,
    },
    avatar: {
        type: String,
    },
    
},   {
    //usuwanie __v i _id z odpowiedzi mongo
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