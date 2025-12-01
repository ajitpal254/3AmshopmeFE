import React from 'react';
import { Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

const TermsOfService = () => {
    return (
        <Container className="py-5">
            <Helmet>
                <title>Terms of Service | 3AmShop</title>
            </Helmet>
            <h1 className="mb-4 fw-bold">Terms of Service</h1>
            <p className="text-muted mb-4">Last updated: December 1, 2024</p>

            <section className="mb-4">
                <h3>1. Agreement to Terms</h3>
                <p>
                    These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and 3AmShop ("we," "us" or "our"), concerning your access to and use of the 3AmShop website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                </p>
            </section>

            <section className="mb-4">
                <h3>2. Intellectual Property Rights</h3>
                <p>
                    Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                </p>
            </section>

            <section className="mb-4">
                <h3>3. User Representations</h3>
                <p>
                    By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Service.
                </p>
            </section>

            <section className="mb-4">
                <h3>4. Products</h3>
                <p>
                    We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products.
                </p>
            </section>

            <section>
                <h3>5. Contact Us</h3>
                <p>
                    In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: <a href="mailto:support@3amshop.com">support@3amshop.com</a>.
                </p>
            </section>
        </Container>
    );
};

export default TermsOfService;
