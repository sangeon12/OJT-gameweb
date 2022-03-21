const cheerio = require('cheerio');
const request = require('request');
const axios = require("axios");

    // 국립국어원 검사
    // function getWord(word){
    //     let url = 'https://stdict.korean.go.kr/search/searchResult.do?pageSize=10&searchKeyword='+encodeURI(word);
    //     return new Promise((resolve, reject) =>{
    //         request(url, (err, res, body)=>{
    //             const $ = cheerio.load(body);
    //             let result;

    //             let content = $('.dataLine').eq(0).html();
    //             result = {name:word, content:content};
    //             resolve({result});
    //         });
    //     });
    // }

    // 네이버 국어사전 검사
    // function getWord(word){
    //     let url = 'https://ko.dict.naver.com/#/search?query='+encodeURI(word);
    //     return new Promise((resolve, reject) =>{
    //         request(url, (err, res, body)=>{
    //             console.log(body);
    //             const $ = cheerio.load(body);
    //             let result;

    //             let content = $('.mean_item').eq(0).html();
    //             result = {name:word, content:content};
    //             resolve({result});
    //         });
    //     });
    // }

    // axios 검사
    // const getHtml = async (word) => {
    //     try {
    //         let url = "https://opendict.korean.go.kr/api/search?certkey_no=3366&key=" + key + "&target_type=search&req_type=json&part=word&q=" + encodeURI(word) + "&sort=popular&start=1&num=10&advanced=y&pos=1&method=exact";
    //       return await axios.get(url);
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   };
      
    //   function getWord(word){
    //     return new Promise((resolve, reject) =>{
    //         let result;
    //         getHtml(word).then((html) => {
    //             console.log(html);
    //             // let data = JSON.parse(html.body);

    //             // if(data.channel.item.length === 0) result = {name:null, content:null};
    //             // else result = {name:data.channel.item[0].word, content:data.channel.item[0].sense[0].definition};
    //             // resolve({result});
    //     })
    //     .then(res => log(res));
    //     });
    // }

    // 우리말샘 api
    // function getWord(word){
    //     let key = "0EAE93F8D570802EA219F0D0F91E59E3 "; //your key
    //     let url = "https://opendict.korean.go.kr/api/search?certkey_no=3366&key=" + key + "&target_type=search&req_type=json&part=word&q=" + encodeURI(word) + "&sort=popular&start=1&num=10&advanced=y&pos=1&method=exact";
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

module.exports.getWord = getWord;
