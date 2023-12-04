// 請代入自己的網址路徑
const api_path = "shuo0608";
const token = "PrfRtWbF4JORy1taFAfgSFu1Plk1";

const productWrap = document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");
const cartList = document.querySelector('.shoppingCart-tableList');
const total = document.querySelector('.total');
let productData = [];
let cartData = [];
function init(){
  getProductList();
  getCartList();
}
init()
// 取得產品列表
function getProductList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
    .then(function (response) {
      productData = response.data.products;
      renderProductList();
    })
    .catch(function(error){
      console.log(error.response.data)
    })
}
function combineProductHTMLItem(item){
  return `<li class="productCard">
  <h4 class="productType">新品</h4>
  <img src="${item.images}" alt="">
  <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
  <h3>${item.title}</h3>
  <del class="originPrice">NT$${item.origin_price}</del>
  <p class="nowPrice">NT$${item.price}</p>
  </li>`
}
function renderProductList(){
  let str = "";
      productData.forEach(function(item){
        str += combineProductHTMLItem(item);
      })
      productWrap.innerHTML = str;
};
productSelect.addEventListener('change',function(e){
  const category = e.target.value;
  if(category == "全部"){
    renderProductList()
    return;
  }
  let str = "";
  productData.forEach(function(item){
    if(item.category == category){
      str += combineProductHTMLItem(item)
    }
  })
  productWrap.innerHTML = str;
})
// 加入購物車
productWrap.addEventListener('click',function(e){
  e.preventDefault()
  let addCardBtn = e.target.getAttribute("class")
  if(addCardBtn!=="addCardBtn"){
    return
  }
  let productId = e.target.getAttribute("data-id");
  let numCheck = 1;
  cartData.forEach(function(item){
    if(item.product.id === productId){
      numCheck = item.quantity += 1
    }
  })
  function addCartItem() {
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
      data: {
        "productId": productId,
        "quantity": numCheck
      }
    }).then(function (response) {
        getCartList()
      })

  }
  addCartItem()
})

// 取得購物車列表
function getCartList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then(function (response) {
      total.textContent = response.data.finalTotal// 加入總金額
      cartData = response.data.carts;
      let str = "";
      cartData.forEach(function(item){
        str+=`<tr>
          <td>
            <div class="cardItem-title">
                <img src="${item.product.images}" alt="">
                <p>${item.product.title}</p>
            </div>
          </td>
        <td>NT$${item.product.price}</td>
        <td>${item.quantity}</td>
        <td>NT$${item.product.price * item.quantity}</td>
        <td class="discardBtn">
            <a href="#" class="material-icons" data-id="${item.id}">
                clear
            </a>
        </td>
      </tr>`
      });
      cartList.innerHTML = str;
    })
}



// 清除購物車內全部產品
function deleteAllCartList() {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then(function (response) {
      alert("全部刪除");
      getCartList();
    })
    .catch(function(res){
      alert("以全數刪除")
    })
}
const discardAllBtn = document.querySelector(".discardAllBtn");

discardAllBtn.addEventListener('click' , function(e){
  e.preventDefault();
  deleteAllCartList()
})
cartList.addEventListener('click',function(e){
  e.preventDefault();
  const cartId = e.target.getAttribute("data-id");
  if(cartId == null){
    alert("點錯了")
    return
  };
  deleteCartItem(cartId);
})
// 刪除購物車內特定產品
function deleteCartItem(cartId) {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
    .then(function (response) {
      console.log(response.data);
      alert("成功刪除");
      getCartList()
    })
}


// 送初訂單
const orderInfoBtn = document.querySelector('.orderInfo-btn');
orderInfoBtn.addEventListener('click',function(e){
  e.preventDefault();
  if(cartData.length == 0){
    alert("請加入購物車");
    return
  }
  const customerName = document.querySelector('#customerName').value
  const customerPhone = document.querySelector('#customerPhone').value;
  const customerEmail = document.querySelector('#customerEmail').value;
  const customerAddress = document.querySelector('#customerAddress').value;
  const tradeWay = document.querySelector('#tradeWay').value;
  console.log(customerName,customerPhone,customerEmail,customerAddress,tradeWay)
  if (customerName==""|| customerPhone==""|| customerEmail==""|| customerAddress==""|| tradeWay==""){
    alert("請填滿");
    return
  }
  createOrder()
})
// 送出購買訂單
function createOrder() {
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
  {
    "data": {
      "user": {
        "name": customerName,
        "tel": customerPhone,
        "email": customerEmail,
        "address": customerAddress,
        "payment": tradeWay
      }
    }
  })
    .then(function (response) {
      console.log(response.data);
      alert('成功');
      getCartList();
    })
    .catch(function(error){
      console.log(error.response.data);
    })
}

// 取得訂單列表
function getOrderList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
    })
}

// 修改訂單狀態

function editOrderList(orderId) {
  axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      "data": {
        "id": orderId,
        "paid": true
      }
    },
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
    })
}

// 刪除全部訂單
function deleteAllOrder() {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
    })
}

// 刪除特定訂單
function deleteOrderItem(orderId) {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
    })
}

