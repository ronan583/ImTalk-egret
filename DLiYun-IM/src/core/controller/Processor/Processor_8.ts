/**
  * 所有的群
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  */
module dliyun {

    export class Processor_8 extends puremvc.SimpleCommand implements puremvc.ICommand {
        public constructor() {
            super();
        }

        public static NAME: string = "Processor_8";

        /**
         * 注册消息
         */
        public register(): void {
            this.facade.registerCommand("Processor_8", this);
        }

        public execute(notification: puremvc.INotification): void {
            var data: any = notification.getBody();//携带数据
            var resultData = ChatRequest.getGroupMessage(data);
            console.log("getGroupMessage-------------", resultData);
            if (resultData.msgType != 6 && resultData.from == null) {
                return;
            }
            //更新信息
            dliyun.ChatRecordData.instance.setFriendMessage(RelationType.group, resultData);
            AppFacade.getInstance().sendNotification(SysNotify.REFRESH_FRIEND_MESSAGE_INFO);
            // AppFacade.getInstance().sendNotification(SysNotify.UPDATE_UNREAD_COUNT_TOTAL);
            var groupId: number = resultData.groupId;
            let chatData: any = {
                "chatId": groupId,
                "chatType": 1
            }
            // if (ChatRecordUI.getInstance()) {
            // if (UIInfo.chatRecordSelectId == (groupId + "")) {
            //     AppFacade.getInstance().sendNotification(SysNotify.SHOW_FRIEND_MESSAGE_RIGHT, chatData);
            // }
            // }
            IndexedDB.instance.addChat(RelationType.group, resultData, function(){
                AppFacade.getInstance().sendNotification(SysNotify.REFRESH_FRIEND_MESSAGE_INFO);
                if (UIInfo.chatRecordSelectId == (groupId + "")) {
                    AppFacade.getInstance().sendNotification(SysNotify.SHOW_FRIEND_MESSAGE_RIGHT, chatData);
                }
                // todo
                // AppFacade.getInstance().sendNotification(SysNotify.UPDATE_UNREAD_COUNT_TOTAL);
            }, this);
            if (resultData.from != null && (resultData.from.id != UserData.instance.getUserInfoData().id)) {
                SoundManager.instance.playMsgNotific();
            }
        }
    }
}
/**
 * message ChatGroupMsg {
    string uuid = 1;
    FriendInfo from = 2;
    int64 groupId = 5;
    int64 timeline = 6;
    MsgType msgType = 7;
    string content = 8;
    bool isRevoke = 9;
    bool isSendOK = 10;
}
 */
