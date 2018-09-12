var MongoClient = require('mongodb').MongoClient;
// var _reverse_ = require('lodash.reverse');
import * as _ from 'lodash';


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
  _id ? : number;
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
for (let i = 0; i < 12; i++) {
  let item = levelPrice[i] * (1 - 0.03);
  levelPrice.push(Number(item.toFixed(3)));
}
// _.reverse(levelPrice);
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
 * 计算格子当前价格等级
 * @param {Grid} grid
 * @return {number}
 */
function gridLevelPrice(grid: Grid): number {
  for (let i = 0; i < levelPrice.length; i++) {
    if (grid.buyPrice > levelPrice[i]) {
      return levelPrice[i - 1];
    }
  }
  return -1;
  // return (grid.buyPrice) * (1 + 0.03);
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


let grid = {
  /** 网格规则 - 价格约定 */
  getLevelPrice: function () {
    return levelPrice;
  },
  /** 获取所有网格 */
  getAllGrid: function () {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(bdUrl, {
        useNewUrlParser: true
      }, function (err, db) {
        if (err) throw err;
        const dbo = db.db(dbName);
        let emptyStr = {};
        dbo.collection("grid").find(emptyStr).toArray(function (err, result) {
          if (err) throw err;
          let dealData: Grid[] = result || [];
          db.close();
          resolve(dealData);
        });
      });
    })
  },
  /** 当前网格 */
  getThisGrid: function () {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(bdUrl, {
        useNewUrlParser: true
      }, function (err, db) {
        if (err) throw err;
        const dbo = db.db(dbName);
        let findStr = {
          'type': 1,
          'sellPrice': undefined
        };
        dbo.collection("grid").find(findStr).toArray(function (err, result) {
          if (err) throw err;
          let dealData: Grid[] = result || [];
          db.close();
          let minGrid = dealData[0];
          for (let i = 0; i < dealData.length; i++) {
            if (dealData[i].buyPrice < minGrid.buyPrice) {
              minGrid = dealData[i];
            }
          }
          resolve(minGrid)
        });
      });
    })

  },
  /** 出货价格 */
  getGridSellPrice: function () {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(bdUrl, {
        useNewUrlParser: true
      }, function (err, db) {
        if (err) throw err;
        const dbo = db.db(dbName);
        let findStr = {
          'type': 1,
          'sellPrice': undefined
        };
        dbo.collection("grid").find(findStr).toArray(function (err, result) {
          if (err) throw err;
          let dealData: Grid[] = result || [];
          db.close();
          let minGrid = dealData[0];
          for (let i = 0; i < dealData.length; i++) {
            if (dealData[i].buyPrice < minGrid.buyPrice) {
              minGrid = dealData[i];
            }
          }
          resolve(gridSellPrice(minGrid));
        });
      });
    })
  },
  /** 入货价格 */
  getNextGridPrice: function () {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(bdUrl, {
        useNewUrlParser: true
      }, function (err, db) {
        if (err) throw err;
        const dbo = db.db(dbName);
        let findStr = {
          'type': 1,
          'sellPrice': undefined
        };
        dbo.collection("grid").find(findStr).toArray(function (err, result) {
          if (err) throw err;
          let dealData: Grid[] = result || [];
          db.close();
          let minGrid = dealData[0];
          for (let i = 0; i < dealData.length; i++) {
            if (dealData[i].buyPrice < minGrid.buyPrice) {
              minGrid = dealData[i];
            }
          }
          resolve(getNextGridPrice(minGrid));
        });
      });
    })
  },
  /** 获取待出货网格 */
  getSellingGrid: function () {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(bdUrl, {
        useNewUrlParser: true
      }, function (err, db) {
        if (err) throw err;
        const dbo = db.db(dbName);
        let findStr = {
          'sellPrice': undefined
        };
        dbo.collection("grid").find(findStr).toArray(function (err, result) {
          if (err) throw err;
          let dealData: Grid[] = result || [];
          db.close();
          resolve(dealData);
        });
      });
    })
  },
  /** 获取待出货网格图表数据 */
  getSellingGridChart: function () {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(bdUrl, {
        useNewUrlParser: true
      }, function (err, db) {
        if (err) throw err;
        const dbo = db.db(dbName);
        let findStr = {
          'sellPrice': undefined
        };
        dbo.collection("grid").find(findStr).toArray(function (err, result) {
          if (err) throw err;
          let dealData: Grid[] = result || [];
          db.close();

          /** 数据处理 **/
          let chartData = {
            yData: [],
            commonData: [] = _.fill(Array(levelPrice.length), 0),
            worthData: [] = _.fill(Array(levelPrice.length), 0),
          };
          let yData = JSON.parse(JSON.stringify(levelPrice));
          _.reverse(yData);
          chartData.yData = yData;
          for (let i = 0; i < dealData.length; i++) {
            for (let j = 0; j < yData.length; j++) {
              if ((gridLevelPrice(dealData[i])) === yData[j]) {
                if (dealData[i].type === 1) {
                  chartData.commonData[j] += dealData[i].amount;
                } else {
                  chartData.worthData[j] += dealData[i].amount;
                }
                continue;
              }
            }
          }
          resolve(chartData);
        });
      });
    })
  },
  /** 设置出货网格 */
  setThisGridSelling: function (_grid: any) {
    return new Promise(function (resolve, reject) {
      console.info('-->setThisGridSelling::', _grid);
      MongoClient.connect(bdUrl, {
        useNewUrlParser: true
      }, function (err, db) {
        if (err) throw err;
        const dbo = db.db(dbName);
        let findStr = {
          'amount': _grid.amount,
          'buyPrice': _grid.buyPrice,
          'type': _grid.type,
          'buyDate': _grid.buyDate
        };
        let setSellGrid = {
          sellDate: _grid.selling.date,
          sellPrice: _grid.selling.price,
        }
        dbo.collection("grid").update(findStr, {
          $set: setSellGrid
        });
        db.close();
      });
    })
  },
  setThisGridBuying: function (_grid: any) {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(bdUrl, {
        useNewUrlParser: true
      }, function (err, db) {
        if (err) throw err;
        const dbo = db.db(dbName);
        let grid = {
          'type': parseInt(_grid.type),
          'amount': parseInt(_grid.amount),
          'buyDate': _grid.date,
          'buyPrice': parseFloat(_grid.price)
        };
        console.info('-->setBuying::', grid);
        dbo.collection("grid").insert(grid);
        db.close();
      });
    })
  },
  getSoldGrid : function(){
    return new Promise(function (resolve, reject) {
      MongoClient.connect(bdUrl, {
        useNewUrlParser: true
      }, function (err, db) {
        if (err) throw err;
        const dbo = db.db(dbName);
        let findStr = {
          'sellPrice': {$ne:undefined} 
        };
        dbo.collection("grid").find(findStr).toArray(function (err, result) {
          if (err) throw err;
          resolve(result);
          db.close();
        });
      });
    })    
  }
}

export default grid;