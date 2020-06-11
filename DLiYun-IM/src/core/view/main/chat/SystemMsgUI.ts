/**
 * 主界面
 */
module dliyun {

    export class SystemMsgUI extends eui.Component {

        private timeLabel: eui.Label;

        public constructor() {
            super();
            this.skinName = "resource/eui_skins/main/chat/dialogue/SystemMsgUISkin.exml";
        }

        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }

        public showMsg(msg: string): void{
            this.timeLabel.text = msg;
        }
    }
}