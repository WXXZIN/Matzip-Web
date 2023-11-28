// markersModule.js

var markersModule = (function(mapModule) {
    var map = mapModule.map;
    var markers = [];
    var customOverlays = [];

    function handleMarkerClick(overlay) {
        map.panTo(overlay.getPosition());
        customOverlays.forEach(function(overlay) {
            overlay.setMap(null);
        })
        overlay.setMap(map);
        listModule.displayMarkerInfo();
    }

    function closeOverlay() {
        customOverlays.forEach(function(overlay) {
            overlay.setMap(null);
        });
    }

    // 마커 생성 및 표시 함수
    function displayMarkers(address) {
        // 기존 마커 제거
        markers.forEach(function(marker) {
            marker.setMap(null);
        });

        markers = [];

        modelData.forEach(function(data) {
            var markerPosition = new kakao.maps.LatLng(data.lat, data.lng);

            var marker = new kakao.maps.Marker({
                position: markerPosition
            });

            // 커스텀 오버레이를 위한 HTML 설정
            var overlayContent = '<div class="wrap">' + 
                                    '<div class="info">' +

                                        '<div class="title">'+
                                            data.name +
                                            '<span class="material-symbols-outlined" onclick="closeOverlay()">close</span>' + 
                                        '</div>' +
                                        '<div class="body">' + 
                                            '<div class="menu"> 메뉴 : '+data.menu+'</div>' + 
                                            '<div class="addr"> 주소 : '+data.addr+'</div>' + 
                                            '<div class="time"> 영업 시간 : '+data.time+'</div>' + 
                                            '<div class="tel"> 연락처 : '+data.tel+'</div>' +    
                                        '</div>' +
                                        '<div class="dir">' +
                                            '<span class="material-icons">turn_right</span>' +
                                            '<a href="https://map.kakao.com/?sName=' + address + '&eName=' + data.addr + '" target="_blank">길찾기</a>' +
                                        '</div>' +
                                    '</div>' +    
                                '</div>';

            // 커스텀 오버레이 생성
            var overlay = new kakao.maps.CustomOverlay({
                content: overlayContent,
                position: markerPosition,
                xAnchor: 0.5,
                yAnchor: 1.0
            });

            kakao.maps.event.addListener(marker, 'click', function() {
                handleMarkerClick(overlay);
            })

            kakao.maps.event.addListener(overlay, 'click', function() {
                closeOverlay();
            })

            markers.push(marker);
            customOverlays.push(overlay);
        });
    }

    function getMarkerInfo() {
        var markerInfo = [];
        for (var i = 0; i < markers.length; i++) {
            var data = modelData[i];
            var marker = markers[i];
            var position = marker.getPosition();
            markerInfo.push({
                marker: marker,
                name: data.name,
                menu: data.menu,
                coordinates: position.getLat()+'/'+position.getLng()
            });
        }
        return markerInfo;
    }

    function updateMarkersEvent() {
        var currentLevel = map.getLevel();
        var show = currentLevel < 8;

        markers.forEach(function(marker) {
            marker.setMap(show ? map : null);
        });
    }

    function updateOverlaysEvent() {
        if (map.getLevel() >= 7) {
            customOverlays.forEach(function(overlay) {
                overlay.setMap(null);
            });
        }
    }

    window.closeOverlay = function() {
        markersModule.closeOverlay();
    };

    return {
        displayMarkers: displayMarkers,
        updateMarkersEvent: updateMarkersEvent,
        updateOverlaysEvent: updateOverlaysEvent,
        closeOverlay: closeOverlay,
        getMarkerInfo: getMarkerInfo
    }
})(mapModule);