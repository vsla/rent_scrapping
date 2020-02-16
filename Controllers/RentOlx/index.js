const rp = require("request-promise");
var $ = require("cheerio");
const url = "https://pe.olx.com.br/imoveis/venda/apartamentos?ps=400000";

const rentOlx = async (req, res) => {
  await rp({ uri: url, encoding: "latin1" })
    .then(function(html) {
      let response = [];

      const texts = $(".item > .OLXad-list-link", html);

      // Every card has 4 childs, every column

      texts.map((i, anounceLine) => {
        let anounce = {};
        // Get image
        // anounceLine.childNodes[1]

        // Link to
        anounce.linkTo = anounceLine.attribs.href;

        // Title
        anounce.title = $(".OLXad-list-title", anounceLine.childNodes[3])
          .text()
          .replace(/(\r\n|\n|\r|\t)/gm, "");

        // Details
        anounce.details = $(" .detail-specific", anounceLine.childNodes[3])
          .text()
          .replace(/(\r\n|\n|\r|\t)/gm, "");

        // Location
        anounce.location = $(" .detail-region", anounceLine.childNodes[3])
          .text()
          .replace(/(\r\n|\n|\r|\t)/gm, "");

        // get value
        anounce.value = $(
          ".OLXad-list-price",
          anounceLine.childNodes[5]
        ).text();

        // In Promotion
        anounce.oldValue = $(
          " .OLXad-list-old-price",
          anounceLine.childNodes[5]
        )
          .text()
          .replace(/(\r\n|\n|\r|\t)/gm, "");

        anounce.inPromotion = !! anounce.oldValue

        // console.log(anounceLine.childNodes[5].childNodes[1].childNodes[0].data);

        anounceLine.childNodes[7];
        // get when rent is anounced
        index = 0;
        response.push(anounce);
      });

      // console.log(texts.children()[2].children);
      // console.log(Object.keys(texts.children()).length);

      // // Get prices
      // const prices = $(
      //   ".item > .OLXad-list-link > .col-3 > .OLXad-list-price",
      //   html
      // );

      // prices.map((i, element) => {
      //   response.push({ id: i, value: $(element).text() });
      // });

      // // Get names

      // const name = $(
      //   ".item > .OLXad-list-link > .col-3 > .OLXad-list-price",
      //   html
      // );

      // name.map((i, element) => {
      //   response.push({ id: i, name: $(element).text() });
      // });

      res.send({ items: response });
    })
    .catch(function(err) {
      console.log(err);
    });
};

module.exports = rentOlx;
