/**
 * 导航
 */
module dliyun {

    export class NavigationUI extends eui.Component {
        public constructor() {
            super();
            this.skinName = "resource/eui_skins/main/NavigationNewUISkin.exml";
        }
        public headImg: eui.Image;
        public radionBtn1: eui.RadioButton;
        public radionBtn2: eui.RadioButton;
        public radionBtn3: eui.RadioButton;
        public settingBtn: eui.Button;
        public selectValue: number = 1;

        public unreadCountLabel: RedDotNumber;
        public newFriendReddot: eui.Image;

        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }


        protected childrenCreated(): void {
            super.childrenCreated();
            // this.headImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.headImgBtn, this);
            this.radionBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.radionBtnClick, this);
            this.radionBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.radionBtnClick, this);
            this.radionBtn3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.radionBtnClick, this);
            this.settingBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSetting, this);
            this.testBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTest, this);
            this.newFriendReddot.visible = false;
            console.warn("---------NavigationUI created");
        }


        public show(): void {
            var self: any = this;
            dliyun.UserData.instance.updateHead(function (texture: egret.Texture) {
                self.headImg.texture = texture;
            });
        }

        public headImgBtn() {
            // AppFacade.getInstance().sendNotification(SceneNotify.OPEN_LOGIN, { info: "111" });
            // AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAIN);
        }

        public radionBtnClick(e: egret.TouchEvent) {
            var button: eui.RadioButton = e.currentTarget as eui.RadioButton;
            this.selectValue = button.value;
            if (button.value == ChatType.record) {
                UIInfo.naviRadioSelectId = ChatType.record;
                AppFacade.getInstance().sendNotification(SysNotify.SHOW_FRIEND_MESSAGE_INFO);
            } else if (button.value == ChatType.group) {
                // AppFacade.getInstance().sendNotification(SysNotify.SHOW_GROUP_LIST);
                UIInfo.naviRadioSelectId = ChatType.group;
                NativeApi.deleteLocalData(LocalEnumName.CONTACTS_GROUP_MAP);
                GroupData.instance.clearGroupMap();
                ChatRequest.sendGetGroupRequest();
            } else if (button.value == ChatType.friend) {
                // AppFacade.getInstance().sendNotification(SysNotify.SHOW_FRIEND_LIST);
                UIInfo.naviRadioSelectId = ChatType.friend;
                NativeApi.deleteLocalData(LocalEnumName.CONTACTS_FRIEND_MAP);
                FriendData.instance.clearFriendMap();
                ChatRequest.sendGetFriendRequest();
            }
        }

        public onRadioBtnSelected(navValue: number): void {
            this.selectValue = navValue;
            switch (navValue) {
                case 1:
                    this.radionBtn1.selected = true;
                    this.radionBtn2.selected = false;
                    this.radionBtn3.selected = false;
                    break;
                case 2:
                    this.radionBtn2.selected = true;
                    this.radionBtn1.selected = false;
                    this.radionBtn3.selected = false;
                    break;
                case 3:
                    this.radionBtn3.selected = true;
                    this.radionBtn1.selected = false;
                    this.radionBtn2.selected = false;
                    break;
            }
        }

        public onSetting() {
            AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAIN);
            SocketManager.closeSocket();
            // SocketManager.connectServer(Global.socketUrl + egret.Capabilities.os);
            egret.setTimeout(() => {
                SocketManager.sendMessage(OpCode.loginWidthQrCode, null);
            }, this, 1000);
        }

        public updateUnread(count: number) {
            this.unreadCountLabel.setNumber(count);
            this.unreadCountLabel.visible = true;
            if (count < 1) {
                this.unreadCountLabel.visible = false
            }
        }

        public updateNewFriendReddot() {
            let check: boolean = FriendData.instance.checkNEWFriend();
            this.newFriendReddot.visible = check;
        }


        public testBtn: eui.Button;
        public onTest() {
            // let count: number = ChatRecordData.instance.getChatUnreadCount("320981668384", 0);
            // console.log("未读消息数：", count);

            // ToastUI.showToast("---test---");
            // TipsUI.showTips("123");
            // let toast: ToastUI = new ToastUI();
            // toast.showToast("1231241234234");

            // ChatRequest.sendFriendApplyRequest(320981668384, 0, "111");
            // ChatRequest.sendCreateNewGroup(["320978146720", "320981668384", "338252168856"]);
            // ChatRequest.sendGetGroupUsers("343772240360");

            // console.log("is new friend ", FriendData.instance.checkNEWFriend());

            // let event: IMEvent = new IMEvent(IMEvent.DATA_EVENTTEST);
            // this.dispatchEvent(event);
        }
    }
}