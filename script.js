let originalData = []; // 원본 데이터 저장을 위한 변수
let randomizedData = []; // 랜덤화된 데이터 저장을 위한 변수
let currentSeed = 0; // 현재 사용된 랜덤 시드
let numberOfGroups = 0; 
let groupStatistics = []; // 각 그룹별 통계를 저장하기 위한 글로벌 변수

function handleFiles(files) {
    if (files.length) {
        Papa.parse(files[0], {
            header: true,
            complete: function(results) {
                originalData = preprocessData(results.data);
                createTable(originalData);
              
                // analyzeUniqueDataCount 함수 호출
                let uniqueCounts = analyzeUniqueDataCount(originalData);
                displayUniqueDataCounts(uniqueCounts); // 결과 표시 함수 호출                
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

function setGroupCount() {
  numberOfGroups = document.getElementById('groupCount').value;
  document.getElementById('inputGroupCount').textContent = numberOfGroups;
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

function analyzeUniqueDataCount(data) {
    let uniqueCounts = {};
    let genderCounts = { '남': 0, '여': 0 }; // 성별 카운트를 위한 객체 추가

    data.forEach(row => {
        Object.keys(row).forEach(key => {
            if (!uniqueCounts[key]) {
                uniqueCounts[key] = new Set();
            }
            uniqueCounts[key].add(row[key]);

            // 성별 카운트 업데이트
            if (key === '성별') {
                if (row[key] === '남') genderCounts['남']++;
                else if (row[key] === '여') genderCounts['여']++;
            }
        });
    });

    // 각 키에 대해 유니크한 값의 수를 저장
    Object.keys(uniqueCounts).forEach(key => {
        uniqueCounts[key] = uniqueCounts[key].size;
    });

    // 성별 카운트 정보 추가
    uniqueCounts['성별_남'] = genderCounts['남'];
    uniqueCounts['성별_여'] = genderCounts['여'];

    return uniqueCounts;
}

function displayUniqueDataCounts(counts) {
    let resultsContainer = document.getElementById('uniqueCountsContainer');
    resultsContainer.innerHTML = ''; // 이전 내용 초기화
    Object.keys(counts).forEach(key => {
        let p = document.createElement('p');
        p.textContent = key.includes('성별_') ? `성별 - ${key.split('_')[1]}: ${counts[key]}` : `${key}: ${counts[key]}`;
        resultsContainer.appendChild(p);
    });
}

function calculateGroupDataCounts() {
    numberOfGroups = parseInt(numberOfGroups);
    if (numberOfGroups <= 0 || isNaN(numberOfGroups)) {
        alert('유효한 그룹 수를 입력해주세요.');
        return;
    }

    let maleData = originalData.filter(row => row['성별'] === '남');
    let femaleData = originalData.filter(row => row['성별'] === '여');

    let totalMaleCount = maleData.length;
    let totalFemaleCount = femaleData.length;
    let totalDataCount = originalData.length;

    let idealMalePerGroup = Math.round(totalMaleCount / numberOfGroups);
    let idealFemalePerGroup = Math.round(totalFemaleCount / numberOfGroups);

    let groups = Array.from({ length: numberOfGroups }, () => ({ male: [], female: [], total: 0 }));

    // 남성과 여성을 번갈아가며 그룹에 할당
    let maleIndex = 0, femaleIndex = 0;
    for (let i = 0; i < totalDataCount; i++) {
        let groupIndex = i % numberOfGroups;
        if (groups[groupIndex].male.length < idealMalePerGroup && maleIndex < totalMaleCount) {
            groups[groupIndex].male.push(maleData[maleIndex]);
            groups[groupIndex].total++;
            maleIndex++;
        } else if (femaleIndex < totalFemaleCount) {
            groups[groupIndex].female.push(femaleData[femaleIndex]);
            groups[groupIndex].total++;
            femaleIndex++;
        }
    }

    // 결과를 저장하기 위한 추가된 코드
    for (let i = 0; i < numberOfGroups; i++) {
        // 남성과 여성 데이터를 혼합
        groups[i] = groups[i].male.concat(groups[i].female);
    }

    displayGroupDataCounts(groups);
}

function displayGroupDataCounts(groupCounts) {
    groupStatistics = []; // 배열 초기화
    
    let resultsContainer = document.getElementById('groupCountsContainer');
    resultsContainer.innerHTML = '';

    groupCounts.forEach((group, index) => {
        let maleCount = group.filter(row => row['성별'] === '남').length;
        let femaleCount = group.filter(row => row['성별'] === '여').length;
        let total = group.length;

        // 각 그룹의 통계 정보를 객체로 저장하고, 배열에 추가
        groupStatistics.push({ groupId: index + 1, total, maleCount, femaleCount });

        let p = document.createElement('p');
        p.textContent = `Group ${index + 1}: 총 ${total} (남: ${maleCount}, 여: ${femaleCount})`;
        resultsContainer.appendChild(p);
    });
}
