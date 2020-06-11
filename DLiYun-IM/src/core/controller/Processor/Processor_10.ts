/**
  * 所有的群
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  */
module dliyun {

    export class Processor_10 extends puremvc.SimpleCommand implements puremvc.ICommand {
        public constructor() {
            super();
        }

        public static NAME: string = "Processor_10";

        /**
         * 注册消息
         */
        public register(): void {
            this.facade.registerCommand("Processor_10", this);
        }

        public execute(notification: puremvc.INotification): void {
            var data: any = notification.getBody();//携带数据
            var resultData = ChatRequest.getDeleteAndExitGroup(data);
            console.log("getDeleteAndExitGroup-------------", resultData);

            if (resultData.groupId == null) return;

            GroupData.instance.removeGroup(resultData.groupId);
            if (UIInfo.naviRadioSelectId == ChatType.record) {
                AppFacade.getInstance().sendNotification(SysNotify.SHOW_FRIEND_MESSAGE_INFO);
            }
        }
    }
}
