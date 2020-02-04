const rp = require('request-promise');
var $ = require('cheerio');
const url = 'https://pe.olx.com.br/imoveis/venda/apartamentos?ps=400000';

const rentOlx = async(req, res) => {
  await rp({uri: url, encoding: 'latin1'})
  .then(function(html){
    //success!
    // data = $.load(html)
    // console.log($.load("<ul class='list' id='main-ad-list'>...</ul>").length);
    // console.log($.load('big > a', html));
    const texts = $('.OLXad-list-title', html)
    console.log(texts[0].children[0].data);
    
    res.send(texts[0].children[0].data)
    // console.log(data.forEach((item) => console.log(item.text())
    // ))
  })
  .catch(function(err){
    //handle error
  });
}

module.exports = rentOlx