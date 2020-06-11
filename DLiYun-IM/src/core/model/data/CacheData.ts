module dliyun {

    export enum ChatType {
        record = 1,
        group = 2,
        friend = 3
    }
    export class UIInfo {
        public static chatRecordSelectId: string = "";
        public static naviRadioSelectId: number = ChatType.record;
        public static groupContentUIOn: boolean = false;
        public static chatSettingPanelOn: boolean = false;
    }


    export enum MessageType {
        text = 0, //文字
        image = 1, //图片
        gif = 2, //动画
        voice = 3, //语音
        tel = 4, //电话
        tel_video = 5, //视频电话
        info = 6, //提示信息

        empty = 10, //空
    }

    export enum RelationType {
        friend = 0,
        group = 1
    }
    export enum BubbleMenuType {
        CopyDeleteRevoke = 1,
        CopyDelete = 2,
        Delete = 3,
        DeleteRevoke = 4
    }

    export class ChatRecordData {
        private static _instance: ChatRecordData;
        static get instance(): ChatRecordData {
            if (!this._instance) {
                this._instance = new ChatRecordData();
            }
            return this._instance;
        }
        //聊天记录 key 好友id value 记录集合
        private chatMap: HashMap = new HashMap();
        private chatGroupMap: HashMap = new HashMap();
        //用户头像对缓存 key =uid value=Texture
        private headTextureMap: HashMap = new HashMap();
        private emojiMap: HashMap = new HashMap();





        public chatCacheData: Array<ChatInfo>;
        public setChatCacheData(data: any) {
            this.chatCacheData = new Array<ChatInfo>();
            for (let i = 0; i < data.length; i++) {
                let info = new ChatInfo();
                let item = data[i];
                info.chatId = item.chatId;
                info.content = item.content;
                info.friendId = item.friendId;
                info.isRead = item.isRead;
                info.isSelf = item.isSelf;
                info.timeline = item.timeline;
                info.msgType = item.msgType;
                info.uuid = item.uuid;
                info.isSendOK = item.isSendOK;
                this.chatCacheData.push(info);
            }
            console.log("--------setChatCacheData: ", this.chatCacheData);
        }

        public recordCacheData: Array<RecordInfo>;
        public setRecordCacheData(data: any) {
            this.recordCacheData = new Array<RecordInfo>();
            for (let i = 0; i < data.length; i++) {
                let info = new RecordInfo();
                let item = data[i];
                if (item == null) { continue; }
                info.chatId = item.chatId;
                info.content = item.content;
                info.friendId = item.friendId;
                info.msgType = item.msgType;
                info.timeDate = CommonUtil.TimeStampToDateHM(item.timeline);
                info.timeline = item.timeline;
                info.chatType = item.chatType;

                if (item.relationType == 0) {
                    var friendInfo = FriendData.instance.getFriendInfo(item.chatId);
                    info.isOnline = friendInfo.isOnline;
                }

                this.recordCacheData.push(info);
            }
            console.log("--------setRecordCacheData: ", this.recordCacheData);
        }





        //获取最近聊天记录缓存
        private initLocalChatData(): void {
            var chatMapString: string = NativeApi.getLocalData(LocalEnumName.CHAT_RECORD_DATA_MAP);
            var groupChatMapString: string = NativeApi.getLocalData(LocalEnumName.GROUP_CHAT_RECORD_DATA_MAP);
            if (chatMapString != null) {
                this.chatMap = MapToJsonUtil.JsonToMap(chatMapString);
            } else {
                this.chatMap = new HashMap();
            }
            if (groupChatMapString != null) {
                this.chatGroupMap = MapToJsonUtil.JsonToMap(groupChatMapString);
            } else {
                this.chatGroupMap = new HashMap();
            }
        }

        public get friendLength(): number {
            return this.chatMap.size();
        }

        /**
         * 获取好友聊天信息
         * @param relation 私聊or群聊
         */
        public getFriendChatAll(relation: RelationType, id: string, startCount: number, endCount: number): Array<ChatInfo> {
            var targetMap: HashMap;
            switch (relation) {
                case 0:
                    targetMap = this.chatMap;
                    break;
                case 1:
                    targetMap = this.chatGroupMap;
                    break;
            }
            if (targetMap.size() == 0) {
                this.initLocalChatData();
            }
            var list: Array<ChatInfo> = targetMap.get(id);
            if (list == null) {
                return null;
            }
            list.sort((info1: ChatInfo, info2: ChatInfo) => {
                return (info1.timeline - info2.timeline);
            });
            let length = list.length;

            let top = length - endCount;
            let bottom = length - startCount;
            if (top < 0) {
                top = 0;
            }
            return list.slice(top, bottom);
        }

        public getChatLength(relation: RelationType, id: string): number {
            var targetMap: HashMap;
            switch (relation) {
                case 0:
                    targetMap = this.chatMap;
                    break;
                case 1:
                    targetMap = this.chatGroupMap;
                    break;
            }
            if (targetMap.size() == 0) {
                this.initLocalChatData();
            }
            var list: Array<ChatInfo> = targetMap.get(id);
            if (list != null) {
                return list.length;
            } else {
                return -1;
            }
        }


        /**
         * 获取所有好友聊天记录
         */
        public getChatAll(): Array<RecordInfo> {
            if (this.chatMap.size() == 0 && this.chatGroupMap.size() == 0) {
                this.initLocalChatData();
            }
            var list: Array<RecordInfo> = new Array<RecordInfo>();
            var keysFriend: string[] = this.chatMap.keys();
            var keysGroup: string[] = this.chatGroupMap.keys();
            for (let id in keysFriend) {
                var chatId: string = keysFriend[id];
                var chatList: Array<ChatInfo> = this.chatMap.get(chatId);
                var friendInfo = FriendData.instance.getFriendInfo(chatId);
                if (friendInfo == null) {
                    continue;
                }
                var recordInfo: RecordInfo = new RecordInfo();
                if (chatList == null) {
                    recordInfo.chatId = chatId;
                    recordInfo.msgType = ChatType.friend;
                    recordInfo.name = friendInfo.nickName;
                    recordInfo.chatType = RelationType.friend;
                    recordInfo.isOnline = friendInfo.isOnline;
                    list.push(recordInfo);
                    continue;
                }
                var chatInfo: ChatInfo = chatList[chatList.length - 1];     //找最后一条
                if (chatInfo == null) {
                    continue;
                } else {
                    recordInfo.content = chatInfo.content;
                    recordInfo.timeline = chatInfo.timeline;
                    recordInfo.timeDate = CommonUtil.TimeStampToDateHM(recordInfo.timeline);

                    recordInfo.chatId = chatId;
                    recordInfo.friendId = chatInfo.friendId;
                    recordInfo.msgType = chatInfo.msgType;
                    recordInfo.name = friendInfo.nickName;
                    recordInfo.chatType = RelationType.friend;
                    recordInfo.isOnline = friendInfo.isOnline;

                    list.push(recordInfo);
                }
            }
            for (let id in keysGroup) {
                var groupId: string = keysGroup[id];
                var chatList: Array<ChatInfo> = this.chatGroupMap.get(groupId);
                if (chatList == null) {
                    continue;
                }
                var groupInfo: GroupInfo = GroupData.instance.getGroupInfo(groupId);
                var recordInfo: RecordInfo = new RecordInfo();
                if (groupInfo == null) {
                    continue;
                }
                if (chatList == null) {
                    recordInfo.chatId = groupId;
                    recordInfo.friendId = chatInfo.friendId;
                    recordInfo.msgType = chatInfo.msgType;
                    recordInfo.name = groupInfo.name;
                    recordInfo.chatType = RelationType.group;
                    list.push(recordInfo);
                    continue;
                }
                var chatInfo: ChatInfo = chatList[chatList.length - 1];
                //判断字符串的尺寸
                if (chatInfo) {
                    recordInfo.content = chatInfo.content;
                    recordInfo.timeline = chatInfo.timeline;
                    recordInfo.timeDate = CommonUtil.TimeStampToDateHM(recordInfo.timeline);
                    recordInfo.chatId = groupId;
                    recordInfo.friendId = chatInfo.friendId;
                    recordInfo.msgType = chatInfo.msgType;
                    recordInfo.name = groupInfo.name;
                    recordInfo.chatType = RelationType.group;

                    list.push(recordInfo);
                }
            }
            list.sort((rec1: RecordInfo, rec2: RecordInfo) => {
                return (rec2.timeline - rec1.timeline);
            });
            return list;
        }

        public setChatRead(chatId: string, relation: RelationType) {
            let localName: string;
            switch (relation) {
                case 0:
                    localName = LocalEnumName.CHAT_RECORD_DATA_MAP;
                    break;
                case 1:
                    localName = LocalEnumName.GROUP_CHAT_RECORD_DATA_MAP;
                    break;
            }
            let chatMapString: string = NativeApi.getLocalData(localName);
            NativeApi.deleteLocalData(localName);
            let chatMap: HashMap = MapToJsonUtil.JsonToMap(chatMapString);
            let chatArr: Array<ChatInfo> = chatMap.get(chatId);
            if (chatArr == null || chatArr.length < 1) {
                return;
            }
            for (let i = 0; i < chatArr.length; i++) {
                let chatInfo: ChatInfo = chatArr[i];
                if (chatInfo.msgType != 10) {
                    chatInfo.isRead = true;
                }
            }
            chatMap.remove(chatId);
            chatMap.put(chatId, chatArr);
            chatMapString = MapToJsonUtil.mapToJson(chatMap);
            NativeApi.setLocalData(localName, chatMapString);
            this.initLocalChatData();
        }

        public getChatUnreadCount(chatId: string, relation: RelationType): number {
            let localName: string;
            switch (relation) {
                case 0:
                    localName = LocalEnumName.CHAT_RECORD_DATA_MAP;
                    break;
                case 1:
                    localName = LocalEnumName.GROUP_CHAT_RECORD_DATA_MAP;
                    break;
            }
            var count = 0;
            let chatMapString: string = NativeApi.getLocalData(localName);
            let chatMap: HashMap = MapToJsonUtil.JsonToMap(chatMapString);
            let chatArr: Array<ChatInfo> = chatMap.get(chatId);
            if (chatArr == null || chatArr.length < 1) {
                return 0;
            }
            for (let i = 0; i < chatArr.length; i++) {
                let chatInfo: ChatInfo = chatArr[i];
                if (chatInfo.msgType != 10 && chatInfo.isRead == false) {
                    if (!chatInfo.isSelf) {
                        count++;
                    }
                }
            }
            return count;
        }

        public getChatUnreadTotal(): number {
            var count = 0;
            var friendChatMap: HashMap = MapToJsonUtil.JsonToMap(NativeApi.getLocalData(LocalEnumName.CHAT_RECORD_DATA_MAP));
            var groupChatMap: HashMap = MapToJsonUtil.JsonToMap(NativeApi.getLocalData(LocalEnumName.GROUP_CHAT_RECORD_DATA_MAP));
            var keysFriend: string[] = friendChatMap.keys();
            var keysGroup: string[] = groupChatMap.keys();
            for (let id in keysFriend) {
                let num = this.getChatUnreadCount(keysFriend[id], 0);
                count = count + num;
            }
            for (let id in keysGroup) {
                let num = this.getChatUnreadCount(keysGroup[id], 1);
                count = count + num;
            }

            return count;
        }

        public deleteSingleChat(msgId: string, relation: RelationType): string {
            let localName: string;
            switch (relation) {
                case 0:
                    localName = LocalEnumName.CHAT_RECORD_DATA_MAP;
                    break;
                case 1:
                    localName = LocalEnumName.GROUP_CHAT_RECORD_DATA_MAP;
                    break;
            }
            let chatMapString: string = NativeApi.getLocalData(localName);
            NativeApi.deleteLocalData(localName);
            let chatMap: HashMap = MapToJsonUtil.JsonToMap(chatMapString);
            for (var chatId in chatMap) {
                let chatArr: Array<ChatInfo> = chatMap.get(chatId);
                var index = -1;
                for (let i = 0; i < chatArr.length; i++) {
                    if (chatArr[i].uuid == msgId) {
                        index = i;
                        break;
                    }
                }
                if (index > -1) {
                    chatMap.remove(chatId);
                    chatArr.splice(index, 1);
                    chatMap.put(chatId, chatArr);
                    chatMapString = MapToJsonUtil.mapToJson(chatMap);
                    NativeApi.setLocalData(localName, chatMapString);
                    this.initLocalChatData();
                    return chatId;
                }
            }
            return null;
        }

        public deleteFriendChat(id: string, relation: RelationType) {
            let localName: string;
            switch (relation) {
                case 0:
                    localName = LocalEnumName.CHAT_RECORD_DATA_MAP;
                    break;
                case 1:
                    localName = LocalEnumName.GROUP_CHAT_RECORD_DATA_MAP;
                    break;
            }
            let chatMapString: string = NativeApi.getLocalData(localName);
            NativeApi.deleteLocalData(localName);
            let chatMap: HashMap = MapToJsonUtil.JsonToMap(chatMapString);
            let chatArr: Array<ChatInfo> = chatMap.get(id);
            chatMap.remove(id);
            chatMapString = MapToJsonUtil.mapToJson(chatMap);
            NativeApi.setLocalData(localName, chatMapString);
            this.initLocalChatData();
            this.startFriendMessage(relation, id);
        }

        // message ChatGroupMsg {
        //     string uuid = 1;
        //     FriendInfo from = 2;
        //     int64 groupId = 5;
        //     int64 timeline = 6;
        //     MsgType msgType = 7;
        //     string content = 8;
        //     bool isRevoke = 9;
        //     bool isSendOK = 10;
        // }        
        /**
         * 添加私聊聊天记录
         * @param relation 私聊or群聊
         */
        public setFriendMessage(relation: RelationType, data: any): void {
            var chatInfo = new ChatInfo();
            var chatId: number;
            var targetMap: HashMap;
            var localEnum: string;

            chatInfo.uuid = data.uuid;
            chatInfo.content = data.content;
            chatInfo.msgType = data.msgType;
            chatInfo.isSendOK = data.isSendOK;
            chatInfo.timeline = data.timeline;
            chatInfo.isRead = false;

            if (chatInfo.msgType == 6) {
                chatInfo.friendId = "system000";
                chatInfo.isSelf = false;
                switch (relation) {     //当前系统消息只能是群组消息
                    // case RelationType.friend:
                    //     chatInfo.chatId = 
                    //     targetMap = this.chatMap;
                    //     localEnum = LocalEnumName.CHAT_RECORD_DATA_MAP;
                    //     break;
                    case RelationType.group:
                        chatInfo.chatId = data.groupId + "";
                        targetMap = this.chatGroupMap;
                        localEnum = LocalEnumName.GROUP_CHAT_RECORD_DATA_MAP;
                        break;
                }
            } else {
                switch (relation) {
                    case RelationType.friend:

                        chatInfo.friendId = (data.from == UserData.instance.getUserInfoData().id) ? data.to : data.from;
                        chatInfo.isSelf = (data.from == UserData.instance.getUserInfoData().id);
                        chatInfo.chatId = chatInfo.isSelf ? data.to : data.from;

                        targetMap = this.chatMap;
                        localEnum = LocalEnumName.CHAT_RECORD_DATA_MAP;

                        break;
                    case RelationType.group:

                        chatInfo.chatId = data.groupId + "";
                        chatInfo.friendId = data.from.id + "";
                        chatInfo.isSelf = (data.from.id == UserData.instance.getUserInfoData().id);

                        targetMap = this.chatGroupMap;
                        localEnum = LocalEnumName.GROUP_CHAT_RECORD_DATA_MAP;

                        break;
                }
            }

            var chatArray: Array<ChatInfo> = targetMap.get(chatInfo.chatId + "");

            if (chatArray == null || (chatArray.length == 1 && chatArray[0].msgType == 10)) {
                chatArray = new Array<ChatInfo>();
            }

            chatArray.push(chatInfo);
            targetMap.put(chatInfo.chatId + "", chatArray);


            //保存本地
            var chatMapString: string = MapToJsonUtil.mapToJson(targetMap);
            NativeApi.setLocalData(localEnum, chatMapString);
        }

        /**
         * 开启私聊聊天
         * @param relation 私聊or群聊
         */
        public startFriendMessage(relation: RelationType, chatId: string): void {
            var targetMap: HashMap;
            switch (relation) {
                case RelationType.friend:
                    targetMap = this.chatMap;
                    break;
                case RelationType.group:
                    targetMap = this.chatGroupMap;
                    break;
            }
            if (FriendData.instance.getFriendInfo(chatId) == null) {
                console.error("----------好友不存在");
                return;
            }
            var chatArray: Array<ChatInfo> = targetMap.get(chatId);
            if (chatArray == null) {
                chatArray = new Array<ChatInfo>();
                let chat: ChatInfo = new ChatInfo();
                //开启的新聊天的类型为empty（10）
                chat.msgType = 10;
                chat.timeline = new Date().getTime();
                chatArray.push(chat);
                targetMap.put(chatId, chatArray);
            }
        }

        //获取聊天图片
        public getChatImg(url: string, compFunc?: Function, funcObj?: any): void {
            //todo 做缓存hashmap
            // var texture: egret.Texture = this.headTextureMap.get(id);
            var texture: egret.Texture = new egret.Texture();
            console.warn("图片地址是：", url);
            RES.getResByUrl(url, function (texture: egret.Texture) {
                compFunc.call(funcObj, texture);
            }, this, RES.ResourceItem.TYPE_IMAGE);
        }
    }


    export class FriendData {
        private static _instance: FriendData;
        static get instance(): FriendData {
            if (!this._instance) {
                this._instance = new FriendData();
            }
            return this._instance;
        }
        //联系人
        private friendMap: HashMap = new HashMap();
        private newFriendMap: HashMap = new HashMap();
        //用户头像对缓存 key =uid value=Texture
        private headTextureMap: HashMap = new HashMap();

        //获取用户联系人缓存
        private initLocalFriendData(): void {
            var friendMapString: string = NativeApi.getLocalData(LocalEnumName.CONTACTS_FRIEND_MAP);
            if (friendMapString != null) {
                this.friendMap = MapToJsonUtil.JsonToMap(friendMapString);
            }
        }
        //获取新的好友缓存
        private initLocalNewFriendData(): void {
            var newFriendMapString: string = NativeApi.getLocalData(LocalEnumName.CONTACTS_NEWFRIEND_MAP);
            if (newFriendMapString != null) {
                this.newFriendMap = MapToJsonUtil.JsonToMap(newFriendMapString);
            }
        }

        //获取所有联系人
        public getFriendAll(): Array<FriendInfo> {
            if (this.friendMap.size() == 0) {
                this.initLocalFriendData();
            }
            var friendList: Array<FriendInfo> = new Array<FriendInfo>();
            var keys: string[] = this.friendMap.keys();
            for (let id of keys) {
                let friendInfo: FriendInfo = new FriendInfo();
                friendInfo.id = id;
                friendInfo.nickName = this.friendMap.get(id).nickName;
                friendInfo.avatar = this.friendMap.get(id).avatar;
                friendInfo.isOnline = this.friendMap.get(id).isOnline;
                friendList.push(friendInfo);
            }
            friendList.sort((info1: FriendInfo, info2: FriendInfo) => {
                return (info1.nickName.localeCompare(info2.nickName, "zh"));
            })
            return friendList;
            //return this.friendMap;
        }

        //添加用户联系人
        public setFriendInfo(data: any): void {
            var friendinfo = new FriendInfo();
            friendinfo.id = data.id;
            friendinfo.nickName = data.nickName;
            friendinfo.avatar = data.avatar;
            friendinfo.remarkName = data.remarkName;
            friendinfo.isOnline = data.isOnline;
            friendinfo.lastOnline = data.lastOnline;
            this.friendMap.put(friendinfo.id, friendinfo);

            //保存本地
            var friendMapString: string = MapToJsonUtil.mapToJson(this.friendMap);
            NativeApi.setLocalData(LocalEnumName.CONTACTS_FRIEND_MAP, friendMapString);
        }

        //获取联系人信息
        public getFriendInfo(id: string): FriendInfo {
            if (this.friendMap.size() == 0) {
                this.initLocalFriendData();
            }
            let friendInfo = this.friendMap.get(id);
            if (friendInfo != null) {
                return friendInfo;
            } else {
                return null;
            }
        }

        public removeFriend(id: string) {
            if (this.friendMap.size() == 0) {
                this.initLocalFriendData();
            }
            if (this.isFriend(id)) {
                this.friendMap.remove(id);
            }
            var friendMapStr: string = MapToJsonUtil.mapToJson(this.friendMap);
        }

        //更新用户头像
        public updateHead(id: string, compFunc?: Function): void {
            var texture: egret.Texture = this.headTextureMap.get(id);
            if (texture == null) {
                var $this = this;
                var avatar;
                var friendInfo: FriendInfo = this.getFriendInfo(id);
                if (id != (UserData.instance.getUserInfoData().id + "") && friendInfo == null) {
                    return;
                }
                if (id == (UserData.instance.getUserInfoData().id + "")) {
                    avatar = UserData.instance.getUserInfoData().avatar;
                } else {
                    avatar = Global.imageUrl + friendInfo.avatar;
                }
                RES.getResByUrl(avatar, function (texture: egret.Texture) {
                    $this.headTextureMap.put(id, texture);
                    compFunc(texture);
                }, this, RES.ResourceItem.TYPE_IMAGE);
            } else {
                compFunc(texture);
            }
        }

        public updateHeadByAvartar

        //新的朋友
        public setNEWFriend(data: any, status: number) {
            let id = data.applyUser.id;
            let newFriendInfo: NewFriendInfo = new NewFriendInfo();
            newFriendInfo.applyMsg = data;
            newFriendInfo.status = status;
            this.newFriendMap.put(id, newFriendInfo);
            //存本地
            var newFriendMapString: string = MapToJsonUtil.mapToJson(this.newFriendMap);
            NativeApi.setLocalData(LocalEnumName.CONTACTS_NEWFRIEND_MAP, newFriendMapString);

            console.log(this.newFriendMap);
        }

        public getAllNEWFriend(): Array<NewFriendInfo> {
            if (this.newFriendMap.size() == 0) {
                this.initLocalNewFriendData();
            }
            var newFriendList: Array<NewFriendInfo> = new Array<NewFriendInfo>();
            var keys: string[] = this.newFriendMap.keys();
            for (let id of keys) {
                let newFriendInfo: NewFriendInfo = new NewFriendInfo();
                newFriendInfo.applyMsg = this.newFriendMap.get(id).applyMsg;
                newFriendInfo.status = this.newFriendMap.get(id).status;
                //如果已经在好友列表中
                if (FriendData.instance.getFriendInfo(id) != null) {
                    newFriendInfo.status = 1;
                }
                newFriendList.push(newFriendInfo);
            }
            return newFriendList;
        }

        public getNEWFriend(id: string): NewFriendInfo {
            if (this.newFriendMap.size() == 0) {
                this.initLocalNewFriendData();
            }
            let newFriendInfo: NewFriendInfo = this.newFriendMap.get(id);
            if (newFriendInfo != null) {
                return newFriendInfo;
            } else {
                return null;
            }
        }

        public setNEWFriendAgree(id: string, status: number) {
            let info = FriendData.instance.getNEWFriend(id);
            if (info == null) {
                console.error("new friend not found");
            } else {
                info.status = status;
                this.newFriendMap.put(id, info);
                var mapStr: string = MapToJsonUtil.mapToJson(this.newFriendMap);
                NativeApi.setLocalData(LocalEnumName.CONTACTS_NEWFRIEND_MAP, mapStr);
            }
        }

        public checkNEWFriend(): boolean {
            var newFriendArray: Array<NewFriendInfo> = this.getAllNEWFriend();
            if (newFriendArray.length < 1) {
                return false;
            } else {
                let length = newFriendArray.length;
                for (let i = 0; i < length; i++) {
                    if (newFriendArray[i].status == 0) {
                        return true;
                    }
                }
                return false;
            }
        }

        public isFriend(id: string): boolean {
            let info = this.getFriendInfo(id);
            if (info == null) {
                return false;
            } else {
                return true;
            }
        }

        public clearFriendMap() {
            this.friendMap.clear();
        }
    }

    export class GroupData {
        private static _instance: GroupData;
        static get instance(): GroupData {
            if (!this._instance) {
                this._instance = new GroupData();
            }
            return this._instance;
        }
        //群map
        private groupMap: HashMap = new HashMap();
        //群头像对缓存 key =uid value=Texture
        private headTextureMap: HashMap = new HashMap();

        //获取群缓存
        private initLocalGroupData(): void {
            var groupMapString: string = NativeApi.getLocalData(LocalEnumName.CONTACTS_GROUP_MAP);
            if (groupMapString != null) {
                this.groupMap = MapToJsonUtil.JsonToMap(groupMapString);
            }
        }

        //获取所有群
        public getGroupAll(): HashMap {
            if (this.groupMap.size() == 0) {
                this.initLocalGroupData();
            }
            return this.groupMap;
        }

        //添加群
        public setGroupInfo(data: any): void {
            var groupInfo = new GroupInfo();
            groupInfo.id = data.id;
            groupInfo.avatar = data.avatar;
            groupInfo.ownerId = data.ownerId;
            groupInfo.userCount = data.userCount;
            groupInfo.name = data.name;
            this.groupMap.put(groupInfo.id + "", groupInfo);

            //保存本地
            var groupMapString: string = MapToJsonUtil.mapToJson(this.groupMap);
            NativeApi.setLocalData(LocalEnumName.CONTACTS_GROUP_MAP, groupMapString);
        }

        //获取群信息
        public getGroupInfo(id: string): GroupInfo {
            if (this.groupMap.size() == 0) {
                this.initLocalGroupData();
            }
            return this.groupMap.get(id);
        }

        //更新群头像
        public updateHead(id: string, compFunc?: Function): void {
            var texture: egret.Texture = this.headTextureMap.get(id);
            if (texture == null) {
                var $this = this;
                var groupInfo: GroupInfo = this.getGroupInfo(id);
                if (groupInfo == null) { return; }
                RES.getResByUrl(Global.imageUrl + groupInfo.avatar, function (texture: egret.Texture) {
                    $this.headTextureMap.put(id, texture);
                    compFunc(texture);
                }, this, RES.ResourceItem.TYPE_IMAGE);
            } else {
                compFunc(texture);
            }
        }

        public removeGroup(id: string) {
            if (this.groupMap.size() == 0) {
                this.initLocalGroupData();
            }
            if (this.isMyGroup(id)) {
                this.groupMap.remove(id);
            }
            var friendMapStr: string = MapToJsonUtil.mapToJson(this.groupMap);
        }

        public isMyGroup(id: string): boolean {
            let info = this.getGroupInfo(id);
            if (info == null) {
                return false;
            } else {
                return true;
            }
        }

        public clearGroupMap() {
            this.groupMap.clear();
        }
    }

    //联系人基本信息
    export class FriendInfo {
        public id: string;
        public nickName: string;
        public avatar: string;
        public gender: number;
        public remarkName: string;
        public isOnline: boolean;
        public lastOnline: number;
    }

    export class NewFriendInfo {
        public applyMsg: any;
        public status: number;   //0未决定 1已添加 2已拒绝
    }

    //群基本信息
    export class GroupInfo {
        public id: number;
        public name: string;
        public avatar: string;
        public ownerId: number;
        public userCount: number;
    }

    //聊天信息(单条)
    export class ChatInfo {
        public uuid: string;
        public content: string;
        public msgType: number;
        public chatType: number;
        public isSendOK: boolean;
        public timeline: number;
        public isSelf: boolean;//是否自己发送
        //chatId 私聊：对方id 群聊：groupId
        public chatId: string;
        //friendId 私聊：对方id 群聊：该消息所属人id
        public friendId: string;
        public isRead: boolean;
    }

    //聊天信息（集合）
    export class ChatInfoArray {
        public chatInfos: Array<ChatInfo>;
        public lastTime: number;
    }

    //最近聊天好友信息
    export class RecordInfo {
        public chatId: string;
        public friendId: string;
        public name: string;
        public content: string;
        public msgType: number;
        public timeline: number;
        public timeDate: string;
        public chatType: number;
        public isOnline: boolean;
    }

}
