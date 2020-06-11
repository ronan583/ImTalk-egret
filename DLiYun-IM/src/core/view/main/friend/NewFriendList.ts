module dliyun {
	export class NewFriendList extends eui.ItemRenderer {
		public userId: string;
		public applyMsg: any;

		public headImg: eui.Image;
		public nickName: eui.Label;
		public explain: eui.Label;
		public btnAgree: eui.Button;
		public btnReject: eui.Button;
		public statusLabel: eui.Label;

		public constructor() {
			super();
			this.skinName = "resource/eui_skins/main/friend/NewFriendListSkin.exml";
		}

		protected childrenCreated():void{
			super.childrenCreated();
			this.btnAgree.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAgreeClick, this);
			this.btnReject.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRejectClick, this);
		}

		protected dataChanged(): void {
			var self = this;
			FriendData.instance.updateHead(this.data.id, function (texture: egret.Texture) {
				if(texture == null) return;
				self.headImg.texture = texture;
			});
			this.userId = this.data.id;
			if(this.data.status == 0){
				this.showDialogBtn();
			} else if(this.data.status == 1){
				this.showAgreed();
			} else if(this.data.status == 2){
				this.showRejected();
			}
		}

		private onAgreeClick(){
			let msg: any = FriendData.instance.getNEWFriend(this.userId).applyMsg;
			// console.warn(msg);
			msg.state = "agree";
			ChatRequest.sendAgreeApply(msg);

			//需要回调todo
			ToastUI.showToast("已添加");
			FriendData.instance.setNEWFriendAgree(this.userId, 1);
			this.showAgreed();
		}

		private onRejectClick(){
			let msg: any = FriendData.instance.getNEWFriend(this.userId).applyMsg;
			msg.state = "refuse";
			ChatRequest.sendAgreeApply(msg);
			
			ToastUI.showToast("已拒绝");
			FriendData.instance.setNEWFriendAgree(this.userId, 2);
			this.showRejected();
		}		

		private showDialogBtn() {
			this.statusLabel.visible = false;
			this.btnAgree.visible = true;
			this.btnReject.visible = true;
		}
		private showAgreed() {
			this.statusLabel.visible = true;
			this.statusLabel.text = "已添加";
			this.btnAgree.visible = false;
			this.btnReject.visible = false;
		}
		private showRejected() {
			this.statusLabel.visible = true;
			this.statusLabel.text = "已拒绝";
			this.btnAgree.visible = false;
			this.btnReject.visible = false;
		}
	}
}