/**
  * 所有的群
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  */
module dliyun {

    export class Processor_2 extends puremvc.SimpleCommand implements puremvc.ICommand {
        public constructor() {
            super();
        }

        public static NAME: string = "Processor_2";

        /**
         * 注册消息
         */
        public register(): void {
            this.facade.registerCommand("Processor_2", this);
        }

        public execute(notification: puremvc.INotification): void {
            var data: any = notification.getBody();//携带数据
            console.log("successMessage-------", CommonUtil.Uint8ArrayToString(data));
        }
    }
}
