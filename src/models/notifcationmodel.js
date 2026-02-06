const moongoose = require('mongoose');

const notificationSchema = new moongoose.Schema({
    recipientid: { type: String, ref: 'Auth', required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    type: { type: String, enum: ['Order Update', 'Promotion', 'General'], default: 'General' },
},
    { timestamps: true });
notificationSchema.set('collection', 'notifications');

const notificationModel = moongoose.model('Notification', notificationSchema);
module.exports = notificationModel;