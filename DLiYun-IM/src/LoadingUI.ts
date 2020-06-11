//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class LoadingUI extends egret.Sprite implements RES.PromiseTaskReporter {

    public constructor() {
        super();
        this.createView();
    }

    private textField: egret.TextField;
    public bg: egret.Bitmap;
    public dtalkIcon: egret.Bitmap;
    public dtalkIcon1: egret.Bitmap;
    public maskDtalk: egret.Shape;

    public ICON_HEIGHT: number = 130;
    public ICON_WIDTH: number = 108;

    private createView(): void {
        this.initUI();

        this.bg = new egret.Bitmap(RES.getRes("dlyim_login_bg_png"));
        this.bg.x = this.bg.y = 0
        this.addChild(this.bg);

        this.dtalkIcon1 = new egret.Bitmap(RES.getRes("dlyim_loading_ctricon1_png"));
        this.dtalkIcon1.x = this.width / 2 - this.ICON_WIDTH / 2;
        this.dtalkIcon1.y = this.height / 2 - this.ICON_HEIGHT / 2;
        this.addChild(this.dtalkIcon1);


        this.dtalkIcon = new egret.Bitmap(RES.getRes("dlyim_loading_ctricon_png"));
        this.dtalkIcon.x = this.width / 2 - this.ICON_WIDTH / 2;
        this.dtalkIcon.y = this.height / 2 - this.ICON_HEIGHT / 2;
        this.addChild(this.dtalkIcon);

        this.dtalkIcon.visible = false;
    }

    public initUI() {
        this.width = GameConfig.curWidth();
        this.height = GameConfig.curHeight();
        this.textField = new egret.TextField();
    }

    public onProgress(current: number, total: number): void {
        this.textField.text = `正在加载...` + Math.ceil((current / total) * 100).toString() + "%";
        this.textField.textAlign = "center";
        this.textField.y = this.height / 2 + this.ICON_HEIGHT / 2 + 10;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.x = this.width / 2 - this.textField.width / 2;
        this.textField.textColor = 0x4ac0cb;
        this.textField.fontFamily = "Microsoft YaHei";
        this.textField.size = 20;
        this.dtalkIcon.visible = true;
        this.addChild(this.textField);

        let height = this.ICON_HEIGHT * current / total;

        this.maskDtalk = new egret.Shape();
        this.maskDtalk.graphics.beginFill(0x0000ff);
        this.maskDtalk.graphics.drawRect(
            this.width / 2 - this.ICON_WIDTH / 2,
            this.height / 2 + this.ICON_HEIGHT / 2 - height,
            130,
            height
        );
        this.maskDtalk.graphics.endFill();
        this.addChild(this.maskDtalk);

        this.dtalkIcon.mask = this.maskDtalk;
    }
}
