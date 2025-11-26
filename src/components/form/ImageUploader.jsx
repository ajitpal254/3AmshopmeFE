import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const ImageUploader = ({ imagePreviews, onImageChange, onRemove, uploadProgress }) => {
    return (
        <Form.Group className="mb-4">
            <Form.Label>Product Images</Form.Label>
            <div className="image-upload-area p-3 border rounded">
                <div className="d-flex flex-wrap gap-3 mb-3">
                    {imagePreviews && imagePreviews.map((preview, index) => (
                        <div key={index} className="position-relative" style={{ width: '100px', height: '100px' }}>
                            <img 
                                src={preview} 
                                alt={`Preview ${index}`} 
                                className="w-100 h-100 object-fit-cover rounded border" 
                            />
                            <button
                                type="button"
                                className="position-absolute top-0 end-0 btn btn-danger btn-sm p-0 d-flex align-items-center justify-content-center rounded-circle"
                                style={{ width: '20px', height: '20px', transform: 'translate(30%, -30%)' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemove(index);
                                }}
                            >
                                <i className="fas fa-times" style={{ fontSize: '10px' }}></i>
                            </button>
                        </div>
                    ))}
                    <div 
                        className="d-flex flex-column align-items-center justify-content-center border rounded bg-light"
                        style={{ width: '100px', height: '100px', cursor: 'pointer', borderStyle: 'dashed' }}
                        onClick={() => document.getElementById('product-image-input').click()}
                    >
                        <i className="fas fa-plus text-muted mb-1"></i>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>Add Image</small>
                    </div>
                </div>
                
                <input
                    id="product-image-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onImageChange}
                    style={{ display: 'none' }}
                />
                <small className="text-muted d-block">Supports JPG, PNG, WEBP (Max 10MB each)</small>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="upload-progress-container mt-2">
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
