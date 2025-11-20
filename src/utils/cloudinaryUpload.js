/**
 * Cloudinary Image Upload Utility
 * Much easier than Firebase Storage - no permissions needed!
 */

/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {function} onProgress - Progress callback (0-100)
 * @returns {Promise<string>} - URL of uploaded image
 */
export const uploadImageToCloudinary = async (file, onProgress = null) => {
    return new Promise((resolve, reject) => {
        // Validate file
        if (!file) {
            reject(new Error('No file provided'));
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            reject(new Error('Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP)'));
            return;
        }

        // Validate file size (max 10MB for Cloudinary free tier)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            reject(new Error('File size too large. Maximum size is 10MB'));
            return;
        }

        // Cloudinary credentials from environment
        const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            reject(new Error('Cloudinary not configured. Please set REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET'));
            return;
        }

        // Create form data
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('cloud_name', cloudName);

        // Upload to Cloudinary
        const xhr = new XMLHttpRequest();

        // Progress tracking
        if (onProgress) {
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    onProgress(percentComplete);
                }
            });
        }

        // Success handler
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                resolve(response.secure_url);
            } else {
                reject(new Error('Upload failed: ' + xhr.statusText));
            }
        });

        // Error handler
        xhr.addEventListener('error', () => {
            reject(new Error('Network error during upload'));
        });

        // Send request
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
        xhr.send(formData);
    });
};

/**
 * Upload profile picture
 * @param {File} file - Image file
 * @param {function} onProgress - Progress callback
 * @returns {Promise<string>} - Image URL
 */
export const uploadProfilePicture = (file, onProgress) => {
    return uploadImageToCloudinary(file, onProgress);
};

/**
 * Upload product image
 * @param {File} file - Image file
 * @param {function} onProgress - Progress callback
 * @returns {Promise<string>} - Image URL
 */
export const uploadProductImage = (file, onProgress) => {
    return uploadImageToCloudinary(file, onProgress);
};

export default {
    uploadImageToCloudinary,
    uploadProfilePicture,
    uploadProductImage,
};
