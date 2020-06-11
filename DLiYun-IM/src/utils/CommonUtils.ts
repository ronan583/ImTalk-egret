module CommonUtil {
    export function RandomRange(min: number, max: number) {
        return (max - min) * Math.random() + min;
    }

    export function RandomRangeInt(min: number, max: number) {
        return Math.floor((max - min) * Math.random() + min);
    }

    export function TimeStampToDateHM(stamp: number): string {
        var date = new Date(stamp);
        var min: string = "";
        if (date.getMinutes() / 10 < 1) {
            min = "0" + date.getMinutes();
        } else {
            min = date.getMinutes() + "";
        }
        return (date.getHours() + ":" + min);
    }

    /**
     * 汉字长度2，字符长度1 
     */
    export function sizeOf(str: string): number {
        var size: number = 0;
        if (str == null || str.length == 0) {
            return size;
        }
        for (let i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            if (/^[\u0000-\u00ff]$/.test(c)) {
                size += 1;
            } else {
                size += 2;
            }
        }
        return size;
    }

    /**
     * 缩略字符串
     * @param 指定字符串
     * @param 超过len长度则缩略
     */
    export function omittStr(str: string, len: number): string {
        if (str == null || str.length == 0) {
            return str;
        }
        if (sizeOf(str) > len) {
            return (str.slice(0, len - 2) + "...")
        }
        return str;
    }

    export function openSearchUser() {
        var panel: dliyun.SearchUserPanel = new dliyun.SearchUserPanel();
        PopUpPanel.addPopPanel(panel);
    }

    export function openSelectFriendCreate() {
        var panel: dliyun.SelectFriendPanel = new dliyun.SelectFriendPanel(0);
        PopUpPanel.addPopPanel(panel);
        panel.showFriendSelectList();
    }

    export function base64ToUint8(base64Data: any): Uint8Array {
        let array: ArrayBuffer = egret.Base64Util.decode(base64Data);
        let uint8: Uint8Array = new Uint8Array(array);
        return uint8;
    }

    export function Uint8ArrayToString(fileData) {
        var dataString = "";
        for (var i = 0; i < fileData.length; i++) {
            dataString += String.fromCharCode(fileData[i]);
        }
        return dataString
    }

    export function getSuffix(name: string): string {
        var lastIdx = name.lastIndexOf(".");
        var suffix = "";
        if (lastIdx > -1) {
            suffix = name.substring(lastIdx + 1);
            return suffix;
        } else {
            return null;
        }
    }

}