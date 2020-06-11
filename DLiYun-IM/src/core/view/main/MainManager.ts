/**
  * 主界面管理类
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  * 所有的弹窗都需要在register注册事件
  * 在execute添加消息处理面板打开关闭事件
  */
module dliyun {

    export class MainManager extends puremvc.SimpleCommand implements puremvc.ICommand {
        private mainUI: dliyun.MainUI;

        public constructor() {
            super();
        }

        public static NAME: string = "MainManager";

        /**
         * 注册消息
         */
        public register(): void {
            this.facade.registerCommand(SceneNotify.OPEN_MAIN, this);
            this.facade.registerCommand(SceneNotify.CLOSE_MAIN, this);
            this.facade.registerCommand(SysNotify.SHOW_FRIEND_LIST, this);
            this.facade.registerCommand(SysNotify.SHOW_FRIEND_MESSAGE_INFO, this);
            this.facade.registerCommand(SysNotify.REFRESH_FRIEND_MESSAGE_INFO, this);
            this.facade.registerCommand(SysNotify.SHOW_GROUP_LIST, this);
            this.facade.registerCommand(SysNotify.SHOW_FRIEND_MESSAGE_RIGHT, this);
            this.facade.registerCommand(SysNotify.SHOW_FRIEND_INFO_RIGHT, this);
            this.facade.registerCommand(SysNotify.SELECT_NAVIGATION_RADIOBUTTON, this);
            this.facade.registerCommand(SysNotify.SHOW_GROUP_INFO_RIGHT, this);
            this.facade.registerCommand(SysNotify.REFRESH_CHAT_CONTENT, this);
            this.facade.registerCommand(SysNotify.UPDATE_UNREAD_COUNT_TOTAL, this);
            this.facade.registerCommand(SysNotify.UPDATE_UNREAD_COUNT_EACH, this);
            this.facade.registerCommand(SysNotify.SHOW_NEW_FRIEND_RIGHT, this);
            this.facade.registerCommand(SysNotify.REFRESH_NEW_FRIEND_REDDOT, this);
            this.facade.registerCommand(SysNotify.GROUP_USER_REFRESHED, this);
            this.facade.registerCommand(PanelNotify.OPEN_SEARCH_USER, this);
            this.facade.registerCommand(PanelNotify.OPEN_SELECT_FRIEND_PANEL, this);
        }

        public execute(notification: puremvc.INotification): void {
            var data: any = notification.getBody();//携带数据
            var panelCon = GameLayerManager.gameLayer().mainLayer;
            switch (notification.getName()) {
                case SceneNotify.OPEN_MAIN: {
                    egret.log("open main -------------");
                    if (this.mainUI == null) {
                        this.mainUI = new dliyun.MainUI();
                        panelCon.addChild(this.mainUI);
                        AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_LOGIN);
                    }
                    NativeApi.deleteLocalData(LocalEnumName.CONTACTS_FRIEND_MAP);
                    NativeApi.deleteLocalData(LocalEnumName.CONTACTS_GROUP_MAP);
                    // IndexedDB.instance.openDB();
                    // test code
                    // FriendData.instance.getFriendAll();
                    // GroupData.instance.getGroupAll();
                    // NativeApi.clearLocalData();
                    ChatRequest.sendGetFriendRequest();
                    ChatRequest.sendGetGroupRequest();
                    this.mainUI.navigationUI.show();
                    var index: number = this.mainUI.navigationUI.selectValue;
                    this.mainUI.leftUI.showRecord(index);
                    break;
                }
                case SceneNotify.CLOSE_MAIN: {
                    if (this.mainUI != null) {
                        panelCon.removeChild(this.mainUI);
                        this.mainUI = null;
                    }
                    break;
                }
                case SysNotify.REFRESH_FRIEND_MESSAGE_INFO: {
                    this.mainUI.leftUI.refreshRecord();
                    break;
                }
                case SysNotify.SHOW_FRIEND_MESSAGE_INFO: {
                    if (this.mainUI != null) {
                        var index: number = this.mainUI.navigationUI.selectValue;
                        if (data == null) {
                            this.mainUI.leftUI.showRecord(index);
                        } else {
                            let chatId: string = data;
                            this.mainUI.leftUI.showRecord(index, chatId);
                        }
                    }
                    break;
                }
                case SysNotify.SHOW_FRIEND_LIST: {
                    if (this.mainUI != null) {
                        var index: number = this.mainUI.navigationUI.selectValue;
                        this.mainUI.leftUI.showFriend(index);
                    }
                    break;
                }
                case SysNotify.SHOW_GROUP_LIST: {
                    if (this.mainUI != null) {
                        var index: number = this.mainUI.navigationUI.selectValue;
                        this.mainUI.leftUI.showGroup(index);
                    }
                    break;
                }
                case SysNotify.SHOW_FRIEND_MESSAGE_RIGHT: {
                    if (this.mainUI != null) {
                        let index: number = this.mainUI.navigationUI.selectValue;
                        this.mainUI.rightUI.showFriendMessage(index, data.chatId, data.chatType);
                    }
                    break;
                }
                case SysNotify.SHOW_GROUP_INFO_RIGHT: {
                    if (this.mainUI != null) {
                        let index: number = this.mainUI.navigationUI.selectValue;
                        if (data != null) {
                            this.mainUI.rightUI.showGroupInfo(index, data);
                        }
                    }
                    break;
                }
                case SysNotify.SHOW_FRIEND_INFO_RIGHT: {
                    if (this.mainUI != null) {
                        let index: number = this.mainUI.navigationUI.selectValue;
                        this.mainUI.rightUI.showFriendInfo(index, data);
                    }
                    break;
                }
                case SysNotify.SELECT_NAVIGATION_RADIOBUTTON: {
                    if (this.mainUI != null) {
                        this.mainUI.navigationUI.onRadioBtnSelected(data)
                    }
                    break;
                }
                case SysNotify.REFRESH_CHAT_CONTENT: {
                    if (ChatContentUI.instance) {
                        ChatContentUI.instance.show(data.id, data.chatType);
                        // todo
                        // ChatRecordData.instance.setChatRead(data.id, data.chatType);
                    }
                    break;
                }
                case SysNotify.UPDATE_UNREAD_COUNT_TOTAL: {
                    let count = ChatRecordData.instance.getChatUnreadTotal();
                    this.mainUI.navigationUI.updateUnread(count);
                    break;
                }
                case SysNotify.UPDATE_UNREAD_COUNT_EACH: {
                    this.mainUI.leftUI.chatRecordUI.updateUnread();
                    break;
                }
                case PanelNotify.OPEN_SEARCH_USER: {
                    CommonUtil.openSearchUser();
                    break;
                }
                case PanelNotify.OPEN_SELECT_FRIEND_PANEL: {
                    CommonUtil.openSelectFriendCreate();
                    break;
                }
                case SysNotify.SHOW_NEW_FRIEND_RIGHT: {
                    this.mainUI.rightUI.showNewFriendPanel();
                    this.mainUI.rightUI.newFriendUI.show();
                    break;
                }
                case SysNotify.REFRESH_NEW_FRIEND_REDDOT: {
                    
                    break;
                }

                case SysNotify.GROUP_USER_REFRESHED:{
                    var groupId: string = data.groupId;
                    var listUsers = data.listUsers;
                    if(UIInfo.groupContentUIOn){
                        this.mainUI.rightUI.groupContentUI.onShowGroupUsersList(groupId, listUsers);
                    }
                    if(UIInfo.chatSettingPanelOn){
                        this.mainUI.rightUI.chatContentUI.onShowGroupUsersList(groupId, listUsers);
                    }
                    break;
                }
            }
        }
    }
}
