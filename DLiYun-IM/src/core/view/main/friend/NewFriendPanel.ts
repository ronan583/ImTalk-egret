module dliyun {
	export class NewFriendPanel extends eui.Component {
		public newFriendListId: eui.List;
		public scroller: eui.Scroller;
		public constructor() {
			super();
			this.skinName = "resource/eui_skins/main/friend/NewFriendPanelSkin.exml";
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			if (this.scroller.horizontalScrollBar != null) {
				this.scroller.horizontalScrollBar.autoVisibility = false;
				this.scroller.horizontalScrollBar.visible = false;
				this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
			}
		}

		// class NewFriendInfo {
		// public applyInfo: any;
		// public status: number;   //0未决定 1已添加 2已拒绝

		// //申请添加关系
		// message RelationApply {
		// string id = 1;
		// int64 relationId = 2; //好友、群ID
		// RelationType relationType = 3; //申请类型friend/group
		// FriendInfo applyUser = 4; //申请者信息
		// string explain = 5; //申请说明
		// int64 timeline = 6;
		// string state = 7;
		public show() {
			var newFriends: Array<NewFriendInfo> = FriendData.instance.getAllNEWFriend();
			if (newFriends.length < 1) {

			}
			var collection = new eui.ArrayCollection();
			for (let info of newFriends) {
				collection.addItem({
					"id": info.applyMsg.applyUser.id + "",
					"nickName": info.applyMsg.applyUser.nickName,
					"explain": info.applyMsg.explain,
					"avatar": info.applyMsg.applyUser.avatar,
					"status": info.status
				});
			}
			this.newFriendListId.dataProvider = collection;
			this.newFriendListId.itemRenderer = NewFriendList;
		}
	}
}