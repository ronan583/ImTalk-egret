/**
  * All Rights Reserved. 
  */

module ChatRequest {
    export var message;
    /**
        * 初始化
        * Create a game scene
        */
    export function init(): void {
        load("resource/net/Chat.proto", (err: any, root: any) => {
            message = root.Chat;
        });
    }

    export function getFriendInfo(uint8: any): any {
        var info: any = message.FriendInfo;
        var data: any = info.decode(uint8);
        return data;
    }
    export function getFriendMessage(uint8: any): any {
        var info: any = message.ChatFriendMsg;
        var data: any = info.decode(uint8);
        return data;
    }
    export function getGroupMessage(uint8: any): any {
        var info: any = message.ChatGroupMsg;
        var data: any = info.decode(uint8);
        return data;
    }

    export function getGroupInfo(uint8: any): any {
        var info: any = message.GroupInfo;
        var data: any = info.decode(uint8);
        return data;
    }

    export function getRevokeMessage(uint8: any): any {
        var info: any = message.RevokeMessage;
        var data: any = info.decode(uint8);
        return data;
    }

    export function getRelationApply(uint8: any): any {
        var info: any = message.RelationApply;
        var data: any = info.decode(uint8);
        return data;
    }

    export function getRemoveFriend(uint8: any): any {
        var info: any = message.RemoveFriend;
        var data: any = info.decode(uint8);
        return data;
    }

    export function getRemoveFromGroup(uint8: any): any{
        var info: any = message.RemoveFromGroup;
        var data: any = info.decode(uint8);
        return data;
    }

    //获取群成员列表
    export function getUpdateGroupUsers(uint8: any) {
        var info: any = message.GroupUsers;
        var data: any = info.decode(uint8);
        return data;
    }

    export function getDeleteAndExitGroup(uint8: any){
        var info: any = message.DeleteAndExitGroup;
        var data: any = info.decode(uint8);
        return data;
    }

    //请求全部好友
    export function sendGetFriendRequest() {
        SocketManager.sendMessage(OpCode.getMyFriends, null);
    }

    //请求全部群
    export function sendGetGroupRequest() {
        SocketManager.sendMessage(OpCode.getMyGroups, null);
    }

    //发送消息给好友
    export function sendChatFriend(uuid: string, from: number, to: number, msgType: number, content: string) {
        var chatFriendMsg: any = message.ChatFriendMsg;
        var sendMesage: any = {
            "uuid": uuid,
            "from": from,
            "to": to,
            "timeline": 4,
            "msgType": msgType,
            "content": content
        }
        var sendBuffer: any = chatFriendMsg.encode(chatFriendMsg.create(sendMesage)).finish();
        SocketManager.sendMessage(5, sendBuffer);
    }

    //撤回消息
    export function sendRevokeMessage(uuid: string, msgUuid: string, relationId: number, relationType: number) {
        var revokeMsg: any = message.RevokeMessage;
        var sendMessage: any = {
            "uuid": uuid,
            "msgUuid": msgUuid,
            "relationId": relationId,
            "relationType": relationType
        }
        var sendBuffer: any = revokeMsg.encode(revokeMsg.create(sendMessage)).finish();
        SocketManager.sendMessage(9, sendBuffer);
    }


    //发送消息到群聊
    export function sendGroupChatFriendRequest(uuid: string, groupId: number, msgType: number, content: string) {
        var chatGroupMsg: any = message.ChatGroupMsg;
        var friendInfoMsg: any = message.FriendInfo;
        var selfData = dliyun.UserData.instance.getUserInfoData();

        var sendSelfMsg: any = {
            "id": selfData.id,
            "nickName": selfData.nickName,
            "avatar": selfData.avatar,
            "gender": selfData.gender,
            "remarkName": selfData.nickName
        }

        var sendMesage: any = {
            "uuid": uuid,
            "from": sendSelfMsg,
            "groupId": groupId,
            "timeline": Date.now(),
            "msgType": msgType,
            "content": content
        }
        var sendBuffer: any = chatGroupMsg.encode(chatGroupMsg.create(sendMesage)).finish();
        SocketManager.sendMessage(6, sendBuffer);
    }

    //获取群成员列表
    export function sendGetGroupUsers(groupId: string) {
        var memberMsg: any = message.GroupUsers;
        var sendMessage: any = {
            "groupId": groupId
        }
        var sendBuffer: any = memberMsg.encode(memberMsg.create(sendMessage)).finish();
        SocketManager.sendMessage(15, sendBuffer);
    }

    //添加好友
    export function sendFriendApplyRequest(relationId: number, relationType: dliyun.RelationType, explain: string): void {
        var applyMsg: any = message.RelationApply;
        var uuid = NativeApi.uuid();
        var selfData = dliyun.UserData.instance.getUserInfoData();
        var user = {
            "id": selfData.id,
            "nickName": selfData.nickName,
            "avatar": selfData.avatar,
            "gender": selfData.gender,
            "remarkName": selfData.nickName
        }
        var sendMessage: any = {
            "id": uuid,
            "relationId": relationId,
            "relationType": relationType,
            "applyUser": user,
            "explain": explain
        }
        var sendBuffer: any = applyMsg.encode(applyMsg.create(sendMessage)).finish();
        SocketManager.sendMessage(18, sendBuffer);
        //     string id = 1;
        // int64 relationId = 2; //好友、群ID
        // RelationType relationType = 3; //申请类型friend/group
        // FriendInfo applyUser = 4; //申请者信息
        // string explain = 5; //申请说明
        // int64 timeline = 6;
        // string state = 7;
    }

    //同意添加对方好友
    export function sendAgreeApply(msgData: any): void {
        var msg: any = message.RelationApply;
        var sendBuffer: any = msg.encode(msg.create(msgData)).finish();
        SocketManager.sendMessage(19, sendBuffer);
    }

    //删除好友
    export function sendRemoveFriend(friendId: string): void {
        var removeMsg: any = message.RemoveFriend;
        var sendMsg: any = {
            "friendId": Number(friendId)
        }
        var sendBuffer: any = removeMsg.encode(removeMsg.create(sendMsg)).finish();
        SocketManager.sendMessage(20, sendBuffer);
    }

    export function sendUpdateGroupName(groupId: string, name: string){
        var infoMsg: any = message.UpdateGroupInfo;
        var groupInfo: any = {
            "id": Number(groupId),
            "name": name
        }
        var sendMsg: any = {
            "groupInfo": groupInfo
        }

        var sendBuffer: any = infoMsg.encode(infoMsg.create(sendMsg)).finish();
        SocketManager.sendMessage(13, sendBuffer);
    }
//     //群基本信息
// message GroupInfo {
//     int64 id = 1;
//     string name = 2;
//     string avatar = 3;
//     int64 ownerId = 4;
//     int64 userCount = 5;
// }

    export function sendCreateNewGroup(userIdArr: Array<string>) {
        var createGrpMsg: any = message.CreateNewGroup;
        var sendMsg: any = {
            "userIds": userIdArr
        }
        var sendBuffer: any = createGrpMsg.encode(createGrpMsg.create(sendMsg)).finish();
        SocketManager.sendMessage(12, sendBuffer);
    }
    export function sendInviteToGroup(groupId, userIdArr: Array<string>) {
        var inviteMsg: any = message.InviteToGroup;
        var sendMsg: any = {
            "groupId": Number(groupId),
            "userIds": userIdArr
        }
        var sendBuffer: any = inviteMsg.encode(inviteMsg.create(sendMsg)).finish();
        SocketManager.sendMessage(16, sendBuffer);
    }
    export function sendRemoveFromGroup(groupId, userIdArr: Array<string>) {
        var removeMsg: any = message.RemoveFromGroup;
        var sendMsg: any = {
            "groupId": Number(groupId),
            "userIds": userIdArr
        }
        var sendBuffer: any = removeMsg.encode(removeMsg.create(sendMsg)).finish();
        SocketManager.sendMessage(17, sendBuffer);
    }

    export function sendDeleteAndExitGroup(groupId){
        var exitMsg: any = message.DeleteAndExitGroup;
        var sendMsg: any = {
            "groupId": groupId
        }
        var sendBuffer: any = exitMsg.encode(exitMsg.create(sendMsg)).finish();
        SocketManager.sendMessage(14, sendBuffer);
    }

    /**
     * 使用框架内部加载外部proto文件
     * @param  {any} url proto文件路径 也可以是路径数组（可包含多条路径）
     * @param  {any} options (err: any, root: any) => {}加载完成后回调
     * @param  {any} callback=null
     * @returns void
     */
    export function load(url: any, options, callback = null): void {
        let self: any = new protobuf.Root();
        let queued: number = 0;
        let path: string;
        if (typeof options === "function") {
            callback = options;
            options = undefined;
        }
        let finish = (err, root) => {
            if (!callback || queued) return;
            callback(err, root);
        }
        let process = (filename, source) => {
            self.files.push(filename);
            let parsed = protobuf.parse(source, self, options), resolved;
            if (parsed.imports) {
                queued += parsed.imports.length;
                for (let i = 0; i < parsed.imports.length; ++i) {
                    if (resolved = self.resolvePath(path, parsed.imports[i])) {
                        let str: any = resolved.slice(resolved.lastIndexOf("/") + 1, resolved.length).replace(".", "_");
                        if (!RES.getRes(str)) {
                            RES.getResByUrl(resolved, function (source_: any) {
                                process(resolved, source_);
                                --queued;
                                finish(null, self);
                            }, this, RES.ResourceItem.TYPE_TEXT)
                        } else {
                            process(resolved, RES.getRes(str));
                            --queued;
                        }
                    }
                }
            }
            if (parsed.weakImports) {
                queued += parsed.imports.length;
                for (let i = 0; i < parsed.weakImports.length; ++i) {
                    if (resolved = self.resolvePath(path, parsed.weakImports[i])) {
                        let str: any = resolved.slice(resolved.lastIndexOf("/") + 1, resolved.length).replace(".", "_");
                        if (!RES.getRes(str)) {
                            RES.getResByUrl(resolved, function (source_: any) {
                                process(resolved, source_);
                                --queued;
                                finish(null, self);
                            }, this, RES.ResourceItem.TYPE_TEXT);
                        } else {
                            process(resolved, RES.getRes(str));
                            --queued;
                        }
                    }
                }
            };
            finish(null, self);
        }

        if (typeof url === "string") {
            path = url.slice(0, url.lastIndexOf("/") + 1);
            RES.getResByUrl(url, function (source_: any) {
                process(url, source_);
            }, this, RES.ResourceItem.TYPE_TEXT);
        } else {
            for (let i = 0; i < url.length; i++) {
                RES.getResByUrl(url[i], function (source_: any) {
                    let tempurl: string = url[i];
                    path = tempurl.slice(0, tempurl.lastIndexOf("/") + 1);
                    process(tempurl, source_);
                }, this, RES.ResourceItem.TYPE_TEXT);
            }
        }
    }
}
