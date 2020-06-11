module dliyun {
	// export class FriendSelecterData{
	// 	public constructor(id, head, name){
	// 		this.id = id;
	// 		this.head = head;
	// 		this.name = name;
	// 	}
	// 	public id: string;
	// 	public head: egret.Texture;
	// 	public name: string;
	// }
	export class SelectFriendPanel extends eui.Component {

		public selectFriendList: eui.List;
		public selectedGroup: eui.Group;
		public scroller0: eui.Scroller;
		public scroller1: eui.Scroller;

		public titleLabel: eui.Label;

		public confirmBtn: eui.Button;
		public cancelBtn: eui.Button;
		public closeBtn: eui.Button;

		public groupId: string;

		public friendArr: Array<FriendSelectedItem>;

		public type: number;		//0 create /1 add /2 remove

		/**
		 * //0 create /1 add /2 remove
		 */
		public constructor(type: number) {
			super();
			this.skinName = "resource/eui_skins/main/chat/SelectFriendPanelSkin.exml";
			this.type = type;
		}

		public childrenCreated(): void {
			super.childrenCreated();
			this.friendArr = new Array<FriendSelectedItem>();
			this.selectedGroup.removeChildren();
			this.cancelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanel, this);
			this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanel, this);
			if (this.type == 0) {
				this.titleLabel.text = "请勾选需要添加的联系人";
				this.confirmBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onConfirmCreate, this);
			}
			if (this.type == 1) {
				this.titleLabel.text = "请勾选需要邀请的联系人";
				this.confirmBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onConfirmAdd, this);
			}
			if (this.type == 2) {
				this.titleLabel.text = "请勾选需要移除的群成员";
				this.confirmBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onConfirmRemove, this);
			}
		}

		public showFriendSelectList() {
			var collection: eui.ArrayCollection = new eui.ArrayCollection();
			var friendAll: Array<FriendInfo> = FriendData.instance.getFriendAll();
			for (let info of friendAll) {
				let nickName = CommonUtil.omittStr(info.nickName, 17);
				collection.addItem({ "id": info.id, "nickName": nickName });
			}
			this.selectFriendList.dataProvider = collection;
			this.selectFriendList.itemRenderer = FriendSelecterList;
		}

		public showAddGroupUserSelect(userArr: Array<FriendInfo>, groupId: string) {
			this.groupId = groupId;

			var collection: eui.ArrayCollection = new eui.ArrayCollection();
			var friendAll: Array<FriendInfo> = FriendData.instance.getFriendAll();

			for (let info of friendAll) {
				let isIn = false;
				for (let user of userArr) {
					if (info.id == user.id) {
						isIn = true;
					}
				}
				if (!isIn) {
					let nickName = CommonUtil.omittStr(info.nickName, 17);
					collection.addItem({ "id": info.id, "nickName": nickName });
				}
			}
			this.selectFriendList.dataProvider = collection;
			this.selectFriendList.itemRenderer = FriendSelecterList;
		}

		public showRemoveGroupUserSelect(userArr: Array<FriendInfo>, groupId: string) {
			this.groupId = groupId;

			var collection: eui.ArrayCollection = new eui.ArrayCollection();
			var friendAll: Array<FriendInfo> = FriendData.instance.getFriendAll();

			for (let info of userArr) {
				//去掉自己
				if(Number(info.id) == UserData.instance.getUserInfoData().id){
					continue;
				}
				let nickName = CommonUtil.omittStr(info.nickName, 17);
				collection.addItem({ "id": info.id, "nickName": nickName });
			}
			this.selectFriendList.dataProvider = collection;
			this.selectFriendList.itemRenderer = FriendSelecterList;
		}

		public showSelectedItem() {
			this.friendArr = new Array<FriendSelectedItem>();
			let num = this.selectFriendList.numChildren;
			for (let i = 0; i < num; i++) {
				let obj = this.selectFriendList.getChildAt(i);
				if (!(obj instanceof FriendSelecterList)) {
					continue;
				}
				if (obj.selectCheckbox.selected) {
					let id = obj.friendId;
					let head = obj.headTexture;
					let name = obj.nickName.text;

					let item: FriendSelectedItem = new FriendSelectedItem();
					item.showFriend(id, head, name);
					this.friendArr.push(item);
				}

			}
			this.refreshSelectUI();
		}

		public removeSelected(id: string) {
			//删除左侧选中
			//从列表中删除
			//从右边容器移除
			let length = this.friendArr.length;
			for (let i = 0; i < length; i++) {
				if (this.friendArr[i].friendId == id) {
					this.friendArr.splice(i, 1);
					break;
				}
			}

			let num = this.selectFriendList.numChildren;
			for (let i = 0; i < num; i++) {
				let obj = this.selectFriendList.getChildAt(i);
				if (!(obj instanceof FriendSelecterList)) {
					continue;
				}
				if (obj.friendId == id) {
					obj.selectCheckbox.selected = false;
				}
			}
		}

		public refreshSelectUI() {
			this.selectedGroup.removeChildren();
			let length = this.friendArr.length;
			for (let i = 0; i < length; i++) {
				let item = this.friendArr[i];
				this.selectedGroup.addChild(item);
			}
		}

		public onConfirmCreate() {
			let idArr: Array<string> = new Array<string>();
			for (let item of this.friendArr) {
				idArr.push(item.friendId);
			}
			ChatRequest.sendCreateNewGroup(idArr);
			this.closePanel();
		}

		public onConfirmAdd() {
			let idArr: Array<string> = new Array<string>();
			for (let item of this.friendArr) {
				idArr.push(item.friendId);
			}
			ChatRequest.sendInviteToGroup(this.groupId, idArr);
			this.closePanel();
		}

		public onConfirmRemove() {
			let idArr: Array<string> = new Array<string>();
			for (let item of this.friendArr) {
				idArr.push(item.friendId);
			}
			ChatRequest.sendRemoveFromGroup(this.groupId, idArr);
			this.closePanel();
		}

		private closePanel() {
			PopUpPanel.removePopPanel(this);
		}
	}
}