import mongoose from 'mongoose';

const friendSchema = new mongoose.Schema(
    {
        userA: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        userB: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    },
);

friendSchema.pre('save', function () {
    if (this.userA.toString() > this.userB.toString()) {
        const temp = this.userA;
        this.userA = this.userB;
        this.userB = temp;
    }
});

friendSchema.index({ userA: 1, userB: 1 }, { unique: true });

const Friend = mongoose.model('Friend', friendSchema);

export default Friend;
