module dliyun {
	export class SearchUserPanel extends eui.Component {

		public titleLabel: eui.Label;
		public explainLabel: eui.Label;
		public inputText: eui.EditableText;
		public userInfoPanel: UserInfoPanel;

		public btn1: eui.Button;
		public btn2: eui.Button;
		public closeBtn: eui.Button;

		public constructor() {
			super();
			this.skinName = "resource/eui_skins/common/DialoguePanelSkin.exml";
		}

		public childrenCreated(): void {
			super.childrenCreated();
			this.btn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtn1, this);
			this.btn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanel, this);
			this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanel, this);

			this.searchUserTheme();
		}

		public init(): void {
			this.titleLabel.text = "";
			this.explainLabel.text = "";
		}

		public searchUserTheme(): void {
			this.titleLabel.text = "查找好友";
			this.explainLabel.text = "";
		}

		public onBtn1() {
			var input: string = this.inputText.text;
			//todo 校验
			let userInfoPanel = new UserInfoPanel(input);
			PopUpPanel.addPopPanel(userInfoPanel, (GameConfig.curWidth() - userInfoPanel.width) / 2, (GameConfig.curHeight() - userInfoPanel.height) / 2)
		}

		public onBtn1Test() {
			// if (this.confirmFunc != null) {
				// this.confirmFunc.call(this.funcObj, this.inputText.text);
			// }
		}

		private closePanel() {
			PopUpPanel.removePopPanel(this);
		}

	}
}