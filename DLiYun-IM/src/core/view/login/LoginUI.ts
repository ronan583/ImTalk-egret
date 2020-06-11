/**
 * 登陆界面
 */
module dliyun {

    export class LoginUI extends eui.Component {
        public constructor(data: any) {
            super();
            this.skinName = "resource/eui_skins/login/LoginUISkin.exml";
            //创建二维码
            var qrInfo: egret.Sprite = qr.QRCode.create(data.info, 200, 200);
            this.qrGruop.removeChildren();
            this.qrGruop.addChild(qrInfo);
        }
        public qrGruop: eui.Group;

        public clearBtn0: eui.Button;
        public clearBtn: eui.Button;
        public testEdit: eui.EditableText;
        public loginLabel: eui.Label;

        protected childrenCreated(): void {
            super.childrenCreated();
            this.clearBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClearData, this);
            this.clearBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clearOldData, this);
            // this.clearBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.testIDB, this);
            // this.clearBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.testIDB1, this);
            egret.startTick(this.updateScale, this);
        }

        private updateScale(timestamp: number): boolean {
            this.width = this.stage.stageWidth;
            this.height = this.stage.stageHeight;
            return false;
        }

        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }

        public onClearData(): void {
            // NativeApi.clearLocalData();
            IndexedDB.instance.deleteDB();
        }

        public stringSizeTest(): void {
            let text = this.testEdit.text;
            console.log("字符串长度96尺寸为：", CommonUtil.sizeOf(text));
        }

        public removeFromStage(): void {
            egret.stopTick(this.updateScale, this);
        }

        public clearOldData(){
            NativeApi.clearLocalData();
        }





        ///////////////test indexdb
        private testdata = [
            {
                uuid: "100000", chatId: '2000', content: "xxxxx",
                msgType: 0, timeline: 300000000, friendId: 20000,
                isRead: true, isSelf: true
            }
            , {
                uuid: '100001', chatId: '20001', content: "xxxxx",
                msgType: 0, timeline: 300000001, friendId: 20002,
                isRead: true, isSelf: false
            }
            , {
                uuid: '100002', chatId: '20002', content: "xxxxx",
                msgType: 0, timeline: 300000002, friendId: 20002,
                isRead: true, isSelf: false
            }
            , {
                uuid: '100003', chatId: '20001', content: "xxxxx",
                msgType: 0, timeline: 300000007, friendId: 20002,
                isRead: true, isSelf: false
            }
            , {
                uuid: '100004', chatId: '20001', content: "xxxxx",
                msgType: 0, timeline: 300000004, friendId: 20002,
                isRead: true, isSelf: false
            }
            , {
                uuid: '100005', chatId: '20002', content: "xxxxx",
                msgType: 0, timeline: 300000005, friendId: 20002,
                isRead: true, isSelf: false
            }
            , {
                uuid: '100006', chatId: '20002', content: "xxxxx",
                msgType: 0, timeline: 300000003, friendId: 20002,
                isRead: true, isSelf: false
            }
            , {
                uuid: '100007', chatId: '20001', content: "xxxxx",
                msgType: 0, timeline: 300000012, friendId: 20002,
                isRead: true, isSelf: false
            }
            , {
                uuid: '100008', chatId: '20001', content: "xxxxx",
                msgType: 0, timeline: 300000011, friendId: 20002,
                isRead: true, isSelf: false
            }
            , {
                uuid: '100009', chatId: '20001', content: "xxxxx",
                msgType: 0, timeline: 300000014, friendId: 20002,
                isRead: true, isSelf: false
            }
            , {
                uuid: '100010', chatId: '20001', content: "xxxxx",
                msgType: 0, timeline: 300000008, friendId: 20002,
                isRead: true, isSelf: false
            }
            , {
                uuid: '100011', chatId: '20001', content: "xxxxx",
                msgType: 0, timeline: 300000010, friendId: 20002,
                isRead: true, isSelf: false
            }
            , {
                uuid: '100012', chatId: '20003', content: "xxxxx",
                msgType: 0, timeline: 300000012, friendId: 20002,
                isRead: true, isSelf: false
            }
        ];

        private deleteUuidArr = [
            100000, 100001
        ]
        public createIDB() {
            IndexedDB.instance.openDB();
        }
        public testIDB() {
            // IndexedDB.instance.addChat(this.testdata);
        }

        public testIDB1() {
            // IndexedDB.instance.getAllByChatId(20001, 0, 5);
            // IndexedDB.instance.getAllLastChat();
            // IndexedDB.instance.checkChatLength(20001, 8, ()=>{
            //     console.log("------20001的消息大于10");
            // }, this)
            // IndexedDB.instance.add([{
            //     uuid: 100012, chatId: 20003, content: "xxxxx",
            //     msgType: 0, timeline: 300000012, friendId: 20002,
            //     isRead: true, isSelf: false
            // }]);
            // IndexedDB.instance.deleteUserStore();
            IndexedDB.instance.deleteChat("20001")
        }

        public testIDB2() {
            // IndexedDB.instance.delete(IndexedDB.instance.tableName, );
        }
    }
}