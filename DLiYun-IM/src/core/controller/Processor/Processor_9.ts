/**
  * 所有的群
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  */
module dliyun {

    export class Processor_9 extends puremvc.SimpleCommand implements puremvc.ICommand {
        public constructor() {
            super();
        }

        public static NAME: string = "Processor_9";

        /**
         * 注册消息
         */
        public register(): void {
            this.facade.registerCommand("Processor_9", this);
        }

        public execute(notification: puremvc.INotification): void {
            var data: any = notification.getBody();//携带数据
            var resultData = ChatRequest.getRevokeMessage(data);
            console.log("getRevokeMessage-------------", resultData);
            // let relationId: string = dliyun.ChatRecordData.instance.deleteSingleChat(resultData.msgUuid, resultData.relationType);
            IndexedDB.instance.delete(resultData.msgUuid, ()=>{
                ToastUI.showToast("消息已撤回");
                AppFacade.getInstance().sendNotification(SysNotify.REFRESH_FRIEND_MESSAGE_INFO);
                // todo
                // AppFacade.getInstance().sendNotification(SysNotify.UPDATE_UNREAD_COUNT_TOTAL);
                let relation = resultData.relationType;
                let id = resultData.relationId;
                let chatData: any = {
                    "chatId": resultData.relationId,
                    "chatType": relation
                }
                console.log("------------撤回：", chatData);
                if (UIInfo.chatRecordSelectId == resultData.relationId) {
                    AppFacade.getInstance().sendNotification(SysNotify.SHOW_FRIEND_MESSAGE_RIGHT, chatData);
                }
            }, this);
        }
    }
}
