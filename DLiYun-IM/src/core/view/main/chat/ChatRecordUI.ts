/**
 * 主界面
 */
module dliyun {

	export class ChatRecordUI extends eui.Component {
		public constructor() {
			super();
			this.skinName = "resource/eui_skins/main/chat/ChatRecordUISkin.exml";
		}

		public selectId: string;

		public recordListId: eui.List;
		public scroller: eui.Scroller;
		public addBtn: eui.Image;

		public partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			// console.warn("---------ChatRecordUI created");
			// // this.initScale();
			this.addBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.addBtnClik, this);

			if (this.scroller.horizontalScrollBar != null) {
				this.scroller.horizontalScrollBar.autoVisibility = false;
				this.scroller.horizontalScrollBar.visible = false;
				this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
			}
			if (this.scroller.verticalScrollBar != null) {
				this.scroller.verticalScrollBar.autoVisibility = false;
				this.scroller.verticalScrollBar.visible = false;
			}
		}

		public initScale() {
			this.scroller.height = GameConfig.curHeight() - this.scroller.y;
		}

		private getImgToBase64(url) { //将图片转换为Base64
			var canvas = document.createElement('canvas'),
				ctx = canvas.getContext('2d'),
				img = new Image;
			img.crossOrigin = 'Anonymous';
			img.onload = function () {
				canvas.height = img.height;
				canvas.width = img.width;
				ctx.drawImage(img, 0, 0);
				var dataURL = canvas.toDataURL('image/png');
				console.log(dataURL);
				canvas = null;
			};
			img.src = url;
		}

		public show(id: string = ""): void {
			//refresh后，取recordInfoList数据
			this.refresh(()=>{
				var recordInfoList: Array<RecordInfo> = ChatRecordData.instance.recordCacheData;
				var selectChatId: string = null;
				var selectType: RelationType;
				if(recordInfoList == null) {
					console.log("record无数据");
				} else {
					if (recordInfoList.length > 0) {
						selectChatId = recordInfoList[0].chatId;
						selectType = recordInfoList[0].chatType;
					}

					let selectIndex: number;
					if (id == "") {
						selectIndex = 0;
						if (recordInfoList.length > 0) {
							UIInfo.chatRecordSelectId = recordInfoList[0].chatId;
						}
					} else {
						for (let info of recordInfoList) {
							if (info.chatId == id) {
								selectIndex = recordInfoList.indexOf(info);
								selectChatId = info.chatId;
								UIInfo.chatRecordSelectId = selectChatId;
								selectType = info.chatType;
							}
						}
					}
					this.recordListId.selectedIndex = selectIndex;//设置默认选中项
					this.recordListId.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.selectItemTap, this);
					let chatData: any = {
						"chatId": selectChatId,
						"chatType": selectType
					}
					AppFacade.getInstance().sendNotification(SysNotify.SHOW_FRIEND_MESSAGE_RIGHT, chatData);
					this.updateUnread();
				}
			}, this);
		}

		public refresh(compFunc?: Function, funcObj?) {
			IndexedDB.instance.getAllLastChat(function () {
				console.warn("=========== refresh");
				var recordInfoList: Array<RecordInfo> = ChatRecordData.instance.recordCacheData;
				var collection = new eui.ArrayCollection();
				if(recordInfoList == null) {
					console.log("record无数据");
				} else {
					for (let info of recordInfoList) {
						var chatTime: string = info.timeDate;
						var chatContent: string = CommonUtil.omittStr(info.content, 23);
						var chatName: string;
						if(info.chatType == 0){
							let friendData = FriendData.instance.getFriendInfo(info.chatId);
							if(friendData != null){
								chatName = CommonUtil.omittStr(friendData.nickName, 15);
							}
						} else {
							let groupData = GroupData.instance.getGroupInfo(info.chatId);
							if(groupData != null){
								chatName = CommonUtil.omittStr(groupData.name, 15);
							}
						}
						//todo
						// let unread = ChatRecordData.instance.getChatUnreadCount(info.chatId, info.chatType);
						collection.addItem({
							"id": info.chatId, "headImg": "", "nickName": chatName, "rightTxt": chatTime,
							"bottomTxt": chatContent, "chatType": info.chatType, "isOnline": info.isOnline, 
							/* todo "unread": unread*/
						});
						if (info.chatId == UIInfo.chatRecordSelectId) {
							this.recordListId.selectedIndex = recordInfoList.indexOf(info);
						}
					}
					this.recordListId.dataProvider = collection;
					this.recordListId.itemRenderer = ChatRecordList;

					//todo
					// AppFacade.getInstance().sendNotification(SysNotify.UPDATE_UNREAD_COUNT_TOTAL);
				}
				if(compFunc){
					compFunc.call(funcObj);
				}
			}, this);
			
			// var recordInfoList: Array<RecordInfo> = dliyun.ChatRecordData.instance.getChatAll();
			// var collection = new eui.ArrayCollection();

			// for (let info of recordInfoList) {
			// 	var chatTime: string = info.timeDate;
			// 	var chatContent: string = CommonUtil.omittStr(info.content, 23);
			// 	var chatName: string = CommonUtil.omittStr(info.name, 15);
			// 	let unread = ChatRecordData.instance.getChatUnreadCount(info.chatId, info.chatType);
			// 	collection.addItem({ 
			// 		"id": info.chatId, "headImg": "", "nickName": chatName, "rightTxt": chatTime, 
			// 		"bottomTxt": chatContent, "chatType": info.chatType, "isOnline": info.isOnline, "unread": unread
			// 	});
			// 	if (info.chatId == UIInfo.chatRecordSelectId) {
			// 		this.recordListId.selectedIndex = recordInfoList.indexOf(info);
			// 	}
			// }
			// this.recordListId.dataProvider = collection;
			// this.recordListId.itemRenderer = ChatRecordList;

			// AppFacade.getInstance().sendNotification(SysNotify.UPDATE_UNREAD_COUNT_TOTAL);
		}

		public getChatByIndex(index: number): string {
			let chatId: string;
			if (this.recordListId && index > 0) {
				chatId = this.recordListId.dataProvider[index].id;
			}
			return chatId;
		}

		public selectItemTap(event: eui.ItemTapEvent) {
			var info: any = this.recordListId.getChildAt(this.recordListId.selectedIndex);
			UIInfo.chatRecordSelectId = info.data.id;
			let chatData: any = {
				"chatId": info.data.id,
				"chatType": info.data.chatType
			}
			AppFacade.getInstance().sendNotification(SysNotify.SHOW_FRIEND_MESSAGE_RIGHT, chatData);
			this.updateUnread();
		}

		public addBtnClik() {
			let point = this.localToGlobal(this.addBtn.x + this.addBtn.width / 2, this.addBtn.y + this.addBtn.height / 2);
			PopUpPanel.addPopPanel(new PopMenu(), point.x, point.y);
		}

		public updateUnread() {
			egret.setTimeout(this.refresh, this, 400);
			// this.refresh();
		}
	}
}