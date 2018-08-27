
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
	type : number;
	amount : number;
	buyPrice : number;
	buyDate : Date;
	sellPrice ? : number;
	sellDate ? : Date;
}

// 网格规则 - 价格约定
const basePrice : number = 0.953;
let levelPrice : number[] = [basePrice];
for (let i = 0 ; i < 15 ; i++) {
	let item  = levelPrice[i] * (1 - 0.03);
	levelPrice.push(Number(item.toFixed(3)));
}
// console.info("参考价格：" , levelPrice);

/**
 * 单个网格盈利金额
 * @param {Grid} grid
 * @return {number}
 */
function gridGain(grid: Grid) {
	return ( grid.sellPrice - grid.buyPrice ) * grid.amount;
}

/**
 * 网格状态
 * @param {Grid} grid
 * @return {number} 0: 已进货， 1：已出货
 */
function gridState(grid: Grid) : number {
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
function gridSellPrice(grid: Grid) : number {
	for (let i = 0 ; i < levelPrice.length ; i++) {
		if (grid.buyPrice > levelPrice[i]) {
			return levelPrice[i-2];
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
function getNextGridPrice(grid: Grid) : number {
	for (let i = 0 ; i < levelPrice.length ; i++) {
		if (grid.buyPrice > levelPrice[i]) {
			return levelPrice[i];
		}
	}
	return -1;
	// return (grid.buyPrice) * (1 - 0.03);
}

//todo 2.  录入网格

// 导入JSON文件
const dealNote: any[] = require('./dealNote.json');

// 解析 JSON 数据
let dealData : Grid[] = [];
for (let i = 0 ; i < dealNote.length ; i++){
	let item : Grid = {
		type : dealNote[i].type,
		amount : dealNote[i].amount,
		buyPrice : dealNote[i].buyPrice,
		buyDate : new Date(dealNote[i].buyDate),
		sellPrice : dealNote[i].sellPrice,
		sellDate : new Date(dealNote[i].sellDate)
	};
	dealData.push(item);
}
// 打印所有网格
// console.info(dealData);



// 网格分类： 待出货网格、已出货网格、价值网格
// 待出货网格
let gridSelling : Grid[] = [];
// 已出货网格
let gridSold : Grid[] = [];
// 价值网格
let gridWorth : Grid[] = [];
for (let i = 0 ; i < dealData.length ; i++){
	// 挑出常规网格
	if (dealData[i].type === 1){
		// 挑出待出货网格
		if (dealData[i].sellPrice === undefined){
			let itSellPrice = gridSellPrice(dealData[i]);
			// 每个格子的出货价格
			// console.info(dealData[i].buyPrice + ' --> ' + itSellPrice);
			gridSelling.push(dealData[i]);
		} else {
			gridSold.push(dealData[i]);
		}
	} else if (dealData[i].type === 2) {
		gridWorth.push(dealData[i]);
	}
}

// console.info('待出货网格：' , gridSelling.length);
// console.info('已出货网格：' , gridSold.length);
// console.info('价值网格：' , gridWorth.length);

// todo 1. 进货价格 、出货价格
// 找到最低价格的网格，确定出货价，进货价
let minGrid = gridSelling[0];
for(let i = 0 ; i < gridSelling.length ; i++) {
	if (gridSelling[i].buyPrice < minGrid.buyPrice){
		minGrid = gridSelling[i];
	}
}

// console.log('------操作参考-----');
// console.info('当前网格：' , minGrid);
// console.info('出货价格：' , gridSellPrice(minGrid));
// console.info('入货价格：' , getNextGridPrice(minGrid));



// todo 1. 统计：共盈利，现持仓，

// console.log('------统计信息-----');

//盈利统计
let gainSum : number = 0 ;
for (let i = 0; i < gridSold.length; i++) {
	let gain = (gridSold[i].sellPrice - gridSold[i].buyPrice) * gridSold[i].amount;
	gainSum += gain;
}
// console.info('共盈利：' + gainSum.toFixed(2));

let amountSum = 0;

//常规网格持仓统计
let sellingSum : number = 0 ;
for (let i = 0 ; i < gridSelling.length ; i++){
	sellingSum += gridSelling[i].buyPrice * gridSelling[i].amount;
	amountSum += gridSelling[i].amount;
}
// console.info('常规网格持仓：' + sellingSum.toFixed(2));

//价值网格持仓统计
let worthSum : number = 0;
for (let i = 0 ; i < gridWorth.length ; i++){
	worthSum += gridWorth[i].buyPrice * gridWorth[i].amount;
	amountSum += gridWorth[i].amount;
}
// console.info('价值网格持仓：' + worthSum.toFixed(2));

let holdSum = sellingSum + worthSum;
// console.info('持仓数量：' + amountSum);
// console.info('持仓价值：' + holdSum.toFixed(2));


// console.log('==========================');


let grid = {
    /** 网格规则 - 价格约定 */
    getLevelPrice:function(){
        return levelPrice;
    },
    /** 当前网格 */
    getThisGrid:function(){
        return minGrid;
    },
    /** 出货价格 */
    getGridSellPrice:function(){
        return gridSellPrice(minGrid);
    },
    /** 入货价格 */
    getNextGridPrice:function(){
        return getNextGridPrice(minGrid);
    }

}

export default grid;