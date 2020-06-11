/**
 * Created by yangsong on 15-1-14.
 * Sound管理类
 */
class SoundManager {
    /**
     * 音乐文件清理时间
     * @type {number}
     */
    public static CLEAR_TIME: number = 3 * 60 * 1000;

    private effect: SoundEffects;
    private voice: SoundEffects;
    private bg: SoundBg;
    private _effectOn: boolean;
    private _bgOn: boolean;
    private currBg: string;
    private bgVolume: number;
    private effectVolume: number;


    private static _instance: SoundManager;
    private _customPause:boolean = false;

    static get instance(): SoundManager {
        if (!this._instance) {
            this._instance = new SoundManager();
        }
        return this._instance;
    }

    /**
     * 构造函数
     */
    public constructor() {

        this._bgOn = this.bgOn;
        this._effectOn = this.effectOn;
        var tempVolume = egret.localStorage.getItem("bgVolume");
        this.bgVolume = Number(tempVolume == null ? 0.5 : tempVolume);
        tempVolume = egret.localStorage.getItem("effectVolume");
        this.effectVolume = Number(tempVolume == null ? 0.5 : tempVolume);

        this.bg = new SoundBg();
        this.bg.setVolume(this.bgVolume);

        this.effect = new SoundEffects();
        this.effect.setVolume(this.effectVolume);

        this.voice = new SoundEffects();
        this.voice.setVolume(this.effectVolume);
    }

    /**
    * true 保存设置  false 恢复设置
    */
    private _playBgOn: boolean;
    private _palyEffectOn: boolean;
    private _isStartRecord: boolean = false;
    public startRecord(): void {
        if (!this._isStartRecord) {
            this._isStartRecord = true;
            this._playBgOn = this.bgOn;
            this._palyEffectOn = this.effectOn;
            this.bgOn = false;
            this.effectOn = false;
        }
    }

    public stopRecord(): void {
        this.bgOn = this._playBgOn;
        this.effectOn = this._palyEffectOn;
        this._isStartRecord = false;
    }

    /**
     * 播放音效
     * @param effectName
     */
    public playEffect(effectName: string): void {
        if (!this.effectOn)
            return;

        this.effect.play(effectName);
    }

    //立即停止特效声音的播放
    public stopEffectOrVoiceImm() {
        if(this.effect) {
            this.effect.stopImm();
        }
    }

    public playVoice(effectName: string): void {
        if (!this.effectOn)
            return;

        this.voice.play(effectName);
    }

    public playMsgNotific(): void{
        this.effect.play("sound_msg_mp3");
    }

    /**
     * 播放背景音乐
     * @param key
     */
    public playBg(bgName: string): void {
        // if(bgName == this.currBg) return;
        this.currBg = bgName;
        if (!this.bgOn)
            return;

        this.bg.play(bgName);
    }
    /**
     * 继续播放背景音乐
     * @param key
     */
    public playBgC(): void {
        if (!this.bgOn)
            return;

        if (this.currBg) {
            this.playBg(this.currBg);
        }
    }

    /**
     * 停止背景音乐
     */
    public stopBg(): void {
        this.bg.stop();
    }


    /**
     * 设置背景音乐音量
     * @param volume
     */
    public setBgVolume(volume: number): void {
        volume = Math.min(volume, 1);
        volume = Math.max(volume, 0);
        this.bgVolume = volume;

        egret.localStorage.setItem("bgVolume", volume.toString());
        this.bg.setVolume(this.bgVolume);
    }

    /**
     * 获取背景音乐音量
     * @returns {number}
     */
    public getBgVolume(): number {
        return this.bgVolume;
    }

    /**
     * 设置音效音量
     * @param volume
     */
    public setEffectVolume(volume: number): void {
        volume = Math.min(volume, 1);
        volume = Math.max(volume, 0);
        this.effectVolume = volume;
        egret.localStorage.setItem("effectVolume", volume.toString());
        this.effect.setVolume(this.effectVolume);
        this.voice.setVolume(this.effectVolume);
    }

    /**
     * 获取音效音量
     * @returns {number}
     */
    public getEffectVolume(): number {
        return this.effectVolume;
    }

    public PlayClick(): void {
        this.playEffect("hallClick_mp3");
    }
    public PlayBattle(value: string): void {
        console.log(value);

        this.playEffect(value);
    }

    //声效是否播放，保存设置
    public set bgOn(value: boolean) {
        if (value) {
            this._bgOn = true;
            egret.localStorage.setItem("isSound", "true");
            if (this.currBg) {
                this.playBg(this.currBg);
            }
        } else {
            this._bgOn = false;
            this.stopBg();
            egret.localStorage.setItem("isSound", "false");
        }
    }
    public get bgOn(): boolean {
        var b = egret.localStorage.getItem("isSound");
        if (b == null || b == "") {
            return true;
        }
        else {
            return b == "true";
        }

    }

    //音乐是否播放，保存设置
    public set effectOn(value) {
        if (value) {
            this._effectOn = true;
            egret.localStorage.setItem("ismusic", "true");
        } else {
            this._effectOn = false;
            egret.localStorage.setItem("ismusic", "false");
        }
    }
    public get effectOn(): boolean {
        var b = egret.localStorage.getItem("ismusic");
        if (b == null || b == "") {
            return true;
        }
        else {
            return b == "true";
        }
    }

    public get quietOn(): boolean {
        if (this.bgOn || this.effectOn) {
            return false;
        } else {
            return true;
        }
    }
}