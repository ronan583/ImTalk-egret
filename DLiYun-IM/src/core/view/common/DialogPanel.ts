module dliyun {
	export class DialogPanel extends eui.Component {
		public id: string;
		public type: number;

		public titleLabel: eui.Label;
		public title2Label: eui.Label;
		public explainLabel: eui.Label;
		public inputText: eui.EditableText;
		public inputGrp: eui.Group;
		public userInfoPanel: UserInfoPanel;

		public btn1: eui.Button;
		public btn2: eui.Button;
		public closeBtn: eui.Button;

		/**
		 * /0: 删好友 /1退出群
		 */
		public constructor(type: number, id: string) {
			super();
			this.skinName = "resource/eui_skins/common/DialoguePanelSkin.exml";
			this.type = type;
			this.id = id;
		}

		public childrenCreated(): void {
			super.childrenCreated();
			this.btn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtn1, this);
			this.btn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanel, this);
			this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanel, this);
			if(this.type == 0){
				this.inputGrp.visible = false;
				this.titleLabel.text = "删除好友"
				this.title2Label.visible = true;
				this.title2Label.text = "确定删除此好友？"
				this.explainLabel.visible = false;
			} 
			if(this.type == 1){
				this.inputGrp.visible = false;
				this.titleLabel.text = "退出群聊"
				this.title2Label.visible = true;
				this.title2Label.text = "确定退出此群？"
				this.explainLabel.visible = false;
			}
		}

		public onBtn1() {
			if(this.type == 0){
				this.deleteFriend();
			}
			if(this.type == 1){
				this.exitGroup();
			}
			this.closePanel();
		}

		public deleteFriend(){
			ChatRequest.sendRemoveFriend(this.id);
		}

		public exitGroup(){
			ChatRequest.sendDeleteAndExitGroup(this.id);
		}

		private closePanel() {
			PopUpPanel.removePopPanel(this);
		}

	}
}