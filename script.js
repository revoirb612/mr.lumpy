let originalData = []; // 원본 데이터 저장을 위한 변수
let randomizedData = []; // 랜덤화된 데이터 저장을 위한 변수
let currentSeed = 0; // 현재 사용된 랜덤 시드
let numberOfGroups = 0; 
let groupStatistics = []; // 각 그룹별 통계를 저장하기 위한 글로벌 변수
let allUniqueCounts = {};
let savedRandomSeeds = [];

document.getElementById('reviewButton').addEventListener('click', function() {
    let isValid = checkGroupStatisticsValidity();
    let resultText = isValid ? "모든 조건이 만족됩니다." : "일부 조건이 만족되지 않습니다.";
    document.getElementById('reviewResult').textContent = resultText;
});

function handleFiles(files) {
    if (files.length) {
        Papa.parse(files[0], {
            header: true,
            complete: function(results) {
                originalData = preprocessData(results.data);
                randomizedData = originalData
              
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

function shuffleDataWithSeed() {
    return new Promise(resolve => {
        let seedInput = document.getElementById('seedInput').value;
        if (seedInput) {
            currentSeed = parseInt(seedInput);
        } else {
            // seedrandom 라이브러리를 사용하여 더 강력한 난수 생성기 사용
            var rng = new Math.seedrandom(); // 새로운 seedrandom 인스턴스
            currentSeed = rng.int32(); // 32비트 정수 난수 생성
        }

        // seedrandom으로 초기화
        Math.seedrandom(currentSeed);
        randomizedData = shuffleArray([...originalData]);
        document.getElementById('randomSeed').textContent = currentSeed;
        resolve();
    });
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

    data.forEach(row => {
        Object.keys(row).forEach(key => {
            if (!uniqueCounts[key]) {
                uniqueCounts[key] = new Set();
            }
            uniqueCounts[key].add(row[key]);
        });
    });

    Object.keys(uniqueCounts).forEach(key => {
        uniqueCounts[key] = uniqueCounts[key].size;
    });

    allUniqueCounts = uniqueCounts;

    return uniqueCounts;
}

function displayUniqueDataCounts(counts) {
    let resultsContainer = document.getElementById('uniqueCountsContainer');
    resultsContainer.innerHTML = ''; // 이전 내용 초기화

    // 테이블 생성
    let table = document.createElement('table');
    table.border = '1';

    // 테이블 헤더 생성
    let thead = table.createTHead();
    let headerRow = thead.insertRow();
    let th1 = document.createElement('th');
    th1.textContent = 'Column';
    let th2 = document.createElement('th');
    th2.textContent = 'Unique Counts';
    headerRow.appendChild(th1);
    headerRow.appendChild(th2);

    // 테이블 바디 생성
    let tbody = table.createTBody();
    Object.keys(counts).forEach(key => {
        let row = tbody.insertRow();
        let cell1 = row.insertCell();
        cell1.textContent = key;
        let cell2 = row.insertCell();
        cell2.textContent = counts[key];
    });

    resultsContainer.appendChild(table);
}

function cyclicSort(data) {
    const maxClassNumber = Math.max(...data.map(item => parseInt(item['반'])));
    const sortedData = [];
    let added = true;

    while (added) {
        added = false;
        for (let i = 1; i <= maxClassNumber; i++) {
            const index = data.findIndex(item => parseInt(item['반']) === i);
            if (index !== -1) {
                sortedData.push(data[index]);
                data.splice(index, 1);
                added = true;
            }
        }
    }
    return sortedData;
}

function calculateGroupDataCounts() {
    return new Promise(resolve => {
        numberOfGroups = parseInt(document.getElementById('groupCount').value);
        if (numberOfGroups <= 0 || isNaN(numberOfGroups)) {
            alert('유효한 그룹 수를 입력해주세요.');
            resolve(); // 그룹 수가 유효하지 않으면 즉시 resolve 호출
            return;
        }

        // 먼저 '성별'을 기준으로 오름차순 정렬
        randomizedData.sort((a, b) => a['성별'].localeCompare(b['성별']));
        
        // '반' 컬럼을 기준으로 데이터 순환 정렬
        randomizedData = cyclicSort(randomizedData);

        let maleData = randomizedData.filter(row => row['성별'] === '남');
        let femaleData = randomizedData.filter(row => row['성별'] === '여');

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
        displayGroupStatistics();
        resolve(); // 모든 처리가 완료되면 resolve 호출
    });
}

// 테이블 생성 함수
function createGroupTable(group, groupId) {
    // ID 열을 기준으로 데이터를 오름차순으로 정렬
    group.sort((a, b) => a.ID - b.ID);

    let table = document.createElement('table');
    table.border = '1';
    
    // 테이블 헤더 생성
    let thead = table.createTHead();
    let headerRow = thead.insertRow();
    Object.keys(group[0]).forEach(key => {
        let th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    });

    // 테이블 바디 생성
    let tbody = table.createTBody();
    group.forEach(row => {
        let tr = tbody.insertRow();
        Object.values(row).forEach(val => {
            let td = tr.insertCell();
            td.textContent = val;
        });
    });

    return table;
}

// 분산 계산 함수
function calculateVariance(group, key) {
    let mean = group.reduce((acc, row) => acc + parseFloat(row[key]), 0) / group.length;
    let variance = group.reduce((acc, row) => acc + Math.pow(parseFloat(row[key]) - mean, 2), 0) / group.length;
    return variance;
}

// 유니크 데이터 수 계산 함수
function calculateUniqueDataCounts(group) {
    let uniqueCounts = {};
    Object.keys(group[0]).forEach(key => {
        uniqueCounts[key] = new Set(group.map(row => row[key])).size;
    });
    return uniqueCounts;
}

function calculateGroupSum(group) {
    let groupSums = {};
    group.forEach(row => {
        Object.keys(row).forEach(key => {
            if (!isNaN(parseFloat(row[key]))) {
                if (!groupSums[key]) {
                    groupSums[key] = 0;
                }
                groupSums[key] += parseFloat(row[key]);
            }
        });
    });
    return groupSums;
}

function displayGroupDataCounts(groupCounts) {
    groupStatistics = []; // 배열 초기화

    let resultsContainer = document.getElementById('groupCountsContainer');
    resultsContainer.innerHTML = '';

    groupCounts.forEach((group, index) => {
        let maleCount = group.filter(row => row['성별'] === '남').length;
        let femaleCount = group.filter(row => row['성별'] === '여').length;
        let total = group.length;

        // 각 그룹의 분산 계산
        let groupVariances = {};
        Object.keys(group[0]).forEach(key => {
            if (!isNaN(group[0][key])) {
                groupVariances[key] = calculateVariance(group, key);
            }
        });

        // 유니크 데이터 수 계산
        let uniqueDataCounts = calculateUniqueDataCounts(group);
      
        // 각 그룹의 SUM 계산
        let groupSums = calculateGroupSum(group);

        // 그룹 정보, 분산, 유니크 데이터 수 및 SUM 정보를 groupStatistics에 저장
        groupStatistics.push({
            groupId: index + 1, 
            total, 
            maleCount, 
            femaleCount, 
            variances: groupVariances,
            uniqueCounts: uniqueDataCounts,
            sums: groupSums // 합계 정보 추가
        });

        // 화면에 그룹 정보 표시
        let groupContainer = document.createElement('div');
        let p = document.createElement('p');
        p.textContent = `Group ${index + 1}: 총 ${total} (남: ${maleCount}, 여: ${femaleCount})`;

        groupContainer.appendChild(p);
        groupContainer.appendChild(createGroupTable(group, index + 1));
        resultsContainer.appendChild(groupContainer);
    });
}

function displayGroupStatistics() {
    let statsContainer = document.getElementById('groupStatsContainer');
    statsContainer.innerHTML = ''; 

    let table = document.createElement('table');
    table.border = '1';

    // 테이블 헤더 생성
    let thead = table.createTHead();
    let headerRow = thead.insertRow();
    let baseHeaders = ['Group ID', 'Total', 'Male Count', 'Female Count'];
    baseHeaders.forEach(header => {
        let th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    // 모든 그룹의 분산, 유니크 데이터, 그리고 SUM 키 수집
    let varianceKeys = new Set();
    let uniqueDataKeys = new Set();
    let sumKeys = new Set();
    groupStatistics.forEach(groupStat => {
        Object.keys(groupStat.variances).forEach(key => {
            varianceKeys.add(key);
        });
        Object.keys(groupStat.uniqueCounts).forEach(key => {
            uniqueDataKeys.add(key);
        });
        Object.keys(groupStat.sums).forEach(key => {
            sumKeys.add(key);
        });
    });

    // 분산, 유니크 데이터, 그리고 SUM 키를 헤더로 추가
    varianceKeys.forEach(key => {
        let th = document.createElement('th');
        th.textContent = `${key} Variance`;
        headerRow.appendChild(th);
    });
    uniqueDataKeys.forEach(key => {
        let th = document.createElement('th');
        th.textContent = `${key} Unique Count`;
        headerRow.appendChild(th);
    });
    sumKeys.forEach(key => {
        let th = document.createElement('th');
        th.textContent = `${key} Sum`;
        headerRow.appendChild(th);
    });

    // 테이블 바디 생성
    let tbody = table.createTBody();
    groupStatistics.forEach(groupStat => {
        let row = tbody.insertRow();

        let cell = row.insertCell();
        cell.textContent = groupStat.groupId;

        cell = row.insertCell();
        cell.textContent = groupStat.total;

        cell = row.insertCell();
        cell.textContent = groupStat.maleCount;

        cell = row.insertCell();
        cell.textContent = groupStat.femaleCount;

        // 분산 값 추가
        varianceKeys.forEach(key => {
            cell = row.insertCell();
            cell.textContent = groupStat.variances[key] ? groupStat.variances[key].toFixed(2) : 'N/A';
        });

        // 유니크 데이터 값 추가
        uniqueDataKeys.forEach(key => {
            cell = row.insertCell();
            cell.textContent = groupStat.uniqueCounts[key] ? groupStat.uniqueCounts[key] : 'N/A';
        });

        // SUM 값 추가
        sumKeys.forEach(key => {
            cell = row.insertCell();
            cell.textContent = groupStat.sums[key] ? groupStat.sums[key].toFixed(2) : 'N/A';
        });
    });

    statsContainer.appendChild(table);
}

function checkGroupStatisticsValidity() {
    let classUniqueCount = allUniqueCounts['반'];

    for (let groupStat of groupStatistics) {
        // 기존 조건: '반' 컬럼의 유니크 카운트 일치 여부 확인
        if (groupStat.uniqueCounts['반'] !== classUniqueCount) {
            return false;
        }

        // 새로운 조건: 'ID Unique Count'와 '이름 Unique Count'가 같지 않은 경우 검사
        // if (groupStat.uniqueCounts['ID'] !== groupStat.uniqueCounts['이름']) {
        //    return false;
        // }
    }
  
    // 조건을 모두 만족하는 경우, 현재 사용된 랜덤 시드를 저장
    savedRandomSeeds.push(currentSeed);

    return true; // 모든 조건을 만족하면 True 반환
}

async function repeatProcess() {
    let repeatCount = parseInt(document.getElementById('repeatCount').value);
    for (let i = 0; i < repeatCount; i++) {
        await shuffleDataWithSeed(); // 데이터 셔플 및 완료를 기다림
        await calculateGroupDataCounts(); // 새 그룹 만들기 및 완료를 기다림
        checkGroupStatisticsValidity(); // 검토하기
    }

    displaySavedSeeds(); // savedRandomSeeds 표시
}

function displaySavedSeeds() {
  let container = document.getElementById('savedSeedsContainer');
  container.innerHTML = '저장된 랜덤 시드: ' + savedRandomSeeds.join(', ');
}
