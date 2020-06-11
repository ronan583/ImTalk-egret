module dliyun {

    export class HashMap extends egret.HashObject {

        constructor() {
            super();
        }

        /**
         * 加入数据
         * @param key 键
         * @param value 值
         */
        put(key:any, value:any):void {
            this[key] = value;
        }

        /**
         * 获得数据
         * @param key 键
         */
        get(key:any):any {
            return this[key];
        }

        /**
         * 移除数据
         * @param key 键
         */
        remove(key:any):any {
            var value = this[key];
            if (value) {
                delete this[key];
            }
            return value;
        }

        /**
         * 是否存在
         * @param key 键
         */
        contains(key:any):boolean {
            return this[key] != null;
        }

        /**
         * 获得所有键值
         */
        keys():string[] {
            var keys = Object.keys(this);
            var index = keys.indexOf("$hashCode");
            if (index > -1) {
                keys.splice(index, 1);
            }
            return keys;
        }

        sortIntKeys():number[] {
            var keys = Object.keys(this);
            var index = keys.indexOf("$hashCode");
            if (index > -1) {
                keys.splice(index, 1);
            }
            var intKeys:Array<number> = new Array<number>();
            for(let keyStr of keys) {
                intKeys.push(parseInt(keyStr));
            }
            intKeys.sort((a:number,b:number)=>{
                return a - b;
            });
            return intKeys;
        }

        size():number {
            return this.keys().length;
        }

        /**
         * 清空
         */
        clear():void {
            var keys = this.keys();
            var len = keys.length;
            for (var i = 0; i < len; i++) {
                this.remove(keys[i]);
            }
        }
    }
}