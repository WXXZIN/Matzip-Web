// polygonsModule.js

var polygonsModule = (function(mapModule) {
    var map = mapModule.map;
    var customOverlay = new kakao.maps.CustomOverlay({});
    var polygons = [];

    // 마우스 이벤트 핸들러 함수
    function handlePolygonMouseOver(polygon, name, mouseEvent) {
        polygon.setOptions({
            fillColor: '#09f'
        });

        customOverlay.setContent('<div class="area">' + name + '</div>');

        customOverlay.setPosition(mouseEvent.latLng);
        customOverlay.setMap(map);
    }

    function handlePolygonMouseMove(mouseEvent) {
        customOverlay.setPosition(mouseEvent.latLng);
    }

    function handlePolygonMouseOut(polygon) {
        polygon.setOptions({
            fillColor: '#fff'
        });
        customOverlay.setMap(null);
    }

    function handlePolygonClick(name) {
        var level = map.getLevel() - 4;

        var coordinates = getCoordinatesForArea(name); // Get the coordinates for the area
        if (coordinates) {
            var centerLatLng = new kakao.maps.LatLng(coordinates[0], coordinates[1]);
            map.setLevel(level, { anchor: centerLatLng, animate: { duration: 350 } });
        }
    }

    function getCoordinatesForArea(name) {
        var areaCoordinates = {
            '중구': [35.10078086157615, 129.03260743558744],
            '서구': [35.09785572269479, 129.0243110185456],
            '동구': [35.12467299701666, 129.0405281179789],
            '영도구': [35.082480501230364, 129.05543851241742],
            '부산진구': [35.157643967855414, 129.0593252654095],
            '둥래구': [35.20525880368384, 129.07844551416542],
            '남구': [35.129663162921744, 129.09764871598375],
            '북구': [35.22318993019103, 129.00918988127157],
            '해운대구': [35.163640857067115, 129.15894204401593],
            '사하구': [35.103989457631506, 128.96427062901918],
            '금정구': [35.24276359589664, 129.0921004350938],
            '강서구': [35.09289323431401, 128.91829306991048],
            '연제구': [35.18613388508669, 129.0817342416964],
            '수영구': [35.15315275715506, 129.1190770846596],
            '사상구': [35.1625026281243, 128.98421177546123],
            '기장군': [35.24432544476333, 129.21887928675397],
        };

        return areaCoordinates[name];
    }

    function displayArea(coordinates, name) {
        var path = [];
        var points = coordinates.map(function(coordinate) {
            return { x: coordinate[1], y: coordinate[0] };
        });

        points.forEach(function(point) {
            path.push(new kakao.maps.LatLng(point.x, point.y));
        });

        var polygon = new kakao.maps.Polygon({
            map: map,
            path: path,
            strokeWeight: 2,
            strokeColor: '#004c80',
            strokeOpacity: 0.8,
            fillColor: '#fff',
            fillOpacity: 0.7
        });
        
        polygons.push(polygon);

        // 이벤트 리스너 추가
        kakao.maps.event.addListener(polygon, 'mouseover', function(mouseEvent) {
            handlePolygonMouseOver(polygon, name, mouseEvent);
        });

        kakao.maps.event.addListener(polygon, 'mousemove', handlePolygonMouseMove);

        kakao.maps.event.addListener(polygon, 'mouseout', function() {
            handlePolygonMouseOut(polygon);
        });

        kakao.maps.event.addListener(polygon, 'click', function() {
            handlePolygonClick(name);
        });
    }

    function updatePolygonsAndEvents() {
        var currentLevel = map.getLevel();
        var show = currentLevel >= 8;
        
        for (var i = 0; i < polygons.length; i++) {
            polygons[i].setOptions({
                strokeWeight:  2 ,
                strokeColor: '#004c80',
                strokeOpacity: 0.8,
                fillColor: show ? '#fff' : '#09f',
                fillOpacity: show ? 0.7 : 0
            });
        }
    }

    return {
        displayArea: displayArea,
        updatePolygonsAndEvents: updatePolygonsAndEvents
    }

})(mapModule);