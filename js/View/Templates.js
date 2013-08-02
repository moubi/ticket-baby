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
		'<p>Are you sure there is a valid trap on this location? Note that other people may protest that.</p>' + 
		'<div data-value="yes" data-misc="button small">Yes</div><div data-value="no" data-misc="button small">No</div>' + 
	'</div>'
}, 
overview_popup : {
	name : "overview_popup", 
	value :
	'<div class="popup _8" data-type="{?type?}">' + 
		'<h2>Speed trap</h2>' +  
		'<div>'+
			'<ul class="users">' +
				'<li>{?data.first_name?} {?data.last_name?} <em>({?data.date?})</em></li>' + 
			'</ul>' +
			'<div data-value="protest" data-misc="button large red" class="td arrow_down _2 right">Protest</div>' +
			'<div data-value="agree" data-misc="button large orange" class="td arrow_up _3 left">Agree</div>' +
			'<div class="clear"></div>' + 
		'</div>' + 
	'</div>'
}
};
});