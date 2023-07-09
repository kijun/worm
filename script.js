function parse(t,n,i=e=>e){let e=Object.create(null);e.options=n||{},e.reviver=i,e.value="",e.entry=[],e.output=[],e.col=1,e.row=1;let l=/"|,|\r\n|\n|\r|[^",\r\n]+/y,a=/^(\r\n|\n|\r)$/,u=[],o="",r=0;for(;(u=l.exec(t))!==null;)switch(o=u[0],r){case 0:switch(!0){case o==='"':r=3;break;case o===",":r=0,s(e);break;case a.test(o):r=0,s(e),c(e);break;default:e.value+=o,r=2;break}break;case 2:switch(!0){case o===",":r=0,s(e);break;case a.test(o):r=0,s(e),c(e);break;default:throw r=4,Error(`CSVError: Illegal state [row:${e.row}, col:${e.col}]`)}break;case 3:switch(!0){case o==='"':r=4;break;default:r=3,e.value+=o;break}break;case 4:switch(!0){case o==='"':r=3,e.value+=o;break;case o===",":r=0,s(e);break;case a.test(o):r=0,s(e),c(e);break;default:throw Error(`CSVError: Illegal state [row:${e.row}, col:${e.col}]`)}break}return e.entry.length!==0&&(s(e),c(e)),e.output}function w(t,n={},i=e=>e){let e=Object.create(null);e.options=n,e.options.eof=e.options.eof!==void 0?e.options.eof:!0,e.row=1,e.col=1,e.output="";let l=/"|,|\r\n|\n|\r/;return t.forEach((a,u)=>{let o="";switch(e.col=1,a.forEach((r,f)=>{typeof r=="string"&&(r=r.replace(/"/g,'""'),r=l.test(r)?`"${r}"`:r),o+=i(r,e.row,e.col),f!==a.length-1&&(o+=","),e.col++}),!0){case e.options.eof:case(!e.options.eof&&u!==t.length-1):e.output+=`${o}
`;break;default:e.output+=`${o}`;break}e.row++}),e.output}function s(t){let n=t.options.typed?p(t.value):t.value;t.entry.push(t.reviver(n,t.row,t.col)),t.value="",t.col++}function c(t){t.output.push(t.entry),t.entry=[],t.row++,t.col=1}function p(t){let n=/.\./;switch(!0){case t==="true":case t==="false":return t==="true";case n.test(t):return parseFloat(t);case isFinite(t):return parseInt(t);default:return t}}


let parsed = null;

const FONTS = [
  //'font-1',
  'font-2',
  'font-3',
  'font-4',
  'font-5',
  'font-6',
  'font-7',
  'font-8'] 


const DATEFONT = "date";

function randomFont(currFont) {
  let cls = currFont;
  while (cls == currFont) {
    cls = FONTS[Math.floor(Math.random() * FONTS.length)];
  }
  return cls;
}

function render() {
  console.log ('rendering');
  let board = document.getElementById("game-board");
  board.innerHTML = "";
  parsed.shift();
  parsed = parsed.slice(1, 2000);
  let prevDate = null;
  let prevBook = null;
  let currFont = randomFont(null);
  let dateFont = DATEFONT;

  function addSpan (text, style) {
      const span = document.createElement("span");
      span.classList.add(style);
      const node = document.createTextNode(text);
      span.appendChild(node);
      board.appendChild(span);
  }

  for (let x of parsed) {
    let currDate = x[0];
    let currBook = x[1];
    let currText = x[2];

    if (currDate != prevDate) {
      // new font/new date
      //currFont = randomFont(currFont);
      addSpan(currDate + " ", dateFont);
      prevDate = currDate;
    }
    
    if (currBook != prevBook) {
      //change font for every book
      currFont = randomFont(currFont);
      prevBook = currBook;
    }

    for (let c of currText) {
      addSpan(c, currFont);
    }

    addSpan(" ", currFont)
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// for every snake

function hasContent(node) {
  return (node && node.textContent != ' ' && node.tagName == "SPAN" && !node.classList.contains("hide")) ? node : null;
}

const INTERVAL = 1;

function moveSnake2() {
  let x = -1;
  let y = -1;

  let a = null; // node to paint

  function _moveSnake() {
    if (a == null) {
      let sx = getRandomInt(window.innerWidth);
      let sy = getRandomInt(window.innerHeight);
      a = document.elementFromPoint(sx, sy)
    }
    if (hasContent(a)) {
      //a.style.backgroundColor = "black";
      a.classList.add("hide");
      let right = a.nextSibling;
      let left = a.previousSibling;
      let rect = a.getBoundingClientRect();
      // try to move right
      if (hasContent(right)) {
        //console.log("right");
        a = right;
        //_moveSnake();
        setTimeout(_moveSnake, INTERVAL);
      } else if (hasContent(left)) {
        //console.log("left");
        a = left;
        //_moveSnake();
        setTimeout(_moveSnake, INTERVAL);
      }
      // else try to go top
      else {
        //setTimeout(moveSnake2, INTERVAL*2);
        //return;
        //console.log("up or down");
        let up = document.elementFromPoint(rect.x, rect.y - rect.height/2);
        let down = document.elementFromPoint(rect.x, rect.y + rect.height*1.5);
        
        if (Math.random() > 0.5) {
          if (hasContent(up)) {
            //console.log("up");
            a = up;
            setTimeout(_moveSnake, INTERVAL);
          } else if (hasContent(down)) {
            //console.log("down");
            a = down;
            setTimeout(_moveSnake, INTERVAL);
          } else {
            // else we are dead
            //console.log("we dead");
            setTimeout(moveSnake2, INTERVAL*2);
          }
        } else {
          if (hasContent(down)) {
            //_moveSnake();
            a = down;
            setTimeout(_moveSnake, INTERVAL);
          } else if (hasContent(up)) {
            //_moveSnake();
            a = up;
            setTimeout(_moveSnake, INTERVAL);
          } else {
            // else we are dead
            //console.log("we dead");
            setTimeout(moveSnake2, INTERVAL*2);
          }
        }
      }
    }
    else {
      //console.log("no content");
      setTimeout(moveSnake2, INTERVAL*2);
    }
  }
  _moveSnake();
}

fetch("https://raw.githubusercontent.com/kijun/worm/main/highlights.csv")
  .then((res) => res.text())
  .then((text) => {
    // do something with "text"
    parsed = parse(text);
    //console.log(parsed);
    render();
    for (let i = 0; i < 2; i++) {
      moveSnake2();
    }
   })
  .catch((e) => console.error(e));