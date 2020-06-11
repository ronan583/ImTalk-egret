/**
 * 右侧好友个人信息
 */
module dliyun {
	export class FriendContentUI extends eui.Component {
		public constructor() {
			super();
			this.skinName = "resource/eui_skins/main/friend/FriendContentUiSkin.exml"
		}

		public friendId: string;
		public infoData: FriendInfo;

		public nameLabel: eui.Label;
		public signatureLabel: eui.Label;
		public idLabel: eui.Label;
		public genderIcon: eui.Image;
		public headImg: eui.Image;

		public beizhuLabel: eui.Label;
		public diquLabel: eui.Label;
		public laiyuanLabel: eui.Label;

		public deleteBtn: eui.Button;

		public uiGroup: eui.Group;

		private maleIconPath: string = "dlyim_info_boy";
		private femaleIconPath: string = "dlyim_info_girl";

		//todo
		public beizhuEdit: eui.EditableText;

		public sendBtn: eui.Button;

		public partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			console.warn("---------FriendContentUI created");
			this.sendBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendFriendMsg, this);
			this.deleteBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDeleteFriend, this);
		}

		private initUI(): void {
			this.nameLabel.text = "";
			this.signatureLabel.text = "";
			this.idLabel.text = "";
			this.genderIcon.source = this.maleIconPath;
			this.headImg.source = "";

			this.beizhuLabel.text = "";
			this.diquLabel.text = "";
			this.laiyuanLabel.text = "";
		}

		public show(id?: string) {
			this.initUI();
			if (id == null) {
				this.uiGroup.visible = false;
				return;
			}
			this.friendId = id;
			this.infoData = FriendData.instance.getFriendInfo(this.friendId);
			console.log(this.infoData);

			this.nameLabel.text = this.infoData.nickName;
			this.idLabel.text = "id: " + this.infoData.id;
			//this.signatureLabel.text = ;
			if (this.infoData.gender) {
				this.genderIcon.visible = true;
				switch (this.infoData.gender) {
					case 0:
						this.genderIcon.visible = false;
						break;
					case 1:
						this.genderIcon.source = this.maleIconPath;
						break;
					case 2:
						this.genderIcon.source = this.femaleIconPath;
						break;
				}
			}
			this.genderIcon.visible = false;
			dliyun.FriendData.instance.updateHead(this.friendId, (texture: egret.Texture) => {
				if(texture == null) return;
				this.headImg.texture = texture;
			});

			this.beizhuLabel.text = this.infoData.remarkName;
			this.diquLabel.text = "";
			this.laiyuanLabel.text = "";
		}

		private onSendFriendMsg() {
			// ChatRecordData.instance.startFriendMessage(RelationType.friend, this.friendId);
			IndexedDB.instance.addStartChat(RelationType.friend, this.friendId, ()=>{
				AppFacade.getInstance().sendNotification(SysNotify.SELECT_NAVIGATION_RADIOBUTTON, 1);
				AppFacade.getInstance().sendNotification(SysNotify.SHOW_FRIEND_MESSAGE_INFO, this.friendId);
				let chatData: any = {
					"chatId": this.friendId,
					"chatType": 0
				}
				// AppFacade.getInstance().sendNotification(SysNotify.SHOW_FRIEND_MESSAGE_RIGHT, chatData);
				AppFacade.getInstance().sendNotification(SysNotify.UPDATE_UNREAD_COUNT_EACH);
			}, this);
		}

		public onDeleteFriend() {
			let panel = new DialogPanel(0, this.friendId);
			PopUpPanel.addPopPanel(panel);
		}
	}
}