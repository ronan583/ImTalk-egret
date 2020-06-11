/**
  * 退出登录
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  */
module dliyun {

    export class Processor_3 extends puremvc.SimpleCommand implements puremvc.ICommand {
        public constructor() {
            super();
        }

        public static NAME: string = "Processor_3";

        /**
         * 注册消息
         */
        public register(): void {
            this.facade.registerCommand("Processor_3", this);
        }

        public execute(notification: puremvc.INotification): void {
            // var data: any = notification.getBody();//携带数据
            // var resultData = ChatRequest.getFriendInfo(data);
            // console.warn("getFriendInfo-------------", resultData);
            
            //更新联系人
            // dliyun.FriendData.instance.setFriendInfo(resultData);

            //刷新最近聊天记录
            AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_LOGIN);
        }
    }
}
