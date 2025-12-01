import React from 'react';
import { Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
    return (
        <Container className="py-5">
            <Helmet>
                <title>Privacy Policy | 3AmShop</title>
            </Helmet>
            <h1 className="mb-4 fw-bold">Privacy Policy</h1>
            <p className="text-muted mb-4">Last updated: December 1, 2024</p>

            <section className="mb-4">
                <h3>1. Introduction</h3>
                <p>
                    Welcome to 3AmShop. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                </p>
            </section>

            <section className="mb-4">
                <h3>2. Data We Collect</h3>
                <p>
                    We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                </p>
                <ul>
                    <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                    <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                    <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
                </ul>
            </section>

            <section className="mb-4">
                <h3>3. How We Use Your Data</h3>
                <p>
                    We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </p>
                <ul>
                    <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                    <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                    <li>Where we need to comply with a legal or regulatory obligation.</li>
                </ul>
            </section>

            <section className="mb-4">
                <h3>4. Data Security</h3>
                <p>
                    We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                </p>
            </section>

            <section>
                <h3>5. Contact Us</h3>
                <p>
                    If you have any questions about this privacy policy or our privacy practices, please contact us at: <a href="mailto:privacy@3amshop.com">privacy@3amshop.com</a>.
                </p>
            </section>
        </Container>
    );
};

export default PrivacyPolicy;
