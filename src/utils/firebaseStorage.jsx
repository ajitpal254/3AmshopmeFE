import { storage } from '../firebaseconfig';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Upload image to Firebase Storage
 * @param {File} file - Image file to upload
 * @param {string} folder - Folder name in storage (e.g., 'profile-pictures', 'product-images')
 * @param {function} onProgress - Optional callback for upload progress (0-100)
 * @returns {Promise<string>} - URL of uploaded image
 */
export const uploadImageToFirebase = (file, folder = 'images', onProgress = null) => {
    return new Promise((resolve, reject) => {
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

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            reject(new Error('File size too large. Maximum size is 5MB'));
            return;
        }

        // Create unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const extension = file.name.split('.').pop();
        const filename = `${folder}/${timestamp}_${randomString}.${extension}`;

        // Create storage reference
        const storageRef = ref(storage, filename);

        // Upload file
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Progress monitoring
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (onProgress) {
                    onProgress(Math.round(progress));
                }

            },
            (error) => {
                // Error handling
                console.error('Upload error:', error);
                reject(error);
            },
            async () => {
                // Upload completed successfully
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    resolve(downloadURL);
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
};

/**
 * Upload profile picture
 * @param {File} file - Image file
 * @param {function} onProgress - Progress callback
 * @returns {Promise<string>} - Image URL
 */
export const uploadProfilePicture = (file, onProgress) => {
    return uploadImageToFirebase(file, 'profile-pictures', onProgress);
};

/**
 * Upload product image
 * @param {File} file - Image file
 * @param {function} onProgress - Progress callback
 * @returns {Promise<string>} - Image URL
 */
export const uploadProductImage = (file, onProgress) => {
    return uploadImageToFirebase(file, 'product-images', onProgress);
};

/**
 * Delete image from Firebase Storage (optional cleanup)
 * @param {string} imageUrl - Full URL of the image
 * @returns {Promise<void>}
 */
export const deleteImageFromFirebase = async (imageUrl) => {
    try {
        // Properly validate Firebase Storage URL using URL object
        let parsedUrl;
        try {
            parsedUrl = new URL(imageUrl);
        } catch (e) {
            throw new Error('Invalid URL format');
        }

        // Validate hostname exactly matches Firebase Storage domain
        // This prevents URL spoofing attacks like https://firebasestorage.googleapis.com.evil.com
        const validHostname = 'firebasestorage.googleapis.com';
        if (parsedUrl.hostname !== validHostname) {
            throw new Error(`Invalid Firebase Storage URL. Expected hostname: ${validHostname}, got: ${parsedUrl.hostname}`);
        }

        // Validate protocol is HTTPS
        if (parsedUrl.protocol !== 'https:') {
            throw new Error('Invalid protocol. Firebase Storage URLs must use HTTPS');
        }

        // This is a simplified version - you might need to adjust based on your URL structure
        const imagePath = decodeURIComponent(
            imageUrl.split('/o/')[1].split('?')[0]
        );

        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);

    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
};

export default {
    uploadImageToFirebase,
    uploadProfilePicture,
    uploadProductImage,
    deleteImageFromFirebase,
};
