import React from 'react';
import { Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

const RefundPolicy = () => {
    return (
        <Container className="py-5">
            <Helmet>
                <title>Refund Policy | 3AmShop</title>
            </Helmet>
            <h1 className="mb-4 fw-bold">Refund Policy</h1>
            <p className="text-muted mb-4">Last updated: December 1, 2024</p>

            <section className="mb-4">
                <h3>1. Returns</h3>
                <p>
                    We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.
                </p>
                <p>
                    To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.
                </p>
            </section>

            <section className="mb-4">
                <h3>2. Refunds</h3>
                <p>
                    We will notify you once we've received and inspected your return, and let you know if the refund was approved or not. If approved, you'll be automatically refunded on your original payment method within 10 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too.
                </p>
            </section>

            <section className="mb-4">
                <h3>3. Damages and Issues</h3>
                <p>
                    Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
                </p>
            </section>

            <section className="mb-4">
                <h3>4. Exceptions / Non-returnable items</h3>
                <p>
                    Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products). We also do not accept returns for hazardous materials, flammable liquids, or gases. Please get in touch if you have questions or concerns about your specific item.
                </p>
            </section>

            <section>
                <h3>5. Contact Us</h3>
                <p>
                    If you have any questions about our Returns and Refunds Policy, please contact us at: <a href="mailto:returns@3amshop.com">returns@3amshop.com</a>.
                </p>
            </section>
        </Container>
    );
};

export default RefundPolicy;
