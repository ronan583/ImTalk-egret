module dliyun {

    export class UserData {
        private static _instance: UserData;

        static get instance(): UserData {
            if (!this._instance) {
                this._instance = new UserData();
            }
            return this._instance;
        }
        public userInfo: UserInfo = null;
        public userId : number = null ;

        public setUserInfoData(data: any): void {
            if (this.userInfo == null) {
                this.userInfo = new UserInfo();
            }
            this.userInfo.id = data.id;
            this.userId = data.id;
            if (data.avatar.indexOf("http") == 0) {
                this.userInfo.avatar = data.avatar;
            } else {
                this.userInfo.avatar = Global.imageUrl + data.avatar;
            }
            this.userInfo.nickName = data.nickName;
            this.userInfo.gender = 0;
            this.userInfo.accessToken = data.accessToken;
            this.userInfo.loginTime = data.loginTime;
            var userJsonString: string = JSON.stringify(this.userInfo);
            NativeApi.setLocalData(LocalEnumName.USER_BASE_INFO, userJsonString);
        }

        public updateHead(compFunc?: Function): void {
            if (this.userInfo == null) {
                this.getUserInfoData();
            }
            if (this.userInfo.headTexture == null) {
                RES.getResByUrl(this.userInfo.avatar, function (texture: egret.Texture) {
                    this.userInfo.headTexture = texture;
                    compFunc(texture);
                }, this, RES.ResourceItem.TYPE_IMAGE);
            } else {
                compFunc(this.userInfo.headTexture);
            }
        }

        public getUserInfoData(): UserInfo {
            if (this.userInfo == null) {
                var userJsonString: string = NativeApi.getLocalData(LocalEnumName.USER_BASE_INFO);
                if (userJsonString != null) {
                    var localJson: JSON = JSON.parse(userJsonString);
                    this.setUserInfoData(localJson);
                }
            }
            return this.userInfo;
        }
    }

    //用户基本信息
    export class UserInfo {
        public id: number;//id
        public avatar: string;//用户头像地址
        public headTexture: egret.Texture;//头像
        public nickName: string;//昵称
        public gender: number;//性别
        public accessToken: string;//tonken
        public loginTime: number;//登陆时间
    }

}