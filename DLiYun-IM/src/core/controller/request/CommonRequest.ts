/**
  * All Rights Reserved. 
  */

module CommonRequest {
    export var message;
    /**
        * 初始化
        * Create a game scene
        */
    export function init(): void {
        load("resource/net/Common.proto", (err: any, root: any) => {
            message = root.Common;
        });
    }

    export function getQRCodeInfo(uint8: any): any {
        var info: any = message.QRCodeInfo;
        var data: any = info.decode(uint8);
        return data;
    }
    export function getInfoMsg(uint8: any): any {
        var info: any = message.InfoMsg;
        var data: any = info.decode(uint8);
        return data;
    }
     export function getHeartbeat(uint8: any): any {
        var info: any = message.Heartbeat;
        var data: any = info.decode(uint8);
        return data;
    }

    export function getUserOauthInfo(uint8: any): any {
        var info: any = message.OauthInfo;
        var data: any = info.decode(uint8);
        return data;
    }

    export function getUserReconnect(uint8: any): any {
        var info: any = message.UserReconnect;
        var data: any = info.decode(uint8);
        return data;
    }

    export function sendUserReconnect() {
        var heartbeat: any = message.UserReconnect;
        var userInfo: dliyun.UserInfo = dliyun.UserData.instance.getUserInfoData();
        if (userInfo == null) {
            return;
        }
        var sendMesage: any = {
            "id": userInfo.id,
            "accessToken": userInfo.accessToken,
            "operatingSystem": egret.Capabilities.os
        }
        var sendBuffer: any = heartbeat.encode(heartbeat.create(sendMesage)).finish();
        SocketManager.sendMessage(25, sendBuffer);
    }

    export function sendHeartbeat() {
        var heartbeat: any = message.Heartbeat;
        var sendMesage: any = {
            "timeline": new Date().getTime(),
            "operatingSystem": egret.Capabilities.os
        }
        var sendBuffer: any = heartbeat.encode(heartbeat.create(sendMesage)).finish();
        SocketManager.sendMessage(0, sendBuffer);
    }

    export function sendLogout(){
        var sendBuffer: any = null;
        SocketManager.sendMessage(1, sendBuffer);
    }

    /**
     * 使用框架内部加载外部proto文件
     * @param  {any} url proto文件路径 也可以是路径数组（可包含多条路径）
     * @param  {any} options (err: any, root: any) => {}加载完成后回调
     * @param  {any} callback=null
     * @returns void
     */
    export function load(url: any, options, callback = null): void {
        let self: any = new protobuf.Root();
        let queued: number = 0;
        let path: string;
        if (typeof options === "function") {
            callback = options;
            options = undefined;
        }
        let finish = (err, root) => {
            if (!callback || queued) return;
            callback(err, root);
        }
        let process = (filename, source) => {
            self.files.push(filename);
            let parsed = protobuf.parse(source, self, options), resolved;
            if (parsed.imports) {
                queued += parsed.imports.length;
                for (let i = 0; i < parsed.imports.length; ++i) {
                    if (resolved = self.resolvePath(path, parsed.imports[i])) {
                        let str: any = resolved.slice(resolved.lastIndexOf("/") + 1, resolved.length).replace(".", "_");
                        if (!RES.getRes(str)) {
                            RES.getResByUrl(resolved, function (source_: any) {
                                process(resolved, source_);
                                --queued;
                                finish(null, self);
                            }, this, RES.ResourceItem.TYPE_TEXT)
                        } else {
                            process(resolved, RES.getRes(str));
                            --queued;
                        }
                    }
                }
            }
            if (parsed.weakImports) {
                queued += parsed.imports.length;
                for (let i = 0; i < parsed.weakImports.length; ++i) {
                    if (resolved = self.resolvePath(path, parsed.weakImports[i])) {
                        let str: any = resolved.slice(resolved.lastIndexOf("/") + 1, resolved.length).replace(".", "_");
                        if (!RES.getRes(str)) {
                            RES.getResByUrl(resolved, function (source_: any) {
                                process(resolved, source_);
                                --queued;
                                finish(null, self);
                            }, this, RES.ResourceItem.TYPE_TEXT);
                        } else {
                            process(resolved, RES.getRes(str));
                            --queued;
                        }
                    }
                }
            };
            finish(null, self);
        }

        if (typeof url === "string") {
            path = url.slice(0, url.lastIndexOf("/") + 1);
            RES.getResByUrl(url, function (source_: any) {
                process(url, source_);
            }, this, RES.ResourceItem.TYPE_TEXT);
        } else {
            for (let i = 0; i < url.length; i++) {
                RES.getResByUrl(url[i], function (source_: any) {
                    let tempurl: string = url[i];
                    path = tempurl.slice(0, tempurl.lastIndexOf("/") + 1);
                    process(tempurl, source_);
                }, this, RES.ResourceItem.TYPE_TEXT);
            }
        }
    }
}
