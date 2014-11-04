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

$(document).ready(function() { init(); });
