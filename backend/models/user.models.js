import mongoose from 'mongoose';

const userSchema = mongoose.Schema({

});

const User = mongoose.model('user', userSchema);
export default User;