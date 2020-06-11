class ToastUI extends eui.Component implements eui.UIComponent {
	public static instance: ToastUI;
	public isInit: boolean;
	public message: string;
	public time: number = 1500;

	public toastLabel: eui.Label;
	public constructor() {
		super();
		this.skinName = "resource/eui_skins/common/ToastUISkin.exml";
	}

	protected childrenCreated(): void {
		super.childrenCreated();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	public static showToast(msg: string) {
		if (ToastUI.instance == null) {
			ToastUI.instance = new ToastUI();
		}
		ToastUI.instance.message = msg;
		ToastUI.instance.updateToast();
		ToastUI.instance.effectExec();
	}



	public updateToast() {
		this.width = GameConfig.curWidth();
		this.height = GameConfig.curHeight();
		this.toastLabel.text = this.message;
	}

	public effectExec() {
		GameLayerManager.gameLayer().effectLayer.addChild(this);
		this.alpha = 0;
		egret.Tween.get(this).to(
			{ alpha: 0.8 }, 100
		).wait(this.time).to(
			{ alpha: 0 }, 100
			).call(this.removeToast, this);
	}

	public removeToast() {
		if (GameLayerManager.gameLayer().effectLayer.contains(this)) {
			GameLayerManager.gameLayer().effectLayer.removeChild(this);
		}
	}


}