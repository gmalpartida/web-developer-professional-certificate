/*
confirmation.js
Gino Malpartida
*/

// event listener for form's onload event
window.addEventListener('load', populate_page);

/*
retrieves order if from URL params
Params:         None
Returns:        order id 
*/
function get_order_id(){
    const params = new URLSearchParams(window.location.search);
    return params.get('orderId');
}

/*
populates the order id element of the page
Params:         None
Returns:        None;
*/
function populate_page(){
    let orderId = get_order_id();

    document.getElementById('orderId').textContent = orderId;
}