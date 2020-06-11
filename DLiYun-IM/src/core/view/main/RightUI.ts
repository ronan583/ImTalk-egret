/**
 * 主界面
 */
module dliyun {

    export class RightUI extends eui.Component {
        public constructor() {
            super();
            this.skinName = "resource/eui_skins/main/RightUISkin.exml";
        }

        public chatContentUI: ChatContentUI;
        public friendInfoContent: FriendContentUI;
        public groupContentUI: GroupContentUI;
        public newFriendUI: NewFriendPanel;

        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            // this.initScale();
            console.warn("---------RightUI created");
        }

        public initScale() {
            this.chatContentUI.height = GameConfig.curHeight();
            this.friendInfoContent.height = GameConfig.curHeight();
            this.groupContentUI.height = GameConfig.curHeight();
        }

        //展示好友聊天信息
        public showFriendMessage(index: number, id: string, type: number) {
            //好友聊天
            this.chatContentUI.show(id, type);
            if (index != ChatType.record) {
                return;
            }

            //todo 打开了一个聊天，相当于查看了消息，须发送“消息设为已读”的通知
            this.chatContentUI.visible = true;
            this.friendInfoContent.visible = false;
            this.groupContentUI.visible = false;
            this.newFriendUI.visible = false;
            ChatRecordData.instance.setChatRead(id, type);
        }

        //展示好友个人信息
        public showFriendInfo(index: number, id: string) {
            //好友聊天
            this.friendInfoContent.show(id);
            if (index != ChatType.friend) {
                return;
            }
            this.chatContentUI.visible = false;
            this.friendInfoContent.visible = true;
            this.groupContentUI.visible = false;
            this.newFriendUI.visible = false;
        }
        //展示新的好友
        public showNewFriendPanel() {
            this.chatContentUI.visible = false;
            this.friendInfoContent.visible = false;
            this.groupContentUI.visible = false;
            this.newFriendUI.visible = true;
        }
        //展示群聊聊天信息
        public showGroupInfo(index: number, id: string) {
            //好友聊天
            this.groupContentUI.show(id);
            if (index != ChatType.group) {
                return;
            }
            this.chatContentUI.visible = false;
            this.friendInfoContent.visible = false;
            this.groupContentUI.visible = true;
            this.newFriendUI.visible = false;
        }
    }
}