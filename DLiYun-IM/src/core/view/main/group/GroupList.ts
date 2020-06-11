/**
 * 主界面
 */
module dliyun {

    export class GroupList extends eui.ItemRenderer {
        public constructor() {
            super();
            this.skinName = "resource/eui_skins/main/group/GroupListSkin.exml";
        }

        public selectImg: eui.Image;
        public headImg: eui.Image;
        public nickName: eui.Label;
        public userCount: eui.Label;

        protected dataChanged(): void {
            var $this: any = this;
            dliyun.GroupData.instance.updateHead(this.data.id, function (texture: egret.Texture) {
                $this.headImg.texture = texture;
            });
            if (this.selected) {
                this.selectImg.visible = true;
            } else {
                this.selectImg.visible = false;
            }
        }

        protected getCurrentState(): string {
            if (this.selected) {
                this.selectImg.visible = true;
            } else {
                this.selectImg.visible = false;
            }
            return super.getCurrentState();
        }
    }
}