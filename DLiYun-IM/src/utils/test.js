
function getRandom(max, min) {
    max = max || 100;
    min = min || 0;
    return Math.floor(min + Math.random() * max);
}
var dbName = "MyDatabase",
    tableName = 'students',
    addData = [
        { uid: getRandom(9999), name: "qwer", email: "@qq.com" },
        { uid: getRandom(9999), name: "asdf", email: "@163.com" },
        { uid: getRandom(9999), name: "zxcv", email: "@sina.com" },
        { uid: getRandom(9999), name: "tyuo", email: "@live.com" },
        { uid: getRandom(9999), name: "ghjk", email: "@baidu.com" }
    ],
    Btn_create = document.getElementById('create'),
    Btn_add = document.getElementById('add'),
    Btn_delete = document.getElementById('delete'),
    Btn_search = document.getElementById('search'),
    Btn_fuzzy = document.getElementById('fuzzySearch'),
    input = document.getElementsByTagName('input')[0];


//初始化数据库
var indexedDB = window.indexedDB || window.msIndexedDB || window.mozIndexedDB || window.webkitIndexedDB;
/*对象拆解*/
function objParsing(obj) {
    var result = {};
    for (var k in obj) {
        result.val = obj[k];
        result.key = k;
    }
    return result;
}
function DBError() {
    console.log('数据库链接出现错误');
}
indexedDB.__proto__.create = function (dbName, tableConfig) {
    /*链接数据库*/
    var request = this.open(dbName);
    request.onerror = DBError;
    /*创建数据库*/
    request.onupgradeneeded = function (event) {
        var db = event.target.result;
        tableConfig.autoIncrement = tableConfig.autoIncrement || true;
        //创建存储对象（表）,以id字段作为主键来确保唯一,使用keyPath表示
        var objectStore = db.createObjectStore(tableConfig.tableName, {
            /*设置主键*/
            keyPath: tableConfig.MainKey,
            /*是否自增,如新增数据设定了主键值则自增失效,下一个自增值会以主键值中最大值开始继续自增*/
            /*其实没啥用,默认自增*/
            autoIncrement: tableConfig.autoIncrement
        });
        console.log('主键：' + tableConfig.MainKey + '\n是否自增：' + tableConfig.autoIncrement);
        //给表添加索引
        for (var i in tableConfig.Keys) {
            console.log('字段：' + i);
            /*创建索引值
             * 只有被创建的索引值才能再后期搜索中按照该索引排序
             * unique为该索引的值是否不可重复
             * */
            objectStore.createIndex(i, i, { unique: !!tableConfig.Keys[i] });
            if (tableConfig.Keys[i]) {
                console.log('数据唯一');
            } else {
                console.log('数据不唯一');
            }
        }
        console.log("---新建数据库成功---");
    }
};
indexedDB.__proto__.add = function (dbName, tableName, data) {
    var request = this.open(dbName);
    //打开数据库失败的回调
    request.onerror = DBError;
    //打开数据成功的回调
    request.onsuccess = function (event) {
        var db = event.target.result,
            /*创建事务
             * indexedDB中链接数据库是依靠事务
             * 再一次事物中可以对数据库进行多次操作
             * 事务有三个触发事件分别是error、abort、success
             * 事务会因错误而中断,可以再中断中完成一些对用户的提示操作
             * 事务需要规定权限,默认为只读权限
             * argument[0]:对象存储名称,可输入多个存储对象名称
             * argument[1]:权限
             * */
            transaction = db.transaction([tableName], 'readwrite');
        transaction.onerror = function (event) {
            //处理错误
            console.error(new Error('transaction错误！！'));
        };
        /*中断*/
        transaction.onabort = function () {
            //事务中断处理
            console.log('处理中断');
        };
        /*完成*/
        transaction.oncomplete = function () {
            console.log("添加数据成功");
            db.close();
        };
        var objectStore = transaction.objectStore(tableName);
        /*objectStore对象
         * 其中中有对于对象存储的操作方法如：add\delete\clear\get\getAll等
         * 可以操作对象存储,改变其内容*/
        for (var i in data) {
            var request = objectStore.add(data[i]);
            request.onsuccess = function () {
                console.log("成功添加一条数据");
            };
            request.onabort = function () {
                console.log('数据添加中断');
            };
            request.onerror = function () {
                console.log('添加数据一条失败');
            }
        }
    };
};
indexedDB.__proto__.del = function (dbName, tableName, delArray) {
    /*默认通过主键值进行删除*/
    var request = this.open(dbName);
    request.onerror = DBError;
    request.onsuccess = function (event) {
        var objectStore,
            transaction,
            db = event.target.result;
        transaction = db.transaction([tableName], 'readwrite');
        transaction.onerror = function (event) {
            //处理错误
            console.log("删除失败" + event.target.errorCode);
        };
        transaction.onabort = function () {
            //事务中断处理
            alert('处理中断');
        };
        transaction.oncomplete = function () {
            if (delArray instanceof Array) {
                console.log("删除" + delArray.join("、") + "成功");
            } else {
                console.log("删除" + delArray + "成功");
            }
        };
        objectStore = transaction.objectStore(tableName);
        console.log(objectStore);
        if (delArray instanceof Array) {
            for (var i = 0; i < delArray.length; i++) {
                /*只能按照主键值删除数据*/
                objectStore.delete(delArray[i] - 0);
            }
        } else {
            objectStore.delete(delArray - 0);
        }
        db.close();
    };
};
indexedDB.__proto__.search = function (dbName, tableName, searchConfig) {
    var request = this.open(dbName);
    request.onerror = DBError;
    request.onsuccess = function (event) {
        var db = event.target.result,
            transaction = db.transaction(tableName, "readwrite"),
            objectStore = transaction.objectStore(tableName),
            index, IDB;
        if (searchConfig.range && searchConfig.range.key) {
            index = objectStore.index(searchConfig.range.key);
            IDB = searchConfig.range.IDB || null;
        } else {
            index = objectStore;
            IDB = searchConfig.range && searchConfig.range.IDB || null;
        }
        /*创建游标（cursor）
         * 游标是indexedDB数据库中可以对查询数据进行匹配的一种方式
         * 可以通过创建IDBKeyRange对象对游标筛选进行控制
         * 游标会多次返回,当没有更多符合筛选条件的数据时会返回null
         * 因此可以使用if else语句判断游标是否结束
         * */
        var OpenCursor = index.openCursor(IDB),
            resultArray = [];
        OpenCursor.onsuccess = function (event) {
            var cursor = event.target.result, searchKey;
            /*对象查找获取对象的key和value*/
            if (typeof searchConfig.keyword === 'object') {
                searchConfig.keyword = objParsing(searchConfig.keyword).val;
                searchKey = objParsing(searchConfig.keyword).key;
            }
            /*判断是否模糊查询*/
            var reg = searchConfig.isFuzzy ? new RegExp(searchConfig.keyword, 'g') : new RegExp('^' + searchConfig.keyword + '$', 'g');
            /*执行游标回调函数*/
            function cursorCallback(cursor) {
                searchConfig.fun1 && searchConfig.fun1(cursor, searchConfig.fun1Arguments);
                resultArray.push(cursor.value);
            }

            if (cursor) {
                /*模糊查询部分↓*/
                switch (typeof searchConfig.keyword) {
                    case 'string':
                        (function () {
                            for (var key in cursor.value) {
                                if (reg.test(cursor.value[key])) {
                                    cursorCallback(cursor);
                                    /*防止重复推入一条数据*/
                                    break;
                                }
                            }
                        })();
                        break;
                    case 'object':
                        /*判别keyword筛选的项目*/
                        cursor.value[searchConfig.keyword[searchKey]] &&
                            reg.test(cursor.value[searchConfig.keyword[searchKey]]) &&
                            cursorCallback(cursor);
                        break;
                    default:
                        cursorCallback(cursor);
                        break;
                }
                /*模糊查询结束↑*/
                /*在游标中可以对该条数据进行更新
                 * 但更新不能以某个属性为单位
                 * 只能更新全部数据
                 * */
                /*cursor的continue方法让游标进行下一次循环*/
                cursor.continue();
            } else {
                /*执行数据操作*/
                if (searchConfig.fun2) searchConfig.fun2(resultArray, searchConfig.fun2Arguments);
                /*记得关闭数据库*/
                db.close();
            }
        };
    }
};
/*批量删除*/
function queryDel(Array, funArguments) {
    indexedDB.del(funArguments.dbName, funArguments.tableName, getMainKey(Array));
}
function getMainKey(Array) {
    var arr = [];
    for (var i = 0; i < Array.length; i++) {
        arr[i] = Array[i].id;
    }
    console.log(arr);
    return arr;
}

Btn_create.onclick = function () {//打开数据库失败的回调
    indexedDB.create(dbName, {
        /*表名称*/
        tableName: tableName,
        /*可索引队列-->数据唯一性：默认为false,可重复*/
        Keys: { 'name': false, 'email': false, 'uid': false },
        /*主键是否自增,默认为true(设置为false后如没有指定该属性值则维持自增,自增值为主键所存在的length值)*/
        autoIncrement: false,
        /*主键：必须属性*/
        MainKey: 'id'
    });
};
Btn_add.onclick = function () {
    indexedDB.add(dbName, tableName, addData);
};
Btn_delete.onclick = function () {
    var config = {
        keyword: input.value[0] === '{' ? eval(input.value) : input.value,
        fun2: queryDel,
        fun2Arguments: { dbName: dbName, tableName: tableName },
        isFuzzy: false
    };
    indexedDB.search(dbName, tableName, config);
};
Btn_search.onclick = function () {
    /*查询测试*/
    var request = indexedDB.open(dbName);
    request.onerror = DBError;
    request.onsuccess = function (event) {
        var db = event.target.result,
            transaction = db.transaction(tableName, "readonly"),
            objectStore = transaction.objectStore(tableName),
            /*获取指定索引值为XXX的数据
             * 只获取第一个找到的数据*/
            request1 = objectStore.index('uid').get(3903);
        request1.onsuccess = function (e) {
            var data = e.target.result;
            console.log(data);
        };
    }
};
Btn_fuzzy.onclick = function () {
    var config = {
        /*关键词*/
        keyword: input.value[0] === '{' ? eval(input.value) : input.value,
        /*是否模糊*/
        isFuzzy: true,
        /*索引排序键值*/
        sortIndex: 'email',
        /*查询到每一条的操作函数*/
        fun1: function (cursor, Arguments) {
            cursor.value.email = '这是我定义的Email@CCdddC.com';
            cursor.update(cursor.value);
        },
        fun1Arguments: [],
        /*查询完毕的回调函数*/
        fun2: function (result, Arguments) {
            var html = '<tr><td>id</td><td>uid</td><td>name</td><td>email</td></tr>';
            for (var i = 0; i < result.length; i++) {
                html += '<tr><td>' + result[i].id + '</td><td>' + result[i].uid + '</td><td>' + result[i].name + '</td><td>' + result[i].email + '</td></tr>'
            }
            document.getElementById('table').innerHTML = html;
        },
        fun2Arguments: [],
        /*如没有range对象则不设置额外的过滤属性*/
        range: {
            /*过滤对象方法
             IDBKeyRange.lowerBound(any,bool)小于//
             IDBKeyRange.upperBound(any,bool)大于//
             IDBKeyRange.bound(any,any,bool,bool)//之间
             IDBKeyRange.only(any)//等于
             */
            IDB: IDBKeyRange.bound(0, 4000, true, true),
            /*过滤键值*/
            key: 'uid'
        }
    };
    indexedDB.search(dbName, tableName, config);
};







let students=[
  { 
    id:1001, 
    name:"张三", 
    age:21,
    sex:"男"
  },{ 
    id:1002, 
    name:"李四", 
    age:20,
    sex:"女"
  },{ 
    id:1003, 
    name:"王五", 
    age:19,
    sex:"女"
  }
];
let request = window.indexedDB.open("antzone", 1);
request.onupgradeneeded = (ev) => {
  let db = ev.target.result;
  if (!db.objectStoreNames.contains('students')) {
    let objectStore = db.createObjectStore('students',{keyPath:"id"});
    objectStore.createIndex("xingbie","sex",{ unique: false });
    objectStore.createIndex("xingming","name",{ unique: true });
  }
}
request.onsuccess = (ev) => {
  let db = ev.target.result;
  let odiv=document.getElementById("ant");
 
  let transaction = db.transaction(['students'], 'readwrite');
  let objectStore = transaction.objectStore('students');
  for(let i=0;i<students.length;i++){
    objectStore.add(students[i]);
  }
 
  let IDBIndexSex = objectStore.index("xingbie");
  let getRequest = IDBIndexSex.get("女");
  getRequest.onsuccess=function(ev){
    odiv.innerHTML=this.result.name;
  }
  getRequest.onerror=function(ev){
    odiv.innerHTML="读取失败";
  }
}