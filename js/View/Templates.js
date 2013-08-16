N.plug("Templates", function() {
return {
login : {
	name : "login", 
	value : 
	'<form method="post action="#" data-type="login">' + 
		'<input type="text" value="Email" name="email" />' + 
		'<input type="text" value="Password" name="password" data-type="password" />'+ 
		'<button type="submit" class="right">Login</button>' + 
	'</form>'
}, 
registration : {
	name : "registration", 
	value : 
	'<form method="post action="#" data-type="registration">' +
		'<input type="text" value="First name" name="first_name" />' + 
		'<input type="text" value="Last name" name="last_name" />' +
		'<input type="text" value="Email" name="email" />' +  
		'<input type="text" value="Password" name="password" data-type="password" />'+
		'<button type="submit" class="right">Register</button>' + 
	'</form>'
}, 
welcome : {
	name : "welcome", 
	value : 
	'Hi {?data.first_name?} {?data.last_name?} | ' + 
	'<a id="logoutButton" href="javascript:;" title="Logout">Logout</a>'
}, 
traps : {
	name : "traps", 
	value :
	'<div class="traps">' + 
		'<p>' + 
		'{? if (logged) { ?}' +  
			'Select trap from the list and clik on the map to add it.' + 
		'{?} else {?}' + 
			'Please login to place a trap marker.' + 
		'{?}?}' +
		'</p>' + 
		'<ul>' + 
		'{? if (data) { ?}' + 
		'{? for (var i = 0; i < data.length; i++) { ?}' + 
			'<li data-marker-id="{?data[i].id?}" data-type="{?data[i].type?}"><img class="trapsMarker" src="{?data[i].iconUrl?}" alt="{?data[i].name?}" /><span>{?data[i].name?}</span></li>' +
		'{?}?}'	+
		'{?}?}'	+
		'</ul>'	+ 
	'</div>'
}, 
agreement_popup : {
	name : "agreement_popup", 
	value :
	'<div class="popup _7" data-type="{?type?}">' + 
		'<p>Arey you sure this is a speed trap?</p>' + 
		'<div data-value="yes" data-misc="button small">YES</div><div data-value="no" data-misc="button small red">NO</div>' + 
	'</div>'
}, 
overview_popup : {
	name : "overview_popup", 
	value :
	'<div class="popup _8" data-type="{?type?}" data-marker={?data.marker.id?}>' + 
		'<h2>Speed trap</h2>' +  
		'<div class="content">' +
			'<ul class="users">' +
				'<li>{?data.first_name?} {?data.last_name?} <em>({?data.marker.date?})</em></li>' + 
			'</ul>' +
			'<div data-value="protest" data-misc="button large red" class="td arrow_down _3 right">Immobilized</div>' +
			'<div data-value="agree" data-misc="button large orange" class="td arrow_up _2 left">Agree</div>' +
			'<div class="clear"></div>' +
		'</div>' + 
		'<ul class="menu">' +
			'<li><a data-value="details" href="javascript:;" title="Details">Details</a></li>' +
			'<li><a data-value="history" href="javascript:;" title="History">History</a></li>' + 
		'</ul>' + 
	'</div>'
}, 
trap_history : {
	name : "trap_history", 
	value :
	'<ul class="users">' +
		'<li>{?user.first_name?} {?user.last_name?} <em>({?user.date?})</em></li>' + 
	'{? for (var i = 0; i < data.length; i++) { ?}' +
		'<li class="vote_{?+data[i].vote?}">{?data[i].user.first_name?} {?data[i].user.last_name?} <em>({?data[i].date?})</em></li>' +
	'{?}?}' +
	'</ul>'
}, 
trap_details : {
	name : "trap_details", 
	value :
	'<ul class="users">' +
		'<li>{?user.first_name?} {?user.last_name?} <em>({?user.date?})</em></li>' + 
	'</ul>' +
	'<div data-value="protest" data-misc="button large red" class="td arrow_down _3 right">Immobilized</div>' +
	'<div data-value="agree" data-misc="button large orange" class="td arrow_up _2 left">Agree</div>' +
	'<div class="clear"></div>'
}
};
});