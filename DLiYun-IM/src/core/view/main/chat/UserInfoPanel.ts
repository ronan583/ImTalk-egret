/**
 * 联系人信息 弹出
 */
module dliyun {
	export class UserInfoPanel extends eui.Component {
		public constructor(id: string) {
			super();
			this.skinName = "resource/eui_skins/user/UserInfoPanelSkin.exml"
			this.friendId = id;
		}

		public friendId: string;
		public friendInfo: FriendInfo;

		public nameLabel: eui.Label;
		public idLabel: eui.Label;
		public genderIcon: eui.Image;
		public headImg: eui.Image;

		public beizhuLabel: eui.Label;
		public diquLabel: eui.Label;
		public laiyuanLabel: eui.Label;

		private maleIconPath: string = "dlyim_info_boy";
		private femaleIconPath: string = "dlyim_info_girl";

		public btnShare: eui.Button;
		public btnAdd: eui.Button;
		public btnTalk: eui.Button;

		public partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			// this.btnTalk.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendFriendMsg, this);
			this.btnAdd.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAddFriend, this);
			this.btnTalk.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendFriendMsg, this);
			egret.setTimeout(() => {
				this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.stageClick, this);
			}, this, 100);

			this.initUI();
			this.show(this.friendId);
		}

		protected removeFromStage() {
			if (this.stage) {
				this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.stageClick, this);
			}
		}

		private stageClick(e: egret.TouchEvent) {
			if (!this.hitTestPoint(e.stageX, e.stageY, true)) {
				this.closePanel();
			}
		}

		private initUI(): void {
			this.nameLabel.text = "";
			this.idLabel.text = "";
			this.genderIcon.source = this.maleIconPath;
			this.headImg.source = "";

			this.beizhuLabel.text = "";
			this.diquLabel.text = "";
			this.laiyuanLabel.text = "";
		}

		private onRequestComplete(event: egret.Event) {
			var loader: egret.URLLoader = <egret.URLLoader>event.currentTarget;
			var data: egret.URLVariables = loader.data;
			console.log("--------" + data);
			let jsonStr = JSON.parse(data + "");
			if (jsonStr.code == "MESSAGE_ERROR") {
				this.visible = false;
				ToastUI.showToast("用户不存在")
			} else if (jsonStr.code == "SUCCESS") {
				let infoData: string = jsonStr.data;
				let uint8: Uint8Array = CommonUtil.base64ToUint8(infoData);
				let resultData = ChatRequest.getFriendInfo(uint8);
				console.log("--------", resultData);

				this.friendInfo = new FriendInfo();
				this.friendId = resultData.id + "";
				this.friendInfo.nickName = resultData.nickName;
				this.friendInfo.avatar = resultData.avatar;
				this.friendInfo.gender = resultData.gender;
				this.friendInfo.remarkName = resultData.remarkName;

				this.showOnComplete();
				// this.friendInfo.isOnline
				// this.friendInfo.lastOnline
			} else if (jsonStr.code == "SERVER_ERROR") {

			}
		}

		private onRequestError() {
			console.error("error");
			ToastUI.showToast("查找好友失败");
		}

		public show(id: string) {
			Http.requestFriendInfo(id, this.onRequestComplete, this);
		}

		public showOnComplete() {
			this.nameLabel.text = this.friendInfo.nickName;
			this.idLabel.text = "D-Talk id: " + this.friendId;
			if (this.friendInfo.gender) {
				this.genderIcon.visible = true;
				switch (this.friendInfo.gender) {
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
				if (texture == null) return;
				this.headImg.texture = texture;
			});

			this.beizhuLabel.text = this.friendInfo.remarkName;
			this.diquLabel.text = "";
			this.laiyuanLabel.text = "";

			if (FriendData.instance.isFriend(this.friendId)) {
				this.isFriendBtn();
			} else {
				this.notFriendBtn();
			}
		}

		private onSendFriendMsg() {
			let friendInfo: FriendInfo = FriendData.instance.getFriendInfo(this.friendId);
			if (friendInfo == null) {
				console.error("----------好友不存在");
				return;
			}
			// ChatRecordData.instance.startFriendMessage(RelationType.friend, this.friendId);
			IndexedDB.instance.addStartChat(RelationType.friend, this.friendId, ()=>{
				AppFacade.getInstance().sendNotification(SysNotify.SELECT_NAVIGATION_RADIOBUTTON, 1);
				AppFacade.getInstance().sendNotification(SysNotify.SHOW_FRIEND_MESSAGE_INFO, this.friendId);
				let chatData: any = {
					"chatId": this.friendId,
					"chatType": 0
				}
				AppFacade.getInstance().sendNotification(SysNotify.SHOW_FRIEND_MESSAGE_RIGHT, chatData);
				AppFacade.getInstance().sendNotification(SysNotify.UPDATE_UNREAD_COUNT_EACH);
				this.closePanel();
			}, this);
		}

		private notFriendBtn() {
			this.btnShare.visible = false;
			this.btnAdd.visible = true;
			this.btnTalk.visible = false;
		}

		private isFriendBtn() {
			this.btnShare.visible = false;
			this.btnAdd.visible = false;
			this.btnTalk.visible = true;
		}

		private onAddFriend() {
			ChatRequest.sendFriendApplyRequest(Number(this.friendId), 0, "");
			ToastUI.showToast("申请已发送");
			this.closePanel();
		}

		private closePanel() {
			PopUpPanel.removePopPanel(this);
			this.removeFromStage();
		}
	}
}