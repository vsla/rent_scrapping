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
    const texts = $('.item > .OLXad-list-link > .col-3 > .OLXad-list-price', html)
    
    let a = texts.map((i,elem) => {       
      return {id: i, text: $(elem).text()}
    });

    // for (let index = 0; index < a.length; index++) {
    //   const element = a[index];
    //   console.log(element);
    // }

    console.log(a.length );
    
    res.json({items: a[44]}) 

  })
  .catch(function(err){
    //handle error
  });
}

module.exports = rentOlx