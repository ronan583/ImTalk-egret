/**
 * 主界面
 */
module dliyun {

    export class FriendList extends eui.ItemRenderer {
        public constructor() {
            super();
            this.skinName = "resource/eui_skins/main/friend/FriendListSkin.exml";
        }

        public selectImg: eui.Image;
        public headImg: eui.Image;
        public nickName: eui.Label;
        public chatInfo: eui.Label;
        public chatTime: eui.Label;

        public onlineLabel: eui.Label;
        public offlineLabel: eui.Label;

        protected dataChanged(): void {
            var $this: any = this;
            dliyun.FriendData.instance.updateHead(this.data.id, function (texture: egret.Texture) {
				if(texture == null) return;
                $this.headImg.texture = texture;
            });
            if (this.selected) {
                this.selectImg.visible = true;
            } else {
                this.selectImg.visible = false;
            }
            this.showOnlineStatus(this.data.isOnline);
        }

        protected getCurrentState(): string {
            if (this.selected) {
                this.selectImg.visible = true;
            } else {
                this.selectImg.visible = false;
            }
            return super.getCurrentState();
        }

        public showOnlineStatus(isOn: boolean) {
            this.onlineLabel.visible = isOn;
            this.offlineLabel.visible = !isOn;
        }

        public hideOnlineStatus() {
            this.onlineLabel.visible = false;
            this.offlineLabel.visible = false;
        }

        public hideSelected(){
            this.selectImg.visible = false;
        }
    }
}