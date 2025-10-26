const todoList = [
  {
    id: 1,
    title: "JavaScript 공부",
    done: true,
    important: false,
  },
  {
    id: 4,
    title: "React 공부",
    done: false,
    important: false,
  },
  {
    id: 3,
    title: "바닐라 프로젝트",
    done: false,
    important: false,
  },
  {
    id: 2,
    title: "TypeScript 공부",
    done: false,
    important: false,
  },
  {
    id: 5,
    title: "Final 프로젝트",
    done: true,
    important: false,
  },
];
// 전역변수(최상위로 올려서 작성)
// addItem의 id 값을 증가 시키기 위한 최대값 for문.
let lastNo = 0;

const intervalCall1000 = intervalCall(500); // 5000ms 5s

for (let i = 0; i < todoList.length; i++) {
  if (todoList[i].id > lastNo) {
    lastNo = todoList[i].id;
  }
}

// 할 일 목록 표시
function showList() {
  const todoListElem = [];
  for (let i = 0; i < todoList.length; i++) {
    const item = todoList[i];
    const elem = getTodoItemElem(item);
    todoListElem.push(elem);
  }
  // console.log(todoListElem);

  const todotListUl = document.querySelector(".todolist");

  for (let i = 0; i < todoListElem.length; i++) {
    const itemLi = todoListElem[i];
    todotListUl.appendChild(itemLi);
  }
}

// 할 일 목록 표시
function getTodoItemElem(item) {
  const liElem = document.createElement("li");
  const starElem = document.createElement("span");
  const noElem = document.createElement("span");
  const spaceElem = document.createElement("span");
  const titleElem = document.createElement("span");
  const deleteElem = document.createElement("button");

  const memoBtn = document.createElement("button");
  const memoView = document.createElement("div");

  const starTxt = document.createTextNode("⬜️ ");
  const noTxt = document.createTextNode(item.id);
  const spaceTxt = document.createTextNode(". ");
  const titleTxt = document.createTextNode(item.title);
  const deleteTxt = document.createTextNode("삭제");

  liElem.setAttribute("data-no", item.id);
  liElem.setAttribute("data-done", item.done);
  liElem.setAttribute("data-important", item.important);

  starElem.appendChild(starTxt);
  noElem.appendChild(noTxt);
  spaceElem.appendChild(spaceTxt);
  titleElem.appendChild(titleTxt);
  deleteElem.appendChild(deleteTxt);
  deleteElem.setAttribute("type", "button");

  memoBtn.textContent = "메모";
  memoBtn.type = "button";
  memoView.className = "memo"; // memoView에 클래스 네임을 memo라고 줌.

  liElem.appendChild(starElem);
  liElem.appendChild(noElem);
  liElem.appendChild(spaceElem);
  liElem.appendChild(titleElem);
  liElem.appendChild(deleteElem);
  liElem.appendChild(memoBtn);
  liElem.appendChild(memoView);

  deleteElem.addEventListener("click", function () {
    removeItem(item.id);
  });

  titleElem.addEventListener("click", function () {
    toggleDone(item.id);
  });

  starElem.addEventListener("click", function () {
    toggleImportant(item.id);
  });

  if (item.done) {
    const sElem = document.createElement("s");
    sElem.appendChild(titleTxt);
    titleElem.appendChild(sElem);
  } else {
    titleElem.appendChild(titleTxt);
  }

// 메모기능 추가
  const key = "memo-" + item.id; // memo-1, 저장소에 넣어줄 이름을 라벨링함.
  const saved = localStorage.getItem(key) || "";
  // localStorage 자체저장소에서 memo-id의 값이 있으면 꺼내서 할당.
  // 저장소에서 key 값을 꺼냈는데 값이 없으면 빈 문자열로 해라.
  memoView.textContent = saved;
  memoView.style.display = saved ? "block" : "none";
  // 값이 저장되어 있는게 있으면 display block, 저장된 값이 없으면 display none.

  memoBtn.addEventListener("click", function () {
    const current = localStorage.getItem(key) || "";
    const next = prompt("메모 입력/수정 (빈 값 저장 시 삭제)", current);
    // prompt 안에 안내 문구를 주고, current를 기본값으로 줌.
    if (next === null) return; // 예상치 못한 null값을 처리하기 위해 에러방지로 넣은 코드.

    const text = next.trim();
    if (text) {
      memoView.textContent = text;
      memoView.style.display = "block";
      localStorage.setItem(key, text); // 저장소에 키 값을 텍스트와 다시 저장.
    } else {
      memoView.textContent = "";
      memoView.style.display = "none";
      localStorage.removeItem(key); // 저장소에 키를 삭제해라.
    }
  });

  return liElem;
}

// 할 일 목록 추가
function add() {
  const inputElem = document.querySelector(".todoinput > input");
  console.log(inputElem.value);
  // 주석 해제 시 목록에 할 일이 추가가 되면서 콘솔에는 할 일 추가 목록과 빈칸이 두번 찍히는 이유가 뭘까?
  if (inputElem.value.trim() !== "") {
    // 빈 칸이 아닐때
    addItem(inputElem.value.trim());
    inputElem.value = "";
    inputElem.focus();
  }
} // 빈 칸이 아닐때 addItem을 호출하면서 새로운 목록이 추가 된 후 빈칸으로 만듬.

// 할 일 목록 추가
function addItem(title) {
  const todoListUl = document.querySelector(".todolist");
  const item = {
    id: ++lastNo,
    title,
    done: false, // 새 목록이 추가 된 거라 완료 안됨.
  };
  // console.log(item); 새로 추가된 아이템 확인

  const todoLi = getTodoItemElem(item);
  // console.log(todoLi); 새로운 item이 리스트로 변환 된걸 확인
  todoListUl.insertBefore(todoLi, todoListUl.firstChild);
}

// Enter 키 입력 시 목록 추가.
function handleKeyup(event) {
  if (event.key === "Enter") {
    intervalCall1000(() => {
      add();
    });
  }
} // event가 발생한게 Enter이면 add를 호출해라.

// 삭제 버튼 클릭 시 목록 삭제
function removeItem(no) {
  const targetLi = document.querySelector(`.todolist > li[data-no="${no}"]`);
  if (targetLi !== null) targetLi.remove();
}

// 클릭 시 취소선 생성 및 삭제
function toggleDone(no) {
  const targetLi = document.querySelector(`.todolist > li[data-no="${no}"]`);
  const beforeDone = targetLi.getAttribute("data-done");
  const isDone = beforeDone === "true" ? false : true;
  const titleEl = targetLi.querySelector("span:last-of-type");

  if (isDone) {
    const sElem = document.createElement("s");
    sElem.appendChild(titleEl.firstChild);
    titleEl.appendChild(sElem);
  } else {
    titleEl.appendChild(titleEl.firstElementChild.firstChild);
    titleEl.firstElementChild.remove();
  }
  targetLi.setAttribute("data-done", isDone);
}

// 중요 목록 표시
function toggleImportant(no) {
  const importantLi = document.querySelector(`.todolist > li[data-no="${no}"]`);
  const important = importantLi.getAttribute("data-important") === "true" ? true : false;
  const starEl = importantLi.querySelector("span:first-of-type");

  if (important) {
    starEl.textContent = "⬜️ ";
  } else {
    starEl.textContent = "🌟 ";
  }
  importantLi.setAttribute("data-important", !important);
}

// 목록 Enter로 목록 추가 시 add()가 두번 출력이 되어 
// 콘솔에 한글,빈 줄 2줄로 나오는 결과를 일정시간 동안 막는 함수.
// (한글로 엔터키를 쳤을때만 콘솔 두줄 출력.) 
// 맥에서만 keyup 실행시 이상함....윈도우는 아래 함수 없이도 잘 돌아감..
function intervalCall(interval) { 
  let elapsed = true;
  return (fn) => {
    if (!elapsed) {
      return;
    }
    elapsed = false;
    fn();
    setTimeout(() => { // 다음 함수가 실행 되지 않게 막는 함수.
      elapsed = true;
    }, interval); 
  };
}

showList();
