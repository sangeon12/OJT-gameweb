const cheerio = require('cheerio');
const request = require('request');
const axios = require("axios");

    //네이버 어학사전 검색
    function getWord(word){
        let url = 'https://dict.naver.com/search.dict?dicQuery='+encodeURI(word);
        return new Promise((resolve, reject) =>{
            axios.get(url).then(e =>{
                const $ = cheerio.load(e.data);
                let result;

                let type = $('.word_class').eq(0).text();
                let content = null;
                if( type === '[명사]') content = $('.lst_krdic li:first-child p:nth-child(2)').text().replace(/(\s*)/g, "").replace(/\[[ㄱ-ㅎ|ㅏ-ㅣ|가-힣][ㄱ-ㅎ|ㅏ-ㅣ|가-힣]]/g, "").replace("1.", "");                
                result = {name:word, content:content.split(".")[0]};
                resolve({result});
            })
        });
    }

    //네이버 검색
    // function getWord(word){
    //     let url = 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query='+encodeURI(word);
    //     return new Promise((resolve, reject) =>{
    //         axios.get(url).then(e =>{
    //             const $ = cheerio.load(e.data);
    //             let result;

    //             let content = $('.mean').eq(0).text();
    //             result = {name:word, content:content};
    //             resolve({result});
    //         })
    //     });
    // }

    // 국립국어원 검사
    // function getWord(word){
    //     let url = 'https://stdict.korean.go.kr/search/searchResult.do?pageSize=10&searchKeyword='+encodeURI(word);
    //     return new Promise((resolve, reject) =>{
    //         request(url, (err, res, body)=>{
    //             console.log(body);
    //             const $ = cheerio.load(body);
    //             console.log($);
    //             let result;

    //             let content = $('.dataLine').eq(0).html();
    //             result = {name:word, content:content};
    //             resolve({result});
    //         });
    //     });
    // }

    // 우리말샘 api
    // function getWord(word){
    //     let key = "0EAE93F8D570802EA219F0D0F91E59E3 "; //your key
    //     let url = "https://opendict.korean.go.kr/api/search?certkey_no=3366&key=" + key + "&target_type=search&req_type=json&part=word0&q=" + encodeURI(word) + "&sort=popular&start=1&num=10&advanced=y&pos=1&method=exact";
    //     return new Promise((resolve, reject) =>{
    //         request(url, (err, res, body)=>{
    //             let data = JSON.parse(res.body);
    //             let result;

    //             if(data.channel.item.length === 0) result = {name:null, content:null};
    //             else result = {name:data.channel.item[0].word, content:data.channel.item[0].sense[0].definition};
    //             resolve({result});
    //         });
    //     });
    // }

    // function getWord(word){
    //     const wordList = xlsx.readFile("wordList.xls");
    //     const sheetName = wordList.SheetNames[0];
    //     const firstSheet = wordList.Sheets[sheetName];
    //     console.log(xlsx.utils.sheet_to_json(firstSheet, {defval:""}));
    // }

module.exports.getWord = getWord;