import React, { useState } from 'react';
import { Form, Row, Col, Button, Alert, Card, Badge, ProgressBar } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { uploadProductImage } from '../../utils/cloudinaryUpload';
import ImageUploader from './ImageUploader';
import './ProductFormEnhanced.css';

// Validation schema
const productSchema = yup.object().shape({
    name: yup.string().required('Product name is required').min(3, 'Name must be at least 3 characters'),
    price: yup.number().required('Price is required').positive('Price must be positive').typeError('Price must be a number'),
    description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
    brand: yup.string().required('Brand is required'),
    category: yup.string().required('Category is required'),
    countInStock: yup.number().required('Stock count is required').min(0, 'Stock cannot be negative').integer('Stock must be a whole number').typeError('Stock must be a number'),
});

const ProductFormEnhanced = ({ 
    initialData = null, 
    onSubmit, 
    onCancel,
    categories = [],
    isEditing = false 
}) => {
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState(initialData?.images || []);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [suggestedCategories, setSuggestedCategories] = useState(categories);

    const { control, handleSubmit, watch, formState: { errors, isDirty, isValid }, reset, setValue } = useForm({
        resolver: yupResolver(productSchema),
        defaultValues: {
            name: initialData?.name || '',
            price: initialData?.price || '',
            description: initialData?.description || '',
            brand: initialData?.brand || '',
            category: initialData?.category || '',
            countInStock: initialData?.countInStock || 0,
        },
        mode: 'onChange' // Enable real-time validation
    });

    // Watch form values for live preview
    const watchedValues = watch();



    // Handle category input changes for autocomplete
    const handleCategoryChange = (value) => {
        setValue('category', value, { shouldValidate: true, shouldDirty: true });
        
        if (value.length > 0) {
            const filtered = categories.filter(cat => 
                cat.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestedCategories(filtered);
        } else {
            setSuggestedCategories(categories);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        const validFiles = files.filter(file => {
            if (file.size > 10 * 1024 * 1024) {
                setSubmitError("One or more files are too large (max 10MB)");
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            setImageFiles(prev => [...prev, ...validFiles]);
            
            const newPreviews = [];
            let processed = 0;
            
            validFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result);
                    processed++;
                    if (processed === validFiles.length) {
                        setImagePreviews(prev => [...prev, ...newPreviews]);
                    }
                };
                reader.readAsDataURL(file);
            });
            setSubmitError('');
        }
    };

    const handleRemoveImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const onFormSubmit = async (data) => {
        setSubmitError('');
        setIsSubmitting(true);

        try {
            let imageUrls = initialData?.images || [];

            // Only upload new images if there are new files
            if (imageFiles.length > 0) {
                imageUrls = [];
                for (let i = 0; i < imageFiles.length; i++) {
                    const url = await uploadProductImage(imageFiles[i], (progress) => {
                        const totalProgress = Math.round(((i * 100) + progress) / imageFiles.length);
                        setUploadProgress(totalProgress);
                    });
                    imageUrls.push(url);
                }
            }

            if (imageUrls.length === 0 && !isEditing) {
                setSubmitError("Please upload at least one product image");
                setIsSubmitting(false);
                return;
            }

            const productData = {
                ...data,
                image: imageUrls[0], // Main image
                images: imageUrls,   // All images
                rating: initialData?.rating || 0,
            };

            await onSubmit(productData);
            
            if (!isEditing) {
                reset();
                setImageFiles([]);
                setImagePreviews([]);
                setUploadProgress(0);
            }
        } catch (err) {
            console.error("Submit failed:", err);
            setSubmitError(err.response?.data?.message || err.message || "Failed to submit product");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="product-form-enhanced">
            <Row>
                <Col lg={8}>
                    <Card className="mb-4">
                        <Card.Body>
                            {submitError && <Alert variant="danger" dismissible onClose={() => setSubmitError('')}>{submitError}</Alert>}
                            
                            <Form onSubmit={handleSubmit(onFormSubmit)}>
                                {/* Image Upload Section */}
                                <div className="mb-4">
                                    <h5 className="mb-3">Product Images</h5>
                                    <ImageUploader
                                        imagePreviews={imagePreviews}
                                        onImageChange={handleImageChange}
                                        onRemove={handleRemoveImage}
                                        uploadProgress={uploadProgress}
                                    />
                                </div>

                                {/* Product Name */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Product Name <span className="text-danger">*</span></Form.Label>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Control
                                                {...field}
                                                type="text"
                                                placeholder="e.g., Wireless Headphones"
                                                isInvalid={!!errors.name}
                                                isValid={!errors.name && field.value && isDirty}
                                            />
                                        )}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Row>
                                    {/* Price */}
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Price ($) <span className="text-danger">*</span></Form.Label>
                                            <Controller
                                                name="price"
                                                control={control}
                                                render={({ field }) => (
                                                    <Form.Control
                                                        {...field}
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                        isInvalid={!!errors.price}
                                                        isValid={!errors.price && field.value && isDirty}
                                                    />
                                                )}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.price?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    {/* Stock Count */}
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Stock Count <span className="text-danger">*</span></Form.Label>
                                            <Controller
                                                name="countInStock"
                                                control={control}
                                                render={({ field }) => (
                                                    <Form.Control
                                                        {...field}
                                                        type="number"
                                                        placeholder="0"
                                                        min="0"
                                                        isInvalid={!!errors.countInStock}
                                                        isValid={!errors.countInStock && field.value !== '' && isDirty}
                                                    />
                                                )}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.countInStock?.message}
                                            </Form.Control.Feedback>
                                            {watchedValues.countInStock < 10 && watchedValues.countInStock > 0 && (
                                                <Form.Text className="text-warning">
                                                    <i className="fas fa-exclamation-triangle me-1"></i>
                                                    Low stock warning
                                                </Form.Text>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    {/* Brand */}
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Brand <span className="text-danger">*</span></Form.Label>
                                            <Controller
                                                name="brand"
                                                control={control}
                                                render={({ field }) => (
                                                    <Form.Control
                                                        {...field}
                                                        type="text"
                                                        placeholder="e.g., Sony"
                                                        isInvalid={!!errors.brand}
                                                        isValid={!errors.brand && field.value && isDirty}
                                                    />
                                                )}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.brand?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    {/* Category with Autocomplete */}
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                                            <Controller
                                                name="category"
                                                control={control}
                                                render={({ field }) => (
                                                    <>
                                                        <Form.Control
                                                            {...field}
                                                            type="text"
                                                            placeholder="e.g., Electronics"
                                                            onChange={(e) => handleCategoryChange(e.target.value)}
                                                            isInvalid={!!errors.category}
                                                            isValid={!errors.category && field.value && isDirty}
                                                            list="category-suggestions"
                                                        />
                                                        <datalist id="category-suggestions">
                                                            {suggestedCategories.map((cat, idx) => (
                                                                <option key={idx} value={cat} />
                                                            ))}
                                                        </datalist>
                                                    </>
                                                )}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.category?.message}
                                            </Form.Control.Feedback>
                                            {suggestedCategories.length > 0 && watchedValues.category && (
                                                <div className="mt-2">
                                                    {suggestedCategories.slice(0, 5).map((cat, idx) => (
                                                        <Badge 
                                                            key={idx} 
                                                            bg="light" 
                                                            text="dark"
                                                            className="me-2 mb-2 cursor-pointer"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => setValue('category', cat, { shouldValidate: true })}
                                                        >
                                                            {cat}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Description */}
                                <Form.Group className="mb-4">
                                    <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Control
                                                {...field}
                                                as="textarea"
                                                rows={4}
                                                placeholder="Detailed product description..."
                                                isInvalid={!!errors.description}
                                                isValid={!errors.description && field.value && isDirty}
                                            />
                                        )}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.description?.message}
                                    </Form.Control.Feedback>
                                    <Form.Text className="text-muted">
                                        {watchedValues.description?.length || 0} characters
                                    </Form.Text>
                                </Form.Group>

                                {/* Upload Progress */}
                                {uploadProgress > 0 && uploadProgress < 100 && (
                                    <div className="mb-3">
                                        <ProgressBar 
                                            now={uploadProgress} 
                                            label={`${uploadProgress}%`}
                                            variant="success"
                                            animated
                                        />
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="d-flex gap-2">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={isSubmitting || (!isEditing && imageFiles.length === 0)}
                                        className="px-4"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                {isEditing ? 'Updating...' : 'Creating...'}
                                            </>
                                        ) : (
                                            <>
                                                <i className={`fas fa-${isEditing ? 'save' : 'plus-circle'} me-2`}></i>
                                                {isEditing ? 'Update Product' : 'Create Product'}
                                            </>
                                        )}
                                    </Button>
                                    {onCancel && (
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={onCancel}
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                    {isDirty && !isSubmitting && (
                                        <Button
                                            type="button"
                                            variant="outline-secondary"
                                            onClick={() => reset()}
                                        >
                                            <i className="fas fa-undo me-2"></i>
                                            Reset
                                        </Button>
                                    )}
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Live Preview Panel */}
                <Col lg={4}>
                    <Card className="sticky-top" style={{ top: '20px' }}>
                        <Card.Header className="bg-light">
                            <h6 className="mb-0">
                                <i className="fas fa-eye me-2"></i>
                                Live Preview
                            </h6>
                        </Card.Header>
                        <Card.Body>
                            {imagePreviews.length > 0 && (
                                <div className="mb-3">
                                    <img 
                                        src={imagePreviews[0]} 
                                        alt="Preview" 
                                        className="img-fluid rounded"
                                        style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                            
                            <h5 className="mb-2">{watchedValues.name || 'Product Name'}</h5>
                            
                            <div className="mb-2">
                                <Badge bg="primary">{watchedValues.category || 'Category'}</Badge>
                                <Badge bg="secondary" className="ms-2">{watchedValues.brand || 'Brand'}</Badge>
                            </div>

                            <div className="d-flex align-items-center mb-2">
                                <h4 className="mb-0 text-success">
                                    ${watchedValues.price || '0.00'}
                                </h4>
                            </div>

                            <div className="mb-3">
                                <small className="text-muted">
                                    <i className="fas fa-box me-1"></i>
                                    Stock: <strong>{watchedValues.countInStock || 0}</strong>
                                </small>
                            </div>

                            <p className="text-muted small mb-0">
                                {watchedValues.description || 'Product description will appear here...'}
                            </p>

                            {/* Validation Status */}
                            <div className="mt-3 pt-3 border-top">
                                <small className="d-block mb-1">
                                    <i className={`fas fa-circle me-2 ${isValid ? 'text-success' : 'text-warning'}`}></i>
                                    Form {isValid ? 'Valid' : 'Incomplete'}
                                </small>
                                {isDirty && (
                                    <small className="d-block text-info">
                                        <i className="fas fa-pencil-alt me-2"></i>
                                        Unsaved changes
                                    </small>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProductFormEnhanced;
