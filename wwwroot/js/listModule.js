// listModule.js

var listModule = (function(mapModule, markersModule) {

    var map = mapModule.map;
    var listContainer = document.getElementById('markerList');
    
    listContainer.style.visibility = 'hidden';

    function displayMarkerInfo() {
        var center = map.getCenter();
        var markerInfo = markersModule.getMarkerInfo();
        var listContent = '';

        for (var i = 0; i < markerInfo.length; i++) {
            var info = markerInfo[i];
            var distance = calculateDistance(center, info.coordinates);

            if (distance <= 1500) {
                listContent += '<div class="listBtn">'
                listContent += `<div class="name">${info.name}</div>`;
                if (info.menu != '') {
                    listContent += `<div class="menu">${info.menu}</div><div class="coor">${info.coordinates}</div>`;
                } else {
                    listContent += `<div class="menu">정보없음</div><div class="coor">${info.coordinates}</div>`;
                }
                listContent += '</div>'; // 마커 정보 사이에 구분을 위해 수평선 추가
            }
        }

        listContainer.style.visibility = listContent.length != 0 && map.getLevel() < 8 ? 'visible' : 'hidden';
        listContainer.innerHTML = listContent;

        // 이벤트 핸들러 함수를 호출
        attachEventHandlers(markerInfo);
    }

    function attachEventHandlers(markerInfo) {
        listContainer.addEventListener('mouseover', handleEvent);
        listContainer.addEventListener('mouseout', handleEvent);
        listContainer.addEventListener('click', handleEvent);

        function handleEvent(event) {
            if (event.target.closest('.listBtn')) {
                var targetContent = event.target.closest('.listBtn').querySelector('.coor').textContent;

                if (event.type === 'click') {
                    handleListClick(markerInfo, targetContent);
                } else {
                    updateMarkerImage(event, markerInfo, targetContent);
                }
            }
        }
    }

    function handleListClick(markerInfo, targetContent) {
        for (var i = 0; i < markerInfo.length; i++) {
            var info = markerInfo[i];
            if (info.coordinates === targetContent) {
                var [x, y] = info.coordinates.split('/');

                map.panTo(new kakao.maps.LatLng(x, y));
                displayMarkerInfo();
            }
        }
    }

    function updateMarkerImage(event, markerInfo, targetContent) {
        for (var i = 0; i < markerInfo.length; i++) {
            var info = markerInfo[i];
            if (info.coordinates === targetContent) {
                var [x, y] = info.coordinates.split('/');
                var markerImage;

                if (event.type === 'mouseout') {
                    markerImage = new kakao.maps.MarkerImage(
                        'https://t1.daumcdn.net/localimg/localimages/07/2018/pc/img/marker_spot.png',
                        new kakao.maps.Size(29, 42), new kakao.maps.Point(13, 34));
                } else if (event.type === 'mouseover') {
                    markerImage = new kakao.maps.MarkerImage(
                        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                        new kakao.maps.Size(29, 42), new kakao.maps.Point(13, 34));
                }

                info.marker.setImage(markerImage);
            }
        }
    }

    function calculateDistance(point1, point2) {
        var lat1 = point1.getLat();
        var lng1 = point1.getLng();
        var lat2 = point2.split('/')[0];
        var lng2 = point2.split('/')[1];

        var R = 6371; // 지구 반지름 (킬로미터)
        var dLat = deg2rad(lat2 - lat1);
        var dLng = deg2rad(lng2 - lng1);

        var a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var distance = R * c; // 거리 (킬로미터)

        return distance * 1000; // 거리를 미터로 변환
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // 페이지에 컨테이너를 추가합니다.
    document.body.appendChild(listContainer);

    return {
        displayMarkerInfo: displayMarkerInfo
    }
})(mapModule, markersModule);