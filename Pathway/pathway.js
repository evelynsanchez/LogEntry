(function () {
    var app = angular.module("BlakWealth");
    app.config(configure);
    configure.$inject = ['$stateProvider'];

    function configure($stateProvider) {
        $stateProvider
            .state({
                name: 'PathWayScreen',
                component: 'pathway',
                url: '/pathway/{id}'
            })
            .state({
                name: 'PathWayScreen.content',
                component: 'pathwaycontent',
                url: '/{contentId:int}'

            })
    }
    //content controller 
    app.component('pathwaycontent', {
        templateUrl: '/content.html',
        controller: 'ContentController'
    });

    //main controller
    app.component('pathway', {
        templateUrl: 'pathway/PathWay.html',
        controller: 'PathWaysController'
    });


})();


(function () {
    "use strict";
    angular.module("BlakWealth")
        .factory("PathWayService", PathWayService);
    PathWayService.$inject = ["$http", "$q"];

    function PathWayService($http, $q) {

        return {
           getPathway: _getPathway,
            GetPathWayContent: _getPathwayCont
        };

        function _getPathway(id) {
            var settings = {
                url: "/Pathway/getPathway/" + id
                , method: "GET"
                , cache: false
                , withCredentials: true
            };
            return $http(settings)
                .then(_getPathwaySuccess, _getFail);
        }
        function _getPathwaySuccess(response) {
            return response;
        }
        function _getFail(error) {
            var msg = 'Failed to load pathway'
            if (error.data && error.data.description) {
                msg += '\n' + error.data.description;
            }
            error.data.description = msg;
            return $q.reject(error);
        }

        function _getPathwayCont(id) {
            var settings = {
                url: "/Pathway/getContent/" + id
                , method: "GET"
                , cache: false
                , withCredentials: true
            };
            return $http(settings)
                .then(_getSuccess, _getError);
        }

        function _getSuccess(response) {
            return response.data;
        }
        function _getError(error) {
            var msg = 'Failed to load pathway content'
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
        .controller('ContentController', ContentController);
    ContentController.$inject = ['PathWayService', '$stateParams', '$scope', '$state'];

    function ContentController(PathWayService, $stateParams, $scope, $state) {
        var vm = this;
        vm.showContent = true;
        vm.contentItemId = $stateParams.contentId;
        vm.next = _next;
        vm.previous = _previous; 

        $scope.$watch(
            function () { return $scope.$parent.pathwayItems },
            function (pathwayItems) {
           
                if (pathwayItems && pathwayItems.length > 0) {
                    vm.showPrevious = pathwayItems[0].contentItemId != vm.contentItemId
                    vm.showNext = pathwayItems[pathwayItems.length - 1].contentItemId != vm.contentItemId
                }

        })
       
        function _next() {
            $scope.$emit("nextPathWayLevel", vm.contentItemId)
        }
        function _previous() {
            $scope.$emit("prevPathWayLevel", vm.contentItemId)
         
        }     

    }
})();

(function () {
    "use strict";
    angular.module('BlakWealth')
        .controller('PathWaysController', PathWaysController);
    PathWaysController.$inject = ['PathWayService', '$stateParams', '$state', '$scope', 'alertService'];

    function PathWaysController(PathWayService, $stateParams, $state, $scope, alertService) {
        var vm = this;
        vm.items = [];
        vm.PathWayService = PathWayService;
        vm.id = $stateParams.id;
        getPathways();
        vm.$state = $state

        $scope.$on("prevPathWayLevel", function (event, contentItemId) {       
            for (var i = 0; i < vm.items.length; i++) {
                if (vm.items[i].contentItemId == contentItemId) {
                    $state.go( 'PathWayScreen.content',{contentId: vm.items[i - 1].contentItemId})
                    break;
                }
            }     
        });

        $scope.$on("nextPathWayLevel", function (event, contentItemId){
            for (var i = 0; i < vm.items.length; i++) {
                if (vm.items[i].contentItemId == contentItemId) {
                    $state.go('PathWayScreen.content', { contentId: vm.items[i + 1].contentItemId })
                    break;
                }
            }
        });
            
        function getPathways() {
            vm.id = $stateParams.id;
            vm.PathWayService.getPathway(vm.id).then(_getPathwaySuccess, _getFail);
        }
        function _getFail(error) {
            alertService.error("Trying to reconnect")
        }
        function _getPathwaySuccess(response) {
            console.log(response.data.item)
            vm.coverImage = response.data.item.coverImage
            vm.description = response.data.item.description
            vm.PathWayService.GetPathWayContent(response.data.item.id).then(getContentInfo)
            vm.pathwayName = response.data.item.name
        }      
        function getContentInfo(response) {
            console.log(response.items)
            for (var i = 0; i < response.items.length; i++) {
                vm.items.push(response.items[i])        
            }
            $scope.pathwayItems = vm.items;
        }
        function _getSuccess(response) {
            vm.items
        }
        function _getFailed(error) {
            if (error && error.message) {
                return error; 
            }
        }
    }
})();