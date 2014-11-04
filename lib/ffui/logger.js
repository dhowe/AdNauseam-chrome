var Cc = require("chrome").Cc;
var Ci = require("chrome").Ci;
var data = require("sdk/self").data;
var Options = require("./options").Options;

var _Logger =  require('sdk/core/heritage').Class({

	fileName :  'adnauseam.log',

    initialize : function() {
    	
    	this.ostream = null;
    	
    	this.prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].
    		getService(Ci.nsIPromptService);
    		
    	this.alertsService = Cc["@mozilla.org/alerts-service;1"]
    		.getService(Ci.nsIAlertsService);
    	
		this.logFile = Cc["@mozilla.org/file/directory_service;1"]
			.getService(Ci.nsIProperties).get("ProfD", Ci.nsIFile);
			
		this.logFile.append(this.fileName);

		if (Options.get('disableLogs')) return;
		
		this.reset();
	},
	
	dispose : function() {
		
		console.log("Logger.dispose()");

		if (this.logFile && this.logFile.exists()) {
			this.logFile.remove();
			if (this.logFile && this.logFile.exists())
				console.error("Logger.dispose() still exists! "+this.logFile.exists());
			this.logFile = null;
		}
		
		this.ostream && (this.ostream = null);
		this.prompts && (this.prompts = null);
		this.alertsService && (this.alertsService = null);
	},
	
	reset : function() {
		 			
		try {
			
			if (!this.logFile.exists()) {
				
				this.ostream = null;
				this.logFile.create(Ci.nsIFile.NORMAL_FILE_TYPE, 0666);
				console.log("Created " + this.logFile.path);
			}
	
			if (!this.ostream) {
				
				this.ostream = Cc["@mozilla.org/network/file-output-stream;1"]
					.createInstance(Ci.nsIFileOutputStream);
				
				//var flags = Options.saveLogs ? 0x02 | 0x10 : -1;

				this.ostream.init(this.logFile, 0x02, -1, 0);
				 
				this.log('=');
				this.log("Log: " + this.logFile.path);
					
				Options.dump(this);	
			}
		}
		catch(e) {
			
			console.exception(e);
		}
	},


	log : function(msg) { 
		
		if (!Options.disableLogs && (typeof this.ostream === 'undefined'  
			|| !this.ostream || !this.logFile || !this.logFile.exists())) 
		{ 
			console.warn('AdnLogger: Reinitializing log');

			this.initialize();
			
			if (typeof this.ostream === 'undefined' || !this.ostream) { 
				console.warn('AdnLogger: Unable to create iostream');
				console.trace();
			}			
		}
		
		console.log(msg);
		
		if (!Options.disableLogs) {
			
			if (!msg || !msg.length) {
				msg = '\n';
				this.ostream.write(msg, msg.length);
				return;
			}
			
			if (msg === '=') {
				msg = '\n'+ this.line(90);
				this.ostream.write(msg, msg.length);
				return;
			}
			
			var d = new Date(), ms = d.getMilliseconds()+'', now = d.toLocaleTimeString();
		    ms =  (ms.length < 3) ? ("000"+ms).slice(-3) : ms;
	 
			msg = "[" + now  + ":" + ms + "] " + msg + "\n" + this.line(90);
				
			if ( typeof this.ostream === 'undefined' || !this.ostream) {
				console.error("NO IO!");
				return;
			}
			
			this.ostream.write(msg, msg.length);
		}
	}, 
	
	warn : function(msg, notify) { 
   		
   		console.warn(msg);
   		
   		this.log("[WARN]\n     "+msg, notify);
   	},
   	
   	err : function(msg, e) { 
   		
   		this.log("[ERROR]" + this.line(90) + "\n" + msg + "\n");
   		
   		console.error(msg);
   		
   		if (e) 
   			console.exception(e);
   		else
   			console.trace();
   	},
   	
   	alert : function(message, title) {
   		
   		if (!message) return;
   		
   		title = title || 'AdNauseam';
   		
   		this.log("Alert: "+message);
   		
   		this.prompts && (this.prompts.alert(null, title, message));
   	},
   		
   	notify : function(message, title, url, noLog) {
   		
   		if (!message) return;
   		
   		title = title || 'AdNauseam';
   		
   		if (!noLog)
   			this.log("Notify: "+message.replace(/[\r\n]/,' '));
   			
		if (message.length <= 100) message = '\n' + message
   		   		
   		try {
   			if (url) {
	   			var listener = {
	   				observe : function(subject, topic, data) {
	   					if (topic === 'alertclickcallback')
	   						Options.openInTab(data); 
	   				}
	   			}
	   			this.alertsService.showAlertNotification(data.url('img/adn128.png'),
	   				 title, message, true, url, listener);
	   		}
	   		else {
	   			this.alertsService.showAlertNotification(data.url('img/adn128.png'), 
	   				title, message);
			}
		}
		catch (e) {
			
			// This can fail on Mac OS X
			console.warn("No notification!", e); // TODO: remove
		}
	},
	
   	trimPath : function(u, max) {
    	
		max = max || 60;
		if (u && u.length > max) 
			u = u.substring(0,max/2)+"..."+u.substring(u.length-max/2);
		return u;
	},
	
   	line : function(num, sep) {
		var s = '';
		num = num || 78;
		sep = sep || '=';
		for (var i=0; i < num; i++) 
		  s += sep;
		return s+'\n';
	},
		
});

exports.Logger = _Logger();
