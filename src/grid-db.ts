var MongoClient = require('mongodb').MongoClient;
const bdUrl = 'mongodb://127.0.0.1:27017/';
const dbName = 'griddb';

/**
 * 网格类接口
 * type : number; 网格类型： 1：常规网格；2：价值网格
 * amount : number;  网格数量：交易的数量
 * buyPrice : number;  买入价格
 * butDate : string; 买入时间
 * sellPrice : number; 卖出价格
 * sellDate : string; 卖出时间
 */
interface Grid {
	type: number;
	amount: number;
	buyPrice: number;
	buyDate: Date;
	sellPrice ? : number;
	sellDate ? : Date;
}

// 网格规则 - 价格约定
const basePrice: number = 0.953;
let levelPrice: number[] = [basePrice];
for (let i = 0; i < 15; i++) {
	let item = levelPrice[i] * (1 - 0.03);
	levelPrice.push(Number(item.toFixed(3)));
}
// console.info("参考价格：" , levelPrice);

/**
 * 单个网格盈利金额
 * @param {Grid} grid
 * @return {number}
 */
function gridGain(grid: Grid) {
	return (grid.sellPrice - grid.buyPrice) * grid.amount;
}

/**
 * 网格状态
 * @param {Grid} grid
 * @return {number} 0: 已进货， 1：已出货
 */
function gridState(grid: Grid): number {
	if (grid.sellDate === undefined) {
		return 0;
	} else {
		return 1;
	}
}

/**
 * 计算格子出货价格
 * @param {Grid} grid
 * @return {number}
 */
function gridSellPrice(grid: Grid): number {
	for (let i = 0; i < levelPrice.length; i++) {
		if (grid.buyPrice > levelPrice[i]) {
			return levelPrice[i - 2];
		}
	}
	return -1;
	// return (grid.buyPrice) * (1 + 0.03);
}
/**
 * 计算入货价格
 * @param {Grid} grid
 * @return {number}
 */
function getNextGridPrice(grid: Grid): number {
	for (let i = 0; i < levelPrice.length; i++) {
		if (grid.buyPrice > levelPrice[i]) {
			return levelPrice[i];
		}
	}
	return -1;
	// return (grid.buyPrice) * (1 - 0.03);
}


//todo 2.  录入网格

// 打印所有网格
// console.info(dealData);


let grid = {
	/** 网格规则 - 价格约定 */
	getLevelPrice: function () {
		return levelPrice;
	},
	/** 获取所有网格 */
	getAllGrid: function () {
		MongoClient.connect(bdUrl, function (err, db) {
			if (err) throw err;
			const dbo = db.db(dbName);
			let emptyStr = {};
			dbo.collection("grid").find(emptyStr).toArray(function (err, result) {
				if (err) throw err;
				let dealData: Grid[] = [];
				for (let i = 0; i < result.length; i++) {
					let item: Grid = {
						type: result[i].type,
						amount: result[i].amount,
						buyPrice: result[i].buyPrice,
						buyDate: new Date(result[i].buyDate),
						sellPrice: result[i].sellPrice,
						sellDate: new Date(result[i].sellDate)
					};
					dealData.push(item);
				};
				db.close();
				return dealData;
			});
		});
	},
	/** 当前网格 */
	getThisGrid: function () {
		MongoClient.connect(bdUrl, function (err, db) {
			if (err) throw err;
			const dbo = db.db(dbName);
			let findStr = {'type':1};
			dbo.collection("grid").find(findStr).toArray(function (err, result) {
				if (err) throw err;
				let dealData: Grid[] = [];
				for (let i = 0; i < result.length; i++) {
					let item: Grid = {
						type: result[i].type,
						amount: result[i].amount,
						buyPrice: result[i].buyPrice,
						buyDate: new Date(result[i].buyDate),
						sellPrice: result[i].sellPrice,
						sellDate: new Date(result[i].sellDate)
					};
					dealData.push(item);
				};
				db.close();
				let minGrid = dealData[0];
				for(let i = 0 ; i < dealData.length ; i++) {
					if (dealData[i].buyPrice < minGrid.buyPrice){
						minGrid = dealData[i];
					}
				}
				return minGrid;
			});
		});
	},
	/** 出货价格 */
	getGridSellPrice: function () {
		// return gridSellPrice(minGrid);
		MongoClient.connect(bdUrl, function (err, db) {
			if (err) throw err;
			const dbo = db.db(dbName);
			let findStr = {'type':1};
			dbo.collection("grid").find(findStr).toArray(function (err, result) {
				if (err) throw err;
				let dealData: Grid[] = [];
				for (let i = 0; i < result.length; i++) {
					let item: Grid = {
						type: result[i].type,
						amount: result[i].amount,
						buyPrice: result[i].buyPrice,
						buyDate: new Date(result[i].buyDate),
						sellPrice: result[i].sellPrice,
						sellDate: new Date(result[i].sellDate)
					};
					dealData.push(item);
				};
				db.close();
				let minGrid = dealData[0];
				for(let i = 0 ; i < dealData.length ; i++) {
					if (dealData[i].buyPrice < minGrid.buyPrice){
						minGrid = dealData[i];
					}
				}
				return gridSellPrice(minGrid);
			});
		});		
	},
	/** 入货价格 */
	getNextGridPrice: function () {
		// return getNextGridPrice(minGrid);
		MongoClient.connect(bdUrl, function (err, db) {
			if (err) throw err;
			const dbo = db.db(dbName);
			let findStr = {'type':1};
			dbo.collection("grid").find(findStr).toArray(function (err, result) {
				if (err) throw err;
				let dealData: Grid[] = [];
				for (let i = 0; i < result.length; i++) {
					let item: Grid = {
						type: result[i].type,
						amount: result[i].amount,
						buyPrice: result[i].buyPrice,
						buyDate: new Date(result[i].buyDate),
						sellPrice: result[i].sellPrice,
						sellDate: new Date(result[i].sellDate)
					};
					dealData.push(item);
				};
				db.close();
				let minGrid = dealData[0];
				for(let i = 0 ; i < dealData.length ; i++) {
					if (dealData[i].buyPrice < minGrid.buyPrice){
						minGrid = dealData[i];
					}
				}
				return getNextGridPrice(minGrid);
			});
		});		
	}

}

export default grid;