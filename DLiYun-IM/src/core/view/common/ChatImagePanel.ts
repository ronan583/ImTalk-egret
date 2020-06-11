module dliyun {
	export class ChatImagePanel extends eui.Component {
		public constructor() {
			super();
			this.maxHeight = GameConfig.curHeight() - this.btnHeigh * 2;
			this.maxWidth = GameConfig.curWidth() - 50 * 2;
			this.skinName = "resource/eui_skins/common/ChatImagePanelSkin.exml"
		}

		private bgImg: eui.Image;
		private closeBtn: eui.Button;
		private functionBtn: eui.Button;
		public contentImg: eui.Image;
		public contentGrp: eui.Group;

		public maxHeight: number;
		public maxWidth: number;
		public minSize: number = 200;
		public btnHeigh: number = 30;

		private func: Function;
		private funcObj: any;
		private arg: any;
		protected childrenCreated(): void {
			super.childrenCreated();
			this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this)
		}

		public addContent(img: eui.Image, text: string, func?: Function, funcObj?: any, arg?: any): void {
			this.contentImg = new eui.Image();
			this.functionBtn.label = text;
			this.contentImg = img;
			let width = img.width;
			let height = img.height
			let ratio = width / height;
			if (ratio > this.maxWidth / this.maxHeight) {
				if (width > this.maxWidth) {
					this.contentImg.width = this.maxWidth;
					this.contentImg.height = height * this.maxWidth / width;
				}
			} else if (ratio < this.maxWidth / this.maxHeight) {
				if (height > this.maxHeight) {
					this.contentImg.height = this.maxHeight;
					this.contentImg.width = width * this.maxHeight / height;
				}
			}
			width = this.contentImg.width;
			height = this.contentImg.height;
			this.contentGrp.width = width;
			this.contentGrp.height = height;
			this.contentGrp.addChildAt(this.contentImg, 0);
			this.contentImg.horizontalCenter = this.contentImg.verticalCenter = 0;

			this.bgImg.width = width;
			this.bgImg.height = height + this.btnHeigh * 2;

			if (img.width < this.minSize || img.height < this.minSize) {
				this.contentGrp.width = this.contentGrp.height = this.minSize;
				this.bgImg.width = this.minSize;
				this.bgImg.height = this.minSize + this.btnHeigh* 2;
			}

			this.contentGrp.horizontalCenter = this.contentGrp.verticalCenter = 0;
			if (func) {
				this.func = func;
				this.funcObj = funcObj;
				this.arg = arg;
				this.functionBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.functionHandler, this);
			}

		}

		public functionHandler() {
			this.func.call(this.funcObj, this.arg);
			PopUpManager.removePopUp(this, 1);
		}

		public onClose(): void {
			PopUpManager.removePopUp(this, 1);
		}
	}
}