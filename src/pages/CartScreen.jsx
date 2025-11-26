import React, { useEffect, useState } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card, Alert, InputGroup, Modal } from 'react-bootstrap'
import { addToCart, removeFromCart, applyCoupon, removeCoupon, clearCart } from '../actions/cartActions'
import notificationService from "../utils/notificationService";
import { formatPrice, getCurrencySymbol } from '../utils/currencyUtils';

const CartScreen = () => {
    const { id: productId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const qty = location.search ? Number(location.search.split('=')[1]) : 1

    const [couponCode, setCouponCode] = useState('')
    const [couponError, setCouponError] = useState('')
    const [couponSuccess, setCouponSuccess] = useState('')
    
    // Clear Cart Modal State
    const [showClearCartModal, setShowClearCartModal] = useState(false);

    const dispatch = useDispatch()

    const cartItems = useSelector((state) => state.cart.cartItems) || []
    const coupon = useSelector((state) => state.cart.coupon)
    const currencyState = useSelector((state) => state.currencyState);
    const { currency } = currencyState;
    const currencySymbol = getCurrencySymbol(currency);

    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty))
        }
    }, [dispatch, productId, qty])

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
        notificationService.info("Item removed from cart");
    }

    const confirmClearCart = () => {
        setShowClearCartModal(true);
    }

    const clearCartHandler = () => {
        dispatch(clearCart())
        notificationService.info("Cart cleared");
        setShowClearCartModal(false);
    }

    const checkoutHandler = () => {
        navigate('/app/login?redirect=shipping')
    }

    const handleApplyCoupon = async () => {
        setCouponError('')
        setCouponSuccess('')

        if (!couponCode.trim()) {
            notificationService.error('Please enter a coupon code')
            return
        }

        const result = await dispatch(applyCoupon(couponCode))

        if (result.success) {
            notificationService.success('Coupon applied successfully!')
            setCouponCode('')
        } else {
            notificationService.error(result.message)
        }
    }

    const handleRemoveCoupon = () => {
        dispatch(removeCoupon())
        notificationService.info("Coupon removed");
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

    return (
        <div className="container py-5">
            <Row>
                <Col md={8}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="fw-bold">Shopping Cart</h1>
                        {cartItems.length > 0 && (
                            <Button variant="outline-danger" size="sm" onClick={confirmClearCart}>
                                <i className="fas fa-trash me-2"></i> Clear Cart
                            </Button>
                        )}
                    </div>
                    {cartItems.length === 0 ? (
                        <Alert variant='info' className="p-4 text-center">
                            <h4>Your cart is empty</h4>
                            <p className="mb-0">Looks like you haven't added anything to your cart yet.</p>
                            <Link to='/' className="btn btn-primary mt-3">Start Shopping</Link>
                        </Alert>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {cartItems.filter(item => item && item.product).map((item, index) => (
                                <Card key={item.product || index} className="border-0 shadow-sm">
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col md={2}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col md={4}>
                                                <Link to={`/products/${item.product}`} className="text-decoration-none text-dark fw-bold">
                                                    {item.name}
                                                </Link>
                                            </Col>
                                            <Col md={2} className="fw-bold text-muted">
                                                {currencySymbol}{formatPrice(item.price, currency)}
                                            </Col>
                                            <Col md={2}>
                                                <Form.Control
                                                    as='select'
                                                    value={item.qty}
                                                    onChange={(e) =>
                                                        dispatch(
                                                            addToCart(item.product, Number(e.target.value))
                                                        )
                                                    }
                                                    className="form-select-sm"
                                                >
                                                    {[...Array(item.countInStock).keys()].map((x) => (
                                                        <option key={x + 1} value={x + 1}>
                                                            {x + 1}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Col>
                                            <Col md={2} className="text-end">
                                                <Button
                                                    type='button'
                                                    variant='light'
                                                    className="text-danger"
                                                    onClick={() => removeFromCartHandler(item.product)}
                                                >
                                                    <i className='fas fa-trash'></i>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    )}
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <h4 className="mb-3">Order Summary</h4>
                            <ListGroup variant='flush'>
                                <ListGroup.Item className="px-0">
                                    <div className="d-flex justify-content-between">
                                        <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                                        <span className="fw-bold">{currencySymbol}{formatPrice(subtotal, currency)}</span>
                                    </div>
                                </ListGroup.Item>

                                {/* Coupon Code Section */}
                                <ListGroup.Item className="px-0">
                                    <h6 className="mb-2">Have a Coupon?</h6>
                                    {!coupon ? (
                                        <>
                                            <InputGroup className='mb-2'>
                                                <Form.Control
                                                    type='text'
                                                    placeholder='Enter code'
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                />
                                                <Button variant='outline-primary' onClick={handleApplyCoupon}>
                                                    Apply
                                                </Button>
                                            </InputGroup>
                                            {couponError && <small className='text-danger'>{couponError}</small>}
                                            {couponSuccess && <small className='text-success'>{couponSuccess}</small>}
                                        </>
                                    ) : (
                                        <Alert variant='success' className='d-flex justify-content-between align-items-center py-2 px-3 mb-0'>
                                            <small>
                                                <strong>{coupon.code}</strong> applied
                                            </small>
                                            <Button variant='link' size='sm' onClick={handleRemoveCoupon} className='text-danger p-0 text-decoration-none'>
                                                <i className="fas fa-times"></i>
                                            </Button>
                                        </Alert>
                                    )}
                                </ListGroup.Item>

                                {/* Show discount if applied */}
                                {coupon && (
                                    <ListGroup.Item className="px-0">
                                        <div className="d-flex justify-content-between text-success">
                                            <span>Discount</span>
                                            <span>-{currencySymbol}{formatPrice(discount, currency)}</span>
                                        </div>
                                    </ListGroup.Item>
                                )}

                                {/* Total */}
                                <ListGroup.Item className="px-0">
                                    <div className="d-flex justify-content-between fs-5 fw-bold">
                                        <span>Total</span>
                                        <span>{currencySymbol}{formatPrice(total, currency)}</span>
                                    </div>
                                </ListGroup.Item>

                                <ListGroup.Item className="px-0 pt-3">
                                    <Button
                                        type='button'
                                        className='w-100 py-2 fw-bold'
                                        disabled={cartItems.length === 0}
                                        onClick={checkoutHandler}
                                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                                    >
                                        Proceed To Checkout
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Clear Cart Confirmation Modal */}
            <Modal show={showClearCartModal} onHide={() => setShowClearCartModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Clear Cart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to remove all items from your cart?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowClearCartModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={clearCartHandler}>
                        Clear Cart
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CartScreen
