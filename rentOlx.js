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
    let response = []
    texts.map((i, element) => {
      
      response.push( {id: i, value: $(element).text()}) 
    })

    // console.log(response)
    

    
    res.send({items: response}) 

  })
  .catch(function(err){
    console.log(err)
  });
}

module.exports = rentOlx