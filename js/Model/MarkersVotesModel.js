N.plug("MarkersVotesModel", function() {
N.extend(MarkersVotesModel, N.plugins.Model);

MarkersVotesModel.TABLE = "markers_votes";
MarkersVotesModel.FIELDS = { id : "required", mid : "required", uid : "required", vote : "required" };
function MarkersVotesModel() {
	this.MarkersVotesModel();
}
MarkersVotesModel.prototype.MarkersVotesModel = function() {
	this.Model();
};

return MarkersVotesModel;
});