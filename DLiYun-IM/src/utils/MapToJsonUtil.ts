module dliyun {
	export class MapToJsonUtil {
		public constructor() {
		}

		/***
		 * map 转json字符串
		 * 
		 */
		public static mapToJson(map: HashMap): string {
			return JSON.stringify(map);
		}

		/***
		 * json字符串 转map
		 * 
		 */
		public static JsonToMap(jsonString: string): HashMap {
			var map: HashMap = new HashMap
			var mapJson: JSON = JSON.parse(jsonString);
			for (var p in mapJson) {
				if (p === "$hashCode") {
					continue;
				}
				map.put(p, mapJson[p]);
			}
			return map;
		}
	}
}