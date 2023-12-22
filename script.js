function processData() {
    var input = document.getElementById("dataInput").value;
    var lines = input.split('\n');
    
    // 여기서 데이터 처리 및 학급 편성 로직 구현
    var result = ""; // 결과를 문자열로 저장
    for (var i = 0; i < lines.length; i++) {
        // 각 라인의 데이터 처리
        var lineData = lines[i].split(',');
        // 학급 편성 로직 (예: 성별, 학년, 반 별로 그룹화)
        // ...

        // 결과를 result 문자열에 추가
        result += "Processed Line: " + lines[i] + "<br>";
    }

    // 결과를 HTML 페이지에 출력
    document.getElementById("result").innerHTML = result;
}
