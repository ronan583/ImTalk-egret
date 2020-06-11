/**
  * 服务器命令返回
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  */
module dliyun {

    export class Processor_14 extends puremvc.SimpleCommand implements puremvc.ICommand {
        public constructor() {
            super();
        }

        public static NAME: string = "Processor_14";

        /**
         * 注册消息
         */
        public register(): void {
            this.facade.registerCommand("Processor_14", this);
        }

        public execute(notification: puremvc.INotification): void {
            var data: any = notification.getBody();//携带数据
            var resultData = CommonRequest.getQRCodeInfo(data);
            console.log("getQRCodeInfo------------", resultData);
            AppFacade.getInstance().sendNotification(SceneNotify.OPEN_LOGIN, resultData);
        }
    }
}
