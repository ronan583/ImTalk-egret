/**
 * 主界面
 */
module dliyun {

    export class ChatBubbleOtherUI extends eui.Component {
        public constructor() {
            super();
            this.skinName = "resource/eui_skins/main/chat/dialogue/ChatBubbleOtherUISkin.exml";
        }

        public msgType: number;
        public timeline: number;
        public relation: number;
        public chatInfo: ChatInfo;
        public chatContent: string;

        public friendId: string;
        public chatId: string;

        public headImg: eui.Image;
        public nickName: eui.Label;
        public bg: eui.Image;
        public chatImg: eui.Image;
        public chatContentInfo: eui.Label;
        public attachBg: eui.Image;
        public attachImg: eui.Image;
        public fileLabel: eui.Label;

        public menuPoint: eui.Image;

        private bubbleMenu: BubbleMenu;


        private chatTexture: egret.Texture;

        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.headImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowUserInfo, this);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBubble, this);
        }

        public init(chatContent: string, chatId: string, msgType: number, time: number, relation: RelationType, chatInfo: ChatInfo) {
            this.chatId = chatId;
            var $this = this;
            this.msgType = msgType;
            this.timeline = time;
            this.relation = relation;
            this.chatInfo = chatInfo;
            this.friendId = chatInfo.friendId
            this.chatContent = chatContent;
            var suffix = CommonUtil.getSuffix(this.chatContent);

            dliyun.FriendData.instance.updateHead(this.friendId, function (texture: egret.Texture) {
                if (texture) {
                    $this.headImg.texture = texture;
                }
            });
            let friendInfo = FriendData.instance.getFriendInfo(this.friendId);
            if (friendInfo) {
                this.nickName.text = FriendData.instance.getFriendInfo(this.friendId).nickName
            }
            switch (msgType) {
                case 0:
                    this.showTxtMsg();
                    this.chatContentInfo.text = chatContent;
                    if (this.chatContentInfo.width > 960) {
                        this.chatContentInfo.width = 960;
                        this.bg.height = this.chatContentInfo.height + 10;
                        this.height = this.chatContentInfo.height + 10;
                    }
                    this.bg.width = (this.chatContentInfo.width + 20) * 2;
                    break;
                case 1:
                    this.showImgMsg();
                    // this.chatImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onImageOpen, this);
                    this.chatImg.height = 90;
                    this.chatImg.width = 120;
                    this.height = this.chatImg.height + 20;
                    ChatRecordData.instance.getChatImg(chatContent, (texture: egret.Texture) => {
                        if (texture == null) return;
                        let texWidth = texture.textureWidth;
                        let texHeight = texture.textureHeight;
                        let scale: number = 1;
                        this.chatTexture = texture;
                        this.chatImg.texture = texture;
                    });
                    break;
                case 2:
                    this.showImgMsg();
                    break;
                case 7:
                    this.showFileMsg();
                    this.fileLabel.text = suffix + "文件";
                    // this.attachBg.height = (this.height) * 2;
                    this.height = this.height + 20;
                    break;
            }
        }

        public onClickBubble(event: egret.TouchEvent) {
            if (this.bubbleMenu != null || this.contains(this.bubbleMenu)) {
                return;
            }
            if (event.target == this.headImg) {
                return;
            }
            if (this.parent) {
                let count = this.parent.numChildren;
                for (let i = 0; i < count; i++) {
                    let obj: any = this.parent.getChildAt(i);
                    if (obj instanceof ChatBubbleSelfUI) {
                        obj.removeMenuBtns();
                    }
                    if (obj instanceof ChatBubbleOtherUI) {
                        obj.removeMenuBtns();
                    }
                }
            }
            this.addMenuBtns();
        }

        private timeOutId: any;
        public addMenuBtns() {
            var x = this.menuPoint.x;
            var y = this.menuPoint.y;
            this.bubbleMenu = new BubbleMenu();
            this.bubbleMenu.x = x - this.bubbleMenu.width / 2;
            this.bubbleMenu.y = y;
            this.bubbleMenu.copyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.bubbleCopy, this);
            this.bubbleMenu.delBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.bubbleDelete, this);
            this.bubbleMenu.downloadBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.bubbleDownloadFile, this);
            this.bubbleMenu.viewBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onImageOpen, this);

            if (this.msgType == 0) {
                this.bubbleMenu.showCopyBtn();
            } else if (this.msgType == 1) {
                this.bubbleMenu.showViewBtn();
            } else if (this.msgType == 7) {
                this.bubbleMenu.showDownloadBtn();
            }
            this.bubbleMenu.showDeleteBtn();
            this.addChild(this.bubbleMenu);
            this.timeOutId = egret.setTimeout(() => {
                this.removeMenuBtns();
            }, this, 5000);
        }


        public removeMenuBtns() {
            if (this.bubbleMenu != null && this.contains(this.bubbleMenu)) {
                this.bubbleMenu.copyBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.bubbleCopy, this);
                this.bubbleMenu.delBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.bubbleDelete, this);
                this.bubbleMenu.downloadBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.bubbleDownloadFile, this);
                this.bubbleMenu.viewBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onImageOpen, this);
                this.removeChild(this.bubbleMenu);
                this.bubbleMenu = null;
            }
        }

        public onImageOpen(): void {
            let imgPanel = new ChatImagePanel();
            let img: eui.Image = new eui.Image(this.chatTexture);
            img.width = this.chatTexture.textureWidth;
            img.height = this.chatTexture.textureHeight;
            imgPanel.addContent(img, "下载图片", this.downloadImg, this);
            PopUpManager.addPopUp(imgPanel, true, 0, 0, 1);
        }

        public downloadImg(): void {
            var self = this;
            var img = new Image();
            img.setAttribute('crossOrigin', 'Anonymous');
            img.src = this.chatContent;
            img.onload = function () {
                let canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                var context = canvas.getContext('2d');
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                let base64 = canvas.toDataURL();
                let a = document.createElement('a');
                a.href = base64;
                a.download = '';
                a.click();
            }
        }

        private showImgMsg() {
            this.bg.visible = this.chatContentInfo.visible = false;
            this.chatImg.visible = true;

            this.attachBg.visible = false;
            this.attachImg.visible = false;
            this.fileLabel.visible = false;
        }
        private showTxtMsg() {
            this.bg.visible = this.chatContentInfo.visible = true;
            this.chatImg.visible = false;

            this.attachBg.visible = false;
            this.attachImg.visible = false;
            this.fileLabel.visible = false;
        }
        private showFileMsg() {
            this.bg.visible = false;
            this.chatContentInfo.visible = false;

            this.chatImg.visible = false;

            this.attachBg.visible = true;
            this.attachImg.visible = true;
            this.fileLabel.visible = true;
        }

        private onShowUserInfo(event: egret.Event): void {
            let infoPanel: UserInfoPanel = new UserInfoPanel(this.friendId);
            let point = this.localToGlobal(this.headImg.x + this.headImg.width / 2, this.headImg.y + this.headImg.height / 2);
            let cw = GameConfig.curWidth();
            let ch = GameConfig.curHeight();
            let w = (GameConfig.curWidth() / 2 - point.x) * 2;
            let h = (GameConfig.curHeight() / 2 - point.y) * 2;
            // PopUpManager.addPopUp(infoPanel, false, w, h, 1);

            PopUpPanel.addPopPanel(infoPanel, point.x, point.y);
        }

        private bubbleCopy() {
            console.log("----------复制");
            Global.copyToClipboard(this.chatContentInfo.text);
            clearTimeout(this.timeOutId);
            this.removeMenuBtns();
        }
        private bubbleDelete() {
            console.log("----------删除");
            if (this.chatInfo) {
                // ChatRecordData.instance.deleteSingleChat(this.chatInfo.uuid, this.relation);
                IndexedDB.instance.delete(this.chatInfo.uuid, ()=>{
                    let data = {
                        "id": this.chatId,
                        "chatType": this.relation
                    }
                    AppFacade.getInstance().sendNotification(SysNotify.REFRESH_CHAT_CONTENT, data);
                    clearTimeout(this.timeOutId);
                }, this)
            } else {
                console.error("------------无法删除");
            }
            this.removeMenuBtns();
        }

        private bubbleDownloadFile() {
            console.log("----------下载");
            downloadFile(this.chatContent);
            this.removeMenuBtns();
            clearTimeout(this.timeOutId);
        }
    }
}