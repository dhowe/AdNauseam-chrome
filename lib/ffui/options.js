var prefs = require('sdk/simple-prefs').prefs;
var data = require("sdk/self").data;

// Note: Loaded before we have a logger!

var _Options = require('sdk/core/heritage').Class({
	
	tab : null,
	worker : null,

	initialize : function() {

		require('sdk/simple-prefs').on('', function(pname) { // any pref change
			
			var Logger = require("./logger").Logger;
			
			Logger.log("Options."+pname+"="+prefs[pname]);
			
			if (pname === 'enabled') {
	
				require("./uiman").menu.refresh();
			}
			else if (pname === 'disableLogs' && prefs['disableLogs']) {
				
				require("./logger").Logger.reset();
			}
		});				
	},	
	
	get : function(pname) {
		
		if (typeof prefs[pname] == 'undefined') 
			throw Error("No pref for: "+pname); 
		
		return prefs[pname];
	},
	
	set : function(pname, val) {

		prefs[pname] = val;
	},
	
	toggle : function(pname) {
		
		if (typeof prefs[pname] == 'undefined') 
			throw Error("No pref for: "+pname); 
		
		prefs[pname] = !prefs[pname]
	},

	toJSON : function() {

	    var options = {};
		
		options.enabled = prefs['enabled'];
		options.disableLogs = prefs['disableLogs'];
		
		return options;
	},
	
	dump : function(logger) {
		
		if (!logger) throw Error("no logger!");
		
		var s = 'Options:', opts = this.toJSON();
		for (var pref in opts) {
		    if (opts.hasOwnProperty(pref)) {
		        s += '\n  '+pref + '=' + prefs[pref];
		    }
		}
		
		logger.log(s);  
	},  
		
	closeTab : function() {
		
		if (this.tab) {
				
			this.tab.unpin();
			this.tab.close();
		}
	},
	
	updateAdview : function(field, theAd) {
		
		var update = { id: theAd.id, field: field, value: theAd[field] };
		
		if (!this.worker) {
			//require("./adnlogger").Logger.log("updateAdview: No adview open!");
			return;
		}
		
		this.worker.port.emit("ADNUpdateAd", update);
	},
	
  	loadAdview : function(tab) {
		
		console.log("loadAdview: NO-ADNCOMP");

	    /*var parser = require("./adncomp").Component.parser;
	    
		var worker = tab.attach({
			
			contentScriptFile : [ 
				data.url('lib/jquery-1.8.3.min.js'),
				data.url('adview-shim.js')
			],
			
			contentScriptOptions : { ads: parser.getAds() }
		});	
		
		var me = this;
		worker.port.on("ADNClearAds", function(data) { 
            
  			parser.clearAds(); 
  			me.closeTab();
        });
        
        this.worker = worker;*/
  	},
  	
	openInTab : function(pageUrl) {
		
		var me = this;
		
		if (!this.tab) {
			
			console.log("NO ADN-TAB, recreating...");
			require('sdk/tabs').open({
				
				url: pageUrl,
			    isPinned: true,
				onOpen: function(tab) {
					me.tab = tab;
			  	},
	
			  	onReady : function(tab) {
			  		
					//console.log("URL(onReady): "+tab.url);
					
					if (/adview.*\.html$/.test(tab.url))
						me.loadAdview(tab);
				},
				
				onActivate : function(tab) {
					
					//console.log("URL(onActivate): "+tab.url);
					
					if (/adview.*\.html$/.test(tab.url))
						me.loadAdview(tab);
				},
				
			  	onClose: function(tab) {
			  		
					me.tab = null;
			  	}
			});
		}
		else {
			
			this.tab.url = pageUrl; 
  			this.tab.activate();
		}
	}
	
});

exports.Options = _Options();

