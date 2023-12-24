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
    let groupSummaries = {};

    // 데이터를 그룹화하고 각 그룹별로 합계와 카운트를 계산
    data.forEach(row => {
        const groupKey = row[groupHeader];
        if (!groupSummaries[groupKey]) {
            groupSummaries[groupKey] = {};
        }

        Object.keys(row).forEach(header => {
            if (header !== groupHeader && !isNaN(row[header])) {
                if (!groupSummaries[groupKey][header]) {
                    groupSummaries[groupKey][header] = { sum: 0, count: 0, variance: 0 };
                }
                groupSummaries[groupKey][header].sum += parseFloat(row[header]);
                groupSummaries[groupKey][header].count += 1;
            }
        });
    });

    // 각 그룹별로 분산을 계산
    Object.keys(groupSummaries).forEach(groupKey => {
        Object.keys(groupSummaries[groupKey]).forEach(header => {
            let mean = groupSummaries[groupKey][header].sum / groupSummaries[groupKey][header].count;
            let varianceSum = 0;

            data.forEach(row => {
                if (row[groupHeader] === groupKey) {
                    varianceSum += (parseFloat(row[header]) - mean) ** 2;
                }
            });

            groupSummaries[groupKey][header].variance = varianceSum / groupSummaries[groupKey][header].count;
        });
    });

    return groupSummaries;
}

