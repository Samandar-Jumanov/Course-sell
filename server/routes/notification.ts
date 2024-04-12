import { Router } from "express"
import { getUserNotifications , changeUserNotification  } from "../controller/notification"
const notifcationRouter = Router();


notifcationRouter.get("/get-all/:userId" , getUserNotifications)
notifcationRouter.put("/update/:userId/:notificationId" , changeUserNotification)


export default notifcationRouter;

