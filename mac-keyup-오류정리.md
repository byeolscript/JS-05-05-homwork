TodoList를 자바스크립트로 구현하던 중,

**“추가 버튼”**이 아닌 **“Enter 키”**로 할 일(목록)을 추가할 때

브라우저 콘솔에 console.log()가 **두 번 출력되는 현상**이 발생했다.

```
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
}
```

```
// Enter 키 입력 시 목록 추가.
function handleKeyup(event) {
  if (event.key === "Enter") add();
};
```
![스크린샷](./스크린샷%202025-10-26%20오전%2012.20.26.png)

console.log가 한개 인데 두번이 추가된 목록과 빈칸이 찍히는게 궁금해서 보조강사님께 문의 함.

원인을 찾기 위해 개발자 콘솔에서 출력 결과를 한참동안 관찰한 결과,

- **맥(macOS)**에서는 console.log()가 두 번 출력되고,
- **윈도우(Windows)**에서는 한 번만 정상 출력되었다.

그리고

- **맥에서 영문 입력 시**에는 한 번만 출력되지만, **한글 입력 시**에는 **두 번씩 출력**되었다.

이 원인은 **macOS에서 한글 입력 시 조합형 입력(IME) 처리 방식**이 달라

Enter 키가

한 번은 **조합(입력 확정)**, 또 한 번은 **실제 keyup 이벤트 발생**으로 인식되기 때문이다.

즉, keyup 이벤트가 **한글 입력일 때 두 번 발생**하면서 **add() 함수가 중복 호출된 것**

그래서 이러한 문제를 해결하기 위해 

**일정 시간 간격 내에서는 한 번만 실행되도록 제한(throttle)하는 함수**를 만들어 적용했다.

```
const intervalCall1000 = intervalCall(500); // 5000ms 5s
```

```
// Enter 키 입력 시 목록 추가.
function handleKeyup(event) {
  if (event.key === "Enter") {
    intervalCall1000(() => {
      add();
    });
  }
}
```

```
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
```