const webhoseio = require('webhoseio/webhoseio.js');

const client = webhoseio.config({token: '921fa2e6-ad2c-4d93-82ac-842d041399b7'});

//var query = "Bruno Mars (site_type:news OR site_type:blogs)";
var query = "Bruno Mars thread.title:(Bruno Mars) language:(english) thread.country:US (site_type:news)"
    client.query('filterWebData', {q: query, size:10})
    .then(output => {
	    console.log(output['totalResults']);
	    // 15565094

	    console.log(output['posts'].length);
	    // 100

	    console.log(output['posts'][0]['language']);
	    // english

	    console.log(output['posts'][0]["title"]);
	    // Putting quotes around dictionary keys in JS
	});
