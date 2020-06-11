module dliyun {
	export class PopMenu extends eui.Component{

		public btn1: eui.Button;
		public btn0: eui.Button;

		public constructor() {
			super();
            this.skinName = "resource/eui_skins/main/PopMenuSkin.exml";
		}

		protected childrenCreated(): void{
			super.childrenCreated();
			this.btn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtn1, this);
			this.btn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtn0, this);
			egret.setTimeout(() => {
				this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.stageClick, this);
			}, this, 100);
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

		private closePanel() {
			PopUpPanel.removePopPanel(this);
			this.removeFromStage();
		}

		public onBtn1(){
			AppFacade.instance.sendNotification(PanelNotify.OPEN_SEARCH_USER);
			this.closePanel();
		}

		public onBtn0(){
			AppFacade.instance.sendNotification(PanelNotify.OPEN_SELECT_FRIEND_PANEL);
			// ToastUI.showToast("敬请期待");
			this.closePanel();
		}
	}
}