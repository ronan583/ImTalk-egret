module dliyun {
	export class ChatSettingPanel extends eui.Component {

		// public userGroup: eui.Group;
		public userScroller: eui.Scroller;
		public scrollerGrp: eui.Group;
		public deleteBtn: eui.Button;
		public exitBtn: eui.Button;

		public addUserBtn: eui.Button;
		public removeUserBtn: eui.Button;

		public groupName: eui.Label;
		public groupNameLabel: eui.Label;
		public editNameBtn: eui.Label;
		public editNameCancelBtn: eui.Label;
		public confirmEditBtn: eui.Label;
		public editNameInput: eui.EditableText;

		public closeBtn: eui.Button;

		public isShow: boolean;


		public constructor() {
			super();
			this.skinName = "resource/eui_skins/main/chat/ChatSettingsSkin.exml";
		}
		public partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.editNameBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showEditGroupName, this);
			this.editNameCancelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancelConfirm, this);
			this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
		}

		public onFriendShow() {
			this.visible = true;
			this.userScroller.visible = false;
			this.exitBtn.visible = false;

			this.groupName.visible = false;
			this.groupNameLabel.visible = false;
			this.editNameBtn.visible = false;
			this.editNameCancelBtn.visible = false;
			this.confirmEditBtn.visible = false;
			this.editNameInput.visible = false;
		}

		public onGroupShow() {
			this.visible = true;
			this.userScroller.visible = true;
			this.exitBtn.visible = true;
			this.scrollerGrp.removeChildren();

			this.groupName.visible = true;
			this.groupNameLabel.visible = true;
			this.editNameBtn.visible = true;
			this.editNameCancelBtn.visible = false;
			this.confirmEditBtn.visible = false;
			this.editNameInput.visible = false;			
			this.editNameInput.text = "";			
		}

		public showEditGroupName(){
			this.confirmEditBtn.visible = true;
			this.editNameInput.visible = true;
			this.editNameBtn.visible = false;
			this.editNameCancelBtn.visible = true;
		}

		public onConfirm(name: string){
			this.editNameBtn.visible = true;
			this.editNameCancelBtn.visible = false;			
			this.editNameInput.visible = false;
			this.confirmEditBtn.visible = false;

			this.groupNameLabel.text = name;
		}

		public onCancelConfirm(){
			this.editNameBtn.visible = true;
			this.editNameCancelBtn.visible = false;
			this.editNameInput.visible = false;
			this.confirmEditBtn.visible = false;
		}

		public onHide() {
			if (this.isShow == true) {
				this.isShow = false;
				this.visible = false;
				this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onStageClick, this);
			}
		}

		public onClose() {
			this.visible = false;
		}

		public onStageClick(event: egret.TouchEvent) {
			if (this.visible = true && (this.stage != null) && (event != null)) {
				if (!this.hitTestPoint(event.stageX, event.stageY, true)) {
					this.onHide()
				}
			}
		}
	}
}