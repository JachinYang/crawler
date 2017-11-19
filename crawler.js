var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');



var url = 'http://mp.weixin.qq.com/s/LXU5m5op5PZRC48VuhSeIA';
http.get(url, result => {
    result.setEncoding('utf-8');
    var resChunk = '';
    result.on('data', chunk => {
        resChunk += chunk;
    });
    result.on('end', () => {
        var $ = cheerio.load(resChunk);
        $('img').each((index, res) => {
            // 对img标签进行处理
            if(res.attribs['data-src']){
                var src = res.attribs['data-src'];
                var srcArr = src.split('/');
                var fileType = srcArr[srcArr.length - 1].split('=')[1];
                var fileName = srcArr[srcArr.length - 2] + '.' + fileType;
                // request.head(src,function(err,res,body){
                //     if(err){
                //         console.log(err);
                //     }
                // });
                // 写入图片
                request(src).pipe(fs.createWriteStream('./data/image/' + fileName));
                // 把原路径改为本地路径
                res.attribs['data-src'] = './images/' + fileName;
                res.attribs.src = './image/' + fileName
            }
        });
        $('link').each((index, res) => {
            // 对link标签进行处理
            if(res.attribs.href){
                res.attribs.href = 'https:' + res.attribs.href
            }
        });
        // 暂时还没想好怎么处理script
        // $('script').each((index, res) => {
        //
        // });
        // 写入文件
        fs.appendFile('./data/index.html', $.html(), 'utf-8', err => {
            if(err){
                console.log(err)
            }
        });
    })
});