const cheerio = require('cheerio');
const request = require('request');


    function getWord(word){
        let url = 'https://stdict.korean.go.kr/search/searchResult.do?pageSize=10&searchKeyword='+encodeURI(word);
        return new Promise((resolve, reject) =>{
            request(url, (err, res, body)=>{
                const $ = cheerio.load(body);
                let result;

                let content = $('.dataLine').eq(0).html();
                result = {name:word, content:content};
                resolve({result});
            });
        });
    }

    // function getWord(word){
    //     let key = ""; //your key
    //     let url = "https://opendict.korean.go.kr/api/search?certkey_no=3366&key=" + key + "&target_type=search&req_type=json&part=word&q=" + encodeURI(word) + "&sort=popular&start=1&num=10&advanced=y&pos=1&method=exact";
    //     return new Promise((resolve, reject) =>{
    //         request(url, (err, res)=>{
    //             let data = JSON.parse(res.body);
    //             let result;

    //             if(data.channel.item.length === 0) result = {name:null, content:null};
    //             else result = {name:data.channel.item[0].word, content:data.channel.item[0].sense[0].definition};
    //             resolve({result});
    //         });
    //     });
    // }

module.exports.getWord = getWord;