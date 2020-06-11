/**
 * 网络公共类
 * by dily
 * (c) copyright 2014 - 2035
 * All Rights Reserved. 
 * 存放网络公共方法 
 * 注意：是同步请求，不是异步
 */
module SocketManager {

    var sock: egret.WebSocket = new egret.WebSocket();

    var isConnecting: boolean = false;

    //连接服务器
    export function connectServer(url: string) {
        if (this.isConnecting) return;
        if (this.sock) {
            if (this.sock.connected) return;
            this.sock.removeEventListener(egret.ProgressEvent.SOCKET_DATA, onReceiveMessage, this);
            this.sock.removeEventListener(egret.Event.CONNECT, onSocketOpen, this);
            this.sock.removeEventListener(egret.Event.CLOSE, onSocketClose, this);
            this.sock.removeEventListener(egret.IOErrorEvent.IO_ERROR, onSocketError, this);
        }
        egret.log('connect server : ' + url)
        this.sock = new egret.WebSocket();
        this.sock.type = "webSocketTypeBinary";
        this.sock.addEventListener(egret.ProgressEvent.SOCKET_DATA, onReceiveMessage, this);
        this.sock.addEventListener(egret.Event.CONNECT, onSocketOpen, this);
        this.sock.addEventListener(egret.Event.CLOSE, onSocketClose, this);
        this.sock.addEventListener(egret.IOErrorEvent.IO_ERROR, onSocketError, this);
        this.sock.connectByUrl(url);
    }

    export function onSocketError(e): void {
        egret.log("socket error " + e.message + '  ' + e.target.hashCode);
        this.isConnecting = false;
        egret.Ticker.getInstance().unregister(this.onHeartbeat, this);
        this.noticeReconnect();
    }

    //服务器断开
    export function onSocketClose(e): void {
        this.isConnecting = false;
        egret.Ticker.getInstance().unregister(this.onHeartbeat, this);
        egret.log('onSocketClose............' + '  ' + e.target.hashCode);
        this.noticeReconnect();
    }

    export function closeSocket(){
        this.isConnecting = false;
        egret.Ticker.getInstance().unregister(this.onHeartbeat, this);
        this.sock.close();
    }

    //连接成功返回
    export function onSocketOpen(e): void {
        this.sock = e.target;
        egret.log('onSocketOpen success ............' + '  ' + e.target.hashCode);
        if (dliyun.UserData.instance.userId && dliyun.UserData.instance.userId > 0) {
            console.log("发送重连+++++++++++++++++++++");
            CommonRequest.sendUserReconnect();
        } else {
            dliyun.AppFacade.getInstance().sendNotification(SysNotify.CONNECT_SERVER_SUCCESS);
            egret.log("请求二维码")
        }

        this.isReconect = false;
        this.isConnecting = false;
    }

    export function startHeartbeat() {
        egret.Ticker.getInstance().register(this.onHeartbeat, this);
    }

    //心跳
    var sendCont: number = 0;
    export function onHeartbeat(): void {
        sendCont++;
        if (sendCont >= 200) {
            CommonRequest.sendHeartbeat();
            sendCont = 0;
        }
    }

    var isReconect: boolean = false;
    export function noticeReconnect() {
        this.connectServer(Global.socketUrl + egret.Capabilities.os);
        this.isReconect = true;
    }

    //消息返回  
    export function onReceiveMessage(): void {
        var _arr: egret.ByteArray = new egret.ByteArray();
        this.sock.readBytes(_arr);
        var head = _arr.readShort();
        var mainId = _arr.readInt();
        if(mainId != 0){
            console.log("接收服务器协议" + mainId);
        }
        var length = _arr.readInt();
        var cmdDataBA: egret.ByteArray = new egret.ByteArray();
        _arr.readBytes(cmdDataBA);
        var uint8: Uint8Array = new Uint8Array(getUint8Array(cmdDataBA));
        dliyun.AppFacade.getInstance().sendNotification("Processor_" + mainId, uint8);
    }

    //向服务端发送消息
    export function sendMessage(mainId: number, msg: any): void {
        if (mainId != 0) {
            console.log("发送协议到服务器：" + mainId);
        }
        if (this.sock == null || !this.sock.connected) {
            // 重新连接
            this.noticeReconnect();
            egret.log("发送消息失败 sock not connected " + this.sock.hashCode)
            return;
        }
        var sendMsg: egret.ByteArray = new egret.ByteArray();
        sendMsg.writeShort(0x5D6B);
        sendMsg.writeInt(mainId);
        var data: egret.ByteArray = new egret.ByteArray(msg);
        sendMsg.writeInt(data.length);
        if (msg != null) {
            sendMsg._writeUint8Array(msg);
        }
        this.sock.writeBytes(sendMsg);
        this.sock.flush();
    }

    /**
    * 返回一个uintArray数据
    */
    export function getUint8Array(byte: egret.ByteArray): Array<number> {
        let data: Array<number> = [];
        for (let i: number = 0; i < byte.dataView.byteLength; i++) {
            data.push(byte.dataView.getUint8(i));
        }
        return data;
    }
}



