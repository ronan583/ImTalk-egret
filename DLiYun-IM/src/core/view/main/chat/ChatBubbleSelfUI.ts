/**
 * 主界面
 */
module dliyun {

    export class ChatBubbleSelfUI extends eui.Component {
        public constructor() {
            super();
            this.skinName = "resource/eui_skins/main/chat/dialogue/ChatBubbleSelfUISkin.exml";
        }
        public msgType: number;
        public timeline: number;
        public relation: number;
        public chatId: string;
        public chatInfo: ChatInfo;
        public chatContent: string;

        public headImg: eui.Image;
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
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBubble, this);
            // this.chatContentInfo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBubble, this);
        }

        public init(chatContent: string, chatId: string, msgType: number, time: number, relation: RelationType, chatInfo?: ChatInfo) {
            var $this = this;
            this.msgType = msgType;
            this.timeline = time;
            this.relation = relation;
            this.chatId = chatId;
            this.chatContent = chatContent;
            var suffix = CommonUtil.getSuffix(chatContent);

            if (chatInfo) {
                this.chatInfo = chatInfo;
            }
            dliyun.UserData.instance.updateHead(function (texture: egret.Texture) {
                $this.headImg.texture = texture;
            });
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
                    ChatRecordData.instance.getChatImg(chatContent, this.getChatImgByTexture, this);
                    break;

                case 7:
                    this.showFileMsg();
                    this.fileLabel.text = suffix + "文件";
                    this.attachBg.height = (this.height + 20) * 2;
                    this.height = this.height + 20;
                    break;
            }
        }

        public initByBase64(base64Data: string, chatId: string, time: number) {
            var self = this;
            this.msgType = MessageType.image;
            this.timeline = time;
            this.chatId = chatId;
            dliyun.UserData.instance.updateHead(function (texture: egret.Texture) {
                if (texture == null) return;
                self.headImg.texture = texture;
            });
            this.showImgMsg();
            // this.chatImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onImageOpen, this);
            let texture: egret.Texture = new egret.Texture();
            egret.BitmapData.create("base64", base64Data, (bmpData) => {
                var texture = new egret.Texture();
                texture.bitmapData = bmpData;
                self.getChatImgByTexture(texture);
            });
        }

        private getChatImgByTexture(texture: egret.Texture) {
            if (texture) {
                let texWidth = texture.textureWidth;
                let texHeight = texture.textureHeight;
                let scale: number = 1;
                this.chatTexture = texture;
                this.chatImg.texture = texture;
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
            this.bg.visible = true;
            this.chatContentInfo.visible = true;

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

        public onClickBubble(event: egret.TouchEvent) {
            if (this.bubbleMenu != null || this.contains(this.bubbleMenu)) {
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
            // if(this.msgType == 0){
            this.addMenuBtns();
            // } else if(this.msgType == 1){
            // this.onImageOpen();
            // }
        }

        private timeOutId: any;
        private addMenuBtns() {
            var x = this.menuPoint.x;
            var y = this.menuPoint.y;
            this.bubbleMenu = new BubbleMenu();
            this.bubbleMenu.copyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.bubbleCopy, this);
            this.bubbleMenu.delBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.bubbleDelete, this);
            this.bubbleMenu.cancelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.bubbleRevoke, this);
            this.bubbleMenu.viewBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onImageOpen, this);
            this.bubbleMenu.downloadBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.bubbleDownloadFile, this);

            if (this.msgType == 0) {
                this.bubbleMenu.showCopyBtn();
            } else if (this.msgType == 1) {
                this.bubbleMenu.showViewBtn();
            } else if (this.msgType == 7) {
                this.bubbleMenu.showDownloadBtn();
            }
            this.bubbleMenu.showDeleteBtn();
            if (!this.isOverdue()) {
                this.bubbleMenu.showRevokeBtn();
            }
            this.bubbleMenu.x = x - this.bubbleMenu.width / 2;
            this.bubbleMenu.y = y;
            this.addChild(this.bubbleMenu);
            this.timeOutId = egret.setTimeout(() => {
                this.removeMenuBtns();
            }, this, 5000);
        }


        public removeMenuBtns() {
            if (this.bubbleMenu != null && this.contains(this.bubbleMenu)) {
                this.bubbleMenu.copyBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.bubbleCopy, this);
                this.bubbleMenu.delBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.bubbleDelete, this);
                this.bubbleMenu.cancelBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.bubbleRevoke, this);
                this.bubbleMenu.viewBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onImageOpen, this);
                this.bubbleMenu.downloadBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.bubbleDownloadFile, this);
                this.removeChild(this.bubbleMenu);
                this.bubbleMenu = null;
            }
        }

        private isOverdue(): boolean {
            if (!this.timeline) {
                console.error("-------------时间获取失败");
                return true;
            }
            let now: number = Date.now();
            let pastTime: number = now - this.timeline;
            if (pastTime > 120000) {
                return true;
            } else {
                return false;
            }
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
                IndexedDB.instance.delete(this.chatInfo.uuid, () => {
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
        private bubbleRevoke() {
            console.log("----------撤回");
            if (!this.isOverdue()) {
                if (this.chatInfo) {
                    let uuid = NativeApi.uuid();
                    let msgUuid = this.chatInfo.uuid;
                    ChatRequest.sendRevokeMessage(uuid, msgUuid, Number(this.chatId), this.relation);
                }
            }
            this.removeMenuBtns();
            clearTimeout(this.timeOutId);
        }

        private bubbleDownloadFile() {
            console.log("----------下载");
            downloadFile(this.chatContent);
            this.removeMenuBtns();
            clearTimeout(this.timeOutId);
        }
    }
}