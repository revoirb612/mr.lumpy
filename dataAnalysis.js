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

    // 각 키에 대해 유니크한 값의 수를 저장
    Object.keys(uniqueCounts).forEach(key => {
        uniqueCounts[key] = uniqueCounts[key].size;
    });

    return uniqueCounts;
}

function calculateGroupVariance(data, groupHeader) {
    // 그룹별로 데이터를 저장할 객체
    let groups = {};

    // 데이터를 그룹화
    data.forEach(row => {
        let key = row[groupHeader];
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(row);
    });

    // 각 그룹별 분산 계산
    let variances = {};
    for (let key in groups) {
        let group = groups[key];
        let sum = 0;
        let count = 0;

        // 평균 계산
        group.forEach(row => {
            Object.keys(row).forEach(header => {
                if (!isNaN(row[header])) {
                    sum += parseFloat(row[header]);
                    count++;
                }
            });
        });

        let mean = sum / count;

        // 분산 계산
        let varianceSum = 0;
        group.forEach(row => {
            Object.keys(row).forEach(header => {
                if (!isNaN(row[header])) {
                    let value = parseFloat(row[header]);
                    varianceSum += (value - mean) ** 2;
                }
            });
        });

        variances[key] = varianceSum / count;
    }

    return variances;
}
