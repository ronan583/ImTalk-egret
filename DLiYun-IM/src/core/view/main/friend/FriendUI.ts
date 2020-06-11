/**
 * 联系人
 */
module dliyun {

    export class FriendUI extends eui.Component {
        public constructor() {
            super();
            this.skinName = "resource/eui_skins/main/friend/FriendUISkin.exml";
        }

        public friendListId: eui.List;
        public addBtn: eui.Image;
        public scroller: eui.Scroller;

        public newFriendBtn: eui.Button;

        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }
        protected childrenCreated(): void {
            super.childrenCreated();
            // this.initScale();
            // console.warn("---------FriendUI created");
            this.addBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.addBtnClik, this);
            this.newFriendBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.newFriendSelected, this);
            if (this.scroller.horizontalScrollBar != null) {
                this.scroller.horizontalScrollBar.autoVisibility = false;
                this.scroller.horizontalScrollBar.visible = false;
                this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            }
        }

        public initScale() {
            this.scroller.height = GameConfig.curHeight() - this.scroller.y;
        }

        //显示联系人
        public show(): void {
            var friendAll: Array<FriendInfo> = dliyun.FriendData.instance.getFriendAll();
            if (friendAll.length < 1) {
                AppFacade.getInstance().sendNotification(SysNotify.SHOW_FRIEND_INFO_RIGHT);
                return;
            }
            var collection = new eui.ArrayCollection();
            for (let info of friendAll) {
                let nickName = CommonUtil.omittStr(info.nickName, 17);
                collection.addItem({ "id": info.id, "nickName": nickName, "headImg": info.avatar, "type": ChatType.friend, "isOnline": info.isOnline });
            }
            this.friendListId.dataProvider = collection;
            this.friendListId.itemRenderer = FriendList;
            this.friendListId.selectedIndex = 0;//设置默认选中项
            this.friendListId.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.selectItemTap, this);
            //默认显示第一个
            let firstid = collection.getItemAt(0).id;
            AppFacade.getInstance().sendNotification(SysNotify.SHOW_FRIEND_INFO_RIGHT, firstid);
        }

        public addBtnClik(): void {
            let point = this.localToGlobal(this.addBtn.x + this.addBtn.width / 2, this.addBtn.y + this.addBtn.height / 2);
			PopUpPanel.addPopPanel(new PopMenu(), point.x, point.y);
        }

        public newFriendSelected(){
            this.hideListSelectImg();
            this.showNewFriendPanel();
        }

        public showNewFriendPanel(): void {
            AppFacade.getInstance().sendNotification(SysNotify.SHOW_NEW_FRIEND_RIGHT);
            
        }

        public selectItemTap() {
            let id = this.friendListId.selectedItem.id;
            // var friendInfo: any = this.friendListId.getChildAt(this.friendListId.selectedIndex);
            AppFacade.getInstance().sendNotification(SysNotify.SHOW_FRIEND_INFO_RIGHT, id);
        }

        public hideListSelectImg(){
            let num = this.friendListId.numChildren;
            for(let i = 0; i < num; i++){
                let obj:any = this.friendListId.getChildAt(i);
                if(obj instanceof FriendList){
                    obj.hideSelected();
                }
            }
        }
    }
}