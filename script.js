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
                populateGroupSelect(Object.keys(originalData[0])); // 드롭다운 옵션 추가
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

function populateGroupSelect(headers) {
    const select = document.getElementById('groupSelect');
    select.innerHTML = headers.map(header => `<option value="${header}">${header}</option>`).join('');
}

function calculateVariance(selectedHeader) {
    // calculateGroupVariance 함수를 호출하여 분산 계산
    let groupVariances = calculateGroupVariance(originalData, selectedHeader);

    // 결과를 문자열로 변환하여 표시
    let resultString = '';
    for (let group in groupVariances) {
        resultString += `${group}: 분산 = ${groupVariances[group].toFixed(2)}\n`;
    }

    // 결과를 HTML 요소에 표시
    document.getElementById('varianceResult').textContent = resultString;
}
