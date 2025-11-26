import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { uploadProfilePicture } from '../utils/cloudinaryUpload';

const UserProfile = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        profilePicture: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
        bio: '',
        password: '',
        confirmPassword: '',
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/app/login');
            return;
        }
        loadProfile();
    }, [user, navigate]);

    const loadProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await api.get('/api/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setProfile({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                profilePicture: data.profilePicture || '',
                address: data.address || '',
                city: data.city || '',
                country: data.country || '',
                postalCode: data.postalCode || '',
                bio: data.bio || '',
                password: '',
                confirmPassword: '',
            });
            setIsVerified(data.isVerified);
            setImagePreview(data.profilePicture || '');
        } catch (err) {
            console.error('Error loading profile:', err);
            setError('Failed to load profile');
        }
    };

    const handleChange = (e) => {
        setMessage('');
        setError('');
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setError('Invalid file type. Please upload an image');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('File size too large. Maximum size is 5MB');
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (profile.password && profile.password !== profile.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            let imageUrl = profile.profilePicture;

            // Upload new image if selected
            if (imageFile) {
                try {
                    setMessage('Uploading image...');
                    imageUrl = await uploadProfilePicture(imageFile, (progress) => {
                        setUploadProgress(progress);
                    });
                    setUploadProgress(0);
                    setMessage('Image uploaded successfully!');
                } catch (err) {
                    setError(`Image upload failed: ${err.message}`);
                    setLoading(false);
                    return;
                }
            }

            const token = localStorage.getItem('token');
            const updateData = {
                name: profile.name,
                email: profile.email,
                phone: profile.phone,
                profilePicture: imageUrl,
                address: profile.address,
                city: profile.city,
                country: profile.country,
                postalCode: profile.postalCode,
                bio: profile.bio,
            };

            if (profile.password) {
                updateData.password = profile.password;
            }

            const { data } = await api.put('/api/profile', updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update token in localStorage
            localStorage.setItem('token', data.token);

            // Update user in AuthContext (this updates localStorage too)
            updateUser({
                _id: data._id,
                name: data.name,
                email: data.email,
                isAdmin: data.isAdmin,
                profilePicture: data.profilePicture,
                phone: data.phone,
            });

            // Update local profile state
            setProfile({
                name: data.name,
                email: data.email,
                phone: data.phone,
                profilePicture: data.profilePicture,
                address: data.address,
                city: data.city,
                country: data.country,
                postalCode: data.postalCode,
                bio: data.bio,
                password: '',
                confirmPassword: '',
            });
            setImagePreview(data.profilePicture);

            setMessage('Profile updated successfully!');
            setIsEditing(false);
            setImageFile(null);

            // No need to reload! Context update triggers re-render
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h3 className="mb-0">
                                <i className="bi bi-person-circle me-2"></i>
                                My Profile
                            </h3>
                        </div>
                        <div className="card-body">
                            {/* Profile Picture */}
                            <div className="text-center mb-4">
                                <div className="position-relative d-inline-block">
                                    <img
                                        src={imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'User')}&size=150&background=007bff&color=fff&bold=true`}
                                        alt="Profile"
                                        className="rounded-circle"
                                        style={{ width: '150px', height: '150px', objectFit: 'cover', border: '3px solid #dee2e6' }}
                                    />
                                    {isEditing && (
                                        <label
                                            htmlFor="profileImage"
                                            className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle"
                                            style={{ cursor: 'pointer', width: '40px', height: '40px' }}
                                        >
                                            <i className="bi bi-camera"></i>
                                            <input
                                                type="file"
                                                id="profileImage"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                    )}
                                </div>
                                <h4 className="mt-3">
                                    {profile.name}
                                    {isVerified && (
                                        <i className="bi bi-patch-check-fill text-primary ms-2" title="Verified Account"></i>
                                    )}
                                </h4>
                                <p className="text-muted">{profile.email}</p>
                            </div>

                            {/* Upload Progress */}
                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="mb-3">
                                    <div className="progress">
                                        <div
                                            className="progress-bar progress-bar-striped progress-bar-animated"
                                            role="progressbar"
                                            style={{ width: `${uploadProgress}%` }}
                                        >
                                            {uploadProgress}%
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Messages */}
                            {message && (
                                <div className="alert alert-success" role="alert">
                                    {message}
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            {/* Profile Form */}
                            <form onSubmit={handleSubmit}>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profile.name}
                                            onChange={handleChange}
                                            className="form-control"
                                            disabled={!isEditing}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profile.email}
                                            onChange={handleChange}
                                            className="form-control"
                                            disabled={!isEditing}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="Enter phone number"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Bio</label>
                                        <input
                                            type="text"
                                            name="bio"
                                            value={profile.bio}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="Short bio"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={profile.address}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Street Address"
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <label className="form-label">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={profile.city}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="City"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={profile.country}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="Country"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Postal Code</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={profile.postalCode}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="Postal Code"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <>
                                        <hr className="my-4" />
                                        <h5 className="mb-3">Change Password (Optional)</h5>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label">New Password</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={profile.password}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                    placeholder="Leave blank to keep current"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={profile.confirmPassword}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Buttons */}
                                <div className="d-flex justify-content-end mt-4">
                                    {isEditing && (
                                        <>
                                            <button
                                                type="submit"
                                                className="btn btn-success me-2"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-check-circle me-2"></i>
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    loadProfile();
                                                    setImageFile(null);
                                                    setError('');
                                                    setMessage('');
                                                }}
                                                className="btn btn-secondary"
                                                disabled={loading}
                                            >
                                                <i className="bi bi-x-circle me-2"></i>
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </form>

                            {!isEditing && (
                                <div className="d-flex justify-content-center mt-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="btn btn-primary"
                                    >
                                        <i className="bi bi-pencil me-2"></i>
                                        Edit Profile
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
