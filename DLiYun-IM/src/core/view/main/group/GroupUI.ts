/**
 * 联系人
 */
module dliyun {

    export class GroupUI extends eui.Component {
        public constructor() {
            super();
            this.skinName = "resource/eui_skins/main/group/GroupUISkin.exml";
        }

        public groupListId: eui.List;
        public addBtn: eui.Image;
        public scroller: eui.Scroller;

        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }
        protected childrenCreated(): void {
            super.childrenCreated();
            // console.warn("---------GroupUI created");
            // this.initScale();
            this.addBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.addBtnClik, this);
        }
        public initScale(){
			this.scroller.height = GameConfig.curHeight() - this.scroller.y;
		}

        //显示联系人
        public show(): void {
            var groupsAll: HashMap = dliyun.GroupData.instance.getGroupAll();
            var collection = new eui.ArrayCollection();
            var lastGroupId: string = null;
            for (let id of groupsAll.keys()) {
                var info: GroupInfo = groupsAll.get(id);
                let groupName = CommonUtil.omittStr(info.name, 17);
                collection.addItem({ "id": id, "nickName": groupName, "headImg": info.avatar, "userCount": info.userCount + "人" });
                if(lastGroupId == null){
                    lastGroupId = id;
                }
            }
            this.groupListId.dataProvider = collection;
            this.groupListId.itemRenderer = GroupList;
            this.groupListId.selectedIndex = 0;//设置默认选中项
            this.groupListId.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.selectItemTap, this);
            AppFacade.getInstance().sendNotification(SysNotify.SHOW_GROUP_INFO_RIGHT, lastGroupId);
        }

        public addBtnClik(): void {
            let point = this.localToGlobal(this.addBtn.x + this.addBtn.width / 2, this.addBtn.y + this.addBtn.height / 2);
			PopUpPanel.addPopPanel(new PopMenu(), point.x, point.y);
        }

        public selectItemTap() {
            // var groupInfo: any = this.groupListId.getChildAt(this.groupListId.selectedIndex);
            let id = this.groupListId.selectedItem.id;
            AppFacade.getInstance().sendNotification(SysNotify.SHOW_GROUP_INFO_RIGHT, id);
        }
    }
}