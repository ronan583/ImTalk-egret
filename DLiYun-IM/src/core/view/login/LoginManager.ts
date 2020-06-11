/**
  * 主界面管理类
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  * 所有的弹窗都需要在register注册事件
  * 在execute添加消息处理面板打开关闭事件
  */
module dliyun {

    export class LoginManager extends puremvc.SimpleCommand implements puremvc.ICommand {
        private loginUI: dliyun.LoginUI;

        public constructor() {
            super();
        }

        public static NAME: string = "LoginManager";

        /**
         * 注册消息
         */
        public register(): void {
            this.facade.registerCommand(SceneNotify.OPEN_LOGIN, this);
            this.facade.registerCommand(SceneNotify.CLOSE_LOGIN, this);
            this.facade.registerCommand(SysNotify.CONNECT_SERVER_SUCCESS, this);
            this.facade.registerCommand(SceneNotify.REOPEN_LOGIN, this);
        }

        public execute(notification: puremvc.INotification): void {
            var data: any = notification.getBody();//携带数据
            var panelCon = GameLayerManager.gameLayer().mainLayer;
            switch (notification.getName()) {
                case SceneNotify.OPEN_LOGIN: {
                    if (this.loginUI == null) {
                        this.loginUI = new dliyun.LoginUI(data);
                        panelCon.addChild(this.loginUI);
                        // panelCon.addChild(new dliyun.ChatUI())
                    }
                    break;
                }
                case SceneNotify.CLOSE_LOGIN: {
                    if (this.loginUI != null) {
                        this.loginUI.removeFromStage();
                        panelCon.removeChild(this.loginUI);
                        this.loginUI = null;
                    }
                    break;
                }
                case SysNotify.CONNECT_SERVER_SUCCESS: {
                    SocketManager.sendMessage(OpCode.loginWidthQrCode , null);
                    break;
                }
            }
        }
    }
}
