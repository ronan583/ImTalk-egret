/**
  * 更新群成员
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  */
module dliyun {

    export class Processor_12 extends puremvc.SimpleCommand implements puremvc.ICommand {
        public constructor() {
            super();
        }

        public static NAME: string = "Processor_12";

        /**
         * 注册消息
         */
        public register(): void {
            this.facade.registerCommand("Processor_12", this);
        }

        public execute(notification: puremvc.INotification): void {
            var data: any = notification.getBody();//携带数据
            var resultData = ChatRequest.getRelationApply(data);
            console.log("getRelationApply-------------", resultData);   

            var applyState: string = resultData.state;
            var status: number = 0;
            var applyUser: any = resultData.applyUser;
            if(applyState == "processing"){
                status = 0;
            } else if(applyState == "agree"){
                status = 1;
            }
            FriendData.instance.setNEWFriend(resultData, status);

            if(applyState == "agree"){
                if(applyUser != null){
                    FriendData.instance.setFriendInfo(applyUser);
                }
            }
        }
    }
}
