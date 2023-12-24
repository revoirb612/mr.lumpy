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
    // 비어 있는 행 제거 및 데이터 형 변환
    let filteredData = data.filter(row => Object.values(row).some(val => val.trim() !== ''));

    return filteredData.map((row, index) => {
        let processedRow = { ID: index + 1 };
        Object.keys(row).forEach(key => {
            // 숫자로 변환 가능한 경우 숫자로 변환
            processedRow[key] = isNaN(row[key]) ? row[key] : parseFloat(row[key]);
        });
        return processedRow;
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
    let groupVariances = calculateGroupVariance(originalData, selectedHeader);

    // 결과를 테이블 데이터로 변환
    let tableData = [];
    Object.keys(groupVariances).forEach(group => {
        Object.keys(groupVariances[group]).forEach(header => {
            tableData.push({
                'Group': group,
                'Header': header,
                'Variance': groupVariances[group][header].variance.toFixed(2)
            });
        });
    });

    // 결과 테이블 생성
    $('#varianceResult').html('<table id="varianceTable" class="display" width="100%"></table>');

    // DataTables 초기화
    $('#varianceTable').DataTable({
        data: tableData,
        columns: [
            { title: "Group", data: "Group" },
            { title: "Header", data: "Header" },
            { title: "Variance", data: "Variance" }
        ]
    });
}
