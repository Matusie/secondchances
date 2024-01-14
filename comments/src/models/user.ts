import mongoose from 'mongoose';

interface UserAttrs {
    email: string;
}
// exportujemy zeby mozna bylo dac referencje w modelu purchase
export interface UserDoc extends mongoose.Document {
    email: string;
}
//interface BUT also creating query abstraction
interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs: UserAttrs): UserDoc;
    findByEvent(event: {
      email: string;
      //version: number;
    }): Promise<UserDoc | null>;
  }
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
},{
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }

});

userSchema.statics.build =(attrs: UserAttrs) => {
    return new User({
        email: attrs.email,
    });
};
// if we want to add method to the document tho, its done with keywoord function instead of an arrow function (because of values inside)
userSchema.statics.findByEvent = (event: { email: string }) => {
    return User.findOne({
      email: event.email,
    });
  };

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export {User}