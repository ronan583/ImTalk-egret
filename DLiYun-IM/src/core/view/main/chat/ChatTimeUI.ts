/**
 * 主界面
 */
module dliyun {

    export class ChatTimeUI extends eui.Component {

        private timeLabel: eui.Label;

        public constructor() {
            super();
            this.skinName = "resource/eui_skins/main/chat/dialogue/ChatTimeUISkin.exml";
        }

        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }

        public showTime(timeStamp: number): void{
            this.timeLabel.text = CommonUtil.TimeStampToDateHM(timeStamp);
        }
    }
}