import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card, Alert, InputGroup } from 'react-bootstrap'
import { addToCart, removeFromCart, applyCoupon, removeCoupon, clearCart } from '../actions/cartActions'

const CartScreen = ({ match, location, history }) => {
    const productId = match.params.id
    const qty = location.search ? Number(location.search.split('=')[1]) : 1

    const [couponCode, setCouponCode] = useState('')
    const [couponError, setCouponError] = useState('')
    const [couponSuccess, setCouponSuccess] = useState('')

    const dispatch = useDispatch()

    const cartItems = useSelector((state) => state.cart.cartItems) || []
    const coupon = useSelector((state) => state.cart.coupon)

    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty))
        }
    }, [dispatch, productId, qty])

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const clearCartHandler = () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            dispatch(clearCart())
        }
    }

    const checkoutHandler = () => {
        history.push('/app/login?redirect=shipping')
    }

    const handleApplyCoupon = async () => {
        setCouponError('')
        setCouponSuccess('')

        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code')
            return
        }

        const result = await dispatch(applyCoupon(couponCode))

        if (result.success) {
            setCouponSuccess('Coupon applied successfully!')
            setCouponCode('')
        } else {
            setCouponError(result.message)
        }
    }

    const handleRemoveCoupon = () => {
        dispatch(removeCoupon())
        setCouponSuccess('')
        setCouponError('')
    }

    // Calculate subtotal
    const subtotal = cartItems.reduce((acc, item) => {
        if (item && item.qty && item.price) {
            return acc + item.qty * item.price
        }
        return acc
    }, 0)

    // Calculate discount
    let discount = 0
    if (coupon) {
        if (coupon.discountType === 'percentage') {
            discount = (subtotal * coupon.discountValue) / 100
        } else {
            discount = coupon.discountValue
        }
    }

    // Calculate final total
    const total = Math.max(0, subtotal - discount)

    // Debug logging
    console.log('CartScreen Render. Items:', cartItems.length);

    return (
        <Row>
            <Col md={8}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1>Shopping Cart</h1>
                    {cartItems.length > 0 && (
                        <Button variant="danger" size="sm" onClick={clearCartHandler}>
                            <i className="fas fa-trash me-2"></i> Clear Cart
                        </Button>
                    )}
                </div>
                {cartItems.length === 0 ? (
                    <Alert variant='info'>
                        Your cart is empty <Link to='/'>Go Back</Link>
                    </Alert>
                ) : (
                    <ListGroup variant='flush'>
                        {cartItems.filter(item => item && item.product).map((item, index) => (
                            <ListGroup.Item key={item.product || index}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/products/${item.product}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}>${item.price}</Col>
                                    <Col md={2}>
                                        <Form.Control
                                            as='select'
                                            value={item.qty}
                                            onChange={(e) =>
                                                dispatch(
                                                    addToCart(item.product, Number(e.target.value))
                                                )
                                            }
                                        >
                                            {[...Array(item.countInStock).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                    <Col md={2}>
                                        <Button
                                            type='button'
                                            variant='light'
                                            onClick={() => removeFromCartHandler(item.product)}
                                        >
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>
                                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                                items
                            </h2>
                            ${subtotal.toFixed(2)}
                        </ListGroup.Item>

                        {/* Coupon Code Section */}
                        <ListGroup.Item>
                            <h5>Have a Coupon?</h5>
                            {!coupon ? (
                                <>
                                    <InputGroup className='mb-2'>
                                        <Form.Control
                                            type='text'
                                            placeholder='Enter coupon code'
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        />
                                        <Button variant='primary' onClick={handleApplyCoupon}>
                                            Apply
                                        </Button>
                                    </InputGroup>
                                    {couponError && <Alert variant='danger' className='mt-2'>{couponError}</Alert>}
                                    {couponSuccess && <Alert variant='success' className='mt-2'>{couponSuccess}</Alert>}
                                </>
                            ) : (
                                <div>
                                    <Alert variant='success' className='d-flex justify-content-between align-items-center'>
                                        <span>
                                            <strong>{coupon.code}</strong> - {coupon.discountType === 'percentage'
                                                ? `${coupon.discountValue}% off`
                                                : `$${coupon.discountValue} off`}
                                        </span>
                                        <Button variant='link' size='sm' onClick={handleRemoveCoupon} className='text-danger'>
                                            Remove
                                        </Button>
                                    </Alert>
                                </div>
                            )}
                        </ListGroup.Item>

                        {/* Show discount if applied */}
                        {coupon && (
                            <ListGroup.Item>
                                <Row>
                                    <Col>Discount:</Col>
                                    <Col className='text-success'>-${discount.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>
                        )}

                        {/* Total */}
                        <ListGroup.Item>
                            <Row>
                                <Col><strong>Total:</strong></Col>
                                <Col><strong>${total.toFixed(2)}</strong></Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Button
                                type='button'
                                className='btn-block'
                                disabled={cartItems.length === 0}
                                onClick={checkoutHandler}
                            >
                                Proceed To Checkout
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    )
}

export default CartScreen

