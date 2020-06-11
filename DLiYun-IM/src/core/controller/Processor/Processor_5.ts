/**
  * 所有联系人
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  */
module dliyun {

    export class Processor_5 extends puremvc.SimpleCommand implements puremvc.ICommand {
        public constructor() {
            super();
        }

        public static NAME: string = "Processor_5";

        /**
         * 注册消息
         */
        public register(): void {
            this.facade.registerCommand("Processor_5", this);
        }

        public execute(notification: puremvc.INotification): void {
            var data: any = notification.getBody();//携带数据
            var resultData = ChatRequest.getFriendInfo(data);
            console.warn("getFriendInfo-------------", resultData);
            
            //更新联系人
            //跟本地作比对
            let id: string = resultData.id;
            dliyun.FriendData.instance.setFriendInfo(resultData);

            //刷新最近聊天记录
            AppFacade.getInstance().sendNotification(SysNotify.REFRESH_FRIEND_MESSAGE_INFO);
            if(UIInfo.naviRadioSelectId == ChatType.friend){
                AppFacade.getInstance().sendNotification(SysNotify.SHOW_FRIEND_LIST);
            }
            
        }
    }
}
