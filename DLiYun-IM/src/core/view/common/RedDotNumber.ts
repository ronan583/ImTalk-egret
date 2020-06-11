module dliyun {
	export class RedDotNumber extends eui.Component {
		public constructor() {
			super();
			this.skinName = "resource/eui_skins/common/RedDotNumberSkin.exml"
		}
		public numLabel: eui.Label;
		public setNumber(count: number) {
			if (count < 100) {
				this.numLabel.text = count + "";
			} else {
				this.numLabel.text = "99+";
			}
		}
	}
}