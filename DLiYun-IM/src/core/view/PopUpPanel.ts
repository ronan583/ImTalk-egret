module PopUpPanel {
	export function addPopPanel(panel, popX: number = 0, popY: number = 0, effectType: number = 0): void {
		if (GameLayerManager.gameLayer().panelLayer.contains(panel)) {
			return;
		}
		panel.x = popX;
		panel.y = popY;
		panel.alpha = 1;

		if(popX == 0 && popY == 0){
			panel.x = GameConfig.curWidth() / 2 - panel.width / 2;
			panel.y = GameConfig.curHeight() / 2 - panel.height / 2;
		}

		GameLayerManager.gameLayer().panelLayer.addChild(panel);
		GameConfig.curPanel = panel;

		if (panel["title"] != null) {
			panel["title"].alpha = 0;
			panel["title"].scaleX = 0.5;
			panel["title"].scaleY = 0.5;
			egret.Tween.get(panel["title"]).to({ alpha: 1, scaleX: 1, scaleY: 1 }, 400, egret.Ease.backOut);
		}

		panel.alpha = 0;
		panel.scaleX = 0.5;
		panel.scaleY = 0.5;
		egret.Tween.get(panel).to({ alpha: 1, scaleX: 1, scaleY: 1 }, 350, egret.Ease.backOut);
	}

	export function removePopPanel(panel): void {
		var onComplete: Function = function () {
			if (GameLayerManager.gameLayer().panelLayer.contains(panel["dark"])) {
				GameLayerManager.gameLayer().panelLayer.removeChild(panel["dark"]);
			}
		};
		if (panel["dark"] != null) {
			egret.Tween.get(panel["dark"]).to({ alpha: 0 }, 100).call(onComplete, this);
		}

		var remove: Function = function () {
			egret.Tween.get(panel).to({ alpha: 0, scaleX: 0, scaleY: 0 }, 300);
			var waitTime = 500;
			egret.setTimeout(function () {
				if (GameLayerManager.gameLayer().panelLayer.contains(panel)) {//判断是否包含panel
					GameLayerManager.gameLayer().panelLayer.removeChild(panel);
				}
			}, this, waitTime);
		}
		remove();
	}
}