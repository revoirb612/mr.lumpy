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
