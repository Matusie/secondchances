import mongoose from 'mongoose';
import { PasswordManager } from '../services/password-manager'

// AN interface that describes the properties
// that are required to create a new User / a new record in genereal
interface UserAttrs {
    firstName:string;
    lastName:string;
    avatar?:string;
    email: string;
    password: string;
    terms:boolean
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
    firstName:string;
    lastName:string;
    avatar?:string;
    terms:boolean;
    // if we would like to have more properites like created at, it would be here
}


const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        require:true
    },
    lastName:{
        type:String,
        require:true
    },
    avatar:{
        type:String,
        require:false
    },
    terms:{
        type: Boolean,
        required: true
    },
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