import React from 'react';
import Navbar from '../Navbar/Navbar'
import './ProductList.css'
import display from  '../assets/display.png'
import comment from '../assets/comment.png'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LoginModal,SignUpModal,AddproductModal } from '../Modals/Modals';
import axios from 'axios';
import { useEffect } from 'react';
import enter from '../assets/enter.png'
import commentImg from '../assets/comments.png'



const ProductList=()=>{

    const navigate=useNavigate()

    const [isLoggedIn, setIsLoggedIn] = useState(!!window.localStorage.getItem("jwtToken"))
    const [editProduct, setEditProduct] = useState('');


    const handleLogout = ()=>{
        window.localStorage.removeItem("jwtToken")
        setIsLoggedIn(!!window.localStorage.getItem("jwtToken"))
        navigate('/login')
    }

    const [showAddProductModal, setshowAddProductModal] = useState(false);
    const [showSignupModal, setshowSignupModal] = useState(false);
    const [showLoginModal, setshowLoginModal] = useState(false);


    const handleAddProductClick = () => {
        if (isLoggedIn) {
          setshowAddProductModal(true);
        } else {
          setshowSignupModal(true);
        }
      };

    const handleLoginModalClick=()=>{
        setshowSignupModal(false)
        setshowLoginModal(true)
    }


    const [products, setproducts] = useState([]);
    const [showCommentInput, setShowCommentInput] = useState({});
    const [comments, setComments] = useState({});
    const [sortBy, setSortBy] = useState('upvotes'); // Default sorting by upvotes
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);const [filteredProductCount, setFilteredProductCount] = useState(0);


    const fetchProducts = async () => {
        try {
          const response = await axios.get('http://localhost:4000/Viewproducts');
          const uniqueCategories = Array.from(new Set(response.data.map((product) => product.category)));
          setCategories(uniqueCategories);

          const filteredProducts = response.data.filter((product) => selectedCategory === null || product.category === selectedCategory);
          setFilteredProductCount(filteredProducts.length);

          const sortedProducts = response.data.sort((a, b) => {
            if (sortBy === 'upvotes') {
              return b.upvotes - a.upvotes; // Sort by maximum upvotes first
            } else if (sortBy === 'comments') {
              return b.comments.length - a.comments.length; // Sort by maximum comments first
            } else {
              return 0; // Default: do not change the order
            }
          });
          setproducts(sortedProducts);
        } catch (error) {
          console.error('Error fetching job data:', error);
        }
      };

    useEffect(() => {
        // Fetch job data from the backend based on search and skills criteria
        fetchProducts();
      },[selectedCategory, sortBy]);

    const handleEdit = (product) => {
    // Set the product data to be edited
        setEditProduct(product);
        console.log("editProduct", product)
        setshowAddProductModal(true);
    };


    const handleToggleCommentInput = (productId) => {
        setShowCommentInput((prev) => ({ ...prev, [productId]: !prev[productId] }));
      };
    
      const handleCommentChange = (productId, e) => {
        setComments((prev) => ({ ...prev, [productId]: e.target.value }));
      };
    
      const handlePostComment = async (productId) => {
        const newCommentText = comments[productId];
        if (newCommentText && newCommentText.trim() !== '') {
          try {
            await axios.patch(`http://localhost:4000/CommentProduct/${productId}`, { text: newCommentText });
            // Clear the comment input and refresh the product list after posting the comment
            setComments((prev) => ({ ...prev, [productId]: '' }));
            fetchProducts();
          } catch (error) {
            console.error('Error posting comment:', error);
          }
        }
      };

    const handleUpvote = async (productId) => {
        try {
          // Make a PATCH request to update the upvotes field in the database
          await axios.patch(`http://localhost:4000/UpvoteProduct/${productId}`);
          // Refresh the product list after upvoting
          fetchProducts();
        } catch (error) {
          console.error('Error upvoting product:', error);
        }
      };


      

    return(

    <div className='product-list-main'>
        <Navbar isLoggedIn={isLoggedIn}  handleLogout={handleLogout}/>
        <div className='display'>
            <img src={display} alt='display-img' className='display-img' />
            <div className='display-desc'>
                <h1 className='display-heading'>Add your products and give your valuable feedback</h1>
                <p className='display-para'>Easily give your feedback in a matter of minutes. Access your audience on all platforms. Observe result manually in real time</p>
            </div>
        </div>
        <div className='List'>
            <div className='filter-products'>
                <div className='filter-desc'>
                    <p className='filter-heading'>Feedback</p>
                    <p className='filter-para'>Apply Filter</p>
                </div>
                <div className='filters'>
                    <p className='filters-mobile'>Filters:</p>
                    <div className='companyNamefilter'>
                    <p className={`all ${selectedCategory === null ? 'active' : ''}`} onClick={() => setSelectedCategory(null)}>All</p>
                        {categories.map((category) => (
                            <p
                                key={category}
                                className={`mappednames ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category)}>
                                {category}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
            <div className='ProductList'>
                <div  className="details-sort">
                    <p className='suggestions'>{filteredProductCount} Suggestions</p>
                    <div className='sort'>
                        <label htmlFor='sorting' className='sortHeading'>Sort by :</label>
                        <select className='sortSelect' id='sorting' onChange={(e) => setSortBy(e.target.value)}>
                            <option className='sortby' value=" ">Sort by</option>
                            <option className='upvotes' value='upvotes'>Upvotes</option>
                            <option className='comments' value={comments}>Comments</option>
                        </select>
                    </div>
                    <button className='addproduct' onClick={handleAddProductClick}>+Add product</button>
                </div>
                <div className='Product'>
                    {products.map((product,index)=>
                    (selectedCategory === null || product.category === selectedCategory) && (
                    <div className='details-box' key={index}>
                        <div style={{display:"flex", height:"157px",marginTop:"20px"}}>
                            <img className='logoUrl' src={product.logoUrl} alt='logo' />
                            <div className='details'>
                                <p className='category'>{product.category}</p>
                                <p className='description'>{product.description}</p>
                                <div className='boxes'>
                                    <p className='company'>{product.companyName}</p>
                                    <div style={{display:"flex", cursor:"pointer"}} onClick={() => handleToggleCommentInput(product._id)}>
                                        <img src={comment} className='commentimage' alt='com' />
                                        <p className='comment'>Comment</p>
                                    {isLoggedIn?<button className='edit' onClick={() => handleEdit(product)}>Edit</button>:""}
                                    </div>
                                </div>
                            </div>
                            <div className='upcom'>
                                <button className='upvote-btn' onClick={() => handleUpvote(product._id)}>{product.upvotes}</button>
                                <div style={{display:"flex",marginTop:"10px"}}>
                                  <p className='comments-btn'>{product.comments.length}</p>
                                  <img src={commentImg} className='comImg' alt='com'/>
                                </div>
                            </div>
                        </div>
                        {showCommentInput[product._id] && (
                            <div className='commentsbox'>
                              <div className='commentinputCon'>
                                <input
                                type='text' className='commentinput'
                                value={comments[product._id] || ''}
                                onChange={(e) => handleCommentChange(product._id, e)}
                                placeholder='Add a comment...'
                                />
                                <button onClick={() => handlePostComment(product._id)} className='enterBtn'><img src={enter} alt='enter'/></button>
                              </div>
                              <div className='commentsHolder'>
                                  <ul className='comUl'>
                                      {product.comments.map((comment, commentIndex) => (
                                      <li key={commentIndex} className='comLi'>
                                          <p>{comment.text}</p>
                                      </li>
                                      ))}
                                  </ul>
                              </div>
                            </div>
                        )}
                    </div>
                    ))}
                </div>
                {showAddProductModal && <AddproductModal setshowAddProductModal={setshowAddProductModal} editProduct={editProduct}/>}
                {showSignupModal && <SignUpModal handleLoginModalClick={handleLoginModalClick} setshowAddProductModal={setshowAddProductModal} setshowSignupModal={setshowSignupModal}/>}
                {showLoginModal && <LoginModal  setshowAddProductModal={setshowAddProductModal} setshowLoginModal={setshowLoginModal}/>}
            </div>
        </div>
    </div>
    )
}

export default ProductList