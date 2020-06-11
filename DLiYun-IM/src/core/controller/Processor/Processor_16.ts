/**
  * 服务器命令返回
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  */
module dliyun {

    export class Processor_16 extends puremvc.SimpleCommand implements puremvc.ICommand {
        public constructor() {
            super();
        }

        public static NAME: string = "Processor_16";

        /**
         * 注册消息
         */
        public register(): void {
            this.facade.registerCommand("Processor_16", this);
        }

        public execute(notification: puremvc.INotification): void {
            var data: any = notification.getBody();//携带数据
            var resultData = CommonRequest.getUserOauthInfo(data);
            console.log("getUserOauthInfo-------------", resultData);
            dliyun.UserData.instance.setUserInfoData(resultData);
            CommonRequest.sendHeartbeat();
            SocketManager.startHeartbeat();
            AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN);
        }
    }
}
