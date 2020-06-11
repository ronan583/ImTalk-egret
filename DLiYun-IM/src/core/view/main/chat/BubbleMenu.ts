/**
 * 按钮
 */
module dliyun {

    export class BubbleMenu extends eui.Component {

        public copyBtn: eui.Button;
        public viewBtn: eui.Button;
        public delBtn: eui.Button;
        public cancelBtn: eui.Button;
        public downloadBtn: eui.Button;

        public btnGrp: eui.Group;

        public constructor() {
            super();
            this.skinName = "resource/eui_skins/main/chat/dialogue/BubbleMenuSkin.exml";
            this.copyBtn.visible = false;
            this.delBtn.visible = false;
            this.cancelBtn.visible = false;
            this.viewBtn.visible = false;
            this.btnGrp.removeChildren()
        }

        protected childrenCreated():void{
            super.childrenCreated();
        }

        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }

        public showViewBtn(){
            this.viewBtn.visible = true;
            this.btnGrp.addChild(this.viewBtn);
        }
        public showCopyBtn(){
            this.copyBtn.visible = true;
            this.btnGrp.addChild(this.copyBtn);  
        }
        public showDeleteBtn(){
            this.delBtn.visible = true;
            this.btnGrp.addChild(this.delBtn);            
        }
        public showRevokeBtn(){
            this.cancelBtn.visible = true;
            this.btnGrp.addChild(this.cancelBtn);            
        }
        public showDownloadBtn(){
            this.downloadBtn.visible = true;
            this.btnGrp.addChild(this.downloadBtn);
        }

    }
}