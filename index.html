<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>CSV to Table with Separate Random Data</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/seedrandom/3.0.5/seedrandom.min.js"></script>
</head>
<body>

<input type="file" id="csvFileInput" accept=".csv" onchange="handleFiles(this.files)">
<input type="number" id="seedInput" placeholder="랜덤 시드 입력">
<button onclick="shuffleDataWithSeed()">셔플</button>
<button onclick="resetTable()">초기화</button>
<p>사용된 랜덤 시드: <span id="randomSeed"></span></p>
<br>
<div id="tableContainer"></div>

<script>
    let originalData = []; // 원본 데이터 저장을 위한 변수
    let randomizedData = []; // 랜덤화된 데이터 저장을 위한 변수
    let currentSeed = 0; // 현재 사용된 랜덤 시드

    function handleFiles(files) {
        if (files.length) {
            Papa.parse(files[0], {
                header: true,
                complete: function(results) {
                    originalData = preprocessData(results.data);
                    createTable(originalData);
                }
            });
        }
    }

    function preprocessData(data) {
        // 비어 있는 행 제거
        let filteredData = data.filter(row => Object.values(row).some(val => val.trim() !== ''));

        // 맨 왼쪽 열에 ID 열 추가하여 행번호 입력
        return filteredData.map((row, index) => {
            return { ID: index + 1, ...row };
        });
    }

    function createTable(data) {
        let table = document.createElement('table');
        table.border = '1';

        // 테이블 헤더 생성
        let thead = table.createTHead();
        let headerRow = thead.insertRow();
        Object.keys(data[0]).forEach(key => {
            let th = document.createElement('th');
            th.textContent = key;
            headerRow.appendChild(th);
        });

        // 테이블 바디 생성
        let tbody = table.createTBody();
        data.forEach(row => {
            let tr = tbody.insertRow();
            Object.values(row).forEach(val => {
                let td = tr.insertCell();
                td.textContent = val;
            });
        });

        // 기존 테이블이 있으면 제거
        let tableContainer = document.getElementById('tableContainer');
        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);
    }

    function shuffleData() {
        currentSeed = Math.floor(Math.random() * 1000000); // 랜덤 시드 생성
        Math.seedrandom(currentSeed); // 시드 설정
        randomizedData = shuffleArray([...originalData]); // originalData를 복사하여 랜덤화
        document.getElementById('randomSeed').textContent = currentSeed;
        createTable(randomizedData); // 랜덤화된 데이터로 테이블 생성
    }
  
    function shuffleDataWithSeed() {
        let seedInput = document.getElementById('seedInput').value;
        currentSeed = seedInput ? parseInt(seedInput) : Math.floor(Math.random() * 1000000);
        Math.seedrandom(currentSeed); // 사용자 입력 시드로 설정
        randomizedData = shuffleArray([...originalData]); // originalData를 복사하여 랜덤화
        document.getElementById('randomSeed').textContent = currentSeed;
        createTable(randomizedData); // 랜덤화된 데이터로 테이블 생성
    }
  
    function resetTable() {
        createTable(originalData); // 원본 데이터로 테이블 다시 생성
    }

    function shuffleArray(array) {
        let m = array.length, t, i;

        // 피셔-예이츠 셔플 알고리즘
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }

        return array;
    }
</script>

</body>
</html>
