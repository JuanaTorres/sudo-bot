const changeNicknameNotSemester = (currNick, newNick) =>
  currNick.replace(/((.+)\s*)+(?=\()/, newNick + " ");

const changeSemesterNotNickname = (currNick, newSem) =>
  currNick.replace(/\s(\([\d\W]+\))/, ` (${newSem})`);