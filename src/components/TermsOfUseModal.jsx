import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const TermsOfUseModal = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Terms of Use</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <h5>1. Introduction</h5>
                <p>Welcome to 3AmShoppee. By accessing our website and using our services, you agree to be bound by the following terms and conditions.</p>

                <h5>2. User Accounts</h5>
                <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>

                <h5>3. Vendor Obligations</h5>
                <p>Vendors must ensure that all products listed are legal, accurately described, and available for shipment. We reserve the right to remove any listing that violates our policies.</p>

                <h5>4. Privacy Policy</h5>
                <p>Your use of the website is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.</p>

                <h5>5. Intellectual Property</h5>
                <p>All content included on the Site, such as text, graphics, logos, images, as well as the compilation thereof, is the property of 3AmShoppee or its suppliers and protected by copyright and other laws.</p>

                <h5>6. Limitation of Liability</h5>
                <p>3AmShoppee shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.</p>

                <h5>7. Changes to Terms</h5>
                <p>We reserve the right, in our sole discretion, to change the Terms under which 3AmShoppee is offered. The most current version of the Terms will supersede all previous versions.</p>

                <p className="text-muted mt-4">Last updated: December 2025</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TermsOfUseModal;
