import { Router } from "express"
import { getUserNotifications , changeUserNotification  } from "../controller/notification"
import { isAuthenticated , authanticate } from "../middlewares/auth";
const notifcationRouter = Router();


notifcationRouter.get("/get-all/:userId" , isAuthenticated, authanticate("instructor"),getUserNotifications)
notifcationRouter.put("/update/:userId/:notificationId" , isAuthenticated, authanticate("instructor"), changeUserNotification)


export default notifcationRouter;

