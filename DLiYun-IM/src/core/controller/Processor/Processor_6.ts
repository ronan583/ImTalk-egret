/**
  * 所有的群
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  */
module dliyun {

    export class Processor_6 extends puremvc.SimpleCommand implements puremvc.ICommand {
        public constructor() {
            super();
        }

        public static NAME: string = "Processor_6";

        /**
         * 注册消息
         */
        public register(): void {
            this.facade.registerCommand("Processor_6", this);
        }

        public execute(notification: puremvc.INotification): void {
            var data: any = notification.getBody();//携带数据
            var resultData = ChatRequest.getGroupInfo(data);
            console.warn("getGruopInfo-------------", resultData);
            //更新群信息
            dliyun.GroupData.instance.setGroupInfo(resultData);
            //刷新最近聊天记录
            AppFacade.getInstance().sendNotification(SysNotify.REFRESH_FRIEND_MESSAGE_INFO);
            if(UIInfo.naviRadioSelectId == ChatType.group){
                AppFacade.getInstance().sendNotification(SysNotify.SHOW_GROUP_LIST);
            }
        }
    }
}
