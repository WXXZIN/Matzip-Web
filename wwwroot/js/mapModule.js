// mapModule.js

var mapModule = (function() {
    var map = '';

    // 지도 생성 및 옵션 설정
    var mapContainer = document.getElementById('map');
    var mapOption = {
        center: new kakao.maps.LatLng(35.214449, 129.066607),
        level: 9
    };

    function createMap() {
        map = new kakao.maps.Map(mapContainer, mapOption);
    }

    createMap();

    return {
        map: map
    }
})(locModule);