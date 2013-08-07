N.plug("MarkersVotesModel", function() {
N.extend(MarkersVotesModel, N.plugins.Model);

MarkersVotesModel.TABLE = "markers_votes";
MarkersVotesModel.FIELDS = { id : "required", mid : "required", uid : "required", date : "required", vote : "required" };
function MarkersVotesModel() {
	this.MarkersVotesModel();
}
MarkersVotesModel.prototype.MarkersVotesModel = function() {
	this.Model();
};
MarkersVotesModel.prototype.agree = function(data) {
	return (typeof data === "object") ? this.insert(N.objectMerge(data, { vote : true, date : new Date().toDateString() })) : false;
};
MarkersVotesModel.prototype.protest = function(data) {
	return (typeof data === "object") ? this.insert(N.objectMerge(data, { vote : false, date : new Date().toDateString() })) : false;
};
MarkersVotesModel.prototype.userVotedForMarker = function(uid, mid) {
	return (this.select(function(row) { return row.uid === uid && row.mid === mid; }).length > 0) ? true : false;
};
MarkersVotesModel.prototype.markerHistory = function(mid) {
	var markerVotes = this.select(function(row) { return row.mid === mid; }), i = markerVotes.length;
	while (i--) {
		markerVotes[i].user = this.select(function(row) { return row.id === markerVotes[i].uid; }, "users")[0];
	}
	return markerVotes;
};

return MarkersVotesModel;
});