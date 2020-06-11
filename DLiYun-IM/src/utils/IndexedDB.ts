class IndexedDB {
	private static _instance: IndexedDB;
	public static get instance(): IndexedDB {
		if (!this._instance) {
			this._instance = new IndexedDB();
		}
		return this._instance;
	}

	public dbName = "IMChatDatabase";
	public tableName = "chatRecord";

	public LASTEST_VERSION = 1;

	public table = {
		Keys: {
			"userId": false,
			"chatId": false,
			"timeline": false,
			"msgType": false,
			"chatType": false,
			"isRead": false,
			"friendId": false,
			"isSelf": false,
			"isSendOk": false
		},
		autoIncrement: false,
		MainKey: "uuid"
	}

	public static objParsing(obj) {
		var result: any;
		for (let k in obj) {
			result.val = obj[k];
			result.key = k;
		}
		return result;
	}
	public DBError() {
		console.log('数据库链接出现错误');
	}

	public newStore(db) {
		var objectStore = db.createObjectStore(this.tableName, {
			keyPath: this.table.MainKey,
			autoIncrement: this.table.autoIncrement
		});
		console.log("主键：" + this.table.MainKey + "\n是否自增：" + this.table.autoIncrement);
		//添加索引
		for (let i in this.table.Keys) {
			console.log("字段：" + i);
			objectStore.createIndex(i, i, { unique: !!this.table.Keys[i] });
		}
		// objectStore.createIndex()
		console.log("---新建数据库成功---");
	}

	public openDB() {
		var request;
		var self = this;
		request = window.indexedDB.open(this.dbName, this.LASTEST_VERSION + 1);

		request.onerror = this.DBError;

		request.onsuccess = (event) => {
			var db = request.result;
		}

		request.onupgradeneeded = (event) => {
			var db = event.target.result;
			self.newStore(db);
		}

	}

	public addChat(relation, item, compFunc?, funcObj?) {
		var self = this;
		var userId = dliyun.UserData.instance.userId, uuid = item.uuid, content = item.content,
			msgType = item.msgType, chatType = relation, isSendOK = item.isSendOK, timeline = item.timeline,
			isRead = false, friendId, chatId, isSelf;
		if (msgType == 6) {
			friendId = "system000";
			isSelf = false;
			if (chatType == 1) {     //当前系统消息只能是群组消息
				chatId = item.groupId + "";
			}
		} else {
			switch (chatType) {
				case dliyun.RelationType.friend:
					friendId = (item.from == dliyun.UserData.instance.getUserInfoData().id) ? item.to : item.from;
					isSelf = (item.from == dliyun.UserData.instance.getUserInfoData().id);
					chatId = isSelf ? item.to : item.from;
					chatId = chatId + "";
					break;
				case dliyun.RelationType.group:
					chatId = item.groupId + "";
					friendId = item.from.id + "";
					isSelf = (item.from.id == dliyun.UserData.instance.getUserInfoData().id);
					break;
			}
		}

		var data = {
			uuid: uuid, userId: userId, chatId: chatId, content: content, msgType: msgType, chatType: chatType,
			friendId: friendId, isSelf: isSelf, timeline: timeline, isRead: isRead, isSendOK: isSendOK
		}
		var request;
		var self = this;
		request = window.indexedDB.open(this.dbName, this.LASTEST_VERSION + 1);
		request.onerror = this.DBError;
		request.onupgradeneeded = (event) => {
			var db = event.target.result;
			if (!db.objectStoreNames.contains(this.tableName)) {
				self.newStore(db);
			}
		}		
		request.onsuccess = function (event) {
			var db = event.target.result;
			var transaction = db.transaction([self.tableName], "readwrite");
			transaction.onerror = function (event) {
				console.error(new Error("transaction 错误"));
			};
			transaction.onabort = function () {
				console.log("中断");
			}
			transaction.oncomplete = function () {
				console.log("添加数据成功");
				if (compFunc) {
					compFunc.call(funcObj);
				}
			}

			var objectStore = transaction.objectStore(self.tableName);
			var index = objectStore.index("chatId"),
				range = IDBKeyRange.only(chatId);
			// 添加数据前清除所有empty类型消息
			index.openCursor(range, "next").onsuccess = (event) => {
				var cursor = event.target.result;
				if (cursor) {
					if (cursor.value.msgType == 10) {
						cursor.delete();
					}
					cursor.continue();
				} else {
					//添加进db
					let req = objectStore.put(data);
					req.onsuccess = function () {
						console.log("成功添加一条数据");
					};
					req.onabort = function () {
						console.log('数据添加中断');
					};
					req.onerror = function () {
						console.log('添加一条数据失败');
					};
				}
			}
		}
	}

	public addStartChat(relation, chatId, compFunc?, funcObj?) {
		if (dliyun.FriendData.instance.getFriendInfo(chatId) == null
			&& dliyun.GroupData.instance.getGroupInfo(chatId) == null) {
			console.error("----------好友不存在");
			return;
		}
		var msgType = 10,
			chatType = relation,
			timeline = new Date().getTime();
		var data = {
			uuid: NativeApi.uuid(),
			userId: dliyun.UserData.instance.userId,
			chatId: chatId,
			msgType: msgType,
			chatType: chatType,
			timeline: timeline
		}
		var request;
		var self = this;
		request = window.indexedDB.open(this.dbName, this.LASTEST_VERSION + 1);
		request.onupgradeneeded = (event) => {
			var db = event.target.result;
			if (!db.objectStoreNames.contains(this.tableName)) {
				self.newStore(db);
			}
		}		
		request.onerror = this.DBError;
		request.onsuccess = function (event) {
			var db = event.target.result;
			var transaction = db.transaction([self.tableName], "readwrite");
			transaction.onerror = function (event) {
				console.error(new Error("transaction 错误"));
			};
			transaction.onabort = function () {
				console.log("中断");
			}
			transaction.oncomplete = function () {
				console.log("开启新消息成功");
				if (compFunc) {
					compFunc.call(funcObj);
				}
				db.close();
			}

			var objectStore = transaction.objectStore(self.tableName);
			var index = objectStore.index("chatId"),
				range = IDBKeyRange.only(chatId);
			// 添加数据前清除所有empty类型消息
			index.openCursor(range, "next").onsuccess = (event) => {
				var cursor = event.target.result;
				if (cursor) {
					if (cursor.value.msgType == 10) {
						cursor.delete();
					}
					cursor.continue();
				} else {
					//添加进db
					let req = objectStore.put(data);
					req.success = function () {
						console.log('数据添加完成');
					}
					req.onabort = function () {
						console.log('数据添加中断');
					};
					req.onerror = function () {
						console.log('添加一条数据失败');
					};
				}
			};
		}
	}

	public delete(delUuid, compFunc?, funcObj?) {
		var request;
		var self = this;
		request = window.indexedDB.open(this.dbName, this.LASTEST_VERSION + 1);
		request.onupgradeneeded = (event) => {
			var db = event.target.result;
			if (!db.objectStoreNames.contains(this.tableName)) {
				self.newStore(db);
			}
		}	
		request.onerror = this.DBError;
		request.onsuccess = function (event) {
			var objectStore,
				transaction,
				db = event.target.result;
			transaction = db.transaction([self.tableName], "readwrite");
			objectStore = transaction.objectStore(self.tableName);
			objectStore.delete(delUuid);

			transaction.onerror = (event) => {
				console.log("删除失败" + event.target.errorCode);
			}
			transaction.onabort = () => {
				//事务中断处理
				alert('处理中断');
			};
			transaction.oncomplete = () => {
				if (delUuid instanceof Array) {
					console.log("删除" + delUuid.join(", ") + "成功");
				} else {
					console.log("删除" + delUuid + "成功");
				}
				if (compFunc) {
					compFunc.call(funcObj);
				}
			}
		}
	}

	public deleteChat(chatId, compFunc?, funcObj?) {
		var request;
		var self = this;
		request = window.indexedDB.open(this.dbName, this.LASTEST_VERSION + 1);
		request.onupgradeneeded = (event) => {
			var db = event.target.result;
			if (!db.objectStoreNames.contains(this.tableName)) {
				self.newStore(db);
			}
		}
		request.onerror;
		request.onsuccess = (event) => {
			var db = event.target.result,
				transaction = db.transaction([this.tableName], "readwrite"),
				objectStore = transaction.objectStore(this.tableName),
				index = objectStore.index("userId");
			var range = IDBKeyRange.only(dliyun.UserData.instance.userId);
			index.openCursor(range, "next").onsuccess = (event) => {
				var cursor = event.target.result;
				if (cursor) {
					let value = cursor.value;
					if (value.chatId == chatId) {
						cursor.delete();
					}
					cursor.continue();
				} else {
					// console.log(chatId + "删除完成");
				}
			}
			transaction.oncomplete = () => {
				console.log("删除完成");
				if (compFunc) {
					compFunc.call(funcObj);
				}
			};
		}
	}

	public deleteUserStore() {
		var request;
		var self = this;
		request = window.indexedDB.open(this.dbName, this.LASTEST_VERSION + 1);
		request.onupgradeneeded = (event) => {
			var db = event.target.result;
			if (!db.objectStoreNames.contains(this.tableName)) {
				self.newStore(db);
			}
		}
		request.onerror = this.DBError;
		request.onsuccess = (event) => {
			var transaction;
			var db = event.target.result;
			console.log(self.tableName);
			transaction = db.transaction([self.tableName], "readwrite");
			var objectStore = transaction.objectStore(self.tableName);
			var index = objectStore.index("userId");
			var range = IDBKeyRange.only(dliyun.UserData.instance.userId);
			index.openCursor(range, "next").onsuccess = (event) => {
				var cursor = event.target.result;
				if (cursor) {
					cursor.delete();
					cursor.continue();
				} else {
					console.log("删除完成");
				}
			}

			transaction.onerror = (event) => {
				console.error("删除失败");
			}
			transaction.onabort = () => {
				//事务中断处理
				alert('处理中断');
			};
			transaction.oncomplete = () => {
				console.log("删除事务完成");
			}
		}
	}

	public deleteDB() {
		var DBDeleteRequest = window.indexedDB.deleteDatabase(this.dbName);
		DBDeleteRequest.onerror = function (event) {
			console.log('Error');
		};

		DBDeleteRequest.onsuccess = function (event) {
			console.log('delete db succeeded');
		};
	}

	public checkChatLength(chatId, checkLength, compFunc, funcObj) {
		var request;
		var self = this;
		request = window.indexedDB.open(this.dbName, this.LASTEST_VERSION + 1);
		request.onupgradeneeded = (event) => {
			var db = event.target.result;
			if (!db.objectStoreNames.contains(this.tableName)) {
				self.newStore(db);
			}
		}
		request.onsuccess = (event) => {
			let index = event.target.result.transaction([this.tableName]).objectStore(this.tableName).index("chatId");
			let req = index.getAll(chatId);
			req.onsuccess = () => {
				let length = req.result.length;
				if (length > checkLength) {
					compFunc.call(funcObj);
				}
			}
		}
	}

	public getAllByChatId(chatId, start, end, compFunc?, funcObj?) {
		var request;
		var self = this;
		request = window.indexedDB.open(this.dbName, this.LASTEST_VERSION + 1);
		request.onerror = this.DBError;
		request.onupgradeneeded = (event) => {
			var db = event.target.result;
			if (!db.objectStoreNames.contains(this.tableName)) {
				self.newStore(db);
			}
			console.log("数据库升级成功，版本为"+ db.version);
		}
		request.onsuccess = (event) => {
			var db = event.target.result;
			console.log("数据库打开成功，版本为"+ db.version);
			var transaction = db.transaction([this.tableName], "readwrite"),
				objectStore = transaction.objectStore(this.tableName),
				index = objectStore.index("userId");
			var range = IDBKeyRange.only(dliyun.UserData.instance.userId),
				chatArr = new Array<any>();
			index.openCursor(range, "next").onsuccess = (event) => {
				let cursor = event.target.result;
				if (cursor) {
					let value = cursor.value;
					if (value.chatId == chatId) {
						chatArr.push(value);
					}
					cursor.continue();
				} else {
					if (chatArr[0] == null) {
						console.log("getall无数据");
						// return;
					}
					chatArr.sort((info1, info2) => {
						return (info1.timeline - info2.timeline);
					});
					console.log("数据取完，this id chat is：", chatArr);

					let length = chatArr.length,
						top = length - end,
						bottom = length - start;
					if (top < 0) {
						top = 0;
					}
					dliyun.ChatRecordData.instance.setChatCacheData(chatArr.slice(top, bottom));
					if (compFunc) {
						compFunc.call(funcObj);
					}
				}
			}

			transaction.oncomplete = () => {
				console.log("事务完成，数据库关闭");
			};
			transaction.onabort = () => {
				console.log("获取中断")
			};
			transaction.onerror = () => {
				console.log("获取出错");
			};
		}
	}

	public getAllLastChat(compFunc?, funcObj?) {
		var request;
		var self = this;
		request = window.indexedDB.open(this.dbName, this.LASTEST_VERSION + 1);
		request.onerror;
		request.onupgradeneeded = (event) => {
			var db = event.target.result;
			console.log("数据库升级成功，版本为"+ db.version);
			if (!db.objectStoreNames.contains(this.tableName)) {
				self.newStore(db);
			}
		}
		request.onsuccess = (event) => {
			var db = event.target.result;
			console.log("数据库打开成功，版本为"+ db.version);
			var transaction = db.transaction([self.tableName], "readwrite"),
				objectStore = transaction.objectStore(self.tableName),
				index = objectStore.index("chatId");

			// var range = IDBKeyRange.only(dliyun.UserData.instance.userId);
			var chatArr = new Array<any>();
			var prevIdKey = 0;
			var latestChat;
			var isStart = true;
			index.openCursor(null, "next").onsuccess = (event) => {
				var cursor = event.target.result;
				if (cursor) {
					let idKey = cursor.value.chatId;
					let value = cursor.value;
					let timeline = cursor.value.timeline
					// console.log("key:", cursor.key);
					// console.log("value:", cursor.value);
					// console.log("timeline:", timeline);
					if (value.userId != dliyun.UserData.instance.userId) {
						cursor.continue();
					} else {
						if (isStart) {
							latestChat = value;
							prevIdKey = idKey;
							isStart = false;
						}
						if (idKey != prevIdKey) {
							prevIdKey = idKey;
							chatArr.push(latestChat);
							latestChat = value;
						} else {
							if (value.timeline > latestChat.timeline) {
								latestChat = value;
							}
						}
						cursor.continue();
					}
				} else {
					chatArr.push(latestChat);
					if (chatArr == null || chatArr[0] == null) {
						console.log("getall无数据");
						// return;
					}
					chatArr.sort((chat1, chat2) => { return (chat2.timeline - chat1.timeline); });
					console.log("数据取完，latest chat is：", chatArr);
					if (chatArr.length > 0) {
						dliyun.ChatRecordData.instance.setRecordCacheData(chatArr);
					}
					if (compFunc) {
						compFunc.call(funcObj);
					}
				}
			}
			transaction.oncomplete = () => {
				console.log("事务完成，数据库关闭");
			};
		}
	}
}


