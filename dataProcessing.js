function initialAssignStudents(data, numClasses) {
    // 임시로 학생들을 반별로 분배하는 로직
    const studentsPerClass = Math.ceil(data.length / numClasses);
    let classAssignments = Array.from({ length: numClasses }, () => []);

    data.forEach((student, index) => {
        const classIndex = index % numClasses;
        classAssignments[classIndex].push(student);
    });

    return classAssignments;
}

function minimizeSameClassStudents(classAssignments) {
    // 현재는 입력값 그대로 반환합니다. 실제 로직 구현 시 수정 필요
    return classAssignments;
}

function maximizeScoreDiversity(classAssignments) {
    // 현재는 입력값 그대로 반환합니다. 실제 로직 구현 시 수정 필요
    return classAssignments;
}

function balanceGuidanceDifficulty(classAssignments) {
    // 현재는 입력값 그대로 반환합니다. 실제 로직 구현 시 수정 필요
    return classAssignments;
}
