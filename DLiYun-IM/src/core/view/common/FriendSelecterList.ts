module dliyun {
	export class FriendSelecterList extends eui.ItemRenderer {
		public constructor() {
			super();
			this.skinName = "resource/eui_skins/common/FriendSelecterListSkin.exml";
		}

		public selectImg: eui.Image;
		public headImg: eui.Image;
		public nickName: eui.Label;

		public selectCheckbox: eui.CheckBox;
		public deleteBtn: eui.Button;

		public friendId: string;
		public headTexture: egret.Texture;

		// public selected: boolean;

		protected childrenCreated(): void {
			super.childrenCreated();
			this.deleteBtn.visible = false;
			this.selectCheckbox.addEventListener(egret.TouchEvent.CHANGE, this.onSelect, this);
		}

		protected dataChanged(): void {
			var self = this;
			this.friendId = this.data.id;
			FriendData.instance.updateHead(this.friendId, (texture: egret.Texture) => {
				if(texture){
					self.headImg.texture = texture;
					this.headTexture = texture;
				}
			});
		}

		public onSelect(){
			// this.selected = this.selectCheckbox.selected;
			this.getParent().showSelectedItem();
		}

		public getParent(): SelectFriendPanel{
			var parent = this.parent;
			if(parent == null)	return null;
			while(!(parent instanceof SelectFriendPanel)){
				if(parent == null)	return null;
				parent = parent.parent;
			}
			return parent;
		}

	}
}