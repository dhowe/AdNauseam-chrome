var opts;

function init() {

	opts = 0;
	
	$("#log-button").click(function() {
		//console.log("#log-button.click");
	});
	
	$("#vault-button").click(function() {
		//console.log("#vault-button.click");
	});
	
	$("#pause-button").click(function() {
		console.log("#pause-button.click");
		
		refresh_panel();
	});
	
	$("#settings-button").click(function() {
		//console.log("#settings-button.click");
		$(".page").toggleClass( "hide" );
	});
	
	$("#about-button").click(function() {
		//console.log("#about-button.click");
	}); 

}

function refresh_panel() {

	var img, label;
	
	if (opts == 1) {
	
		img = "img/adn78@2x.png", label = "Pause AdNauseam";
		$("#pause-button").removeClass('disabled');
	
		opts = 0;
	}
	
	else {
		
		img = "img/adn78@2xg.png";
		label = "Start AdNauseam";
		$("#pause-button").addClass('disabled');
		
		opts = 1;
	}

	$("#toggle-button").css("background-image", 'url('+img+')');
	$("#pause-button").text(label); 
	
}
/*
self.port.on("refresh-panel", function(opts) {
	
	var img = "img/adn78@2x.png", label = "Pause AdNauseam";
	
	$("#pause-button").removeClass('disabled');
	
	if (!opts.enabled) {
		
		img = "img/adn78@2xg.png";
		label = "Start AdNauseam";
		$("#pause-button").addClass('disabled');
	}

	$("#toggle-button").css("background-image", 'url('+img+')');
	$("#pause-button").text(label); 
});

self.port.on("refresh-ads", function(data) {
	
	//console.log("popup.refresh-ads: ad-objs->"+ads.length);
	
	console.log("#objects: " + data.ads.length);
	console.log("uniqueCount: " + data.uniqueCount);
	console.log("pageCount: " + data.onpage.length);
	
	var visitedCount = 0;
	for (var i=0, j = data.onpage.length; i<j; i++) {
		if (!data.onpage[i].hidden && data.onpage[i].visitedTs > 0) 
			visitedCount++;
	}
	
	$('#vault-count').text(data.uniqueCount);
	$('#found-count').text(data.onpage.length+' ads found');
	$('#visited-count').text(visitedCount+' ads visited'); 
	
	var result = createHtml(data.onpage);
	$('#ad-list-items').html(result);
});

function createHtml(ads) {
		
	var html = '';

	for (var i=0, j = ads.length; i<j; i++) {

		console.log(i+") "+ads[i].contentType);

		if (ads[i].contentType === 'img') {

			html += '<li class="ad-item"><a target="new" href="' + ads[i].targetUrl;
			html += '"><span class="thumb"><img src="' + ads[i].contentData;
			html += '" class="ad-item-img' + (ads[i].visitedTs >= 0 ? '-visited"' : '"');
			html += ' onError="this.onerror=null; this.src=\'img/blank.png\';"';
			html += '" alt="ad thumb"></span><span class="title">' + ads[i].title;
			html += '</span><cite>'+targetDomain(ads[i].targetUrl)+'</cite></a></li>\n\n';
		}
		else if (ads[i].contentType === 'text') {
			
			html += '<li class="ad-item-text';
			html += (ads[i].visitedTs >= 0 ? '-visited' : '') + '""><span class="thumb">';
			html += 'Text Ad</span><h3><a target="new" href="' + ads[i].targetUrl + '">';
			html += ads[i].title + '</a></h3><cite>' + targetDomain(ads[i].targetUrl);
			html += '</cite><div class="ads-creative">' + ads[i].contentData +'</div></li>\n\n';
		}
	}
	
	//console.log("\nHTML\n"+html+"\n\n");
	
	return html;
}

function targetDomain(text) {
	
	var doms = extractDomains(text);
	var dom = doms[doms.length-1];
	return new URL(dom).hostname;
}

function extractDomains(text) {

	var result = [], matches;	
	var regexp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	
	while (matches = regexp.exec(text))
	    result.push(matches[0]);
	
	//console.log(result);
	
	return result;
}

// -----------------------------------------------------------------

self.port.on("close-panel", function() {
	console.log("popup.close-panel: ");
});

self.port.on("open-panel", function() {
	console.log("popup.open-panel: ");	
});

self.port.on("load-advault", function() {
	console.log("popup.open-panel: ");
});
*/

$(document).ready(function() { init(); });
