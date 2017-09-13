//setting the module
(function () {
    var app = angular.module("BlakWealth");
    app.config(configure);
    configure.$inject = ['$stateProvider'];

    function configure($stateProvider) {
        $stateProvider
            .state({
                name: 'LogEntryViewer',
                component: 'logEntryViewer',
                url: '/admin/LogEntryViewer'
            });
    }

    //register component
    app.component('logEntryViewer', {
        templateUrl: 'logentryviewer/LogEntry.html',
        controller: 'LogViewerController',
        controllerAs: 'table'
    });
})();


//getting the module
(function () {
    'use strict'
    angular.module('BlakWealth') 
        .factory('LogViewerService', LogViewerService);

    LogViewerService.$inject = ['$http', '$q'];

    function LogViewerService($http, $q) {

        return {
            post: _post
        };

        function _post(data) {
            var settings = {
                url: '/api/LogEntry/Search',
                method: 'POST',
                cache: false,
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify(data)
            };
            return $http(settings)
                .then(_postSuccess, _postFailed);
        }

        function _postSuccess(response) {
            console.log(response);
            return response.data;
        }
        function _postFailed(error) {
            var msg = 'Failed to retrieve Log Entry'
            if (error.data && error.data.description) {
                msg += '\n' + error.data.description;
            }
            error.data.description = msg;
            return $q.reject(error);
        }
    }

})();

(function () {
    "use strict";
    angular.module('BlakWealth')
        .controller('LogViewerController', LogViewerController);

    LogViewerController.$inject = ['LogViewerService']

    function LogViewerController(LogViewerService) {
        var vm = this;
        vm.LogViewerService = LogViewerService;
        vm.$onInit = _init; // when the page loads it will do this function
        vm.searchedClicked = searchedClicked;
        vm.itemList = []; //all items from the ajax call      
        vm.searchTerm = "";
        vm.searchTermChange = _filter; //where they'll exist
        vm.filters = []; //list of items that meet the filter               
        vm.busy = false;
        vm.IsLoading = false;

        vm.criteria = {
            filter: "",
            info: true,
            warning: true,
            error: true,
            pageSize: 20,
            pageNum: 0
        }

        function searchedClicked(data) {
            vm.itemList = []
            vm.criteria.pageNum = 0
            vm.$onInit()

        }
        vm.update = function (itemList) {
            _post.loadItems(itemList);
        }

        function _filter() {
            vm.update;
            vm.filters = vm.itemList.filter(_adminFilter);

        }

        function _adminFilter(row) {
            if (!vm.searchTerm) {
                return true;
            }

            var searchstring = vm.searchTerm.toUpperCase();
            return (row.message && row.message.toUpperCase().indexOf(searchstring) > -1)
        }

        vm.loadMore = _init

        function _init() {

            if (vm.busy) return;
            vm.busy = true;
            vm.IsLoading = false;
            LogViewerService.post(vm.criteria)
                .then(_postSuccess, _postError);
        }

        function _postSuccess(data) {
            console.log(data);
            for (var i = 0; i < data.items.length; i++) {
                vm.itemList.push(data.items[i]);
            }
            vm.criteria.pageNum = vm.criteria.pageNum + 1;
            _filter();
            vm.busy = false;
            vm.IsLoading = true;

        }
        function _postError(error) {
            if (error && error.message) {
                vm.alertService.error(error.message, "Post Failed")
            }
        }
    }
})();