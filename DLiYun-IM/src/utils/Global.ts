/**
  * 游戏公用方法汇总
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  * 使用方法如：Global.setCookie()
  */

module Global {

    export var socketUrl: string = "ws://api.im.online.dliyun.com/desktop/";
    export var imageUrl: string = "http://res.im.online.dliyun.com";
    export var uploadUrl: string = "http://api.im.online.dliyun.com/uploader/handler";
    export var findUserUrl: string = "http://api.im.online.dliyun.com/findUserInfoById";
    export var isLogin: boolean = false;

    //等待界面，主要用在通讯等待展示
    export var waitPanel: WaitPanel;
    //显示等待界面
    export function showWaritPanel(): void {
        Global.waitPanel = new WaitPanel(1);
        GameLayerManager.gameLayer().maskLayer.removeChildren();
        GameLayerManager.gameLayer().maskLayer.addChild(Global.waitPanel);
    }

    //移除界面
    export function hideWaritPanel(): void {
        if ((Global.waitPanel != null) && GameLayerManager.gameLayer().maskLayer.contains(Global.waitPanel)) {
            GameLayerManager.gameLayer().maskLayer.removeChild(Global.waitPanel);
        }
    }

    //获取html文本
    export function getTextFlow(str: string): egret.ITextElement[] {
        var styleParser = new egret.HtmlTextParser();
        return styleParser.parser(str);
    }

    //复制到剪贴
    export function copyTest(): void {
        let selecter: string = window.getSelection().toString();
        if (selecter != null && selecter.trim() != "") {
            console.log(selecter);
            Global.copyToClipboard(selecter);
        }
    }

    export function copyToClipboard(txt: string): void {
        try {
            let input = document.createElement("input");
            input.readOnly = true;
            input.value = txt;
            document.body.appendChild(input);
            input.select();
            input.setSelectionRange(0, input.value.length);
            document.execCommand("Copy");
            document.body.removeChild(input);
            ToastUI.showToast("复制成功")          
        } catch (e) {

        }
    }

    //获取剪贴板内容，粘贴
    export function pasteText(compFunc: Function): void {
        document.execCommand("paste");
    }

    export function getOS(): any {
        return egret.Capabilities.os;
    }

    export function readFile(file, loadFunc: Function) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            console.log(loadFunc);
            loadFunc(this.result.split(",")[1]);
        }
    }
}

module Paste {

    export var base64Data: string = "";

    export function addListenPaste(thisRef: any, e) {
        console.log("------------------开始监听粘贴");
        document.addEventListener("paste", onPasteImg, false);
    }

    export function removeListenPaste(thisRef: any, e) {
        console.log("------------------不再监听粘贴了");
        document.removeEventListener("paste", onPasteImg, false);
    }

    export function onPasteImg(event: ClipboardEvent) {
        var self = this;
        pasteImg(event);
    }

    export function pasteImg(event: ClipboardEvent) {
        if (event.clipboardData && event.clipboardData.items) {
            var items = event.clipboardData.items;
            var item;
            console.log("-----------剪贴板长度是 ", items.length);
            for (var i = 0; i < items.length; i++) {
                if (items[i] && items[i].kind === "file") {
                    item = items[i];
                    if (item.type.match(/^image\//i)) {
                        // Global.readFile(item.getAsFile(), this.createImg);
                        var reader = new FileReader();
                        reader.readAsDataURL(item.getAsFile());
                        reader.onload = function () {
                            var data = this.result.split(",")[1];
                            base64Data = data;
                        }
                        break;
                    }
                }
            }
        }
    }
}