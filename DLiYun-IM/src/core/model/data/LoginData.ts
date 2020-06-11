module dliyun {
	export class LoginData {
		public constructor() {
		}
		private static _instance: LoginData;
		static get instance(): LoginData {
			if (!this._instance) {
				this._instance = new LoginData();
			}
			return this._instance;
		}

		public qrData: string;
	}
}