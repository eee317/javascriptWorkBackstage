

const url='https://livejs-api.hexschool.io';
const api_path='peiying';
const token='zsYAPcI9hNMISTqubJAtNmAN2Rn1'
let orderData;
init()
function init(){
    getOrder()
}

function getOrder(){
    const apiUrl=`/api/livejs/v1/admin/${api_path}/orders`
    const getApiUrl=url+apiUrl
    console.log(getApiUrl)
    axios.get(getApiUrl,{
        headers:{
            'Authorization':token
        }
        
    })
    .then(function(response){
        orderData=response.data.orders;
        renderOrderList()
        renderC3Category()
        renderC3Revenue()
    })
    .catch(function(error){
        console.log(error)
    })
}
const tbody=document.querySelector('.js-tbody')

function renderOrderList(){
    let strProducts=''
    let str='';
    orderData.forEach(function(item){
        item.products.forEach(function(products){
            strProducts+=`<p> • ${products.title}</p>`
        })
        str+=`<tr>
        <td>${item.id}</td>
        <td>
            <p>${item.user.name}</p>
            <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
            <p>${strProducts}</p>
        </td>
        <td>${dateConversion(item.createdAt)}</td>
        <td class="orderStatus">
            <a href="#" data-paid="${item.paid}" data-id="${item.id}" class="js_orderState">${item.paid?'已處理':'未處理'}</a>
        </td>
        <td>
            <input type="button" class="delSingleOrder-Btn" value="刪除" data-id="${item.id}">
        </td>
    </tr>`
    })
    tbody.innerHTML=str
}
function dateConversion(second){
    let time=new Date(second*1000);
    let year=time.getFullYear();
    let month=time.getMonth();
    let day=time.getDate();
    let timeText=`${year}/${month}/${day}`;
    return timeText;
}

//刪除全部訂單
const discardAllBtn=document.querySelector('.discardAllBtn')
discardAllBtn.addEventListener('click',function(e){
    e.preventDefault();
    let apiUrl=url+`/api/livejs/v1/admin/${api_path}/orders`
    axios.delete(apiUrl,{
        headers:{
            'authorization':token
        }
    })
    .then(function(response){
        console.log(response);
        renderOrderList()
        
    })
    .catch(function(error){
        console.log(error)
    })
});

//刪除單一訂單
tbody.addEventListener('click',function(e){
    e.preventDefault();
    let id=e.target.getAttribute('data-id')
    let state=e.target.getAttribute('data-paid')
    if(e.target.getAttribute('class')=='delSingleOrder-Btn'){
        return deleteOrderId(id)
    }
    if(e.target.getAttribute('class')=='js_orderState'){
        return putOrder(state,id)
    }
    
    
})

//刪除單一訂單
function deleteOrderId(id){
    let urlApi=url+`/api/livejs/v1/admin/${api_path}/orders/${id}`
    console.log(id)
    axios.delete(urlApi,{
        headers:{
            'authorization':token
        }
    })
    .then(function(response){
        console.log(response)
        getOrder()
    })
    .catch(function(error){
        console.log(error)
    })
}

//更改訂單狀態
function putOrder(state,id){
    console.log(state,id)
    let urlApi=url+`/api/livejs/v1/admin/${api_path}/orders`
    let paidState;
    if(state==='false'){
        paidState=true;
    }else{
        paidState=false;
    }
    axios.put(urlApi,{
        data:{
            "id": id,
            "paid": paidState
        }},{
        headers:{
            'authorization':token
        }
    })
    .then(function(response){
        console.log(response)
        getOrder()
    })
    .catch(function(error){
        console.log(error.request)
    })
    
}

//印出c3圖表『全產品類別營收比重』
function renderC3Category(){
    let product={}
    orderData.forEach(function(item){
        item.products.forEach(function(products){
            
            if(product[products.category]==undefined){
                product[products.category]=products.price*products.quantity;
            }else{
                product[products.category]+=products.price*products.quantity;
            }
            
        })
    })
    let productAry=Object.keys(product)
    let renderC3Data=[];
    productAry.forEach(function(item){
        let obj=[]
        obj.push(item);
        obj.push(product[item])
        renderC3Data.push(obj)
    })
    
    let chart_category = c3.generate({
    bindto: '#chart_category', // HTML 元素綁定
    size: {
        width: 480
    },
    data: {
        type: "pie",
        columns: renderC3Data,
        colors:{
            "床架":"#DACBFF",
            "窗簾":"#9D7FEA",
            "收納":"#5434A7"
        }
        
        },
    });
}

//全品項營收比重
function renderC3Revenue(){
    let product={};
    orderData.forEach(function(item){
        item.products.forEach(function(products){
            if(product[products.title]==undefined){
                product[products.title]=products.price*products.quantity;
            }else{
                product[products.title]+=products.price*products.quantity;
            }
        })
    })
    
    let productAry=Object.keys(product)
    let renderC3=[]
    productAry.forEach(function(item){
        let obj=[]
        obj.push(item);
        obj.push(product[item])
        renderC3.push(obj);
    })
    
    renderC3.sort(function(a,b){
        return b-a;
    })
    let otherTotal=0
    if(renderC3.length>2){
        renderC3.forEach(function(item,index){
            if(index>2){
                otherTotal+=renderC3[index][1]
            }
        })
    }
    renderC3.splice(3,renderC3.length-1)
    renderC3.push(['其他',otherTotal])
    
    let chart_revenue = c3.generate({
        bindto: '#chart_revenue', // HTML 元素綁定
        size: {
            width: 480
        },
        data: {
            type: "pie",
            columns: renderC3,
            colors:{
                "床架":"#DACBFF",
                "窗簾":"#9D7FEA",
                "收納":"#5434A7"
            }
            
            },
        });


}
