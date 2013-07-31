N.plug("View", function() {
N.extend(View, N.plugins.Publisher);

//View.events = { MAP_CREATED : "map_created", FACTORY_CREATED : "factory_created"};
function View() {
	this.View();
}
View.prototype.View = function() {
	this.Publisher();
};

return View;
});