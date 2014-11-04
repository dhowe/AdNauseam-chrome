var aboutURL = "https://github.com/dhowe/AdNauseam/wiki/Help";
var Options = require("./options").Options;
var data = require("sdk/self").data;

var button = require('sdk/ui/button/toggle').ToggleButton({

	id : "adnauseam-button",
	label : "AdNauseam",
	icon : buttonIconSet(),
	onChange : handleChange
});

var menu = require("sdk/panel").Panel({

	contentURL : data.url("./popup-menu.html"),
	contentScriptFile : [
		data.url("lib/jquery-1.10.2.min.js"), 
		data.url("lib/jquery-1.11.2-ui.js"),
		data.url("popup-menu.js")
	],
	onShow : openPanel,
	onHide : closePanel
});

// event-handlers ----------------------------------------------

menu.port.on("show-vault", function() {

	//Options.openInTab(aboutURL);
});

menu.port.on("toggle-enabled", function() {

	Options.toggle('enabled');
});

menu.port.on("disable", function() {

	//Options.set('enabled', false);
	Options.toggle('enabled');
});

menu.port.on("show-about", function() {
	
	menu.hide();
	Options.openInTab(aboutURL);
});

menu.port.on("show-log", function() {
	
	menu.hide();
	
	var Logger = require("./logger").Logger;

	if (Options.get('disableLog') || !Logger.ostream) {
		
		Logger.notify("No log available (AdNauseam is disabled or" 
			+" the 'disableLogs' preference is checked)"); // TODO: localize
	}
	else { 
		
		Options.openInTab("file://" + Logger.logFile.path);
	}
});


// functions --------------------------------------------------

function refresh() {

	menu.port.emit("refresh-panel",  Options.toJSON());	
	button.icon = buttonIconSet();
}

function handleChange(state) {

	//console.log("handleChange"); 
	
	if (state.checked) {

		menu.show({
			
			position : button,
			width : 387,
			height : 500,
		});		
	} 
	
	refresh();
}

function buttonIconSet() {

	return {
		
		"16" : buttonIcon(16),
		"32" : buttonIcon(32),
		"64" : buttonIcon(64)
	};
}

function buttonIcon(size) {
	
	return Options.get('enabled')
		? data.url('img/icon-'+size+'.png') 
		: data.url('img/icon-'+size+'g.png');
}

function closePanel() {
	
	button.state('window', {
		checked : false
	});
	
	menu.port.emit("close-panel"); // -> popup-menu.js
}

function openPanel() {

	var rawAds = require('../test/test-ad-data').ads; // tmp-remove
	
	var pageUrl = require('sdk/tabs').activeTab.url;
	
	//console.log('page :: ' + pageUrl);

	var data = processAdData(rawAds, pageUrl);

	menu.port.emit("refresh-ads", data); // -> popup-menu.js
}

function processAdData(ads, page) {
	
	var ad, unique=0, onpage=[], soFar, hash = {};
	
	// set hidden val for each ad
	for (var i=0, j = ads.length; i<j; i++) {
		
		ad = ads[i];
		
		if (!ad.contentData) continue;
		
		soFar = hash[ad.contentData];
		if (!soFar) {
			
			// new: add a hash entry
			hash[ad.contentData] = 1;
			ad.hidden = false;
			
			// update count on this page
			if (page === ads[i].pageUrl) {
				
				//onpage++; // TODO: don't count old ads from same url
				onpage.push(ads[i]);
			} 

			// update total (unique) count			
			unique++;
		}
		else {
			
			// dup: update the count
			hash[ad.contentData]++;
			ad.hidden = true;
		}
	}
	
	// update the count for each ad from hash
	for (var i=0, j = ads.length; i<j; i++) {
		
		ad = ads[i];
		ad.count = hash[ad.contentData];
	}

	return { ads: ads, uniqueCount: unique, onpage: onpage };
}

exports.menu = menu;
exports.menu.refresh = refresh;
exports.button = button;