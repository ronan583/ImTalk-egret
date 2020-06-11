/**
 * Created by yangsong on 15-1-14.
 * 音效类
 */
class SoundEffects extends BaseSound {
    private _volume:number;
    private channelList:Array<egret.SoundChannel> = [];

    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
     * 播放一个音效
     * @param effectName
     */
    public play(effectName:string):void {
        // if(Global.isBackgroud) {
        //     return;
        // }
        var sound:egret.Sound = this.getSound(effectName);
        if (sound) {
            this.playSound(sound);
        }
    }

    public stopImm() {
        for(let c of this.channelList) {
            c.stop();
            c.removeEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this);
        }
        this.channelList = [];
    }

    /**
     * 播放
     * @param sound
     */
    private playSound(sound:egret.Sound):void {
        try{
            let channel = sound.play(0, 1);
            this.channelList.push(channel);
            channel.addEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this);
            channel.volume = this._volume;
        }catch(e) {
            egret.error(e);
        }
    }

    private onSoundComplete(event:egret.Event) :void {
        let cIndex = this.channelList.indexOf(event.target);
        if(cIndex >= 0) {
            this.channelList[cIndex].removeEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this);
            this.channelList.splice(cIndex, 1);
        }
    }

    /**
     * 设置音量
     * @param volume
     */
    public setVolume(volume:number):void {
        this._volume = volume;
    }


    /**
     * 资源加载完成后处理播放
     * @param key
     */
    public loadedPlay(key:string):void {
        this.playSound(RES.getRes(key));
    }
}