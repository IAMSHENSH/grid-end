var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://132.232.142.128:27017/";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("griddb");
    var whereStr = {"buyDate": "2018-5-15"}; 
    let emptyStr = {};
    dbo.collection("grid"). find(emptyStr).toArray(function(err, result) { // 返回集合中所有数据
        if (err) throw err;
        console.log(result);
        db.close();
    });
});
