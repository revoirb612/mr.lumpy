function readCSV(event) {
    const file = event.target.files[0];
    Papa.parse(file, {
        complete: function(results) {
            const data = removeEmptyRows(results.data);
            displayUniqueCounts(data);
            displayTable(data);
        }
    });
}

function removeEmptyRows(data) {
    // 빈 행 제거
    return data.filter(row => row.some(cell => cell.trim() !== ''));
}

function displayTable(data) {
    const table = document.getElementById('dataTable');
    table.innerHTML = "";

    // 헤더 추가
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data[0]) {
        let th = document.createElement("th");
        th.innerText = key;
        row.appendChild(th);
    }

    // 데이터 행 추가
    for (let i = 1; i < data.length; i++) {
        let row = table.insertRow();
        for (let j = 0; j < data[i].length; j++) {
            let cell = row.insertCell();
            cell.innerText = data[i][j];
        }
    }
}

function displayUniqueCounts(data) {
    let uniqueCounts = {};
    let headers = data[0];

    // 각 헤더에 대한 유니크한 값의 개수 계산
    for (let i = 0; i < headers.length; i++) {
        let columnData = data.map(row => row[i]);
        uniqueCounts[headers[i]] = new Set(columnData.slice(1)).size;
    }

    // 결과 표시
    const uniqueCountsDiv = document.getElementById('uniqueCounts');
    uniqueCountsDiv.innerHTML = "<h3>유니크한 값의 개수:</h3>";
    for (let key in uniqueCounts) {
        uniqueCountsDiv.innerHTML += `<p>${key}: ${uniqueCounts[key]}</p>`;
    }
}
