module dliyun {
	export class FriendSelectedItem extends eui.Component {
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

		protected childrenCreated(): void {
			super.childrenCreated();
			this.selectCheckbox.visible = false;
			this.deleteBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDelete, this);
		}

		public showFriend(id: string, texture: egret.Texture, name: string){
			this.headImg.texture = texture;
			this.nickName.text = name;
			this.friendId = id;
		}

		public onDelete(){
			this.getParent().removeSelected(this.friendId);
			if(this.parent){
				this.parent.removeChild(this);
			}
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