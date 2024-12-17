/*
cart.js
Implementation of functions for the cart.html page.
Gino Malpartida
*/


// list of products and prices in the cart, separate from localStorage
let product_list = [];

// event handling functions
window.addEventListener('load', populate_page);
document.getElementById('firstName').addEventListener('input', validate_name);
document.getElementById('lastName').addEventListener('input', validate_name);
document.getElementById('email').addEventListener('input', validate_email);
document.getElementById('city').addEventListener('input', validate_city);
document.getElementById('address').addEventListener('input', validate_address);

/*
Retrieve products' data and populates the page's html controls
Params: None
Return: None
*/
async function populate_page(){
    let cart_totals = {total_quantity:0, total_price:0.0};
    for (let i = 0; i < localStorage.length; i++){
        let product_key = localStorage.key(i);
        let product_in_cart = JSON.parse(localStorage.getItem(product_key));

        const response = await fetch('http://localhost:3000/api/products/' + product_in_cart.product_id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json' }
        });

        if (!response.ok){
            throw new Error('Response Status: $(response.status)');
        }

        const product = await response.json();
        product_list.push(product);
        let results = populate_cart(product_in_cart, product);
        cart_totals.total_quantity += results.total_quantity;
        cart_totals.total_price += results.total_price;
        populate_cart_totals(cart_totals);

    }
    
}

/*
Creates an article html element.
Params:
product_in_cart:    Information of product in the cart
product:            Additional info, including price.
Returns:            html element to be added to cart.
*/
function create_article_element(product_in_cart, product){
    let article = document.createElement('article');
    article.classList.add('cart__item');
    article.setAttribute('data-id', product_in_cart.product_id);
    article.setAttribute('data-color', product_in_cart.color)
    return article;
}

/*
Creates an img html element to be added to the cart item.
Params:             product information including image's path
Return:             img html element
*/
function create_cart_item_img_element(product){
    let div = document.createElement('div');
    div.classList.add('cart__item__img');
    let img = document.createElement('img');
    img.src = product.imageUrl;
    div.appendChild(img);
    return div;
}

/*
Creates a cart item description element.
Params:
    product_in_cart:        info on product added to cart
    product:                additional info on product including name.
Returns:                    html item description element.
*/
function create_cart_item_content_description_element(product_in_cart, product){
    let div = document.createElement('div');
    div.classList.add('cart__item__content__description');
    let h2_name = document.createElement('h2');
    h2_name.textContent = product.name;
    let p_color = document.createElement('p');
    p_color.textContent = product_in_cart.color;
    let p_price = document.createElement('p');
    p_price.textContent = '€' + product.price;

    div.appendChild(h2_name);
    div.appendChild(p_color);
    div.appendChild(p_price);

    return div;
}

/*
Creates an html cart item content element
Params:
    product_in_cart:            info on product added to cart
    product:                    additional info on product
Returns:                        html cart item element.
*/
function create_cart_item_content(product_in_cart, product){
    let div = document.createElement('div');
    div.classList.add('cart__item__content');
    description_element = create_cart_item_content_description_element(product_in_cart, product);
    let cart_item_content_settings = create_cart_item_content_setting_element(product_in_cart, product);
    div.appendChild(description_element);
    div.appendChild(cart_item_content_settings);

    return div;
}

/*
creates an html cart item settings element.
Params:             None
Returns:            html cart item settings element.
*/
function create_cart_item_content_settings_quantity(){
    let cart_item_content_settings_quantity = document.createElement('div');
    cart_item_content_settings_quantity.classList.add('cart__item__content__settings__quantity');
    
    return cart_item_content_settings_quantity;
}

/*
Creates an html quantity element
Params:         
    product_in_cart:            info on product in cart
Returns:                        html quantity element.
*/
function create_input_quantity_element(product_in_cart){
    let input_element = document.createElement('input');
    input_element.classList.add('itemQuantity');
    input_element.setAttribute('type', 'number');
    input_element.setAttribute('name', 'itemQuantity');
    input_element.setAttribute('min', '1');
    input_element.setAttribute('max', '100');
    input_element.setAttribute('value', product_in_cart.quantity);
    return input_element;
}

/*
creates html cart item delete element.
Params:             None
Returns:            html cart item delete element.
*/
function create_cart_item_content_settings_delete_element(){
    let cart_item_content_settings_delete = document.createElement('div');
    cart_item_content_settings_delete.classList.add('cart__item__content__settings__delete');    
    cart_item_content_settings_delete.addEventListener('click', delete_cart_item);
    return cart_item_content_settings_delete;
}

/*
create html cart item content setting element.
Params:
    product_in_cart:            info on product in the cart
    product:                    additional info on product.
Returns:                        html cart item content setting element.
*/
function create_cart_item_content_setting_element(product_in_cart, product){
    //<div class="cart__item__content__settings">
    let cart_item_content_settings = document.createElement('div');
    cart_item_content_settings.classList.add('cart__item__content__settings');

    //<div class="cart__item__content__settings__quantity">
    let cart_item_content_settings_quantity = create_cart_item_content_settings_quantity();
    cart_item_content_settings.appendChild(cart_item_content_settings_quantity);

    //<p>Quantity : </p>
    let quantity = document.createElement('p');
    quantity.textContent = 'Quantity : ';
    cart_item_content_settings_quantity.appendChild(quantity);

    //<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
    let input_element = create_input_quantity_element(product_in_cart);
    input_element.addEventListener('change', quantity_change);
    cart_item_content_settings_quantity.appendChild(input_element);

    //<div class="cart__item__content__settings__delete">
      //  <p class="deleteItem">Delete</p>
    //</div>
    let cart_item_content_settings_delete = create_cart_item_content_settings_delete_element();
    cart_item_content_settings.appendChild(cart_item_content_settings_delete);

    let delete_item = document.createElement('p');
    delete_item.classList.add('deleteItem');
    delete_item.textContent = 'Delete';
    cart_item_content_settings_delete.appendChild(delete_item);

    return cart_item_content_settings;
}

/*
removes an item from the cart.  Displays a message if cart is empty after deletion of item.
Params:             None
Returns:            None
*/
function delete_cart_item(){
    let product_id = this.parentNode.parentNode.parentNode.getAttribute('data-id');
    let product_color = this.parentNode.parentNode.parentNode.getAttribute('data-color');
    key = product_id + product_color;

    localStorage.removeItem(key);
    location.reload();
    if (0 == localStorage.length){
        alert('Your cart will be empty after deleting this last item.  You will be taken back to the Home page.');
        location.href = './index.html';
    }
}

/*
Populates the cart of items.
Params:
    product_in_cart:            info on product in cart
    product:                    additional info on product.
Returns:                        
    total_quantity              total number of items in cart
    total_price                 total price of all items in cart.
*/
function populate_cart(product_in_cart, product){

    let article = create_article_element(product_in_cart, product);

    let cart_item_img = create_cart_item_img_element(product);
    let cart_item_content = create_cart_item_content(product_in_cart, product);

    let cart_items = document.getElementById('cart__items');

    cart_items.appendChild(article);

    article.appendChild(cart_item_img);
    article.appendChild(cart_item_content);

    let total_quantity = parseInt(product_in_cart.quantity);
    let total_price = parseFloat(product.price) * total_quantity;

    return {total_quantity: total_quantity, total_price: total_price};
}

/*
populates the html elements with total price and quantity
Params:
    cart_totals:        total quantity and total price for all items in cart
Returns:                None
*/
function populate_cart_totals(cart_totals){

    document.getElementById('totalQuantity').textContent =  cart_totals.total_quantity;
    document.getElementById('totalPrice').textContent = cart_totals.total_price;

}

/*
Calculates the totals for all items in the cart.
Params:             None
Returns:
    cart_totals:    contains total quantity and total price for items in cart.
*/
function calculate_cart_totals(){
    let cart_totals = {total_quantity: 0, total_price: 0.0};
    for (let i = 0; i < localStorage.length; i++)
    {
        let key = localStorage.key(i);
        let product_in_cart = JSON.parse(localStorage.getItem(key));
        cart_totals.total_quantity += product_in_cart.quantity;
        
        let product = product_list.find(p => p._id == product_in_cart.product_id);

        cart_totals.total_price += product_in_cart.quantity * product.price;
        
    }
    return cart_totals;
}

/*
implements callback for change event of quantity html element.
Params:         None
Returns:        none
*/
function quantity_change(){
    let current_quantity = parseInt(this.value);
    let product_id = this.parentNode.parentNode.parentNode.parentNode.getAttribute('data-id');
    let color_id = this.parentNode.parentNode.parentNode.parentNode.getAttribute('data-color');

    let key = product_id + color_id;
    let product_in_cart = JSON.parse(localStorage.getItem(key));
    product_in_cart.quantity = current_quantity;
    localStorage.setItem(key, JSON.stringify(product_in_cart));

    let cart_totals = calculate_cart_totals();

    populate_cart_totals(cart_totals);
}

/*
validates first name and last name using some arbitrary rules.
Params:
    name:           name to be validated
Returns:            true if name is valid otherwise false.
*/
function is_valid_name(name){
    // rule for length of name
    result = name.length > 1 && name.length <= 50;

    // only letters, hyphen and apostrophe allowed
    if (result){
        const valid_characters = /^[A-Za-zÀ-ÿ]+([ '-][A-Za-zÀ-ÿ]+)*$/;
        result = valid_characters.test(name)
    }

    return result;
}

/*
performs name validation and displays a message if not valid.
Params:         None
Returns:        none;
*/
function validate_name(){
    let is_valid = is_valid_name(this.value);
    if (!is_valid){
        if (this.id == 'firstName')
            document.getElementById('firstNameErrorMsg').textContent = 'Only letters, hyphen and apostrophes allowed in name.';
        else
            document.getElementById('lastNameErrorMsg').textContent = 'Only letters, hyphen and apostrophes allowed in name.';
    }
    else
        if (this.id == 'firstName')
            document.getElementById('firstNameErrorMsg').textContent = '';
        else
            document.getElementById('lastNameErrorMsg').textContent = '';
}

/*
performs validation of email address.
Params:         None
Returns:        None
*/
function validate_email(){
    let email = document.getElementById('email').value;
    // Check length
    let result = !(email.length < 3 || email.length > 254);

    if (result){
        const valid_characters = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;    
        result = valid_characters.test(email);
        
    }
    
   if (!result){
        document.getElementById('emailErrorMsg').textContent = 'Invalid email address.';
    }
    else
        document.getElementById('emailErrorMsg').textContent = '';
}

/*
performs validation of city name. Displays message if not valid.
params:         none
Returns:        none
*/
function validate_city() {
    let city = document.getElementById('city').value;
    let result = !(city.length < 1 || city.length > 100);
    if (result){
        // allow letters, spaces, hyphens, and apostrophes (common in city names)
        const valid_characters = /^[A-Za-zÀ-ÿ]+(?:[ '-][A-Za-zÀ-ÿ]+)*$/;

        result = valid_characters.test(city);
    }
    if (!result){
        document.getElementById('cityErrorMsg').textContent = 'Invalid city name.';
    }
    else
        document.getElementById('cityErrorMsg').textContent = '';
}

/*
performs validation of address. displays error message if not valid.
params:         none
returns:        none
*/
function validate_address() {
    let address = document.getElementById('address').value;
    let result = !(address.length < 1 || address.length > 100);

    if (result){
        // allow letters, numbers, and common punctuation
        const valid_characters = /^[A-Za-z0-9À-ÿ.,' -]+$/;

        result = valid_characters.test(address);

    }

    if (!result){
        document.getElementById('addressErrorMsg').textContent = 'Invalid address.';
    }
    else
        document.getElementById('addressErrorMsg').textContent = '';
}

/*
event listener for submit event of form.  goes to confirmation page if all good.
Params:         
    evt:        submit event data
Returns:        none
*/
document.querySelector('form').addEventListener('submit', async (evt) => {
    evt.preventDefault();

    // create contact record
    let contact = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        email: document.getElementById('email').value
    };

    // create product list
    let products = [];

    for (let i = 0; i < localStorage.length; i++){
        let key = localStorage.key(i);
        let product_in_cart = JSON.parse(localStorage.getItem(key));
        products.push(product_in_cart.product_id);
    }

    // add contact and product list to form's data
    let formData = {'contact': contact, 'products':products};

    // POST form
    const response = await fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });

    if (!response.ok){
        throw new Error('Response Status: $(response.status)');
    }

    // go to confirmation page if all good.
    const product_table = await response.json();

    location.href = './confirmation.html?orderId=' + product_table.orderId;

  });

