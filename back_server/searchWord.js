const cheerio = require('cheerio');
const request = require('request');


    function getWord(word){
        let url = 'https://stdict.korean.go.kr/search/searchResult.do?pageSize=10&searchKeyword='+encodeURI(word);
        return new Promise((resolve, reject) =>{
            request(url, (err, res, body)=>{
                const $ = cheerio.load(body);
                let result = [];

                let content = $('.dataLine').eq(0).html();
                result.push({name:word, content:content});
                resolve({result});
            });
        });
    }

module.exports.getWord = getWord;