// locModule.js

var locModule = (function() {
    var address = '';

    function getLocation(callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const lat = position.coords.latitude; // 위도
                const lon = position.coords.longitude; // 경도
    
                const geocoder = new kakao.maps.services.Geocoder();
    
                geocoder.coord2Address(lon, lat, (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        address = result[0].address.address_name;

                        alert('현재 위치 정보를 갱신하였습니다!');
                        
                        callback(address);
                    }
                });
            });
        }
    }

    return {
        getLocation: getLocation
    }
})();