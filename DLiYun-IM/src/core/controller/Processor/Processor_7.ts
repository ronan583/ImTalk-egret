/**
  * 收到好友消息
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  */
module dliyun {

    export class Processor_7 extends puremvc.SimpleCommand implements puremvc.ICommand {
        public constructor() {
            super();
        }

        public static NAME: string = "Processor_7";

        /**
         * 注册消息
         */
        public register(): void {
            this.facade.registerCommand("Processor_7", this);
        }

        public execute(notification: puremvc.INotification): void {
            var data: any = notification.getBody();//携带数据
            var resultData = ChatRequest.getFriendMessage(data);
            console.log("getFriendMessage-------------", resultData);

            var friendId: number = 0;
            if (resultData.from == UserData.instance.getUserInfoData().id) {
                friendId = resultData.to;
            } else {
                friendId = resultData.from;
            }
            var msgType: number = 0;
            if (resultData.msgType) {
                msgType = resultData.msgType;
            }
            var content: string = resultData.content
            let chatData: any = {
                "chatId": friendId,
                "chatType": 0,
                "msgType": msgType,
                "content": content
            }
            //更新信息
            // dliyun.ChatRecordData.instance.setFriendMessage(RelationType.friend, resultData);
            //添加数据到indexdb，添加完回调是读
            IndexedDB.instance.addChat(RelationType.friend, resultData, function(){
                AppFacade.getInstance().sendNotification(SysNotify.REFRESH_FRIEND_MESSAGE_INFO);
                if (UIInfo.chatRecordSelectId == (friendId + "")) {
                    AppFacade.getInstance().sendNotification(SysNotify.SHOW_FRIEND_MESSAGE_RIGHT, chatData);
                }
                // AppFacade.getInstance().sendNotification(SysNotify.UPDATE_UNREAD_COUNT_TOTAL);
            }, this);
            if (resultData.from != UserData.instance.getUserInfoData().id) {
                SoundManager.instance.playMsgNotific();
            }
        }
    }
}
