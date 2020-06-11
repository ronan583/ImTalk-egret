/**
 * 右侧群聊信息
 */
module dliyun {
	export class GroupContentUI extends eui.Component {
		public constructor() {
			super();
			this.skinName = "resource/eui_skins/main/group/GroupContentUISkin.exml"
		}

		public groupId: string;
		public infoData: GroupInfo;
		public groupUsers: Array<FriendInfo>;

		public nameLabel: eui.Label;
		public scroller: eui.Scroller;
		public userGroup: eui.Group;
		// public countLabel: eui.Label;
		// public headImg: eui.Image;

		public sendBtn: eui.Button;

		public partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
            console.warn("---------GroupContentUI created");
			this.sendBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendGroupMsg, this);
		}

		private initUI(): void {
			this.nameLabel.text = "";
			// this.countLabel.text = "";
			// this.headImg.source = "";
		}

		public show(id: string) {
			this.groupId = id;
			this.infoData = GroupData.instance.getGroupInfo(this.groupId);
			if (this.infoData == null) {
				return;
			}
			this.initUI();
			console.log(this.infoData);

			this.nameLabel.text = CommonUtil.omittStr(this.infoData.name, 21) + " (" + this.infoData.userCount + "人)";
			// this.countLabel.text = this.infoData.userCount + "人";
			dliyun.GroupData.instance.updateHead(this.groupId, (texture: egret.Texture) => {
				// this.headImg.texture = texture;
			});

			UIInfo.groupContentUIOn = true;
			ChatRequest.sendGetGroupUsers(this.groupId);
			this.userGroup.removeChildren();
		}

		private onSendGroupMsg() {
			// ChatRecordData.instance.startFriendMessage(RelationType.group, this.groupId);
			IndexedDB.instance.addStartChat(RelationType.group, this.groupId, ()=>{
				AppFacade.getInstance().sendNotification(SysNotify.SELECT_NAVIGATION_RADIOBUTTON, 1);
				AppFacade.getInstance().sendNotification(SysNotify.SHOW_FRIEND_MESSAGE_INFO, this.groupId);
				let chatData: any = {
					"chatId": this.groupId,
					"chatType": 1
				}
				AppFacade.getInstance().sendNotification(SysNotify.SHOW_FRIEND_MESSAGE_RIGHT, chatData);
				AppFacade.getInstance().sendNotification(SysNotify.UPDATE_UNREAD_COUNT_EACH);
			}, this);
		}

		public onShowGroupUsersList(id: string, users: Array<FriendInfo>){
			UIInfo.groupContentUIOn = false;
			
			if(id != this.groupId)	return;

			this.groupUsers = new Array<FriendInfo>();
			this.groupUsers = users;

			let length = users.length;
			for(let i = 0; i < length; i++){
				let item: UserItem = new UserItem(0);
				item.showUser(users[i].id, users[i].nickName);
				this.userGroup.addChild(item);
			}
		}
	}
}