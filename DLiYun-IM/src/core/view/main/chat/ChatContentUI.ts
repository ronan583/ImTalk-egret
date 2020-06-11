/**
 * 主界面
 */
module dliyun {

    export class ChatContentUI extends eui.Component {

        public static instance: ChatContentUI;

        public constructor() {
            super();
            this.skinName = "resource/eui_skins/main/chat/ChatContentUISkin.exml";
            ChatContentUI.instance = this;
        }
        public chatType: RelationType;

        public groupUsersArr: Array<FriendInfo>;

        public chatContentTxt: eui.EditableText;
        public editBg: eui.Image;
        public editBg_s: eui.Image;
        public sendBtn: eui.Button;
        public chatRecordGroup: eui.Group;
        public nameLab: eui.Label;
        public chatId: string;
        public scroller: eui.Scroller;
        public showMoreBtn: eui.Button;

        public fileBtn: eui.Button;

        public copyBtn: eui.Button;
        public uiGroup: eui.Group;

        public settingBtn: eui.Button;
        public chatSettingPanel: ChatSettingPanel;

        public searchFlag: number;
        public SEARCH_CHAT_COUNT: number = 30;

        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            console.warn("---------ChatContentUI created");
            // this.initScale();
            if (this.scroller.horizontalScrollBar != null) {
                this.scroller.horizontalScrollBar.autoVisibility = false;
                this.scroller.horizontalScrollBar.visible = false;
                this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            }
            if (this.scroller.verticalScrollBar != null) {
                this.scroller.verticalScrollBar.autoVisibility = false;
                this.scroller.verticalScrollBar.visible = false;
            }

            this.groupUsersArr = new Array<FriendInfo>();

            this.fileBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.doSelect, this);            //文件夹按钮，打开目录
            this.sendBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sendFriendMsg, this);
            this.chatContentTxt.restrict = "^\n";
            this.chatContentTxt.addEventListener(egret.FocusEvent.FOCUS_IN, this.addListenPaste, this);
            this.chatContentTxt.addEventListener(egret.FocusEvent.FOCUS_OUT, this.removeListenPaste, this);
            this.scroller.addEventListener(eui.UIEvent.CHANGE, this.onChatScroll, this);
            this.showMoreBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showMoreChat, this);
            this.settingBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openSettingPanel, this);
            this.chatSettingPanel.deleteBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDeleteRecord, this);
            this.chatSettingPanel.addUserBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAddGroupUser, this);
            this.chatSettingPanel.removeUserBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRemoveGroupUser, this);
            this.chatSettingPanel.exitBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onExitGroup, this);
            this.chatSettingPanel.confirmEditBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onConfirmEditBtn, this);
        }

        private testBtn: eui.Button;
        private onTest() {
            // devare record
            if (this.chatId) {
                ChatRecordData.instance.deleteFriendChat(this.chatId, this.chatType);
                this.show(this.chatId, this.chatType)
            }
        }

        public initScale() {
            this.uiGroup.height = GameConfig.curHeight();
            this.scroller.y = 49;
            this.scroller.height = GameConfig.curHeight() - this.editBg.height - this.scroller.y - 5;
            this.chatSettingPanel.height = GameConfig.curHeight() - this.scroller.y;

            this.uiGroup.width = this.scroller.width = GameConfig.curWidth();

            let num: number = this.chatRecordGroup.numChildren;
            if (num > 0) {
                for (let i = 0; i < num; i++) {
                    let obj: any = this.chatRecordGroup.getChildAt(i);
                    if (obj instanceof ChatBubbleSelfUI) {
                        obj.width = GameConfig.curWidth();
                    }
                    if (obj instanceof ChatBubbleOtherUI) {
                        obj.width = GameConfig.curWidth();
                    }
                    if (obj instanceof ChatTimeUI) {
                        obj.width = GameConfig.curWidth();
                    }
                }
            }
        }

        public onEnter() {
            this.sendFriendMsg();
        }

        public show(id: string, chatType: RelationType): void {
            this.uiGroup.visible = true;
            this.showMoreBtn.visible = false;
            this.chatSettingPanel.onClose();

            this.groupUsersArr = new Array<FriendInfo>();

            this.searchFlag = 0;
            if (id == undefined || id == null) {
                this.uiGroup.visible = false;
            }
            this.chatType = chatType;
            this.chatId = id;
            this.chatRecordGroup.removeChildren();

            var myInfo: UserInfo = UserData.instance.getUserInfoData();
            var chatInfoList: Array<ChatInfo>;
            var chatName: string;
            switch (chatType) {
                case 0:
                    var friendInfo: FriendInfo = FriendData.instance.getFriendInfo(id);
                    if (friendInfo != null) {
                        chatName = friendInfo.nickName;
                    }
                    IndexedDB.instance.getAllByChatId(id, 0, this.SEARCH_CHAT_COUNT, this.showComplete, this);
                    // chatInfoList = ChatRecordData.instance.getFriendChatAll(RelationType.friend, id, 0, this.SEARCH_CHAT_COUNT);
                    break;
                case 1:
                    IndexedDB.instance.getAllByChatId(id, 0, this.SEARCH_CHAT_COUNT, this.showComplete, this);
                    // chatInfoList = ChatRecordData.instance.getFriendChatAll(RelationType.group, id, 0, this.SEARCH_CHAT_COUNT);
                    var groupInfo: GroupInfo = GroupData.instance.getGroupInfo(id);
                    if (groupInfo != null) {
                        chatName = groupInfo.name;
                    }
                    break;
            }
            this.nameLab.text = CommonUtil.omittStr(chatName, 21);

            // this.showBubbles(chatInfoList);
        }

        public showComplete() {
            var chatInfoList;
            chatInfoList = ChatRecordData.instance.chatCacheData;
            this.showBubbles(chatInfoList);
        }

        public showMoreChat() {
            // todo 点击查看更多，窗口的滚动位置优化
            IndexedDB.instance.getAllByChatId(this.chatId, this.searchFlag * this.SEARCH_CHAT_COUNT,
                (this.searchFlag + 1) * this.SEARCH_CHAT_COUNT, this.showMoreComp, this);
        }

        public showMoreComp() {
            var chatInfoList = ChatRecordData.instance.chatCacheData;
            this.showBubbles(chatInfoList);
            this.scroller.viewport.scrollV = 0;
            this.showMoreBtn.visible = false;

            this.scroller.dispatchEvent(new eui.UIEvent(eui.UIEvent.CHANGE));
        }

        public showBubbles(chatInfoList: Array<ChatInfo>) {
            var myInfo: UserInfo = UserData.instance.getUserInfoData();
            var indexContent: number = 0;
            for (var index in chatInfoList) {
                var indexChat: number = Number(index);
                var chat = chatInfoList[index];
                var msgType: number = 0;
                msgType = chat.msgType;
                if (msgType == 10) { continue; }        //遇到空消息则跳过
                var name: string = "";
                var userId: string = "0";
                var content: string = chat.content;

                //temp code
                var suffix = CommonUtil.getSuffix(content);
                if (msgType == 1 && suffix != "png" && suffix != "jpg") {
                    msgType = 7;
                }
                //若是图片消息，补全url
                if (msgType == 1) {
                    content = Global.imageUrl + content;
                }
                // if (msgType == 2) {
                //     content = Global.imageUrl + "/" + content;
                // }
                if (msgType == 6) {     //system000

                }
                if (msgType == 7) {     //temp
                    content = Global.imageUrl + "/" + content;
                }
                if (indexChat == 0) {
                    var timeLabel: ChatTimeUI = new ChatTimeUI();
                    timeLabel.showTime(chat.timeline);
                    this.chatRecordGroup.addChildAt(timeLabel, indexContent);
                    timeLabel.width = this.width;
                    indexContent++;
                } else {
                    var lastChat: ChatInfo = chatInfoList[(indexChat - 1) + ""]
                    if ((chat.timeline - lastChat.timeline) > 300000) {
                        var timeLabel: ChatTimeUI = new ChatTimeUI();
                        timeLabel.showTime(chat.timeline);
                        this.chatRecordGroup.addChildAt(timeLabel, indexContent);
                        timeLabel.width = this.width;
                        indexContent++;
                    }
                }

                if (msgType == 6) {
                    var sysMsg: SystemMsgUI = new SystemMsgUI();
                    sysMsg.showMsg(content);
                    this.chatRecordGroup.addChildAt(sysMsg, indexContent);
                    sysMsg.width = this.width;
                    indexContent++;
                } else {
                    if (chat.isSelf) {
                        var chatBubbleS: ChatBubbleSelfUI = new ChatBubbleSelfUI();
                        name = myInfo.nickName;
                        chatBubbleS.init(content, this.chatId, msgType, chat.timeline, this.chatType, chat);
                        this.chatRecordGroup.addChildAt(chatBubbleS, indexContent);
                        chatBubbleS.width = this.width;
                        indexContent++;
                    } else {
                        var chatBubbleO: ChatBubbleOtherUI = new ChatBubbleOtherUI();
                        userId = chat.chatId;
                        chatBubbleO.init(content, this.chatId, msgType, chat.timeline, this.chatType, chat);
                        this.chatRecordGroup.addChildAt(chatBubbleO, indexContent);
                        chatBubbleO.width = this.width;
                        indexContent++;
                    }
                }

            }
            this.searchFlag++;  //预备下一次查找记录
            this.scrollToBottom();
        }

        //发送消息
        public sendFriendMsg(): void {
            var content: string = this.chatContentTxt.text;
            if (content == null || content === "") {
                return;
            }
            this.send(content, MessageType.text);

            this.addMsgBubble(content, 0);
        }

        public sendFriendImg(imgContent) {
            this.send(imgContent, MessageType.image);
        }

        private send(content: string, msgType: number) {
            var uuid: string = NativeApi.uuid();
            var to: number = Number(this.chatId);
            if (this.chatType == 0) {
                var myInfo: UserInfo = dliyun.UserData.instance.getUserInfoData();
                ChatRequest.sendChatFriend(uuid, myInfo.id, to, msgType, content);
            } else if (this.chatType == 1) {
                ChatRequest.sendGroupChatFriendRequest(uuid, Number(this.chatId), msgType, content)
            }
        }

        public clearInputText(): void {
            this.chatContentTxt.text = "";
        }

        public scrollToBottom(): void {
            var self = this;
            // egret.setTimeout(() => {
            var num: number = self.chatRecordGroup.numChildren;
            var allHeight: number = 0;
            for (var i = 0; i < num; i++) {
                var childBubble = self.chatRecordGroup.getChildAt(i);
                allHeight += (childBubble.height + 10);     //10是每个bubble间距
            }
            self.scroller.viewport.scrollV = allHeight - self.scroller.height;
            // }, this, 100);
        }

        public onChatScroll() {
            var self = this;
            let vertical: number = this.scroller.viewport.scrollV;
            // console.log("----------------聊天记录滚动到 ", vertical);
            // if (ChatRecordData.instance.getChatLength(this.chatType, this.chatId) > (this.searchFlag) * this.SEARCH_CHAT_COUNT) {
            //     if (vertical < 15) {
            //         this.showMoreBtn.visible = true;
            //     } else {
            //         this.showMoreBtn.visible = false;
            //     }
            // }

            if (vertical < 15) {
                IndexedDB.instance.checkChatLength(this.chatId, (this.searchFlag * this.SEARCH_CHAT_COUNT),
                    function () {
                        if (self) {
                            self.showMoreBtn.visible = true;
                        }
                    }, this);
            } else {
                this.showMoreBtn.visible = false;
            }
        }

        public doSelect(): void {
            selectImage(this.selectedHandler, this.selectFileHandler, this);
        }
        private selectedHandler(thisRef: any, imgURL: string): void {
            thisRef.addMsgBubble(imgURL, 1);
            RES.getResByUrl(imgURL, thisRef.compFunc, thisRef, RES.ResourceItem.TYPE_IMAGE);
        }
        private compFunc(texture: egret.Texture): void {
            if (texture == null) return;
            var base64 = texture.toDataURL("image/png");
            base64 = base64.split(",")[1];
            console.warn(base64);
            this.uploadFriendFile(base64, 0);     //发送
        }
        private suffix: string;
        private selectFileHandler(thisRef: any, imgURL: string, suffix: string) {
            thisRef.suffix = suffix;
            RES.getResByUrl(imgURL, thisRef.compFileFunc, thisRef);
        }
        private compFileFunc(data) {
            console.log(data);
            var base64 = egret.Base64Util.encode(data);
            this.uploadFriendFile(base64, 1);
        }

        //发送图片//临时代码
        private uploadFriendFile(base64File: string, type: number): void {      //image: 0, other: 1
            egret.ImageLoader.crossOrigin = "anonymous";
            var userToken: string = UserData.instance.userInfo.accessToken;
            var urlLoader: egret.URLLoader = new egret.URLLoader();

            urlLoader.addEventListener(egret.Event.COMPLETE, this.onPostComplete, this);
            urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, () => {
                console.log("error");
            }, this);

            urlLoader.dataFormat = egret.URLLoaderDataFormat.TEXT;

            var urlRequest = new egret.URLRequest(Global.uploadUrl);
            var variable = new egret.URLVariables();
            urlRequest.method = egret.URLRequestMethod.POST;
            if (type == 0) {
                urlRequest.data = JSON.stringify({ "type": "chatImage", "base64File": decodeURIComponent(base64File) });
            } else {
                urlRequest.data = JSON.stringify({ "type": "attachment", "base64File": decodeURIComponent(base64File), "suffix": this.suffix });
            }
            urlRequest.requestHeaders.push(new egret.URLRequestHeader("Content-Type", "application/json"));
            urlRequest.requestHeaders.push(new egret.URLRequestHeader("x-access-token", userToken));
            // urlRequest.requestHeaders.push(new egret.URLRequestHeader("Access-Control-Allow-Origin", "*"));

            urlLoader.load(urlRequest);
        }

        private onPostComplete(event: egret.Event) {
            var loader: egret.URLLoader = <egret.URLLoader>event.currentTarget;
            var data: egret.URLVariables = loader.data;
            let jsonStr = JSON.parse(data + "");
            let imgContent = jsonStr.data;
            if (imgContent) {
                console.log("返回数据：", data);
                console.log("上传图片地址：", jsonStr.data);
                this.sendFriendImg(imgContent)
            }
        }
        private onPostFail(event: egret.Event){
            
        }

        //通过截图预览发送图片
        private panelSendImg(base64Data: string, panel: ChatImagePanel) {
            var myInfo: UserInfo = dliyun.UserData.instance.getUserInfoData();
            var chatBubble: ChatBubbleSelfUI = new ChatBubbleSelfUI();
            chatBubble.initByBase64(base64Data, this.chatId, Date.now());
            this.chatRecordGroup.addChild(chatBubble);
            chatBubble.width = this.width;
            this.chatContentTxt.text = "";
            egret.setTimeout(this.scrollToBottom, this, 500);

            this.uploadFriendFile(base64Data, 0);
        }

        private addMsgBubble(content: string, type: number): void {
            var myInfo: UserInfo = dliyun.UserData.instance.getUserInfoData();
            var chatBubble: ChatBubbleSelfUI = new ChatBubbleSelfUI();
            chatBubble.init(content, this.chatId, type, Date.now(), this.chatType);
            this.chatRecordGroup.addChild(chatBubble);
            chatBubble.width = this.width;
            this.chatContentTxt.text = "";
            egret.setTimeout(this.scrollToBottom, this, 500);
        }

        private addFileBubble() {

        }

        //空白内容
        public hideUI(): void {
            this.uiGroup.visible = false;
        }

        private addListenPaste() {
            // var self = this;
            this.editBg.visible = true;
            this.editBg_s.visible = false;
            console.log("------------------开始监听粘贴");
            document.addEventListener("paste", this.onPasteImg, false);
            document.body.onkeydown = function (evt) {
                if (evt.keyCode == 13) {
                    if (dliyun.ChatContentUI.instance) {
                        dliyun.ChatContentUI.instance.onEnter();
                    }
                }
            }
        }
        private removeListenPaste() {
            this.editBg.visible = false;
            this.editBg_s.visible = true;
            var self = this;
            console.log("------------------不再监听粘贴了");
            document.removeEventListener("paste", this.onPasteImg, false);
            document.body.onkeydown = function (evt) {
                if (evt.keyCode == 13) {
                    
                }
            }
        }

        private onPasteImg(event: ClipboardEvent) {
            if (event.clipboardData && event.clipboardData.items) {
                var items = event.clipboardData.items;
                var item;
                console.log("-----------剪贴板长度是 ", items.length);
                for (var i = 0; i < items.length; i++) {
                    if (items[i] && items[i].kind === "file") {
                        item = items[i];
                        if (item.type.match(/^image\//i)) {
                            // Global.readFile(item.getAsFile(), this.createImg);
                            var reader = new FileReader();
                            reader.readAsDataURL(item.getAsFile());
                            reader.onload = function () {
                                var data = this.result.split(",")[1];
                                egret.BitmapData.create("base64", data, (bmpData) => {
                                    var texture = new egret.Texture();
                                    texture.bitmapData = bmpData;
                                    var image: eui.Image = new eui.Image(texture);
                                    image.width = texture.textureWidth;
                                    image.height = texture.textureHeight;
                                    let panel = new ChatImagePanel();
                                    panel.addContent(image, "发送图片", ChatContentUI.instance.panelSendImg, ChatContentUI.instance, data);
                                    PopUpManager.addPopUp(panel, true, 0, 0, 1);
                                });
                            }
                        }
                    }
                    break;
                }

            }
        }

        public openSettingPanel() {
            if (this.chatType == RelationType.friend) {
                this.chatSettingPanel.onFriendShow();
            }
            if (this.chatType == RelationType.group) {
                this.chatSettingPanel.onGroupShow();
                UIInfo.chatSettingPanelOn = true;
                ChatRequest.sendGetGroupUsers(this.chatId);

                let grpInfo: GroupInfo = GroupData.instance.getGroupInfo(this.chatId);
                if (grpInfo.ownerId == UserData.instance.getUserInfoData().id) {
                    this.chatSettingPanel.removeUserBtn.visible = true;
                } else {
                    this.chatSettingPanel.removeUserBtn.visible = false;
                }

                this.chatSettingPanel.groupNameLabel.text = CommonUtil.omittStr(this.nameLab.text, 17);
            }
        }

        public onShowGroupUsersList(id: string, users: Array<FriendInfo>) {
            if (this.chatType == 0) return;
            UIInfo.chatSettingPanelOn = false;

            if (id != this.chatId) return;

            // let groupUsers = new Array<FriendInfo>();
            // groupUsers = users;
            this.groupUsersArr = new Array<FriendInfo>();
            this.groupUsersArr = users;

            let length = users.length;
            for (let i = 0; i < length; i++) {
                let item: UserItem = new UserItem(1);
                item.showUser(users[i].id, users[i].nickName);
                this.chatSettingPanel.scrollerGrp.addChild(item);
            }
        }

        public onAddGroupUser() {
            if (this.chatType == 0) return;
            if (this.groupUsersArr == null || this.groupUsersArr.length < 1) {
                return;
            }
            var panel: SelectFriendPanel = new SelectFriendPanel(1);
            panel.showAddGroupUserSelect(this.groupUsersArr, this.chatId);
            PopUpPanel.addPopPanel(panel);

            this.chatSettingPanel.onClose();
        }

        public onRemoveGroupUser() {
            if (this.chatType == 0) return;
            if (this.groupUsersArr == null || this.groupUsersArr.length < 1) {
                return;
            }
            var panel: SelectFriendPanel = new SelectFriendPanel(2);
            panel.showRemoveGroupUserSelect(this.groupUsersArr, this.chatId);
            PopUpPanel.addPopPanel(panel);

            this.chatSettingPanel.onClose();
        }

        public onExitGroup() {
            if (this.chatType == 0) return;
            let panel = new DialogPanel(1, this.chatId);
            PopUpPanel.addPopPanel(panel);
            this.chatSettingPanel.onClose();
        }

        public onConfirmEditBtn() {
            if (this.chatType == 0) return;
            let name = this.chatSettingPanel.editNameInput.text;
            if (CommonUtil.sizeOf(name) > 17) {
                return;
            }
            if (name == null || name.length < 1) {
                return;
            }
            ChatRequest.sendUpdateGroupName(this.chatId, name);
            this.chatSettingPanel.onConfirm(name);
        }

        public onDeleteRecord() {
            this.chatSettingPanel.onClose();
            var self = this;
            if (this.chatId) {
                // ChatRecordData.instance.deleteFriendChat(this.chatId, this.chatType);
                IndexedDB.instance.deleteChat(this.chatId, () => {
                    self.show(this.chatId, this.chatType);
                }, this);
            }
        }
        public removeSettingPanel() {
            this.chatSettingPanel.onClose();
        }

        public onClickStage(event: egret.TouchEvent) {
            let obj: any = event.target;
            let obj1: any = event.currentTarget;
            console.log("content页面点击到：", obj);
            console.log("content页面点击到：", obj1);
        }
    }
}


