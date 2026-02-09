const notificationModel = require('../models/notifcationmodel');

const FetchNotifications = async (req, res) => {
    try {
        const userId = req.params.userId;
        const notifications = await notificationModel.find({ recipientid: userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
}

const MarkAsRead = async (req, res) => {
    const notifications = req.body.notifications;

    try {
        notifications.forEach(async notifcation => {
            const notificationId = notifcation._id;
            const notification = await notificationModel.findById(notificationId);
            notification.isRead = true;
            await notification.save();
        }); 
        res.status(200).json({ message: 'Notifications marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
}

const CreateNotification = async (req, res) => { }

module.exports = {
    FetchNotifications,
    MarkAsRead,
    CreateNotification
}