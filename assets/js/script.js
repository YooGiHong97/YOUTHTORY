// 사용자의 IP 주소
fetch('https://api.ipify.org?format=json', function (data) {
  // Setting text of element P with id gfg
  // $("#gfg").html(data.ip);
  storeIPaddressesToCookies(data.ip)
})

function generateHitCount () {
  // console.log('Function CALLED')
  const config = {
    headers: {
      Accept: 'application/json'
    }
  }

  fetch('https://youthapi.co.kr/visit/visit_record.do', config)
    .then(res => res.json())
    .then((data) => {
      // hitCounter.innerHTML = data;
      // console.log(data);
    })
}

// const hitCounter = document.getElementById("hit-counter");
// hitCounter.style.display = "none";

const userCookieName = 'returningVisitor'
checkUserCookie(userCookieName)
function checkUserCookie (userCookieName) {
  const regEx = new RegExp(userCookieName, 'g')
  const cookieExists = document.cookie.match(regEx)
  if (cookieExists != null) {
    // hitCounter.style.display = "inline-block";
  } else {
    createUserCookie(userCookieName)
  }
}

function createUserCookie (userCookieName) {
  const userCookieValue = 'Yes'
  // 쿠키 만료일 설정
  const userCookieDays = 1
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + userCookieDays)
  // Set cookie key and value which is passed in by parameters
  // 매개변수로 전달되는 쿠키 키 및 값 설정
  document.cookie =
    userCookieName +
    '=' +
    userCookieValue +
    '; expires=' +
    expiryDate.toGMTString() +
    'path=/'
}

function storeIPaddressesToCookies (ipaddess) {
  const _cookieName = 'addresses'
  const cookies = getCookie(_cookieName)
  // it says some address cookie exists
  if (cookies) {
    // console.log(cookies);
    const cookieArray = cookies.split(',')
    // console.log(cookieArray);
    // console.log(cookieArray.includes(ipaddess));
    const isIPorIncluded = cookieArray.includes(ipaddess)
    // eslint-disable-next-line no-empty
    if (isIPorIncluded) {
    } else {
      // if addresses existed but IP never recorded
      generateHitCount()
      address = [cookies]
      address.push(ipaddess)
      document.cookie = _cookieName + '=' + address
    }
  } else {
    // if addresses never existed in cookie
    generateHitCount()
    address = []
    address.push(ipaddess)
    document.cookie = _cookieName + '=' + address
  }
}

function getCookie (name) {
  const pattern = RegExp(name + '=.[^;]*')
  const matched = document.cookie.match(pattern)
  if (matched) {
    const cookie = matched[0].split('=')
    return cookie[1]
  }
  return false
}
