module dliyun {
	export class ChatUI extends egret.DisplayObjectContainer {
		public constructor() {
			super();
			this.init();
		}

		private navigationUI: dliyun.NavigationUI;
		private leftUI: dliyun.LeftUI;
		private rightUI: dliyun.RightUI;

		private prevWidth: number = 0;
		private prevHeight: number = 0;

		public init() {
			this.navigationUI = new NavigationUI();
			this.leftUI = new LeftUI();
			this.rightUI = new RightUI();

			this.addChild(this.navigationUI);
			this.addChild(this.leftUI);
			this.addChild(this.rightUI);

			console.log("create init chat content LeftUI")
			egret.startTick(this.updateScale, this);
		}

		private updateScale(timestamp: number): boolean {
			if (this.stage) {
				if (this.stage.stageHeight != this.prevHeight) {
					this.navigationUI.height = this.rightUI.height = this.leftUI.height = this.stage.stageHeight;
					this.rightUI.chatContentUI.height = this.rightUI.friendInfoContent.height = this.rightUI.groupContentUI.height = this.stage.stageHeight;
					this.rightUI.chatContentUI.uiGroup.height = this.rightUI.height;
					this.prevHeight = this.stage.stageHeight;


					console.log("=============================================");
					console.log("-------stage height: ", this.stage.stageHeight);
					console.log("-------prev height: ", this.prevHeight);
					console.log("-------stage width: ", this.stage.stageWidth);
					console.log("-------prev height: ", this.prevHeight);
					console.log("----------------------------------------------")
					console.log("-------NavigationUI height: ", this.navigationUI.height);
					console.log("-------leftUI height: ", this.leftUI.height);
					console.log("-------rightUI height: ", this.rightUI.height);
					console.log("-------navigationUI width: ", this.navigationUI.width);
					console.log("-------leftUI width: ", this.leftUI.width);
					console.log("-------rightUI width: ", this.rightUI.width);
					console.log("-------navigationUI x: ", this.navigationUI.x);
					console.log("-------leftUI x: ", this.leftUI.x);
					console.log("-------rightUI x: ", this.rightUI.x);
				}

				if (this.stage.stageWidth != this.prevWidth) {
					this.leftUI.x = this.navigationUI.width;
					this.rightUI.x = this.leftUI.x + this.leftUI.width;
					this.rightUI.width = this.stage.stageWidth - this.navigationUI.width - this.leftUI.width;
					this.rightUI.chatContentUI.width = this.rightUI.friendInfoContent.width = this.rightUI.groupContentUI.width = this.rightUI.width;
					this.rightUI.chatContentUI.uiGroup.width = this.rightUI.width;

					this.prevWidth = this.stage.stageWidth;
				}
			}

			return false;
		}

	}

}
