import mongoose from "mongoose";

interface CommentAttrs {
    title: string;
    description: string;
    rating: number;
    userId: string;
    authorId: string;
    
}
interface CommentDoc extends mongoose.Document {
    title: string;
    description: string;
    rating: number;
    authorId: string;
    userId: string;

}
interface CommentModel extends mongoose.Model<CommentDoc> {
    build(attrs: CommentAttrs): CommentDoc;
}
const commentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    }, 
    authorId: {
        type: String,
        required: true,
    },
},   {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
});
commentSchema.statics.build = (attrs: CommentAttrs) => {
return new Comment(attrs);
};

const Comment = mongoose.model<CommentDoc, CommentModel>('Comment', commentSchema);

export {Comment};