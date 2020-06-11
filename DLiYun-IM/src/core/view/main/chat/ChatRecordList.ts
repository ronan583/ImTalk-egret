/**
 * 主界面
 */
module dliyun {

    export class ChatRecordList extends eui.ItemRenderer {
        public constructor() {
            super();
            this.skinName = "resource/eui_skins/main/chat/ChatRecordListSkin.exml";
        }

        public selectImg: eui.Image;
        public headImg: eui.Image;
        public nickName: eui.Label;
        public chatInfo: eui.Label;
        public chatTime: eui.Label;
        public onlineLabel: eui.Label;
        public offlineLabel: eui.Label;

        public unreadCountLabel: RedDotNumber;

        protected dataChanged(): void {
            var $this: any = this;
            if (this.data.chatType == 0) {
                dliyun.FriendData.instance.updateHead(this.data.id, function (texture: egret.Texture) {
                    if(texture){
                        // console.warn("==", texture);
                        $this.headImg.texture = texture;
                    }
                });
                this.showOnlineStatus(this.data.isOnline);
            } else {
                dliyun.GroupData.instance.updateHead(this.data.id, function (texture: egret.Texture) {
                    $this.headImg.texture = texture;
                });
                this.hideOnlineStatus();
            }
            if (this.selected) {
                this.selectImg.visible = true;
            } else {
                this.selectImg.visible = false;
            }
            //todo
            // this.updateUnread(this.data.unread);
        }

        protected getCurrentState(): string {
            if (this.selected) {
                this.selectImg.visible = true;
            } else {
                this.selectImg.visible = false;
            }
            return super.getCurrentState();
        }

        public showOnlineStatus(isOn: boolean){
            this.onlineLabel.visible = isOn;
            this.offlineLabel.visible = !isOn;
        }

        public hideOnlineStatus(){
            this.onlineLabel.visible = false;
            this.offlineLabel.visible = false;
        }

        public updateUnread(count: number){
            this.unreadCountLabel.setNumber(count);
            if (count < 1) {
                this.unreadCountLabel.visible = false
            }
        }
    }
}