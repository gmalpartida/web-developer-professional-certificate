/*
implements functionality of index.html page
Gino Malpartida

*/

window.addEventListener('load', get_all_products);

/*
Retrieve list of all products available for sale
Parameters: None
Return: None
*/
async function get_all_products(){
    const url = 'http://localhost:3000/api/products/';
    try{
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok){
            throw new Error('Response Status: $(response.status)');
        }
        const product_list = await response.json();
        populate_page(product_list);
    }
    catch(error){
        console.error(error.message);
    }
}

/*
Populates the page with the products available for sale
Parameters:
    product_list:   list of products available for sale
Returns:    None;
*/
function populate_page(product_list){
    items = document.getElementById('items');
    for (let i = 0; i < product_list.length; i++){
        product_element = create_product_element(product_list[i]);
        items.appendChild(product_element);
    }
}

/*
creates an html element to be displayed on the page
Parameters:
    product:    json record containing all data for one product
Return: an 'a' link html element for one product1000000000
*/
function create_product_element(product){
    
    product_link = document.createElement('a');

    product_link.href = './product.html?id=' + product._id;

    product_article = document.createElement('article');
    product_link.appendChild(product_article);

    // create image element
    img = document.createElement('img');
    img.src = product.imageUrl;
    img.alt = product.altTxt;

    // create h3 element
    h3 = document.createElement('h3');
    h3.classList.add('productName');
    h3.textContent = product.name;

    // create p element
    p = document.createElement('p');
    p.classList.add('productDescription');
    p.textContent = product.description;

    // add children elements
    product_article.appendChild(img);
    product_article.appendChild(h3);
    product_article.appendChild(p);

    return product_link;
}

