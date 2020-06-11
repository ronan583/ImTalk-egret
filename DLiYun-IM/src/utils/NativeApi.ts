/**
  * 调用原生api方法汇总
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  * 使用方法如：Global.setCookie()
  */

module NativeApi {

	// 储存数据需要key和value，都必须是字符串
	export function setLocalData(key: string, value: string): void {
		var ciphertext = CryptoJS.AES.encrypt(value, '5rx9ibpyqdn6xmt3');

		egret.localStorage.setItem(dliyun.UserData.instance.userId + "_" + key, ciphertext.toString());
	}

	// 读取数据
	export function getLocalData(key: string): string {
		var value: string = egret.localStorage.getItem(dliyun.UserData.instance.userId + "_" + key);
		if (value == null || value === "") {
			return null;
		}
		var bytes = CryptoJS.AES.decrypt(value, '5rx9ibpyqdn6xmt3');
		var plaintext = bytes.toString(CryptoJS.enc.Utf8);
		return plaintext;
	}

	// 删除数据
	export function deleteLocalData(key: string): void {
		egret.localStorage.removeItem(dliyun.UserData.instance.userId + "_" + key);
	}

	// 将所有数据清空
	export function clearLocalData(): void {
		egret.localStorage.clear();
	}

	//调用麦克风  
	export function getMic(): void {
		//getUserMedia API 大部分手机不支持，所以暂不考虑
	}

	//调用canvas截屏
	export function getScreen(): void {

	}

	//调用打电话功能
	export function callPhone(telNum: number): void {
		window.open("tel:" + telNum, '_self')
	}

	//调用发短信功能
	export function sendMessage(telNum: number): void {
		window.open("sms:" + telNum, '_self')
	}

	//获取当前地址
	export function getCurUrl(): string {
		return window.location.href;
	}

	//当前游戏角度
	export var curAngle = window["orientation"];

	export function uuid() {
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = "-";

		var uuid = s.join("");
		return uuid;
	}


}