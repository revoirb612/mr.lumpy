document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var numClasses = document.getElementById('numClasses').value;
    var file = document.getElementById('csvFile').files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
        var text = e.target.result;
        var data = parseCSV(text);
        var initialClassAssignments = initialAssignStudents(data, numClasses);
        var classesAfterMinimizingSameClassStudents = minimizeSameClassStudents(initialClassAssignments);
        var classesAfterMaximizingScoreDiversity = maximizeScoreDiversity(classesAfterMinimizingSameClassStudents);
        var optimizedClasses = balanceGuidanceDifficulty(classesAfterMaximizingScoreDiversity);
        displayResults(optimizedClasses);
    };

    reader.readAsText(file);
});

function parseCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const data = line.split(',');
        const obj = {};
        headers.forEach((header, index) => {
            obj[header.trim()] = data[index].trim();
        });
        return obj;
    });
}

function displayResults(classAssignments) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';

    classAssignments.forEach((classData, index) => {
        const className = String.fromCharCode('A'.charCodeAt(0) + index);
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        thead.innerHTML = `<tr><th colspan="4">Class ${className}</th></tr>`;

        classData.forEach(student => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${student['번호']}</td><td>${student['이름']}</td><td>${student['성별']}</td><td>${student['학급내성별석차']}</td>`;
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        outputDiv.appendChild(table);
    });
}
