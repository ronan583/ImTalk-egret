/**
  * 更新群成员
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  */
module dliyun {

    export class Processor_11 extends puremvc.SimpleCommand implements puremvc.ICommand {
        public constructor() {
            super();
        }

        public static NAME: string = "Processor_11";

        /**
         * 注册消息
         */
        public register(): void {
            this.facade.registerCommand("Processor_11", this);
        }

        public execute(notification: puremvc.INotification): void {
            var data: any = notification.getBody();//携带数据
            var resultData = ChatRequest.getUpdateGroupUsers(data);
            console.log("updateGroupUsers-------------", resultData);

            var groupId: string = resultData.groupId;
            var listUsers: Array<FriendInfo> = new Array<FriendInfo>();
            listUsers = resultData.listUsers;

            var data: any = {
                "groupId": groupId,
                "listUsers": listUsers
            }

            AppFacade.getInstance().sendNotification(SysNotify.GROUP_USER_REFRESHED, data);
        }
    }
}
