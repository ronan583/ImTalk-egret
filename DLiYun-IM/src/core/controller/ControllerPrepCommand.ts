/**
  * 注册controller
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  */
module dliyun {

  export class ControllerPrepCommand extends puremvc.SimpleCommand implements puremvc.ICommand {

    public constructor() {
      super();
    }
    public execute(notification: puremvc.INotification): void {
      (new MainManager()).register();
      (new LoginManager()).register();

      //服务器返回command
      (new Processor_1()).register();
      (new Processor_2()).register();
      (new Processor_3()).register();
      (new Processor_5()).register();
      (new Processor_6()).register();
      (new Processor_7()).register();
      (new Processor_8()).register();
      (new Processor_9()).register();
      (new Processor_10()).register();
      (new Processor_11()).register();
      (new Processor_12()).register();
      (new Processor_13()).register();
      (new Processor_14()).register();
      (new Processor_16()).register();
    }
  }
}