const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')
process.env.NODE_ENV = 'development';
const app = express()
app.use(bodyParser.json())
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://covid19-algeria.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//source :   http://covid19.sante.gov.dz/carte/
let GOV_API = "https://services8.arcgis.com/yhz7DEAMzdabE4ro/arcgis/rest/services/Cas_confirme_view/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Cas_confirm%20desc&resultOffset=0&resultRecordCount=48&resultType=standard&cacheHint=true";
let GOV_API_TOTAL = 'https://services8.arcgis.com/yhz7DEAMzdabE4ro/arcgis/rest/services/Cas_confirme_view/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Cas_confirm%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&resultType=standard&cacheHint=true'
let GOV_API_RECOVERED = 'https://services8.arcgis.com/yhz7DEAMzdabE4ro/arcgis/rest/services/COVID_Death_Cumul/FeatureServer/2/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22max%22%2C%22onStatisticField%22%3A%22gueris%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&resultType=standard&cacheHint=true'
let GOV_API_DEATHS = 'https://services8.arcgis.com/yhz7DEAMzdabE4ro/arcgis/rest/services/Cas_confirme_view/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22D%C3%A9c%C3%A9s%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&resultType=standard&cacheHint=true'
let GOV_API_NEW = 'https://services8.arcgis.com/yhz7DEAMzdabE4ro/arcgis/rest/services/Cas_confirme_view/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22new_cases%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&resultType=standard&cacheHint=true'
let GOV_API_NEWDEAD = 'https://services8.arcgis.com/yhz7DEAMzdabE4ro/arcgis/rest/services/Cas_confirme_view/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22New_case_death%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&resultType=standard&cacheHint=true'


app.get('/', (request, response) => {
  response.json({
    msg: "this is covid19 statistics of algeria",
    APIs: {
      0: '/api/province/all    --- get all provinces stats',
      1: '/api/province/:provinceCode  -- get province stats eg: /api/covid19/9 fro BLIDA',
      2: '/api/total/  -- get total cases',
      3: '/api/recovered/  -- get total deaths'
    }
  })
})

//get NEW DEAD
app.get('/api/newdead', (request, response) => {

  https.get(GOV_API_NEWDEAD, (res) => {

    // Async, append chunks of data as it comes
    let body = "";
    res.on("data", data => {
      body += data;
    });

    //When finished, treat it
    res.on('end', () => {


      //The data is in attributes field
      let { value } = JSON.parse(body).features[0].attributes
      response.json({
        value
      })
    })

    res.on("error", (error) => {
      response.json(error)
    })
  })
})


//get NEW CASES
app.get('/api/new', (request, response) => {

  https.get(GOV_API_NEW, (res) => {

    // Async, append chunks of data as it comes
    let body = "";
    res.on("data", data => {
      body += data;
    });

    //When finished, treat it
    res.on('end', () => {


      //The data is in attributes field
      let { value } = JSON.parse(body).features[0].attributes
      response.json({
        value
      })
    })

    res.on("error", (error) => {
      response.json(error)
    })
  })
})

//get dead total stats
app.get('/api/deaths', (request, response) => {

  https.get(GOV_API_DEATHS, (res) => {

    // Async, append chunks of data as it comes
    let body = "";
    res.on("data", data => {
      body += data;
    });

    //When finished, treat it
    res.on('end', () => {


      //The data is in attributes field
      let { value } = JSON.parse(body).features[0].attributes
      response.json({
        value
      })
    })

    res.on("error", (error) => {
      response.json(error)
    })
  })
})

//get recovered total stats
app.get('/api/recovered', (request, response) => {

  https.get(GOV_API_RECOVERED, (res) => {

    // Async, append chunks of data as it comes
    let body = "";
    res.on("data", data => {
      body += data;
    });

    //When finished, treat it
    res.on('end', () => {


      //The data is in attributes field
      let { value } = JSON.parse(body).features[0].attributes
      response.json({
        value
      })
    })

    res.on("error", (error) => {
      response.json(error)
    })
  })
})

//get overal stats
app.get('/api/total', (request, response) => {

  https.get(GOV_API_TOTAL, (res) => {

    // Async, append chunks of data as it comes
    let body = "";
    res.on("data", data => {
      body += data;
    });

    //When finished, treat it
    res.on('end', () => {


      //The data is in attributes field
      let { value } = JSON.parse(body).features[0].attributes
      response.json({
        value
      })
    })

    res.on("error", (error) => {
      response.json(error)
    })
  })
})
//get all provinces statistics
app.get('/api/province/all', (request, response) => {
  https.get(GOV_API, (res) => {

    // Async, append chunks of data as it comes
    let body = "";
    res.on("data", data => {
      body += data;
    });

    //When finished, treat it
    res.on('end', () => {

      //may through 48 feature
      //The data is in attributes field
      //Bizzare naming here, don't mind them
      let allProvinceStatistics = JSON.parse(body).features.map(({ attributes: {
        new_cases,
        NOM_WILAYA, wilayat, WILAYA,
        Décés, Récupér, active, Cas_confirm, Femelle, Males,
        Date_rapport,
        A1_25, A25_34, a35_44, a45_59, A_60, cinqantneuf, soixantedix, plus } }) => {
        return ({
          province: {
            codeName: WILAYA,
            french: NOM_WILAYA,
            arabic: wilayat,
          },
          new_cases,
          deaths: Décés,
          recovered: Récupér,
          activeCases: active ? active : 0,
          totalConfirmedCases: Cas_confirm,
          females: Femelle,
          males: Males,
          lastUpdated: new Date(Date_rapport),
          ageStatistics: [
            {
              from: 0,
              to: 5,
              count: A1_25 || 0
            }, {
              from: 5,
              to: 15,
              count: A25_34 || 0
            }, {
              from: 15,
              to: 25,
              count: a35_44 || 0
            }, {
              from: 25,
              to: 35,
              count: a45_59 || 0
            }, {
              from: 35,
              to: 45,
              count: A_60 || 0
            }, {
              from: 45,
              to: 60,
              count: cinqantneuf || 0
            }, {
              from: 60,
              to: 70,
              count: soixantedix || 0
            }, {
              from: 70,
              to: 100,
              count: plus || 0
            },
          ],
        });
      })

      response.json(allProvinceStatistics)
    })

    res.on("error", (error) => {
      response.json(error)
    })
  })
});
//get one province statistics
app.get('/api/province/:provinceCode', (request, response) => {

  let provinceCode = Number(request.params.provinceCode)

  // Must be an 0 < interger < 49 
  if (!Number.isInteger(provinceCode) || provinceCode > 48 || provinceCode < 1) {
    response.json({ msg: "Please give an Integer number from 1 to 48" })
    return
  }
  //fixing issue: https://github.com/bilobom/covid19API/issues/2
  provinceCode += 1
  // change the orderByFields to WILAYA , put resultRecordCount = provinceCode , you get all wilayas
  // up till the last resultRecordCount, and then pop the array to get last result
  let GOV_API_WILAYA = 'https://services8.arcgis.com/yhz7DEAMzdabE4ro/arcgis/rest/services/Cas_confirme_view/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&outFields=*&orderByFields=WILAYA&resultRecordCount=' + provinceCode;

  https.get(GOV_API_WILAYA, (res) => {
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on('end', () => {
      //The data is in attributes field poped from features returned
      let ProvinceRawStatistics = JSON.parse(body).features.pop().attributes

      //Bizzare naming here, don't mind them    
      let {
        NOM_WILAYA, wilayat, WILAYA,
        Décés, Récupér, active, Cas_confirm, Femelle, Males,
        Date_rapport,
        A1_25, A25_34, a35_44, a45_59, A_60, cinqantneuf, soixantedix, plus } = ProvinceRawStatistics

      let ProvinceStatistics = {
        province: {
          codeName: WILAYA,
          french: NOM_WILAYA,
          arabic: wilayat,
        },
        deaths: Décés,
        recovered: Récupér,
        activeCases: active ? active : 0,
        totalConfirmedCases: Cas_confirm,
        females: Femelle,
        males: Males,
        lastUpdated: new Date(Date_rapport),
        ageStatistics: [
          {
            from: 0,
            to: 5,
            count: A1_25 || 0
          }, {
            from: 5,
            to: 15,
            count: A25_34 || 0
          }, {
            from: 15,
            to: 25,
            count: a35_44 || 0
          }, {
            from: 25,
            to: 35,
            count: a45_59 || 0
          }, {
            from: 35,
            to: 45,
            count: A_60 || 0
          }, {
            from: 45,
            to: 60,
            count: cinqantneuf || 0
          }, {
            from: 60,
            to: 70,
            count: soixantedix || 0
          }, {
            from: 70,
            to: 100,
            count: plus || 0
          },
        ],
      }


      response.json(ProvinceStatistics)
    })

    res.on("error", (error) => {
      response.json(error)
    })
  })
})


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
var port = normalizePort(process.env.PORT || '4000');

app.listen(port, () => {
  console.log("listening on port", port)
})
