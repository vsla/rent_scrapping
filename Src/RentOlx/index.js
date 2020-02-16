const rp = require("request-promise");
var $ = require("cheerio");

const rentOlx = async (req, res) => {
  const { location } = req.query;

  let url = "";
  if (location) {
    url = `https://pe.olx.com.br/grande-recife/recife/${location
      .replace(" ", "-")
      .toLowerCase()}/imoveis/venda/apartamentos`;
  } else {
    url = `https://pe.olx.com.br/grande-recife/recife/imoveis/venda/apartamentos`;
  }

  await rp({ uri: url, encoding: "latin1" })
    .then(function(html) {
      let response = [];

      const anounces = $(".item > .OLXad-list-link", html);

      anounces.map((i, anounceLine) => {
        let anounce = {};
        // anounce id
        anounce.id = anounceLine.attribs.id;

        // Get image
        anounce.imageLink = $(".image, .lazy", anounceLine.childNodes[1]).attr(
          "src"
        );
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

        anounce.inPromotion = !!anounce.oldValue;

        anounceLine.childNodes[7];

        response.push(anounce);
      });

      res.send({ response });
    })
    .catch(function(err) {
      console.log(err);
    });
};

module.exports = rentOlx;
