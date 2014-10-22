// Generic searchbox.
//
// Following methods to be provided on sbInterface
// * sbInterface.throttledSearch -> called while typing.
// * sbInterface.search -> called on form submit or return key.
// * sbInterace.select -> called on a click on the item in the list.
// * sbInterface.label -> called on each item in searchList to generate
// the label for the dropdown.
// default is provided and assumes
// * sbInterface.highlight -> function passed the display string and
// which can be used to decorate the string displayed in the dropdown.
// default is provided.
//
// Communicates with:
// * sbInterface.searchList -> candidates to display in the dropdown.
// * sbInterface.searchTerm -> either hard set during drop-down plus return
// or on a simple submit.
angular
.module("searchbox", ["ngSanitize"])
.directive("searchbox", ["$sce", function($sce) {
	return {
		restrict: 'E',
		replace: true,
      	templateUrl: "templates/searchbox.html",
        scope: {
            // dropped into the input placeholder.
            placeholder: "@",
            sbInterface: "="
        },
		link: function(scope, element) {
            scope.showDropdown = false;
            scope.$watchCollection("sbInterface.searchList", function() {
                var slist = scope.sbInterface.searchList || [];
                scope.searchList = slist;
                // Update dropdown list visibility.
                scope.showDropdown = slist.length;
            });

            scope.searchTerm = scope.sbInterface.searchTerm;
            scope.$watch("sbInterface.searchTerm", function() {
                scope.searchTerm = scope.sbInterface.searchTerm;
            });
            scope.$watch("searchTerm", function() {
                // Update the search term.
                scope.sbInterface.searchTerm = scope.searchTerm;
                scope.throttledSearch();
            });

            scope.throttledSearch = scope.sbInterface.throttledSearch || function() {};
            scope.search = scope.sbInterface.search || function() {};
            scope.select = scope.sbInterface.select || function() {};

            scope.label = scope.sbInterface.label || function(item) {
                return item.label;
            };
            // Passed the label string in the dropdown.
            scope.highlight = scope.sbInterface.highlight || function(s) {
                var match = s.toLowerCase().indexOf(scope.searchTerm.toLowerCase());
                if (match > -1) {
                    var termLen = scope.searchTerm.length;
                    // injext wrapper.
                    s = s.slice(0, match) + "<strong>" + s.slice(match, match + termLen) + "</strong>" + s.slice(match + termLen);
                }
                return $sce.trustAsHtml(s);
            };

            element.find("form").on('submit', function(ev) {
                ev.preventDefault();
                // Update the search term.
                scope.sbInterface.searchTerm = scope.searchTerm;
                scope.search();
                // This can happen outside of the digest, reflect changes in
                // view.
                scope.$apply();
            });
        }
    };
}]);
