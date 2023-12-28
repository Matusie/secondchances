import mongoose from 'mongoose';
import { PasswordManager } from '../services/password-manager'

// AN interface that describes the properties
// that are required to create a new User / a new record in genereal
interface UserAttrs {
    email: string;
    password: string;
}
// represents collection
// An interface that describes the properties
// that a User Mode has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    // if we would like to have more properites like created at, it would be here
}


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},
{
toJSON: {
    transform(doc, ret){
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
    }
}
});

userSchema.pre('save' , async function(done){
    if (this.isModified('password')) {
        const hashed = await PasswordManager.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User (attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);


export { User };