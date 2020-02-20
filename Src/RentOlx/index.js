const rp = require("request-promise");
var $ = require("cheerio");

const getAreaById = area => {
  const areas = [0, 30, 60, 90, 120, 150, 180, 200, 250, 300, 400, 500];

  return areas[area];
};

const getUrlByFilters = async queries => {
  const {
    location,
    minp: minPrice,
    maxp: maxPrice,
    mins: minSpace,
    maxs: maxSpace,
    minbed: minBedRooms,
    maxbed: maxBedRooms,
    minba: minBathroom,
    maxba: maxBathroom,
    gara: garageAmount,
    sp: smallPrice,
    mr: moreRecent,
    sr: sortRelevant
  } = queries;

  let url = `https://pe.olx.com.br/grande-recife/recife/imoveis/venda/apartamentos?`;
  // if (location) {
  //   url = `https://pe.olx.com.br/grande-recife/recife/${location
  //     .replace(" ", "-")
  //     .toLowerCase()}/imoveis/venda/apartamentos`;
  // } else {
  //   url = `https://pe.olx.com.br/grande-recife/recife/imoveis/venda/apartamentos`;
  // }

  if (maxPrice) {
    url += `pe=${maxPrice}`;
  }
  if (minPrice) {
    url += `ps=${minPrice}`;
  }
  if (minSpace) {
    url += `ss=${getAreaById(minSpace)}`;
  }
  if (maxSpace) {
    url += `se=${getAreaById(maxSpace)}`;
  }

  if (minBedRooms) {
    url += `ros=${minBedRooms}`;
  }
  if (maxBedRooms) {
    url += `roe=${maxBedRooms}`;
  }

  if (minBathroom) {
    url += `bas=${minBathroom}`;
  }
  if (maxBathroom) {
    url += `bae=${maxBathroom}`;
  }
  if (garageAmount) {
    url += `gsp=${garageAmount}`;
  }

  if (moreRecent) {
    url += `sf=${1}`;
  } else if (moreRecent) {
    url += `se=${1}`;
  } else {
    if (smallPrice) {
      url += `sp=${1}`;
    }
  }

  console.log(url);

  return url;
};

const rentOlx = async (req, res) => {
  const url = getUrlByFilters(req.query);

  await rp({
    uri:
      "https://pe.olx.com.br/grande-recife/recife/imoveis/venda/apartamentos",
    encoding: "latin1"
  })
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
