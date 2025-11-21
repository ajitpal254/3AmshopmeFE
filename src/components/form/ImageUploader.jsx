import React from 'react';
import { Form } from 'react-bootstrap';

const ImageUploader = ({ imagePreview, onImageChange, onRemove, uploadProgress }) => {
    return (
        <Form.Group className="mb-4">
            <Form.Label>Product Image</Form.Label>
            <div className="image-upload-area" onClick={() => document.getElementById('product-image-input').click()}>
                {imagePreview ? (
                    <div className="image-preview-container">
                        <img src={imagePreview} alt="Preview" className="image-preview" />
                        <button
                            type="button"
                            className="remove-image-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(e);
                            }}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="image-upload-icon">
                            <i className="fas fa-images"></i>
                        </div>
                        <p className="mb-0 text-muted">Click to upload product image</p>
                        <small className="text-muted">Supports JPG, PNG, WEBP (Max 10MB)</small>
                    </>
                )}
                <input
                    id="product-image-input"
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    style={{ display: 'none' }}
                />
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="upload-progress-container">
                    <div className="progress-bar-custom">
                        <div
                            className="progress-fill"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                    <small className="text-muted mt-1 d-block text-end">{uploadProgress}% Uploaded</small>
                </div>
            )}
        </Form.Group>
    );
};

export default ImageUploader;
