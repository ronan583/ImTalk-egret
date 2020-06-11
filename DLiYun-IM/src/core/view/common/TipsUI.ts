enum TipsType
{
	OkAndCancel = 1,
	OnlyOk = 2
}
class TipsUI extends eui.Component implements  eui.UIComponent 
{
	public constructor() 
	{
		super();
		var w = egret.MainContext.instance.stage.stageWidth;
        var h = egret.MainContext.instance.stage.stageHeight;
		this.maskBg = new egret.Shape();
        this.maskBg.graphics.beginFill(0x000000, 0.5);
        this.maskBg.graphics.drawRect(0, 0, w, h);
        this.maskBg.graphics.endFill();
        this.maskBg.width = egret.MainContext.instance.stage.stageWidth;
        this.maskBg.height = egret.MainContext.instance.stage.stageHeight;

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	public bg : eui.Image;
	public message : string;
	private maskBg : egret.Shape;
	private tipsType : TipsType;
	public tipsLabel : eui.Label;
	public okBtn : eui.Button;
	public okBtn1 : eui.Button;
	public cancelBtn : eui.Button;
	public closeBtn:eui.Button;
	public okCallback : Function;
	public callbackObject: any;
	
	public cancelCallback : Function;
	public isInit : boolean = false;
	public okBitmapLabelPath : string = "";
	
	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}

	protected childrenCreated():void
	{
		super.childrenCreated();
		this.okBtn.addEventListener(egret.TouchEvent.TOUCH_TAP , this.onOkTouch , this);
		this.okBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP , this.onOkTouch , this);
		this.cancelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP , this.onCancelTouch , this);
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP , this.onCancelTouch , this);
		this.addChildAt(this.maskBg,0);
		this.isInit = true;
		this.UpdatePanel();
	}

	private onAddToStage():void {
		if(this.okBitmapLabelPath != undefined && this.okBitmapLabelPath != "") {
			// TipsUI.instance.okBtn.imageLabelPath = this.okBitmapLabelPath;
		} else {
			// TipsUI.instance.okBtn.imageLabelPath = "icon_confirm";
		}
		
	}
	
	private onOkTouch(event : egret.TouchEvent)
	{
		if(this.okCallback != null)
		{
			this.okCallback(this.callbackObject);
		}
		TipsUI.removeTips(this);
	}
	
	private onCancelTouch(event : egret.TouchEvent)
	{
		TipsUI.removeTips(this);
		if(this.cancelCallback != null)
		{
			this.cancelCallback(this.callbackObject);
		}
	}
	static instance: TipsUI;
// type 1 : ok and cancel , type 2 : ok
	public static showTips(data):TipsUI
	{
		if(TipsUI.instance == null)
		{
			TipsUI.instance = new TipsUI();
		}
		TipsUI.instance.message = data.text;
		TipsUI.instance.okCallback = data.callback;
		TipsUI.instance.callbackObject = data.callbackObject;
		TipsUI.instance.tipsType = data.tipsType;
		TipsUI.instance.cancelCallback = data.cancelCallback;

		TipsUI.instance.okBitmapLabelPath = data.okBitmapLabelPath;

		if(TipsUI.instance.isInit)
		{
			TipsUI.instance.UpdatePanel();
		}
		TipsUI.instance.effectExe(data.effectType);
		return TipsUI.instance;
	}

	public static showTipsByInstance(tipsUI:TipsUI):TipsUI
	{
		//if(TipsUI.instance == null)
		//{
			TipsUI.instance = tipsUI;
		//}
		if(TipsUI.instance.isInit)
		{
			TipsUI.instance.UpdatePanel();
		}
		TipsUI.instance.effectExe(0);
		return TipsUI.instance;
	}

	

	private UpdatePanel()
	{
		if(this.tipsType == TipsType.OkAndCancel || this.tipsType == null)
		{
			TipsUI.instance.okBtn.visible = TipsUI.instance.cancelBtn.visible = true;
			TipsUI.instance.okBtn1.visible = false;
		}else
		{
			TipsUI.instance.okBtn.visible = TipsUI.instance.cancelBtn.visible = false;
			TipsUI.instance.okBtn1.visible = true;
		}
		this.tipsLabel.text = this.message;
	}


	//**1.渐显 ， 1.从下往上弹出 ，2.从右往左弹出 ， 3.从左往右弹出 */
	private effectExe(effectType)
	{
		GameLayerManager.gameLayer().effectLayer.addChild(this);
		switch (effectType)
		{
			case 0: {
				// TODO: Implement case content
				this.alpha = 0;
				egret.Tween.get(this).to({alpha:1},300);  
				break;
			}
			case 1: {
				this.alpha = 0;
				this.maskBg.alpha = 0;
				this.y += this.getHeight();
				// egret.Tween.get(tips.maskBg).to({alpha:1},500,egret.Ease.backOut); 	                
				egret.Tween.get(this).to({alpha:1,y:this.y - this.getHeight()},500,egret.Ease.backOut).call(this.OnTweenComplete, this); 	                
				break;
			}
			case 2: {
				this.alpha = 0;
				this.maskBg.alpha = 0;
				this.x -= this.getWidth();
				egret.Tween.get(this).to({alpha:1,x:this.x + this.getWidth()},500,egret.Ease.backOut).call(this.OnTweenComplete, this); 
				break;
			}
			case 3: {
				this.alpha = 0;
				this.maskBg.alpha = 0;
				this.x += this.getWidth();
				egret.Tween.get(this).to({alpha:1,x:this.x - this.getWidth()},500,egret.Ease.backOut).call(this.OnTweenComplete, this); 
				break;
			}
			default: {
			}
		}
	}

	public OnTweenComplete()
	{
		egret.Tween.get(this.maskBg).to({alpha:1},500,egret.Ease.backOut); 
	}
	
	public static removeTips(tips)
	{
		if(tips != null){
	        var onComplete:Function = function(){
		        if(GameLayerManager.gameLayer().effectLayer.contains(tips)){
					GameLayerManager.gameLayer().effectLayer.removeChild( tips );
					tips = null;
		        }
	        };
			egret.Tween.get(tips).to({alpha:0},300).call(onComplete,this);      
		}	
	}
	// 获取高度
    public getHeight(): number {
        return this.bg.height;

    }
    // 获取宽度
    public getWidth(): number {
        return this.bg.width;

    }
}