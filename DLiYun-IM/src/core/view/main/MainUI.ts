/**
 * 主界面
 */
module dliyun {

    export class MainUI extends eui.Component {
        public constructor() {
            super();
            // this.skinName = "resource/eui_skins/main/MainUISkin.exml";
            // this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }

        public leftUI: LeftUI;
        public navigationUI: NavigationUI;
        public rightUI: RightUI;

        private prevWidth: number = 0;
        private prevHeight: number = 0;

        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
            // NativeApi.clearLocalData();
        }

        protected onAddToStage() {
            this.init();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.init();
            console.warn("---------MainUI created");
        }

        public init() {
            this.navigationUI = new NavigationUI();
            this.leftUI = new LeftUI();
            this.rightUI = new RightUI();

            this.addChild(this.navigationUI);
            this.addChild(this.leftUI);
            this.addChild(this.rightUI);

            console.log("create init chat content LeftUI")
            // this.initScale();
            egret.setTimeout(()=>{
                egret.startTick(this.updateScale, this)
            }, this, 200);
        }

        public initScale() {
            this.navigationUI.height = GameConfig.curHeight();
            this.rightUI.height = GameConfig.curHeight();
            this.leftUI.height = GameConfig.curHeight();
            this.rightUI.width = GameConfig.curWidth() - this.navigationUI.width - this.leftUI.width;

            this.leftUI.x = this.navigationUI.width;
            this.rightUI.x = this.leftUI.x + this.leftUI.width;
        }

        private updateScale(timestamp: number): boolean {
            if (this.stage) {
                if (GameConfig.curHeight() != this.prevHeight) {
                    this.navigationUI.height = GameConfig.curHeight();
                    this.rightUI.height = GameConfig.curHeight();
                    this.leftUI.height = GameConfig.curHeight();

                    this.leftUI.chatRecordUI.height = GameConfig.curHeight();
                    this.leftUI.friendUI.height = GameConfig.curHeight();
                    this.leftUI.groupUI.height = GameConfig.curHeight();

                    this.leftUI.chatRecordUI.scroller.height = this.leftUI.height - this.leftUI.chatRecordUI.scroller.y;
                    this.leftUI.friendUI.scroller.height = this.leftUI.height - this.leftUI.friendUI.scroller.y;
                    this.leftUI.groupUI.scroller.height = this.leftUI.height - this.leftUI.groupUI.scroller.y;

                    this.rightUI.friendInfoContent.height = GameConfig.curHeight();
                    this.rightUI.friendInfoContent.height = GameConfig.curHeight();
                    this.rightUI.groupContentUI.height = GameConfig.curHeight();
                    this.rightUI.newFriendUI.height = GameConfig.curHeight();                    

                    this.rightUI.chatContentUI.height = GameConfig.curHeight();
                    this.rightUI.friendInfoContent.height = GameConfig.curHeight();
                    this.rightUI.groupContentUI.height = GameConfig.curHeight();
                    this.rightUI.chatContentUI.uiGroup.height = GameConfig.curHeight();
                    this.rightUI.chatContentUI.scroller.height = GameConfig.curHeight() - this.rightUI.chatContentUI.editBg.height - 49 - 5;
                    this.rightUI.chatContentUI.scroller.y = 49;
                    this.rightUI.chatContentUI.chatSettingPanel.height = GameConfig.curHeight() - 49;


                    this.prevHeight = GameConfig.curHeight();

                    // console.log("=============================================");
                    // console.log("-------stage height: ", this.stage.stageHeight);
                    // console.log("-------prev height: ", this.prevHeight);
                    // console.log("-------stage width: ", this.stage.stageWidth);
                    // console.log("-------prev height: ", this.prevHeight);
                    // console.log("----------------------------------------------")
                    // console.log("-------clientHeight: ", document.body.clientHeight);
                    // console.log("-------clientWidth: ", document.body.clientWidth);
                    // console.log("-------innerHeight: ", window.innerHeight);
                    // console.log("-------innerWidth: ", window.innerWidth);
                    // console.log("-------screenheight: ", window.screen.height);
                    // console.log("-------screenwidth: ", window.screen.width);
                    // console.log("-------availHeight: ", window.screen.availHeight);
                    // console.log("-------availWidth: ", window.screen.availWidth);
                    // console.log("----------------------------------------------")
                    // console.log("-------NavigationUI height: ", this.navigationUI.height);
                    // console.log("-------leftUI height: ", this.leftUI.height);
                    // console.log("-------rightUI height: ", this.rightUI.height);
                    // console.log("-------navigationUI width: ", this.navigationUI.width);
                    // console.log("-------leftUI width: ", this.leftUI.width);
                    // console.log("-------rightUI width: ", this.rightUI.width);
                    // console.log("-------navigationUI x: ", this.navigationUI.x);
                    // console.log("-------leftUI x: ", this.leftUI.x);
                    // console.log("-------rightUI x: ", this.rightUI.x);
                }

                if (GameConfig.curWidth() != this.prevWidth) {
                    this.leftUI.x = this.navigationUI.width;
                    this.rightUI.x = this.leftUI.x + this.leftUI.width;

                    this.rightUI.width = GameConfig.curWidth() - this.navigationUI.width - this.leftUI.width;

                    this.rightUI.chatContentUI.width = this.rightUI.width;
                    this.rightUI.friendInfoContent.width = this.rightUI.width;
                    this.rightUI.groupContentUI.width = this.rightUI.width;
                    this.rightUI.newFriendUI.width = this.rightUI.width;
                    this.rightUI.chatContentUI.uiGroup.width = this.rightUI.width;
                    this.rightUI.chatContentUI.scroller.width = this.rightUI.width;
                    this.rightUI.chatContentUI.chatContentTxt.width = this.rightUI.width;

                    let num: number = this.rightUI.chatContentUI.chatRecordGroup.numChildren;
                    if (num > 0) {
                        for (let i = 0; i < num; i++) {
                            let obj: any = this.rightUI.chatContentUI.chatRecordGroup.getChildAt(i);
                            if (obj instanceof ChatBubbleSelfUI) {
                                obj.width = this.rightUI.width;
                            }
                            if (obj instanceof ChatBubbleOtherUI) {
                                obj.width = this.rightUI.width;
                            }
                            if (obj instanceof ChatTimeUI) {
                                obj.width = this.rightUI.width;
                            }
                            if (obj instanceof SystemMsgUI) {
                                obj.width = this.rightUI.width;
                            }
                        }
                    }
                    let num2 = this.rightUI.newFriendUI.newFriendListId.numChildren;
                    if(num2 > 0){
                        for(let i = 0; i < num2; i++){
                            let obj: any = this.rightUI.newFriendUI.newFriendListId.getChildAt(i);
                            if(obj instanceof NewFriendList){
                                obj.width = this.rightUI.newFriendUI.newFriendListId.width;
                            }
                        }
                    }

                    this.prevWidth = GameConfig.curWidth();
                }
            }

            return false;
        }
    }
}