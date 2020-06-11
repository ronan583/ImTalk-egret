module dliyun {
	export class Http {
		private loader: egret.URLLoader = new egret.URLLoader();
		private variables: egret.URLVariables;
		private httpReq: egret.HttpRequest = new egret.HttpRequest();;

		static create(): Http {
			return new Http();
		}
		success(handle: Function, thisObj: any = null): Http {
			this.httpReq.addEventListener(egret.Event.COMPLETE, function (e: egret.Event): void {
				var loader = <egret.HttpRequest>e.currentTarget;
				egret.log("req success " + loader.response);
				handle.call(thisObj, loader.response);
			}, thisObj);
			return this;
		}
		error(handle: Function, thisObj: any = null): Http {
			this.httpReq.addEventListener(egret.IOErrorEvent.IO_ERROR, handle, thisObj);
			return this;
		}
		add(source): Http {
			if (!this.variables) {
				this.variables = new egret.URLVariables();
			}
			this.variables.decode(source);
			return this;
		}
		dataFormat(dataFormat: string): Http {
			// this.httpReq. = dataFormat;
			return this;
		}
		get(url: string) {
			this.httpReq.timeout = 2000;
			this.httpReq.open(url)
			this.httpReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			this.httpReq.send();
			egret.log("requesrt " + url);
		}
		post(url: string) {
			var req = new egret.URLRequest(url);
			req.method = egret.URLRequestMethod.POST;
			this.variables && (req.data = this.variables);
			this.loader.load(req);
		}


		public static requestFriendInfo(id: string, compFunc: Function, obj: any) {
			var userToken: string = UserData.instance.userInfo.accessToken;
			var params: string = "?uid=" + id;
			var req: egret.URLRequest = new egret.URLRequest();
			req.method = egret.URLRequestMethod.GET;
			req.url = Global.findUserUrl + params;
			req.requestHeaders.push(new egret.URLRequestHeader("Content-Type", "application/x-www-form-urlencoded"));
			req.requestHeaders.push(new egret.URLRequestHeader("x-access-token", userToken));

			var loader: egret.URLLoader = new egret.URLLoader();
			loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
			loader.addEventListener(egret.Event.COMPLETE, compFunc, obj)
			loader.addEventListener(egret.IOErrorEvent.IO_ERROR, function () {
				console.error("------error");
			}, this)
			loader.load(req);
		}
	}
}