// C3.js
// let chart = c3.generate({
//     bindto: '#chart', // HTML 元素綁定
//     data: {
//         type: "pie",
//         columns: [
//         ['Louvre 雙人床架', 1],
//         ['Antony 雙人床架', 2],
//         ['Anty 雙人床架', 3],
//         ['其他', 4],
//         ],
//         colors:{
//             "Louvre 雙人床架":"#DACBFF",
//             "Antony 雙人床架":"#9D7FEA",
//             "Anty 雙人床架": "#5434A7",
//             "其他": "#301E5F",
//         }
//     },
// });

// 請代入自己的網址路徑
const api_path = "shuo0608";
const token = "PrfRtWbF4JORy1taFAfgSFu1Plk1";


let orderData = [];
const orderList = document.querySelector(".js-orderList")
function init(){
  getOrderList();

};
init()
function renderC3(){
  console.log(orderData)
  // 物件資料蒐集
  let total = {};
  orderData.forEach(function(item){
    item.products.forEach(function(productItem){
      if(total[productItem.category] == undefined){
        total[productItem.category] = productItem.price*productItem.quantity;
      }else{
        total[productItem.category] += productItem.price*productItem.quantity;
      }
    })
  });
  // console.log(total);
  // 做出資料關聯
  let categoryAry = Object.keys(total);
  console.log(categoryAry)
  let newData = [];
  categoryAry.forEach(function(item){
    let ary = [];
    ary.push(item);
    ary.push(total[item]);
    newData.push(ary);
  })
  let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: newData,
    },
});
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
        orderData = response.data.orders;
        let str = "";
        orderData.forEach(function(item) {
        // 組時間字串
       const thisStamp =new Date(item.createdAt *1000);
       const thisTime = `${thisStamp.getFullYear()}/${thisStamp.getMonth()+1}/${thisStamp.getDate()}`;
       console.log(thisTime);
        // 組產品字串
        let productStr = ""
        item.products.forEach(function(productItem){
            productStr+=`<p>${productItem.title}*${productItem.quantity}</P>`
        })
        // 判斷訂單處理狀態
        let orderStatus = '';
        if(item.paid == true){
            orderStatus = '已處理'
        }else{
            orderStatus = '未處理'
        }
         // 組訂單字串
            str+=`<tr>
            <td>${item.id}</td>
            <td>
            <p>${item.user.name}</p>
            <p>${item.user.tel}</p>
            </td>
            <td>${item.user.address}</td>
            <td>${item.user.email}</td>
            <td>
            ${productStr}
            </td>
            <td>${thisTime}</td>
            <td class="js-orderStatus ">
            <a href="#"class="orderStatus"data-status="${item.paid}" data-id="${item.id}" >${orderStatus}</a>
            </td>
            <td>
            <input type="button" class="delSingleOrder-Btn js-orderDelete" data-id="${item.id}" value="刪除">
            </td>
        </tr>`
        });
        orderList.innerHTML = str;
        renderC3();
      })
  }
  
  // 修改訂單狀態
  function editOrderList( status,id) {
    let newStatus;
    if(status == true){
        newStatus = false
    }else{
        newStatus = true
    }
    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        "data": {
          "id": id,
          "paid": newStatus
        }
      },
      {
        headers: {
          'Authorization': token
        }
      })
      .then(function (response) {
        console.log(response.data);
        alert("修改成功")
        getOrderList()
      })
  }
  
  orderList.addEventListener('click',function(e){
    e.preventDefault();
    const targetClass = e.target.getAttribute('class');

    let id = e.target.getAttribute(("data-id"));

    if( targetClass =='delSingleOrder-Btn js-orderDelete'){
        deleteOrderItem(id);
        return
    }
    else if( targetClass =='orderStatus'){
        let status = e.target.getAttribute(("data-status"));
        
        editOrderList( status,id)
        return
    }
  })

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
        getOrderList()
      })
  }
  const discardAllBtn = document.querySelector('.discardAllBtn');
  discardAllBtn.addEventListener('click',function(e){
    e.preventDefault()
    deleteAllOrder()
    return
  });

  // 刪除特定訂單
  function deleteOrderItem(id) {
    console.log(id)
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${id}`,
      {
        headers: {
          'Authorization': token
        }
      })
      .then(function (response) {
        console.log(response.data);
        getOrderList()
      })
  }