module dliyun {
	export class IMEvent extends egret.Event{
		public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
			super(type, bubbles, cancelable);
		}

		public static DATA_EVENTTEST: string = "DATA_EVENTTEST";
	}
}