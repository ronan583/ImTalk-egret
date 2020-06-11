module dliyun {
	export class UserItem extends eui.Component implements eui.UIComponent {

		public headImg: eui.Image;
		public nameLabel: eui.Label;

		/**
		 * 0:big
		 * 1:middle
		 */
		public constructor(size: number) {
			super();
			if (size == 0) {
				this.skinName = "resource/eui_skins/main/chat/UserItemSkin.exml";
			}
			if (size == 1) {
				this.skinName = "resource/eui_skins/main/chat/UserItemSkin1.exml";
			}
		}
		public partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}

		protected childrenCreated() {
			super.childrenCreated();
		}

		public showUser(id: string, name: string) {
			FriendData.instance.updateHead(id, (texture: egret.Texture) => {
				if (texture == null) {
					
				} else {
					this.headImg.texture = texture;
				}
			});
			this.nameLabel.text = CommonUtil.omittStr(name, 8);
		}
	}
}