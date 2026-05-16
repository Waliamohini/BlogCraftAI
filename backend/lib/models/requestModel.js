import mongoose from "mongoose";

let requestSchema = new mongoose.Schema({
    fullname: {
        required: true,
        type: String
    },
    company: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    status: {
        type: String,
        default: "pending"
    },
    businessType: { 
        type: String,
        required: true
    },
    reviewedAt: {
        type: Date
    },
    reviewedBy: {
        type: String
    },
    rejectionReason: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model("Request", requestSchema);