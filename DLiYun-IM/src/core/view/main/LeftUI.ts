/**
 * 主界面
 */
module dliyun {

    export class LeftUI extends eui.Component {
        public constructor() {
            super();
            this.skinName = "resource/eui_skins/main/LeftNewUISkin.exml";
        }


        public friendUI: FriendUI;
        public groupUI: GroupUI;
        public chatRecordUI: ChatRecordUI;

        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            // this.initScale();
            console.warn("---------LeftUI created");
        }

        public initScale() {
            this.chatRecordUI.height = GameConfig.curHeight();
            this.friendUI.height = GameConfig.curHeight();
            this.groupUI.height = GameConfig.curHeight();

        }

        public showFriend(index: number) {
            if (this.friendUI) {
                this.friendUI.show();
                if (index != ChatType.friend) {
                    return;
                }
                this.friendUI.visible = true;
                this.groupUI.visible = false;
                this.chatRecordUI.visible = false;

                UIInfo.naviRadioSelectId = ChatType.friend;
            }
        }
        public showGroup(index: number) {
            if (this.groupUI != null) {
                this.groupUI.show();
                if (index != ChatType.group) {
                    return;
                }
                this.groupUI.visible = true;
                this.friendUI.visible = false;
                this.chatRecordUI.visible = false;

                UIInfo.naviRadioSelectId = ChatType.group;
            }
        }

        /**
         * 刷新、指向左侧聊天记录列表
         */
        public showRecord(index: number, id: string = "") {
            if (this.chatRecordUI != null) {
                this.chatRecordUI.show(id);
                if (index != ChatType.record) {
                    return;
                }
                this.chatRecordUI.visible = true;
                this.friendUI.visible = false;
                this.groupUI.visible = false;

                UIInfo.naviRadioSelectId = ChatType.record;
            }
        }

        /**
         * 仅刷新左侧聊天记录列表
         */
        public refreshRecord() {
            if (this.chatRecordUI != null) {
                this.chatRecordUI.refresh();
            }
        }
    }
}